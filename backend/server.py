from fastapi import FastAPI, APIRouter, HTTPException
from fastapi import Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone
import asyncio
from email.message import EmailMessage
import aiosmtplib
import re
import secrets
from xml.etree import ElementTree as ET

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

# ---------------- Models ----------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

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

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

class ProjectRecord(BaseModel):
    id: Optional[str] = None
    order: int = 0
    title: str = Field(min_length=1, max_length=120)
    des: str = Field(min_length=1, max_length=2000)
    img: str = Field(min_length=1, max_length=1000)
    stack: List[str] = Field(default_factory=list)
    link: str = Field(min_length=1, max_length=1000)
    accent: str = "from-orange-500 to-amber-400"

class CareerRecord(BaseModel):
    id: Optional[str] = None
    order: int = 0
    kind: Literal["work", "education"] = "work"
    date: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=160)
    organization: str = Field(min_length=1, max_length=160)
    subtitle: Optional[str] = None
    location: str = "India"
    summary: str = Field(min_length=1, max_length=2000)
    highlights: List[str] = Field(default_factory=list)
    stack: List[str] = Field(default_factory=list)
    current: bool = False

class PortfolioSettings(BaseModel):
    projects_limit: int = Field(ge=1, le=50)

class SkillRecord(BaseModel):
    id: Optional[str] = None
    order: int = 0
    name: str = Field(min_length=1, max_length=80)
    icon: str = Field(default="code", max_length=100)

def require_admin(authorization: Optional[str] = Header(default=None)):
    expected = os.environ.get("ADMIN_TOKEN", "")
    if not expected:
        raise HTTPException(status_code=503, detail="Admin is not configured. Set ADMIN_TOKEN on the backend.")
    scheme, _, supplied = (authorization or "").partition(" ")
    if scheme.lower() != "bearer" or not secrets.compare_digest(supplied, expected):
        raise HTTPException(status_code=401, detail="Invalid admin token")

