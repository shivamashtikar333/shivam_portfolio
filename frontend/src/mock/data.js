export const projects = [
  {
    id: 1,
    title: "Converso — AI Powered LMS Platform",
    des: "An AI-powered LMS platform offering real-time voice tutoring, secure authentication, and dynamic user experiences with Supabase and Stripe integration.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    stack: ["React", "Tailwind", "TypeScript", "Next.js", "Stripe"],
    link: "https://www.converso-app.site",
    accent: "from-orange-500 to-amber-400",
  },
  {
    id: 2,
    title: "Kaliedoscope — AI Image Generator",
    des: "An AI image generation app where users can create images from prompts, get random suggestions, share with the community, and download creations.",
    img: "https://images.pexels.com/photos/16027824/pexels-photo-16027824.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    stack: ["React", "Tailwind", "TypeScript", "Stream", "Clerk"],
    link: "https://github.com/shivamashtikar333/ai_image_generator",
    accent: "from-fuchsia-500 to-orange-400",
  },
  {
    id: 3,
    title: "MindMate — RAG-Powered Study Buddy",
    des: "Upload notes or PDFs and chat with them. Uses vector embeddings + LLM retrieval to answer questions with citations. Streaming responses & memory per session.",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    stack: ["Next.js", "LangChain", "Pinecone", "OpenAI", "Tailwind"],
    link: "#",
    accent: "from-sky-500 to-orange-400",
  },
  {
    id: 4,
    title: "PRPilot — AI Code Review Bot",
    des: "A GitHub bot that reads pull requests, flags bugs, suggests refactors and writes review summaries using an LLM. Ships as a GitHub App with webhooks.",
    img: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=1200&q=80",
    stack: ["Node.js", "GitHub API", "OpenAI", "Webhooks", "TypeScript"],
    link: "#",
    accent: "from-emerald-400 to-orange-400",
  },
];

export const focusCards = [
  ["Problem Solver", "I enjoy tackling complex challenges and finding elegant solutions through code."],
  ["Continuous Learner", "I stay current with emerging technologies and best practices in the field."],
  ["Detail Oriented", "I pay attention to the small details that make great user experiences."],
  ["Team Player", "I thrive in collaborative environments and value diverse perspectives."],
];

export const blogPosts = [
  {
    id: 1,
    title: "Next.js Auth Simplified: NextAuth with Role-Based Access",
    excerpt:
      "A deep dive into NextAuth.js — configuring providers, JWT & session callbacks, protecting server/client pages, and enforcing RBAC via middleware.",
    date: "Jun 29, 2025",
    read: "10 min read",
    tag: "Next.js",
    href: "https://nextauth-rbac-in-nextjs.hashnode.dev/nextjs-auth-simplified-nextauth-with-role-based-access",
    featured: true,
  },
];
