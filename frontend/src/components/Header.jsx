import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Menu, X } from "lucide-react";

const MagneticButton = ({ children, className = "", href, onClick }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.35, y: y * 0.35 });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
};

const Header = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-[70] bg-[#fefbf8]/70 backdrop-blur-md border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <a href="#hero" className="text-xl font-bold flex items-center text-[#171717]" data-cursor="hover">
          &lt;Shivam <span className="text-orange-600 text-2xl leading-none">/</span>&gt;
          <span className="text-orange-600 text-2xl leading-none">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <MagneticButton
              key={l.label}
              href={l.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-[#171717] hover:text-orange-600 transition-colors"
            >
              {l.label}
            </MagneticButton>
          ))}
          <Link to="/blogs">
            <MagneticButton className="ml-2 px-5 py-2 rounded-full bg-[#171717] text-white text-sm font-semibold flex items-center gap-2 hover:bg-orange-600 transition-colors">
              <BookOpen className="w-4 h-4" /> Blogs
            </MagneticButton>
          </Link>
        </nav>

        <button className="md:hidden text-[#171717]" onClick={() => setOpen((v) => !v)} aria-label="menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden px-6 pb-4 flex flex-col gap-2 bg-[#fefbf8]/95"
        >
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="py-2 text-[#171717] font-medium">
              {l.label}
            </a>
          ))}
          <Link to="/blogs" onClick={() => setOpen(false)} className="py-2 text-orange-600 font-semibold">Blogs</Link>
        </motion.nav>
      )}
    </motion.header>
  );
};

export default Header;