DEFAULT_PROJECTS = [
    {"id": "1", "order": 0, "title": "Converso — AI Powered LMS Platform", "des": "An AI-powered LMS platform offering real-time voice tutoring, secure authentication, and dynamic user experiences with Supabase and Stripe integration.", "img": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80", "stack": ["React", "Tailwind", "TypeScript", "Next.js", "Stripe"], "link": "https://www.converso-app.site", "accent": "from-orange-500 to-amber-400"},
    {"id": "2", "order": 1, "title": "Kaliedoscope — AI Image Generator", "des": "An AI image generation app where users can create images from prompts, get random suggestions, share with the community, and download creations.", "img": "https://images.pexels.com/photos/16027824/pexels-photo-16027824.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "stack": ["React", "Tailwind", "TypeScript", "Stream", "Clerk"], "link": "https://github.com/shivamashtikar333/ai_image_generator", "accent": "from-fuchsia-500 to-orange-400"},
    {"id": "3", "order": 2, "title": "MindMate — RAG-Powered Study Buddy", "des": "Upload notes or PDFs and chat with them. Uses vector embeddings and LLM retrieval to answer questions with citations.", "img": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80", "stack": ["Next.js", "LangChain", "Pinecone", "OpenAI", "Tailwind"], "link": "#", "accent": "from-sky-500 to-orange-400"},
    {"id": "4", "order": 3, "title": "PRPilot — AI Code Review Bot", "des": "A GitHub bot that reads pull requests, flags bugs, suggests refactors, and writes review summaries using an LLM.", "img": "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=1200&q=80", "stack": ["Node.js", "GitHub API", "OpenAI", "Webhooks", "TypeScript"], "link": "#", "accent": "from-emerald-400 to-orange-400"},
]

DEFAULT_CAREER = [
    {"id": "career-ltm-current", "order": 0, "kind": "work", "date": "Oct 2025 — Present", "title": "Software Developer", "organization": "LTM", "subtitle": "formerly LTIMindtree", "location": "India", "summary": "Building production-grade features across the full stack and shipping code for real users.", "highlights": ["Collaborating in an agile squad on modern web platforms and internal tooling.", "Owning tickets end-to-end: design, implementation, review, and deployment."], "stack": ["React", "Node.js", "TypeScript", "REST APIs"], "current": True},
    {"id": "career-ltm-trainee", "order": 1, "kind": "education", "date": "Jul 2025 — Oct 2025", "title": "Graduate Engineer Trainee", "organization": "LTIMindtree", "location": "India", "summary": "Completed three-month Java full-stack training covering Java fundamentals, Spring Boot, and Angular.", "highlights": [], "stack": ["Java", "Spring Boot", "Angular", "SQL"], "current": False},
    {"id": "career-pods-intern", "order": 2, "kind": "work", "date": "Oct 2024 — Apr 2025", "title": "Software Development Intern", "organization": "Pods Technology Solutions", "location": "India", "summary": "Completed a six-month project titled Anti Spy Mobile Application under the mentorship of PODS Technology Solutions Pvt. Ltd.", "highlights": ["Gained hands-on experience building a mobile application while aligning with industry standards and academic curriculum."], "stack": ["Mobile", "Android", "Java", "REST APIs"], "current": False},
]

DEFAULT_SKILLS = [
    {"id": "skill-javascript", "order": 0, "name": "JavaScript", "icon": "javascript"},
    {"id": "skill-typescript", "order": 1, "name": "TypeScript", "icon": "typescript"},
    {"id": "skill-python", "order": 2, "name": "Python", "icon": "python"},
    {"id": "skill-react", "order": 3, "name": "React", "icon": "react"},
    {"id": "skill-nextjs", "order": 4, "name": "Next.js", "icon": "nextjs"},
    {"id": "skill-tailwind", "order": 5, "name": "Tailwind", "icon": "tailwind"},
    {"id": "skill-nodejs", "order": 6, "name": "Node.js", "icon": "nodejs"},
    {"id": "skill-express", "order": 7, "name": "Express", "icon": "express"},
    {"id": "skill-mongodb", "order": 8, "name": "MongoDB", "icon": "mongodb"},
    {"id": "skill-postgres", "order": 9, "name": "Postgres", "icon": "postgres"},
    {"id": "skill-firebase", "order": 10, "name": "Firebase", "icon": "firebase"},
    {"id": "skill-git", "order": 11, "name": "Git", "icon": "git"},
    {"id": "skill-docker", "order": 12, "name": "Docker", "icon": "docker"},
    {"id": "skill-figma", "order": 13, "name": "Figma", "icon": "figma"},
]

_content_seed_lock = asyncio.Lock()

async def ensure_portfolio_content():
    settings = await db.portfolio_settings.find_one({"id": "main"})
    if settings and settings.get("initialized") and settings.get("skills_initialized"):
        return settings
    async with _content_seed_lock:
        settings = await db.portfolio_settings.find_one({"id": "main"})
        if settings and settings.get("initialized") and settings.get("skills_initialized"):
            return settings
        if (not settings or not settings.get("initialized")) and await db.projects.count_documents({}) == 0:
            await db.projects.insert_many(DEFAULT_PROJECTS)
        if (not settings or not settings.get("initialized")) and await db.career.count_documents({}) == 0:
            await db.career.insert_many(DEFAULT_CAREER)
        if (not settings or not settings.get("skills_initialized")) and await db.skills.count_documents({}) == 0:
            await db.skills.insert_many(DEFAULT_SKILLS)
        await db.portfolio_settings.update_one(
            {"id": "main"},
            {"$set": {"initialized": True, "skills_initialized": True}, "$setOnInsert": {"projects_limit": 4}},
            upsert=True,
        )
        return await db.portfolio_settings.find_one({"id": "main"})

# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/projects")
async def get_projects():
    settings = await ensure_portfolio_content()
    limit = int(settings.get("projects_limit", 4))
    projects = await db.projects.find({}, {"_id": 0}).sort([("order", 1), ("id", 1)]).to_list(200)
    return projects[:limit]

@api_router.get("/career")
async def get_career():
    await ensure_portfolio_content()
    return await db.career.find({}, {"_id": 0}).sort([("order", 1), ("id", 1)]).to_list(200)

@api_router.get("/skills")
async def get_skills():
    await ensure_portfolio_content()
    return await db.skills.find({}, {"_id": 0}).sort([("order", 1), ("id", 1)]).to_list(200)

@api_router.get("/settings")
async def get_portfolio_settings():
    settings = await ensure_portfolio_content()
    return {"projects_limit": int(settings.get("projects_limit", 4))}

@api_router.get("/admin/projects", dependencies=[Depends(require_admin)])
async def admin_get_projects():
    await ensure_portfolio_content()
    return await db.projects.find({}, {"_id": 0}).sort([("order", 1), ("id", 1)]).to_list(200)

@api_router.post("/admin/projects", dependencies=[Depends(require_admin)])
async def admin_create_project(project: ProjectRecord):
    record = project.model_dump()
    record["id"] = str(uuid.uuid4())
    await db.projects.insert_one(record)
    return record

@api_router.put("/admin/projects/{record_id}", dependencies=[Depends(require_admin)])
async def admin_update_project(record_id: str, project: ProjectRecord):
    record = project.model_dump(exclude={"id"})
    result = await db.projects.update_one({"id": record_id}, {"$set": record})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"id": record_id, **record}

@api_router.delete("/admin/projects/{record_id}", dependencies=[Depends(require_admin)])
async def admin_delete_project(record_id: str):
    result = await db.projects.delete_one({"id": record_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True}

@api_router.get("/admin/career", dependencies=[Depends(require_admin)])
async def admin_get_career():
    await ensure_portfolio_content()
    return await db.career.find({}, {"_id": 0}).sort([("order", 1), ("id", 1)]).to_list(200)

@api_router.post("/admin/career", dependencies=[Depends(require_admin)])
async def admin_create_career_entry(entry: CareerRecord):
    record = entry.model_dump()
    record["id"] = str(uuid.uuid4())
    await db.career.insert_one(record)
    return record

@api_router.put("/admin/career/{record_id}", dependencies=[Depends(require_admin)])
async def admin_update_career_entry(record_id: str, entry: CareerRecord):
    record = entry.model_dump(exclude={"id"})
    result = await db.career.update_one({"id": record_id}, {"$set": record})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Career entry not found")
    return {"id": record_id, **record}

@api_router.delete("/admin/career/{record_id}", dependencies=[Depends(require_admin)])
async def admin_delete_career_entry(record_id: str):
    result = await db.career.delete_one({"id": record_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Career entry not found")
    return {"success": True}

@api_router.put("/admin/settings", dependencies=[Depends(require_admin)])
async def admin_update_portfolio_settings(settings: PortfolioSettings):
    await ensure_portfolio_content()
    await db.portfolio_settings.update_one(
        {"id": "main"},
        {"$set": {"projects_limit": settings.projects_limit, "initialized": True}},
        upsert=True,
    )
    return {"projects_limit": settings.projects_limit}

@api_router.get("/admin/skills", dependencies=[Depends(require_admin)])
async def admin_get_skills():
    await ensure_portfolio_content()
    return await db.skills.find({}, {"_id": 0}).sort([("order", 1), ("id", 1)]).to_list(200)

@api_router.post("/admin/skills", dependencies=[Depends(require_admin)])
async def admin_create_skill(skill: SkillRecord):
    record = skill.model_dump()
    record["id"] = str(uuid.uuid4())
    await db.skills.insert_one(record)
    return record

@api_router.put("/admin/skills/{record_id}", dependencies=[Depends(require_admin)])
async def admin_update_skill(record_id: str, skill: SkillRecord):
    record = skill.model_dump(exclude={"id"})
    result = await db.skills.update_one({"id": record_id}, {"$set": record})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"id": record_id, **record}

@api_router.delete("/admin/skills/{record_id}", dependencies=[Depends(require_admin)])
async def admin_delete_skill(record_id: str):
    result = await db.skills.delete_one({"id": record_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"success": True}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# ---------------- Hashnode Blogs ----------------
HASHNODE_HOST = os.environ.get("HASHNODE_HOST", "shivamashtikar.hashnode.dev")
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
        content_el = item.find("{http://purl.org/rss/1.0/modules/content/}encoded")
        content_html = content_el.text if content_el is not None else desc
        categories = [c.text for c in item.findall("category") if c.text]
        tag = None
        for c in categories:
            if c and c.lower() not in ("hashnode",):
                tag = c
                if any(ch.isupper() for ch in c):
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

# ---------------- Contact Form ----------------
@api_router.post("/contact")
async def send_contact(form: ContactForm):
    msg = EmailMessage()
    msg["From"] = os.environ["SMTP_USER"]
    msg["To"] = os.environ["CONTACT_EMAIL"]
    msg["Subject"] = f"Portfolio Contact Form - {form.name}"
    msg["Reply-To"] = form.email  # so you can reply directly to user
    msg.set_content(
        f"Name: {form.name}\n"
        f"Email: {form.email}\n\n"
        f"Message:\n{form.message}"
    )
    try:
        await aiosmtplib.send(
            msg,
            hostname=os.environ["SMTP_HOST"],
            port=int(os.environ.get("SMTP_PORT", 587)),
            start_tls=True,
            username=os.environ["SMTP_USER"],
            password=os.environ["SMTP_PASS"],
        )
        return {"success": True, "message": "Message sent successfully"}
    except Exception as e:
        logger.exception("Failed to send contact form email")
        raise HTTPException(status_code=500, detail=f"SMTP error: {str(e)}")


# ---------------- App Setup ----------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
