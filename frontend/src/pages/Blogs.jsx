import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ArrowUpRight, Tag } from "lucide-react";
import { blogPosts } from "../mock/data";

const Blogs = () => {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="relative min-h-screen bg-[#fefbf8] pt-28 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
      <motion.div style={{ y: bgY }} className="blob bg-orange-300 w-[420px] h-[420px] -top-32 -right-24" />
      <motion.div style={{ y: bgY }} className="blob bg-amber-200 w-[380px] h-[380px] top-1/2 -left-32" />

      <div className="relative max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-black transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to portfolio
        </Link>

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
        <p className="text-gray-500 mt-3">Notes on code, design and shipping side projects.</p>

        <div className="mt-12 space-y-6">
          {blogPosts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.href || "#"}
              target={post.href ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`group block relative rounded-2xl p-6 sm:p-8 border transition-all ${
                post.featured
                  ? "bg-gradient-to-br from-black to-[#1a1a1a] border-orange-500/40 text-white hover:border-orange-400"
                  : "bg-white border-black/10 hover:border-orange-500/40"
              }`}
            >
              {post.featured && (
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold tracking-wider uppercase">
                  Featured
                </div>
              )}
              <div className={`flex flex-wrap items-center gap-4 text-xs mb-3 ${post.featured ? "text-gray-400" : "text-gray-500"}`}>
                <span className={`px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                  post.featured ? "bg-orange-500/20 text-orange-300" : "bg-orange-500/10 text-orange-600"
                }`}>
                  <Tag className="w-3 h-3" /> {post.tag}
                </span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read}</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold group-hover:text-orange-500 transition-colors ${
                post.featured ? "text-white" : "text-black"
              }`}>
                {post.title}
              </h2>
              <p className={`mt-2 ${post.featured ? "text-gray-300" : "text-gray-600"}`}>{post.excerpt}</p>
              <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
                post.featured ? "text-orange-400" : "text-orange-600"
              }`}>
                Read on Hashnode
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-dashed border-black/15 text-center text-gray-500 text-sm">
          More posts coming soon. Follow me on{" "}
          <a href="https://hashnode.com/@shivamashtikar" target="_blank" rel="noreferrer" className="text-orange-600 font-semibold hover:underline">
            Hashnode
          </a>.
        </div>
      </div>
    </div>
  );
};

export default Blogs;
