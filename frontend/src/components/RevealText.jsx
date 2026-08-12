import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Accepts either a string or an array of { text, className }
export const RevealText = ({ text, tokens, className = "", as: Tag = "h2", delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = tokens
    ? tokens
    : (text || "").split(" ").map((t) => ({ text: t }));

  return (
    <Tag ref={ref} className={className}>
      {items.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-1 mr-[0.25em]">
          <motion.span
            className={`inline-block ${w.className || ""}`}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {w.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export const RevealChars = ({ text, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, delay: i * 0.02 }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  );
};

export default RevealText;
