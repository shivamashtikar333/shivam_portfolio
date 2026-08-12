import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ArrowUpRight, Tag, RefreshCw, Loader2, AlertTriangle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const formatDate = (raw) => {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const Blogs = () => {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (opts = {}) => {
    try {
      if (opts.refresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const url = `${API}/blogs${opts.refresh ? "?refresh=true" : ""}`;
      const { data } = await axios.get(url);
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Couldn't fetch the latest posts. Please try again in a bit.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fefbf8] pt-28 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
      <motion.div style={{ y: bgY }} className="blob bg-orange-300 w-[420px] h-[420px] -top-32 -right-24" />
      <motion.div style={{ y: bgY }} className="blob bg-amber-200 w-[380px] h-[380px] top-1/2 -left-32" />

      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to portfolio
          </Link>
          <button
            onClick={() => load({ refresh: true })}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-orange-600 font-mono text-sm mb-2"
        >
          &lt;writing/&gt;
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-5xl sm:text-6xl font-bold text-black"
        >
          Writing <span className="text-orange-600">.</span>
        </motion.h1>
        <p className="text-gray-500 mt-3">
          Auto-pulled from{" "}
          <a
            href="https://hashnode.com/@shivamashtikar"
            target="_blank"
            rel="noreferrer"
            className="text-orange-600 hover:underline font-medium"
          >
            my Hashnode
          </a>
          . New posts show up here automatically.
        </p>

        {/* States */}
        {loading && (
          <div className="mt-16 flex flex-col items-center justify-center text-gray-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            Loading latest posts…
          </div>
        )}

        {error && !loading && (
          <div className="mt-12 p-6 rounded-2xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-semibold">Couldn't load posts</div>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="mt-16 p-8 rounded-2xl border border-dashed border-black/15 text-center text-gray-500">
            No posts yet. Your Hashnode articles will appear here as soon as you publish.
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="mt-12 space-y-6">
            {posts.map((post, i) => (
              <motion.a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`group block relative rounded-2xl overflow-hidden border transition-all ${
                  i === 0
                    ? "bg-gradient-to-br from-black to-[#1a1a1a] border-orange-500/40 text-white hover:border-orange-400"
                    : "bg-white border-black/10 hover:border-orange-500/40"
                }`}
              >
                <div className="grid sm:grid-cols-[220px_1fr]">
                  {post.coverImage ? (
                    <div className="relative aspect-video sm:aspect-auto sm:h-full overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 ${i === 0 ? "bg-gradient-to-r from-black/70 to-transparent" : "bg-gradient-to-r from-white/60 to-transparent"} sm:hidden`} />
                    </div>
                  ) : (
                    <div className={`${i === 0 ? "bg-orange-500/10" : "bg-orange-100"} hidden sm:flex items-center justify-center`}>
                      <Tag className={`w-8 h-8 ${i === 0 ? "text-orange-400" : "text-orange-500"}`} />
                    </div>
                  )}

                  <div className="p-6 sm:p-7">
                    {i === 0 && (
                      <div className="inline-block mb-3 px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold tracking-wider uppercase">
                        Latest
                      </div>
                    )}
                    <div className={`flex flex-wrap items-center gap-3 text-xs mb-2 ${i === 0 ? "text-gray-400" : "text-gray-500"}`}>
                      {post.tag && (
                        <span className={`px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                          i === 0 ? "bg-orange-500/20 text-orange-300" : "bg-orange-500/10 text-orange-600"
                        }`}>
                          <Tag className="w-3 h-3" /> {post.tag}
                        </span>
                      )}
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(post.publishedAt)}
                        </span>
                      )}
                      {post.readTimeInMinutes ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTimeInMinutes} min read
                        </span>
                      ) : null}
                    </div>
                    <h2 className={`text-xl sm:text-2xl font-bold group-hover:text-orange-500 transition-colors ${
                      i === 0 ? "text-white" : "text-black"
                    }`}>
                      {post.title}
                    </h2>
                    {post.brief && (
                      <p className={`mt-2 line-clamp-3 text-sm sm:text-base ${i === 0 ? "text-gray-300" : "text-gray-600"}`}>
                        {post.brief}
                      </p>
                    )}
                    <div className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${
                      i === 0 ? "text-orange-400" : "text-orange-600"
                    }`}>
                      Read on Hashnode
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 rounded-2xl border border-dashed border-black/15 text-center text-gray-500 text-sm">
          Follow me on{" "}
          <a href="https://hashnode.com/@shivamashtikar" target="_blank" rel="noreferrer" className="text-orange-600 font-semibold hover:underline">
            Hashnode
          </a>{" "}
          — this page updates automatically.
        </div>
      </div>
    </div>
  );
};

export default Blogs;
