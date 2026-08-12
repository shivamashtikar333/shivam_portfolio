import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = ({ onDone }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDone(true);
      onDone && onDone();
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-end"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-white/60 text-xs tracking-[0.3em] mb-2">LOADING PORTFOLIO</div>
            <div className="text-4xl sm:text-5xl font-semibold text-white">
              &lt;Shivam <span className="text-orange-500">/</span>&gt;
            </div>
            <motion.div
              className="h-[2px] bg-orange-500 mt-4 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </motion.div>
          <motion.div
            className="w-full bg-[#fefbf8] rounded-t-[100%]"
            initial={{ height: 0 }}
            animate={{ height: "100vh" }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
