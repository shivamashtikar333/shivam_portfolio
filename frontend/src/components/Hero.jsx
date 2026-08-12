import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Gem, ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";

const orbitItems = ["React", "Next.js", "Node", "TS", "Mongo", "AWS"];

const Hero = () => {
  const glowRef = useRef(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const orbitScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  useEffect(() => {
    const move = (e) => {
      if (!glowRef.current) return;
      const rect = glowRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glowRef.current.style.setProperty("--x", `${x}%`);
      glowRef.current.style.setProperty("--y", `${y}%`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 2.4 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden min-h-screen w-full pt-28 pb-16 px-6 lg:px-12"
    >
      {/* soft background blobs with scroll parallax */}
      <motion.div style={{ y: blobY1 }} className="blob bg-orange-300 w-[420px] h-[420px] -top-20 -left-20" />
      <motion.div style={{ y: blobY2 }} className="blob bg-amber-200 w-[520px] h-[520px] -bottom-40 -right-40" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* LEFT */}
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
          <motion.div variants={item} className="flex items-center gap-2 text-orange-600 font-mono text-sm mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Available for new opportunities
          </motion.div>

          <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-black leading-[1.05]">
            Hello, <span className="text-orange-600">I'm Shivam</span>
          </motion.h1>

          <motion.p variants={item} className="mt-3 text-2xl sm:text-3xl lg:text-5xl font-medium tracking-tight text-gray-400">
            Software Developer
          </motion.p>

          <motion.div variants={item} className="relative w-[95%] sm:w-52 h-11 rounded-full mt-6 mb-5 p-[2px] bg-gradient-to-r from-[#656565] to-[#e99b63] shadow-[0_10px_30px_-10px_rgba(233,155,99,0.6)]">
            <div className="h-full w-full bg-black rounded-full flex items-center justify-center gap-2 text-white text-sm tracking-wider">
              <Gem className="w-4 h-4" /> Think. Build. Learn.
            </div>
          </motion.div>

          <motion.p variants={item} className="text-base sm:text-lg tracking-wide text-gray-500 max-w-[30rem]">
            I love turning ideas into code — always learning, experimenting, and shipping real-world solutions.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 mt-8">
            <a
              href="/resume.pdf"
              download
              className="group border border-[#2a2a2a] py-3 px-5 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-all hover:bg-[#1a1a1a] hover:text-white flex gap-2 items-center"
            >
              Resume <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="group py-3 px-6 rounded-full text-sm sm:text-base font-semibold tracking-wide bg-orange-600 text-white hover:bg-black transition-colors flex gap-2 items-center"
            >
              Get in touch <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-3 mt-8">
            {[{ Icon: Github, href: "https://github.com/shivamashtikar333" }, { Icon: Linkedin, href: "https://www.linkedin.com/in/shivam-ashtikar/" }, { Icon: Mail, href: "mailto:shivamaashtikar@gmail.com" }].map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-[#171717] hover:bg-black hover:text-orange-500 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Interactive globe/orbit visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.6, duration: 0.9, ease: "easeOut" }}
          style={{ scale: orbitScale }}
          className="relative w-full h-[420px] sm:h-[520px] lg:h-[600px] flex items-center justify-center"
        >
          <div
            ref={glowRef}
            className="absolute inset-0 rounded-full opacity-90"
            style={{
              background:
                "radial-gradient(circle at var(--x,50%) var(--y,50%), rgba(255,168,86,0.35), transparent 40%)",
            }}
          />
          {/* Rings */}
          {[1, 2, 3].map((r, idx) => (
            <motion.div
              key={r}
              className="absolute rounded-full border border-orange-400/30"
              style={{
                width: `${180 + idx * 110}px`,
                height: `${180 + idx * 110}px`,
              }}
              animate={{ rotate: idx % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + idx * 10, ease: "linear", repeat: Infinity }}
            >
              {orbitItems.slice(idx * 2, idx * 2 + 2).map((t, i) => (
                <div
                  key={t}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `translate(-50%,-50%) rotate(${i * 180}deg) translateY(-${(180 + idx * 110) / 2}px)`,
                  }}
                >
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-orange-400 shadow-md">
                    {t}
                  </span>
                </div>
              ))}
            </motion.div>
          ))}

          {/* Center avatar */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-orange-500 to-amber-300 shadow-[0_20px_60px_-15px_rgba(234,88,12,0.55)] flex items-center justify-center text-white"
          >
            <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center text-4xl sm:text-5xl font-bold">
              <span className="text-orange-500">S</span>A
            </div>
            <motion.div
              className="absolute -inset-2 rounded-full border border-orange-400/50"
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 tracking-[0.3em] flex flex-col items-center gap-2"
      >
        SCROLL
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-[1px] h-8 bg-gray-400"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
