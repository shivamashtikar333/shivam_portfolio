import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

const email = "shivamaashtikar@gmail.com";

const socialLinks = [
  { label: "GitHub", Icon: Github, href: "https://github.com/shivamashtikar333" },
  { label: "LinkedIn", Icon: Linkedin, href: "https://www.linkedin.com/in/shivam-ashtikar/" },
  { label: "Email", Icon: Mail, href: `mailto:${email}` },
];

const Contact = () => (
  <section id="contact" className="contact-section text-white px-6 sm:px-10 lg:px-12 pt-24 sm:pt-28 pb-8">
    <div className="max-w-7xl mx-auto">
      <div className="min-h-[440px] grid lg:grid-cols-[minmax(0,1fr)_auto] items-end gap-14 lg:gap-10 pb-20 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="font-mono text-lg sm:text-xl tracking-wide text-[#ed7b2f] mb-7">&lt;let&apos;s-talk/&gt;</p>
          <h2 className="font-bold tracking-[-0.055em] leading-[0.98] text-6xl sm:text-7xl lg:text-8xl">
            <span className="block">Have an idea?</span>
            <span className="block text-[#ed7b2f]">Let&apos;s build it.</span>
          </h2>
          <a
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-3 mt-12 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight hover:text-[#ed7b2f] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed7b2f]"
          >
            <span>{email}</span>
            <ArrowUpRight aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="lg:pb-1"
        >
          <p className="font-mono text-sm sm:text-base tracking-[0.24em] text-gray-500 mb-6">ELSEWHERE</p>
          <nav aria-label="Social links" className="flex items-center gap-4 sm:gap-5">
            {socialLinks.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("https://") ? "_blank" : undefined}
                rel={href.startsWith("https://") ? "noreferrer" : undefined}
                className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full border border-white/15 text-white flex items-center justify-center hover:border-[#ed7b2f] hover:bg-[#ed7b2f] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed7b2f]"
              >
                <Icon aria-hidden="true" className="w-7 h-7" strokeWidth={2} />
              </a>
            ))}
          </nav>
        </motion.div>
      </div>

      <footer className="border-t border-white/10 pt-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-gray-500 text-base sm:text-lg">
        <p>© {new Date().getFullYear()} Shivam Ashtikar. Crafted with care.</p>
        <p className="font-mono text-sm sm:text-base">Think. Build. Learn.</p>
      </footer>
    </div>
  </section>
);

export default Contact;
