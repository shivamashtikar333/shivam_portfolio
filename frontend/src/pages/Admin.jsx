import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Code2, FolderKanban, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { adminApi, portfolioApi } from "../lib/portfolioApi";
import { skillIconGroups, skillIconMap } from "../lib/skillIcons";

const emptyProject = { title: "", des: "", img: "", stack: "", link: "", accent: "from-orange-500 to-amber-400", order: 0 };
const emptyCareer = { kind: "work", date: "", title: "", organization: "", subtitle: "", location: "India", summary: "", highlights: "", stack: "", current: false, order: 0 };
const emptySkill = { name: "", icon: "code", order: 0 };
const inputClass = "mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
const errorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).filter(Boolean).join(" ");
  return fallback;
};

const Field = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <label className="block text-sm font-medium text-gray-700">{label}<input className={inputClass} type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></label>
);

const TextField = ({ label, value, onChange, rows = 3, placeholder = "" }) => (
  <label className="block text-sm font-medium text-gray-700">{label}<textarea className={inputClass} rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></label>
);

const Admin = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem("portfolioAdminToken") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [career, setCareer] = useState([]);
  const [skills, setSkills] = useState([]);
  const [settingsLimit, setSettingsLimit] = useState(4);
  const [editing, setEditing] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [careerForm, setCareerForm] = useState(emptyCareer);
  const [skillForm, setSkillForm] = useState(emptySkill);

  const api = useMemo(() => adminApi(token), [token]);
  const SkillIconPreview = skillIconMap[skillForm.icon]?.Icon || Code2;

  const loadData = async (candidate = token) => {
    const adminClient = adminApi(candidate);
    const [projectResult, careerResult, skillResult, settingResult] = await Promise.all([
      adminClient.get("/projects"),
      adminClient.get("/career"),
      adminClient.get("/skills"),
      portfolioApi.get("/settings"),
    ]);
    setProjects(projectResult.data);
    setCareer(careerResult.data);
    setSkills(skillResult.data);
    setSettingsLimit(settingResult.data.projects_limit || 1);
  };

  const connect = async (candidate) => {
    setBusy(true);
    setError("");
    try {
      await loadData(candidate);
      setToken(candidate);
      sessionStorage.setItem("portfolioAdminToken", candidate);
      setAuthenticated(true);
    } catch (e) {
      const detail = e.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not connect. Check the admin token and backend URL.");
      sessionStorage.removeItem("portfolioAdminToken");
      setAuthenticated(false);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (token) connect(token);
    // Verify a saved session once on page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditing(null);
    setProjectForm(emptyProject);
    setCareerForm(emptyCareer);
    setSkillForm(emptySkill);
  };

  const editProject = (record) => {
    setEditing(record.id);
    setProjectForm({ ...record, stack: (record.stack || []).join(", ") });
  };

  const editCareer = (record) => {
    setEditing(record.id);
    setCareerForm({ ...record, highlights: (record.highlights || []).join("\n"), stack: (record.stack || []).join(", ") });
  };

  const editSkill = (record) => {
    setEditing(record.id);
    setSkillForm({ ...record });
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const record = { ...projectForm, order: Number(projectForm.order) || 0, stack: projectForm.stack.split(",").map((item) => item.trim()).filter(Boolean) };
    try {
      if (editing) await api.put(`/projects/${editing}`, record);
      else await api.post("/projects", record);
      await loadData();
      resetForm();
    } catch (e2) {
      setError(errorMessage(e2, "Unable to save this project."));
    } finally { setBusy(false); }
  };

  const saveCareer = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const record = {
      ...careerForm,
      order: Number(careerForm.order) || 0,
      highlights: careerForm.highlights.split("\n").map((item) => item.trim()).filter(Boolean),
      stack: careerForm.stack.split(",").map((item) => item.trim()).filter(Boolean),
    };
    try {
      if (editing) await api.put(`/career/${editing}`, record);
      else await api.post("/career", record);
      await loadData();
      resetForm();
    } catch (e2) {
      setError(errorMessage(e2, "Unable to save this career entry."));
    } finally { setBusy(false); }
  };

  const saveSkill = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const record = { ...skillForm, order: Number(skillForm.order) || 0 };
    try {
      if (editing) await api.put(`/skills/${editing}`, record);
      else await api.post("/skills", record);
      await loadData();
      resetForm();
    } catch (e2) {
      setError(errorMessage(e2, "Unable to save this skill."));
    } finally { setBusy(false); }
  };

  const deleteRecord = async (type, record) => {
    if (!window.confirm(`Delete “${record.title}”?`)) return;
    setBusy(true);
    setError("");
    try {
      await api.delete(`/${type}/${record.id}`);
      if (editing === record.id) resetForm();
      await loadData();
    } catch (e) {
      setError(errorMessage(e, "Unable to delete this entry."));
    } finally { setBusy(false); }
  };

  const saveLimit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.put("/settings", { projects_limit: Number(settingsLimit) });
      setSettingsLimit(data.projects_limit);
    } catch (e2) {
      setError(errorMessage(e2, "Unable to update the project display count."));
    } finally { setBusy(false); }
  };

  const logout = () => {
    sessionStorage.removeItem("portfolioAdminToken");
    setToken("");
    setAuthenticated(false);
    resetForm();
  };

  if (!authenticated) return (
    <main className="min-h-screen bg-[#fefbf8] px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-black/10 bg-white p-7 shadow-xl sm:p-9">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600"><ArrowLeft className="h-4 w-4" /> Back to portfolio</Link>
        <p className="mt-8 font-mono text-sm text-orange-600">&lt;admin/&gt;</p>
        <h1 className="mt-2 text-3xl font-bold text-black">Portfolio admin</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">Enter the admin token configured on your backend to manage projects and your career timeline.</p>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); connect(tokenInput); }}>
          <Field label="Admin token" type="password" value={tokenInput} onChange={setTokenInput} placeholder="ADMIN_TOKEN" />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button disabled={busy || !tokenInput} className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50">{busy ? "Connecting…" : "Open dashboard"}</button>
        </form>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#f7f5f2] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><Link to="/" className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600"><ArrowLeft className="h-4 w-4" /> View portfolio</Link><h1 className="text-3xl font-bold text-black">Portfolio admin</h1></div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-orange-300"><LogOut className="h-4 w-4" /> Sign out</button>
        </header>

        {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mb-6 flex gap-2 border-b border-black/10">
          <button onClick={() => { setTab("projects"); resetForm(); }} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${tab === "projects" ? "border-orange-500 text-orange-700" : "border-transparent text-gray-500"}`}><FolderKanban className="h-4 w-4" /> Projects ({projects.length})</button>
          <button onClick={() => { setTab("career"); resetForm(); }} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${tab === "career" ? "border-orange-500 text-orange-700" : "border-transparent text-gray-500"}`}><BriefcaseBusiness className="h-4 w-4" /> Career ({career.length})</button>
          <button onClick={() => { setTab("skills"); resetForm(); }} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${tab === "skills" ? "border-orange-500 text-orange-700" : "border-transparent text-gray-500"}`}><Code2 className="h-4 w-4" /> Skills ({skills.length})</button>
        </div>

        {tab === "projects" ? <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
          <section className="space-y-4">
            <form onSubmit={saveLimit} className="flex flex-wrap items-end gap-3 rounded-xl border border-black/10 bg-white p-4">
              <Field label="Projects displayed (1–50)" type="number" value={settingsLimit} onChange={setSettingsLimit} />
              <button disabled={busy} className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">Save count</button>
              <span className="text-xs text-gray-500">Set how many projects appear in the public showcase.</span>
            </form>
            <button onClick={() => { resetForm(); setProjectForm({ ...emptyProject, order: projects.length }); }} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"><Plus className="h-4 w-4" /> Add project</button>
            <div className="space-y-3">{projects.map((item) => <article key={item.id} className={`flex items-start justify-between gap-4 rounded-xl border bg-white p-4 ${editing === item.id ? "border-orange-400" : "border-black/10"}`}>
              <button onClick={() => editProject(item)} className="min-w-0 flex-1 text-left"><h2 className="font-semibold text-black">{item.title}</h2><p className="mt-1 line-clamp-2 text-sm text-gray-500">{item.des}</p><p className="mt-2 text-xs text-orange-700">Order {item.order ?? 0} · {(item.stack || []).join(" · ")}</p></button>
              <button aria-label={`Delete ${item.title}`} onClick={() => deleteRecord("projects", item)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </article>)}</div>
          </section>

          <form onSubmit={saveProject} className="h-fit space-y-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-black">{editing ? "Edit project" : "New project"}</h2>
            <Field label="Title" value={projectForm.title} onChange={(v) => setProjectForm({ ...projectForm, title: v })} />
            <TextField label="Description" value={projectForm.des} onChange={(v) => setProjectForm({ ...projectForm, des: v })} />
            <Field label="Image URL" value={projectForm.img} onChange={(v) => setProjectForm({ ...projectForm, img: v })} placeholder="https://…" />
            <Field label="Project link" value={projectForm.link} onChange={(v) => setProjectForm({ ...projectForm, link: v })} placeholder="https://…" />
            <Field label="Technologies (comma separated)" value={projectForm.stack} onChange={(v) => setProjectForm({ ...projectForm, stack: v })} placeholder="React, Node.js, MongoDB" />
            <div className="grid grid-cols-2 gap-3"><Field label="Display order" type="number" value={projectForm.order} onChange={(v) => setProjectForm({ ...projectForm, order: v })} /><Field label="Card accent" value={projectForm.accent} onChange={(v) => setProjectForm({ ...projectForm, accent: v })} placeholder="from-orange-500 to-amber-400" /></div>
            <div className="flex gap-2"><button disabled={busy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"><Save className="h-4 w-4" />{busy ? "Saving…" : "Save project"}</button>{editing && <button type="button" onClick={resetForm} className="rounded-lg border border-black/10 px-4 py-3 text-sm">Cancel</button>}</div>
          </form>
        </div> : tab === "career" ? <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
          <section className="space-y-4">
            <button onClick={() => { resetForm(); setCareerForm({ ...emptyCareer, order: career.length }); }} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"><Plus className="h-4 w-4" /> Add career entry</button>
            <div className="space-y-3">{career.map((item) => <article key={item.id} className={`flex items-start justify-between gap-4 rounded-xl border bg-white p-4 ${editing === item.id ? "border-orange-400" : "border-black/10"}`}>
              <button onClick={() => editCareer(item)} className="min-w-0 flex-1 text-left"><p className="font-mono text-xs text-orange-600">{item.date}{item.current ? " · CURRENT" : ""}</p><h2 className="mt-1 font-semibold text-black">{item.title}</h2><p className="text-sm text-gray-500">{item.organization} · Order {item.order ?? 0}</p></button>
              <button aria-label={`Delete ${item.title}`} onClick={() => deleteRecord("career", item)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </article>)}</div>
          </section>

          <form onSubmit={saveCareer} className="h-fit space-y-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-black">{editing ? "Edit career entry" : "New career entry"}</h2>
            <label className="block text-sm font-medium text-gray-700">Entry type<select className={inputClass} value={careerForm.kind} onChange={(e) => setCareerForm({ ...careerForm, kind: e.target.value })}><option value="work">Work</option><option value="education">Education / training</option></select></label>
            <Field label="Date range" value={careerForm.date} onChange={(v) => setCareerForm({ ...careerForm, date: v })} placeholder="Oct 2025 — Present" />
            <Field label="Role or qualification" value={careerForm.title} onChange={(v) => setCareerForm({ ...careerForm, title: v })} />
            <div className="grid grid-cols-2 gap-3"><Field label="Organization" value={careerForm.organization} onChange={(v) => setCareerForm({ ...careerForm, organization: v })} /><Field label="Subtitle" value={careerForm.subtitle} onChange={(v) => setCareerForm({ ...careerForm, subtitle: v })} placeholder="Optional" /></div>
            <Field label="Location" value={careerForm.location} onChange={(v) => setCareerForm({ ...careerForm, location: v })} />
            <TextField label="Summary" value={careerForm.summary} onChange={(v) => setCareerForm({ ...careerForm, summary: v })} />
            <TextField label="Highlights (one per line)" value={careerForm.highlights} onChange={(v) => setCareerForm({ ...careerForm, highlights: v })} />
            <Field label="Technologies (comma separated)" value={careerForm.stack} onChange={(v) => setCareerForm({ ...careerForm, stack: v })} />
            <div className="grid grid-cols-[1fr_auto] items-end gap-3"><Field label="Display order" type="number" value={careerForm.order} onChange={(v) => setCareerForm({ ...careerForm, order: v })} /><label className="flex items-center gap-2 pb-3 text-sm text-gray-700"><input type="checkbox" checked={Boolean(careerForm.current)} onChange={(e) => setCareerForm({ ...careerForm, current: e.target.checked })} className="accent-orange-500" /> Current</label></div>
            <div className="flex gap-2"><button disabled={busy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"><Save className="h-4 w-4" />{busy ? "Saving…" : "Save entry"}</button>{editing && <button type="button" onClick={resetForm} className="rounded-lg border border-black/10 px-4 py-3 text-sm">Cancel</button>}</div>
          </form>
        </div> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
          <section className="space-y-4">
            <button onClick={() => { resetForm(); setSkillForm({ ...emptySkill, order: skills.length }); }} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"><Plus className="h-4 w-4" /> Add skill</button>
            <p className="text-sm text-gray-500">These skills appear in the animated strip in the About section.</p>
            <div className="space-y-3">{skills.map((item) => <article key={item.id} className={`flex items-center justify-between gap-4 rounded-xl border bg-white p-4 ${editing === item.id ? "border-orange-400" : "border-black/10"}`}>
              <button onClick={() => editSkill(item)} className="min-w-0 flex-1 text-left"><h2 className="font-semibold text-black">{item.name}</h2><p className="mt-1 text-xs text-orange-700">Icon: {item.icon} · Order {item.order ?? 0}</p></button>
              <button aria-label={`Delete ${item.name}`} onClick={() => deleteRecord("skills", item)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </article>)}</div>
          </section>

          <form onSubmit={saveSkill} className="h-fit space-y-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-black">{editing ? "Edit skill" : "New skill"}</h2>
            <Field label="Skill name" value={skillForm.name} onChange={(v) => setSkillForm({ ...skillForm, name: v })} placeholder="e.g. Kubernetes" />
            <label className="block text-sm font-medium text-gray-700">Technology icon<select className={inputClass} value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}>
              {skillIconGroups.map((group) => <optgroup key={group.label} label={group.label}>{group.options.map((option) => <option key={option.value} value={option.value}>{option.name}</option>)}</optgroup>)}
            </select></label>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600"><SkillIconPreview className={`h-7 w-7 ${skillIconMap[skillForm.icon]?.color || "text-orange-400"}`} /> Preview: {skillForm.name || "Your skill"}</div>
            <Field label="Display order" type="number" value={skillForm.order} onChange={(v) => setSkillForm({ ...skillForm, order: v })} />
            <div className="flex gap-2"><button disabled={busy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"><Save className="h-4 w-4" />{busy ? "Saving…" : "Save skill"}</button>{editing && <button type="button" onClick={resetForm} className="rounded-lg border border-black/10 px-4 py-3 text-sm">Cancel</button>}</div>
          </form>
        </div>}
      </div>
    </main>
  );
};

export default Admin;
