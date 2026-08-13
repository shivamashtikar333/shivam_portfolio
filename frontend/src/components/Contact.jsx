import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Globe, Send, Loader2, Check } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { RevealText } from "./RevealText";

const inputBase =
  "w-full bg-transparent border border-orange-600/40 text-white placeholder:text-gray-500 rounded-lg px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const onSubmit = async (e) => {
  e.preventDefault();
  setStatus("loading");
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, form);
    setStatus("success");
    toast({ title: "Message sent ✨", description: "I'll get back to you soon, promise." });
    setForm({ name: "", email: "", message: "" });
  } catch (err) {
    setStatus("idle");
    toast({ title: "Error", description: "Failed to send message. Please try again." });
    console.error(err);
  }
  setTimeout(() => setStatus("idle"), 2200);
};


  return (
    <section id="contact" className="bg-[#fefbf8] px-4 sm:px-6 lg:px-12 py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <p className="text-orange-600 font-mono text-sm">&lt;contact&gt;</p>
          <RevealText
            as="h2"
            tokens={[{ text: "Let\u2019s" }, { text: "Create", className: "text-orange-600" }]}
            className="text-5xl lg:text-6xl font-bold leading-tight text-black"
          />
          <p className="text-gray-600 text-lg leading-relaxed max-w-md">
            I'm currently available for freelance work and open to discussing new opportunities. If you have a project that needs some creative coding, let's talk!
          </p>

          <div className="space-y-5">
            {[
              { Icon: Mail, label: "Email", value: "shivamaashtikar@gmail.com", href: "mailto:shivamaashtikar@gmail.com" },
              { Icon: MapPin, label: "Location", value: "Mumbai, India" },
            ].map(({ Icon, label, value, href }) => (
              <a key={label} href={href || "#"} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <Icon className="w-5 h-5 text-orange-500 group-hover:text-white" />
                </div>
                <div>
                  <div className="font-semibold text-orange-600">{label}</div>
                  <div className="text-gray-700">{value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="flex gap-3">
            {[
              { Icon: Github, href: "https://github.com/shivamashtikar333" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/shivam-ashtikar/" },
              { Icon: Globe, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <p className="text-orange-500 font-mono text-sm">&lt;/contact&gt;</p>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-2 bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl blur-2xl" />
          <div className="relative bg-black border border-orange-600/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Name</label>
                <input name="name" required value={form.name} onChange={onChange} placeholder="Your name" className={inputBase} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Email</label>
                <input type="email" name="email" required value={form.email} onChange={onChange} placeholder="you@example.com" className={inputBase} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Message</label>
                <textarea name="message" required rows={5} value={form.message} onChange={onChange} placeholder="Tell me about your idea…" className={`${inputBase} resize-none`} />
              </div>
              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {status === "loading" && <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>}
                {status === "success" && <><Check className="w-4 h-4" /> Sent</>}
                {status === "idle" && <>Send Message <Send className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Shivam Ashtikar. Crafted with care.</p>
        <p>Think. Build. Learn.</p>
      </div>
    </section>
  );
};

export default Contact;
