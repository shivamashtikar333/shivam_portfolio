import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../mock/data";
import { RevealText } from "./RevealText";

const TiltCard = ({ project, index }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const rX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const rY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="[perspective:1200px]"
    >
      <motion.a
        ref={ref}
        href={project.link}
        target={project.link && project.link !== "#" ? "_blank" : undefined}
        rel="noreferrer"
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
        className="block relative rounded-2xl overflow-hidden bg-[#111] border border-white/10 hover:border-orange-500/50 transition-colors"
      >
        {/* image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-30`} />
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-full object-cover mix-blend-luminosity opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-4 left-4 text-xs font-mono text-orange-400">
            0{project.id}
          </div>
        </div>

        <div className="p-6" style={{ transform: "translateZ(30px)" }}>
          <h3 className="font-bold text-lg md:text-xl text-white mb-2 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-5">
            {project.des}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((s) => (
                <span key={s} className="text-[10px] uppercase tracking-wider text-orange-300 border border-orange-500/30 bg-orange-500/5 rounded-full px-2 py-0.5">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white group">
              <span className="text-[#fefbf8]">Live</span>
              <ArrowUpRight className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* glow */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 hover:opacity-100 transition-opacity" style={{ boxShadow: "0 0 60px -10px rgba(234,88,12,0.5)" }} />
      </motion.a>
    </motion.div>
  );
};

const Projects = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const dotY = useTransform(scrollYProgress, [0, 1], [0, 220]);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-[#fefbf8] px-4 sm:px-6 lg:px-12 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-orange-600 font-mono text-sm mb-2"
          >
            &lt;projects/&gt;
          </motion.p>
          <RevealText
            as="h2"
            tokens={[{ text: "Selected" }, { text: "Work", className: "text-orange-600" }]}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-gray-500 mt-3 max-w-lg mx-auto"
          >
            A small selection of things I've built recently. Hover the cards — they respond.
          </motion.p>
        </div>

        <div className="relative rounded-3xl bg-black p-6 sm:p-10 overflow-hidden">
          {/* dot pattern with scroll parallax */}
          <motion.div
            style={{
              y: dotY,
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
            className="absolute -inset-y-32 inset-x-0 opacity-[0.09] pointer-events-none"
          />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <TiltCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
