import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { blogPosts } from "../mock/data";

const Blogs = () => {
  return (
    <div className="min-h-screen bg-[#fefbf8] pt-28 pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-black transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to portfolio
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl font-bold text-black"
        >
          Writing <span className="text-orange-600">.</span>
        </motion.h1>
        <p className="text-gray-500 mt-3">Notes on code, design and shipping side projects.</p>

        <div className="mt-12 space-y-6">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 6 }}
              className="group cursor-pointer border-b border-black/10 pb-6"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 font-semibold">{post.tag}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black group-hover:text-orange-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
