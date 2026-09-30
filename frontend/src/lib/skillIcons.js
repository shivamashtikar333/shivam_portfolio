import { FaJava, FaJs, FaPhp, FaPython, FaGitAlt, FaDocker } from "react-icons/fa";
import * as SimpleIcons from "react-icons/si";
import { Code2 } from "lucide-react";

// Resolve brand icons by key so a renamed or removed Simple Icons export cannot
// break the entire frontend build. Unknown keys get the generic code icon.
const simpleIcon = (name) => SimpleIcons[name] || Code2;

const groups = [
  { label: "Languages", items: [
    ["javascript", "JavaScript", FaJs, "text-yellow-400"], ["typescript", "TypeScript", simpleIcon("SiTypescript"), "text-blue-400"],
    ["python", "Python", FaPython, "text-yellow-300"], ["java", "Java", FaJava, "text-red-400"],
    ["c", "C", simpleIcon("SiC"), "text-blue-400"], ["cplusplus", "C++", simpleIcon("SiCplusplus"), "text-blue-500"],
    ["csharp", "C#", simpleIcon("SiSharp"), "text-purple-400"], ["go", "Go", simpleIcon("SiGo"), "text-cyan-400"],
    ["rust", "Rust", simpleIcon("SiRust"), "text-orange-400"], ["php", "PHP", FaPhp, "text-indigo-300"],
    ["ruby", "Ruby", simpleIcon("SiRuby"), "text-red-500"], ["kotlin", "Kotlin", simpleIcon("SiKotlin"), "text-purple-400"],
    ["swift", "Swift", simpleIcon("SiSwift"), "text-orange-400"], ["dart", "Dart", simpleIcon("SiDart"), "text-cyan-400"],
    ["elixir", "Elixir", simpleIcon("SiElixir"), "text-purple-300"], ["scala", "Scala", simpleIcon("SiScala"), "text-red-400"],
  ] },
  { label: "Frontend", items: [
    ["react", "React", simpleIcon("SiReact"), "text-cyan-400"], ["nextjs", "Next.js", simpleIcon("SiNextdotjs"), "text-white"],
    ["angular", "Angular", simpleIcon("SiAngular"), "text-red-500"], ["vue", "Vue.js", simpleIcon("SiVuedotjs"), "text-green-400"],
    ["svelte", "Svelte", simpleIcon("SiSvelte"), "text-orange-500"], ["astro", "Astro", simpleIcon("SiAstro"), "text-purple-400"],
    ["remix", "Remix", simpleIcon("SiRemix"), "text-white"], ["nuxt", "Nuxt", simpleIcon("SiNuxt"), "text-green-400"],
    ["redux", "Redux", simpleIcon("SiRedux"), "text-purple-400"], ["vite", "Vite", simpleIcon("SiVite"), "text-yellow-400"],
    ["webpack", "Webpack", simpleIcon("SiWebpack"), "text-blue-300"], ["tailwind", "Tailwind CSS", simpleIcon("SiTailwindcss"), "text-sky-400"],
    ["bootstrap", "Bootstrap", simpleIcon("SiBootstrap"), "text-purple-400"], ["sass", "Sass", simpleIcon("SiSass"), "text-pink-400"],
    ["html5", "HTML5", simpleIcon("SiHtml5"), "text-orange-500"], ["css3", "CSS3", simpleIcon("SiCss"), "text-blue-400"],
  ] },
  { label: "Backend and APIs", items: [
    ["nodejs", "Node.js", simpleIcon("SiNodedotjs"), "text-green-400"], ["express", "Express", simpleIcon("SiExpress"), "text-gray-300"],
    ["nestjs", "NestJS", simpleIcon("SiNestjs"), "text-red-400"], ["fastapi", "FastAPI", simpleIcon("SiFastapi"), "text-teal-300"],
    ["django", "Django", simpleIcon("SiDjango"), "text-green-400"], ["flask", "Flask", simpleIcon("SiFlask"), "text-gray-300"],
    ["springboot", "Spring Boot", simpleIcon("SiSpringboot"), "text-green-400"], ["laravel", "Laravel", simpleIcon("SiLaravel"), "text-red-400"],
    ["dotnet", ".NET", simpleIcon("SiDotnet"), "text-purple-400"], ["graphql", "GraphQL", simpleIcon("SiGraphql"), "text-pink-400"],
  ] },
  { label: "Databases and cloud", items: [
    ["mongodb", "MongoDB", simpleIcon("SiMongodb"), "text-emerald-400"], ["postgres", "PostgreSQL", simpleIcon("SiPostgresql"), "text-blue-300"],
    ["mysql", "MySQL", simpleIcon("SiMysql"), "text-blue-400"], ["redis", "Redis", simpleIcon("SiRedis"), "text-red-400"],
    ["sqlite", "SQLite", simpleIcon("SiSqlite"), "text-blue-300"], ["supabase", "Supabase", simpleIcon("SiSupabase"), "text-green-400"],
    ["firebase", "Firebase", simpleIcon("SiFirebase"), "text-orange-300"], ["elasticsearch", "Elasticsearch", simpleIcon("SiElasticsearch"), "text-yellow-300"],
    ["aws", "AWS", simpleIcon("SiAmazonaws"), "text-orange-300"], ["googlecloud", "Google Cloud", simpleIcon("SiGooglecloud"), "text-blue-300"],
    ["azure", "Microsoft Azure", simpleIcon("SiMicrosoftazure"), "text-blue-400"],
  ] },
  { label: "DevOps and tools", items: [
    ["docker", "Docker", FaDocker, "text-blue-400"], ["kubernetes", "Kubernetes", simpleIcon("SiKubernetes"), "text-blue-400"],
    ["vercel", "Vercel", simpleIcon("SiVercel"), "text-white"], ["netlify", "Netlify", simpleIcon("SiNetlify"), "text-teal-300"],
    ["terraform", "Terraform", simpleIcon("SiTerraform"), "text-purple-400"], ["githubactions", "GitHub Actions", simpleIcon("SiGithubactions"), "text-blue-300"],
    ["git", "Git", FaGitAlt, "text-orange-400"], ["github", "GitHub", simpleIcon("SiGithub"), "text-white"],
    ["gitlab", "GitLab", simpleIcon("SiGitlab"), "text-orange-400"], ["bitbucket", "Bitbucket", simpleIcon("SiBitbucket"), "text-blue-400"],
    ["figma", "Figma", simpleIcon("SiFigma"), "text-pink-400"], ["postman", "Postman", simpleIcon("SiPostman"), "text-orange-400"],
    ["jest", "Jest", simpleIcon("SiJest"), "text-red-300"], ["cypress", "Cypress", simpleIcon("SiCypress"), "text-green-300"],
    ["playwright", "Playwright", simpleIcon("SiPlaywright"), "text-green-400"], ["linux", "Linux", simpleIcon("SiLinux"), "text-yellow-300"],
    ["nginx", "Nginx", simpleIcon("SiNginx"), "text-green-400"], ["openai", "OpenAI", simpleIcon("SiOpenai"), "text-emerald-300"],
    ["tensorflow", "TensorFlow", simpleIcon("SiTensorflow"), "text-orange-400"], ["pytorch", "PyTorch", simpleIcon("SiPytorch"), "text-red-400"],
    ["pandas", "Pandas", simpleIcon("SiPandas"), "text-indigo-300"], ["numpy", "NumPy", simpleIcon("SiNumpy"), "text-blue-300"],
    ["jupyter", "Jupyter", simpleIcon("SiJupyter"), "text-orange-400"], ["langchain", "LangChain", simpleIcon("SiLangchain"), "text-green-300"],
  ] },
  { label: "General", items: [["code", "Generic code icon", Code2, "text-orange-400"]] },
];

export const skillIconGroups = groups.map(({ label, items }) => ({
  label,
  options: items.map(([value, name, Icon, color]) => ({ value, name, Icon, color })),
}));

export const skillIconMap = Object.fromEntries(
  skillIconGroups.flatMap(({ options }) => options.map(({ value, Icon, color }) => [value, { Icon, color }])),
);
