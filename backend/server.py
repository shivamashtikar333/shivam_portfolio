from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ---------------- Hashnode Blogs (via public RSS) ----------------
import re
from xml.etree import ElementTree as ET


class BlogPost(BaseModel):
    id: str
    title: str
    brief: str
    url: str
    slug: str
    publishedAt: Optional[str] = None
    readTimeInMinutes: Optional[int] = None
    tag: Optional[str] = None
    coverImage: Optional[str] = None


HASHNODE_HOST = os.environ.get("HASHNODE_HOST", "nextauth-rbac-in-nextjs.hashnode.dev")

_hashnode_cache = {"ts": 0.0, "data": None, "host": None}
_HASHNODE_TTL = 300  # 5 min


def _strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _estimate_read_minutes(html: str) -> int:
    words = len(_strip_html(html).split())
    return max(1, round(words / 220))


def _first_image(html: str) -> Optional[str]:
    m = re.search(r'<img[^>]+src="([^"]+)"', html or "")
    return m.group(1) if m else None


async def _fetch_hashnode_posts(host: str) -> List[BlogPost]:
    url = f"https://{host}/rss.xml"
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as http:
        resp = await http.get(url, headers={"User-Agent": "portfolio/1.0"})
        resp.raise_for_status()
        xml_text = resp.text

    root = ET.fromstring(xml_text)
    channel = root.find("channel")
    if channel is None:
        return []

    posts: List[BlogPost] = []
    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        guid = (item.findtext("guid") or link).strip()
        desc = (item.findtext("description") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()

        # content:encoded (namespaced)
        content_el = item.find("{http://purl.org/rss/1.0/modules/content/}encoded")
        content_html = content_el.text if content_el is not None else desc

        categories = [c.text for c in item.findall("category") if c.text]
        # skip the generic "nextauth.js" style slug tag; prefer a nicer capitalized one
        tag = None
        for c in categories:
            if c and c.lower() not in ("hashnode",):
                tag = c
                if any(ch.isupper() for ch in c):  # prefer nice-cased
                    break

        slug = link.rsplit("/", 1)[-1] if link else guid

        posts.append(
            BlogPost(
                id=guid or slug,
                title=title,
                brief=_strip_html(desc)[:240],
                url=link,
                slug=slug,
                publishedAt=pub_date or None,
                readTimeInMinutes=_estimate_read_minutes(content_html or ""),
                tag=tag,
                coverImage=_first_image(content_html or ""),
            )
        )
    return posts


@api_router.get("/blogs", response_model=List[BlogPost])
async def get_blogs(host: Optional[str] = None, refresh: bool = False):
    """Fetch published blogs for a Hashnode publication via its public RSS feed."""
    host = host or HASHNODE_HOST
    now = time.time()

    if (
        not refresh
        and _hashnode_cache["data"] is not None
        and _hashnode_cache["host"] == host
        and (now - _hashnode_cache["ts"]) < _HASHNODE_TTL
    ):
        return _hashnode_cache["data"]

    try:
        posts = await _fetch_hashnode_posts(host)
    except Exception as e:
        logger.exception("Hashnode RSS fetch failed")
        if _hashnode_cache["data"] is not None:
            return _hashnode_cache["data"]
        raise HTTPException(status_code=502, detail=f"Failed to fetch blogs: {e}")

    _hashnode_cache["ts"] = now
    _hashnode_cache["host"] = host
    _hashnode_cache["data"] = posts
    return posts

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()