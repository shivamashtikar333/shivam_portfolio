import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { focusCards } from "../mock/data";
import { RevealText } from "./RevealText";
import { portfolioApi } from "../lib/portfolioApi";
import { skillIconMap } from "../lib/skillIcons";

const defaultSkills = [
  ["javascript", "JavaScript"], ["typescript", "TypeScript"], ["python", "Python"],
  ["react", "React"], ["nextjs", "Next.js"], ["tailwind", "Tailwind"],
  ["nodejs", "Node.js"], ["express", "Express"], ["mongodb", "MongoDB"],
  ["postgres", "Postgres"], ["firebase", "Firebase"], ["git", "Git"],
  ["docker", "Docker"], ["figma", "Figma"],
];

const About = () => {
  const [skills, setSkills] = useState(defaultSkills.map(([icon, name]) => ({ id: icon, icon, name })));
  const wrapRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const codeY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rightY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rot = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  useEffect(() => {
    let active = true;
    portfolioApi.get("/skills")
      .then(({ data }) => { if (active && Array.isArray(data)) setSkills(data); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <section id="about" ref={wrapRef} className="w-full min-w-0 overflow-x-clip px-3 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative w-full min-w-0 overflow-hidden rounded-3xl bg-black px-4 sm:px-6 lg:px-12 xl:px-20 py-16 max-w-7xl mx-auto grain"
      >
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff20 1px, transparent 1px), linear-gradient(to bottom, #ffffff20 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative flex min-w-0 flex-col items-stretch justify-between gap-12 lg:flex-row lg:items-start">
          {/* Left */}
          <div className="w-full min-w-0 flex-1 space-y-4">
            <p className="text-orange-500 font-mono text-lg">{`<about>`}</p>
            <RevealText as="h2" text="About Me" className="text-4xl lg:text-6xl font-bold leading-tight text-gray-100" />

            {/* Code card with parallax */}
            <motion.div style={{ y: codeY, rotate: rot }} className="bg-[#0e0e10] border border-white/5 rounded-xl overflow-hidden p-5 sm:p-6 shadow-2xl w-full max-w-xl">
              <div className="flex gap-1.5 mb-3">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <pre className="w-full min-w-0 overflow-hidden whitespace-pre-wrap break-words font-mono text-[11px] leading-6 [overflow-wrap:anywhere] sm:overflow-x-auto sm:whitespace-pre sm:text-sm">
                <code>
                  <span className="text-orange-400">{`// My tech stack\n`}</span>
                  <span className="text-pink-400">const</span>{" "}
                  <span className="text-blue-400">skills</span>{" "}
                  <span className="text-white">= &#123;</span>
                  {"\n"}
                  &nbsp;&nbsp;<span className="text-green-400">languages</span>: [
                  <span className="text-yellow-300">'JavaScript'</span>,{" "}
                  <span className="text-blue-300">'TypeScript'</span>,{" "}
                  <span className="text-purple-300">'Python'</span>],{"\n"}
                  &nbsp;&nbsp;<span className="text-green-400">frontend</span>: [
                  <span className="text-cyan-300">'React'</span>,{" "}
                  <span className="text-gray-300">'Next.js'</span>,{" "}
                  <span className="text-blue-400">'Tailwind'</span>],{"\n"}
                  &nbsp;&nbsp;<span className="text-green-400">backend</span>: [
                  <span className="text-lime-300">'Node.js'</span>,{" "}
                  <span className="text-teal-300">'Express'</span>,{" "}
                  <span className="text-pink-300">'GraphQL'</span>],{"\n"}
                  &nbsp;&nbsp;<span className="text-green-400">databases</span>: [
                  <span className="text-emerald-300">'MongoDB'</span>,{" "}
                  <span className="text-blue-300">'PostgreSQL'</span>,{" "}
                  <span className="text-orange-300">'Firebase'</span>],{"\n"}
                  &nbsp;&nbsp;<span className="text-green-400">tools</span>: [
                  <span className="text-red-300">'Git'</span>,{" "}
                  <span className="text-blue-500">'Docker'</span>,{" "}
                  <span className="text-pink-300">'Figma'</span>]{"\n"}
                  <span className="text-white">&#125;;</span>
                </code>
              </pre>
            </motion.div>

            {/* Marquee */}
            <div className="relative mt-6 w-full min-w-0 max-w-xl overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />
              <div className="flex gap-10 w-max marquee-track">
                {[...skills, ...skills].map((skill, i) => {
                  const visual = skillIconMap[skill.icon] || skillIconMap.code;
                  const Icon = visual.Icon;
                  return <div key={`${skill.id || skill.name}-${i}`} className="flex flex-col items-center gap-1 min-w-[56px]">
                    <Icon className={`text-3xl ${visual.color} hover:scale-125 transition-transform duration-300`} />
                    <span className="text-[10px] text-gray-500">{skill.name}</span>
                  </div>
                })}
              </div>
            </div>

            <p className="text-orange-500 font-mono text-lg pt-2">{`</about>`}</p>
          </div>

          {/* Right */}
          <motion.div style={{ y: rightY }} className="w-full min-w-0 max-w-xl flex-1 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold mb-2 text-orange-500">My Development Focus</h3>
              <p className="text-gray-400 leading-relaxed">
                I am a dedicated developer focused on building impactful web and mobile applications. My entry into this field was driven by a keen interest in crafting functional and engaging digital experiences. My objective is to contribute to projects that address real-world needs and deliver exceptional value through well-engineered solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-orange-500">My Approach</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                My approach to development prioritizes both technical excellence and user needs. I am committed to continuous skill enhancement, embracing new technologies to deliver robust, scalable, and maintainable software.
              </p>
              <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                {focusCards.map(([title, desc], idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="min-w-0 w-full break-words rounded-xl border border-orange-100 bg-[#fff4eb] p-4 hover:shadow-lg hover:shadow-orange-200/30 transition-shadow"
                  >
                    <h4 className="font-bold text-black">{title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
