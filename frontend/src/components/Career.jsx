import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Code2, GraduationCap, MapPin } from "lucide-react";
import { portfolioApi } from "../lib/portfolioApi";
import { RevealText } from "./RevealText";

const starterEntries = [
  { id: "career-current", kind: "work", date: "Oct 2025 — Present", title: "Software Developer", organization: "LTM", subtitle: "formerly LTIMindtree", location: "India", summary: "Building production-grade features across the full stack and shipping code that goes live for real users.", highlights: ["Collaborating in an agile squad on modern web platforms and internal tooling.", "Owning tickets end-to-end: design, implementation, review, and deployment."], stack: ["React", "Node.js", "TypeScript", "REST APIs"], current: true },
  { id: "career-trainee", kind: "education", date: "Jul 2025 — Oct 2025", title: "Graduate Engineer Trainee", organization: "LTIMindtree", location: "India", summary: "Completed three-month Java full-stack training covering Java fundamentals, Spring Boot (backend), and Angular (frontend).", highlights: [], stack: ["Java", "Spring Boot", "Angular", "SQL"], current: false },
  { id: "career-intern", kind: "work", date: "Oct 2024 — Apr 2025", title: "Software Development Intern", organization: "Pods Technology Solutions", location: "India", summary: "Completed a six-month project titled Anti Spy Mobile Application under the mentorship of PODS Technology Solutions Pvt. Ltd.", highlights: ["Gained hands-on experience building a mobile application while aligning with industry standards and academic curriculum."], stack: ["Mobile", "Android", "Java", "REST APIs"], current: false },
];

const CareerCard = ({ entry, index, side }) => {
  const alignRight = side === "left";
  const Icon = entry.kind === "education" ? GraduationCap : index === 0 ? Code2 : BriefcaseBusiness;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
        className={`relative col-start-2 ${alignRight ? "md:col-start-1" : "md:col-start-3"} rounded-2xl border bg-white/80 p-5 sm:p-7 shadow-sm ${entry.current ? "border-orange-300 shadow-orange-100" : "border-black/10"} ${alignRight ? "md:text-right" : ""}`}
      >
        {entry.current && <span className={`absolute -top-3 ${alignRight ? "right-5" : "left-5"} rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white`}>✦ Current</span>}
        <p className={`mb-3 font-mono text-sm text-orange-600 ${alignRight ? "md:flex md:justify-end" : ""}`}><span className="mr-2 inline-block h-2 w-2 rounded-full bg-orange-500" />{entry.date}</p>
        <h3 className="text-2xl font-bold leading-tight text-black sm:text-3xl">{entry.title}</h3>
        <p className="mt-2 text-lg font-semibold text-gray-700">
          {entry.organization}{entry.subtitle && <span className="font-normal text-gray-400"> · {entry.subtitle}</span>}
        </p>
        <p className={`mt-2 inline-flex items-center gap-1.5 text-sm text-gray-500 ${alignRight ? "md:flex md:justify-end" : ""}`}><MapPin className="h-4 w-4" />{entry.location}</p>
        <p className="mt-5 leading-relaxed text-gray-600">{entry.summary}</p>
        {entry.highlights?.length > 0 && <ul className={`mt-3 space-y-2 text-left text-gray-600 ${alignRight ? "md:text-right" : ""}`}>
          {entry.highlights.map((highlight, i) => <li key={i} className={`flex gap-3 leading-relaxed ${alignRight ? "md:flex-row-reverse" : ""}`}><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" /><span>{highlight}</span></li>)}
        </ul>}
        {entry.stack?.length > 0 && <div className={`mt-5 flex flex-wrap gap-2 ${alignRight ? "md:justify-end" : ""}`}>
          {entry.stack.map((item) => <span key={item} className="rounded-full border border-orange-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-orange-700">{item}</span>)}
        </div>}
      </motion.article>
      <div className="relative z-10 col-start-1 flex justify-center md:col-start-2">
        <div className={`mt-1 flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-[#fefbf8] shadow-lg md:h-16 md:w-16 ${entry.current ? "bg-orange-500 text-white" : "bg-black text-orange-400"}`}>
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
      </div>
    </>
  );
};

const Career = () => {
  const [entries, setEntries] = useState(starterEntries);

  useEffect(() => {
    let active = true;
    portfolioApi.get("/career")
      .then(({ data }) => { if (active && Array.isArray(data)) setEntries(data); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <section id="career" className="relative overflow-hidden bg-[#fefbf8] px-4 py-24 sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-2 font-mono text-sm text-orange-600">&lt;career-path/&gt;</p>
          <RevealText as="h2" tokens={[{ text: "The" }, { text: "Journey", className: "text-orange-600" }]} className="text-4xl font-bold text-black sm:text-5xl lg:text-6xl" />
          <p className="mx-auto mt-4 max-w-xl text-gray-500">A timeline of the roles, training, and experiences shaping my path as a developer.</p>
        </div>

        <div className="relative flex flex-col gap-10 md:gap-20">
          <div className="absolute bottom-8 left-5 top-7 w-0.5 bg-gradient-to-b from-orange-500 via-amber-400 to-orange-100 md:left-1/2 md:-translate-x-1/2" />
          {entries.map((entry, index) => <div key={entry.id || index} className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 md:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] md:gap-x-5"><CareerCard entry={entry} index={index} side={index % 2 === 0 ? "left" : "right"} /></div>)}
        </div>
      </div>
    </section>
  );
};

export default Career;
