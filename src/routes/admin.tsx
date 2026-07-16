import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  LogOut, RotateCcw, ExternalLink, ShieldCheck,
  ArrowUp, ArrowDown, Plus, Trash2, Check,
} from "lucide-react";
import {
  // defaultContent,
  usePortfolioContent,
  type PortfolioContent,
} from "@/lib/portfolio-content";
import { backendUri } from "@/lib/backend-endpoint";

const AUTH_KEY = "portfolio-admin-auth";
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Portfolio Editor" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  
  async function checkAuth(){
    const token = sessionStorage.getItem(AUTH_KEY);
    if (!token) {
      setAuthed(false);
    } else {
      const response = await fetch(`${backendUri}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAuthed(data.roles == "[ROLE_ADMIN]");
    }
  }

  useEffect(() => {
    checkAuth();
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />;
  return <Editor onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} />;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const response = fetch(`${backendUri}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    response.then((res) => res.json()).then((data) => {
      console.log("Login response:", data);
      if (data.token) {
        sessionStorage.setItem(AUTH_KEY, data.token);
        onSuccess();
        toast.success("Signed in");
      } else {
        setErr("Invalid credentials");
      }
    });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground px-4">
      <form onSubmit={submit} className="w-full max-w-sm glass-card p-8 space-y-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold">Admin Login</div>
            <div className="text-xs text-muted-foreground">Portfolio content editor</div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="u">Username</Label>
          <Input id="u" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p">Password</Label>
          <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin" />
        </div>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <Button type="submit" className="w-full rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground border-0">Sign in</Button>
        <p className="text-[11px] text-muted-foreground text-center">
          Note: This is a client-side gate for demo editing (saved to your browser). Not for production security.
        </p>
      </form>
    </div>
  );
}

const SECTIONS: { key: keyof PortfolioContent; label: string; hint: string }[] = [
  { key: "hero", label: "Hero", hint: "Name, tagline, roles, socials" },
  { key: "about", label: "About", hint: "Pillars & timeline" },
  { key: "stack", label: "Tech Stack", hint: "Grouped skills" },
  { key: "experience", label: "Experience", hint: "Work history" },
  { key: "projects", label: "Projects", hint: "Featured work" },
  { key: "services", label: "Services", hint: "Freelance offerings" },
  { key: "whyHire", label: "Why Hire Me", hint: "Value propositions" },
  { key: "skills", label: "Skills", hint: "Skill levels" },
  { key: "coding", label: "Coding Profiles", hint: "GitHub, LeetCode, etc." },
  { key: "contact", label: "Contact", hint: "Email, location" },
];

function Editor({ onLogout }: { onLogout: () => void }) {
  const { content, updateSection, reset } = usePortfolioContent();
  const [active, setActive] = useState<keyof PortfolioContent>("hero");
  const [defaultContent, setDefaultContent] = useState<PortfolioContent>();
  async function fetchDefaultContent(){
    const response = await fetch("http://localhost:8080/api/portfolio/1");
    const data = await response.json();
    setDefaultContent(data);
  }
  useEffect(() => {
    fetchDefaultContent();
  }, []);

  const resetSection = () => {
    updateSection(active, (defaultContent as PortfolioContent)[active] as never);
    toast.success(`${active} reset to defaults`);
  };

  const resetAll = () => {
    if (confirm("Reset ALL portfolio content to defaults? This cannot be undone.")) {
      reset();
      toast.success("All content reset");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const hint = useMemo(() => SECTIONS.find((s) => s.key === active)?.hint ?? "", [active]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-bold text-sm">A</div>
            <div>
              <div className="font-semibold">Portfolio Admin</div>
              <div className="text-xs text-muted-foreground">Edit, create & delete content</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link to="/"><ExternalLink className="h-3.5 w-3.5 mr-1" /> View Site</Link>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={exportJson}>
              Export JSON
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={onLogout}>
              <LogOut className="h-3.5 w-3.5 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                active === s.key
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "hover:bg-secondary/60 text-muted-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={resetAll}
            className="w-full text-left px-3 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 mt-4"
          >
            Reset all content
          </button>
        </aside>

        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold capitalize">{String(active)}</h2>
              <p className="text-sm text-muted-foreground">{hint}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full" onClick={resetSection}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset section
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Changes auto-save to your live site. Use the <ArrowUp className="inline h-3 w-3" />/<ArrowDown className="inline h-3 w-3" /> buttons to reorder items.
          </p>

          <SectionEditor sectionKey={active} />
        </section>
      </div>
    </div>
  );
}

/* ------------------------------- Editors ------------------------------- */

function SectionEditor({ sectionKey }: { sectionKey: keyof PortfolioContent }) {
  const { content, updateSection } = usePortfolioContent();
  const value = content[sectionKey];
  const set = async(v: PortfolioContent[typeof sectionKey]) => {
    try{
      await updateSection(sectionKey, v);
      toast.success("Changes saved");
    }catch(e){
      toast.error("Failed to save changes. Please try again.");
    }
  };

  switch (sectionKey) {
    case "hero":
      return <HeroEditor value={value as PortfolioContent["hero"]} onSave={set as never} />;
    case "about":
      return <AboutEditor value={value as PortfolioContent["about"]} onSave={set as never} />;
    case "stack":
      return <StackEditor value={value as PortfolioContent["stack"]} onSave={set as never} />;
    case "experience":
      return <ExperienceEditor value={value as PortfolioContent["experience"]} onSave={set as never} />;
    case "projects":
      return <ProjectsEditor value={value as PortfolioContent["projects"]} onSave={set as never} />;
    case "services":
      return <ServicesEditor value={value as PortfolioContent["services"]} onSave={set as never} />;
    case "whyHire":
      return <WhyHireEditor value={value as PortfolioContent["whyHire"]} onSave={set as never} />;
    case "skills":
      return <SkillsEditor value={value as PortfolioContent["skills"]} onSave={set as never} />;
    case "coding":
      return <CodingEditor value={value as PortfolioContent["coding"]} onSave={set as never} />;
    case "contact":
      return <ContactEditor value={value as PortfolioContent["contact"]} onSave={set as never} />;
  }
}

/* ------------------------------ Primitives ----------------------------- */

function moveWithSortOrder<T extends { sortOrder?: number }>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if( j<0 || j >= arr.length ) return arr;
  arr.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  next.forEach((item, index) => {
    item.sortOrder = index + 1; // Update sortOrder to reflect new order
  });
  return next;
}

function updateSortOrder<T extends { sortOrder?: number }>(arr: T[]): T[] {
  arr.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  arr.forEach((item, index) => {
    item.sortOrder = index + 1; // Update sortOrder to reflect new order
  });
  return arr;
}

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ItemCard({
  title,
  index,
  total,
  onUp,
  onDown,
  onDelete,
  children,
}: {
  title: string;
  index: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium">
          <span className="text-muted-foreground mr-2">#{index + 1}</span>
          {title || <span className="italic text-muted-foreground">Untitled</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onUp} disabled={index === 0} title="Move up">
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onDown} disabled={index === total - 1} title="Move down">
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={onDelete} title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={onClick}>
      <Plus className="h-3.5 w-3.5 mr-1" /> {label}
    </Button>
  );
}

function StringListEditor({
  values,
  onChange,
  placeholder = "Value",
  addLabel = "Add item",
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input
            value={v}
            placeholder={placeholder}
            onChange={(e) => {
              const next = values.slice();
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange(move(values, i, -1))} disabled={i === 0}>
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange(move(values, i, 1))} disabled={i === values.length - 1}>
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onChange(values.filter((_, k) => k !== i))}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <AddButton onClick={() => onChange([...values, ""])} label={addLabel} />
    </div>
  );
}

/* ------------------------------- Sections ------------------------------ */

function HeroEditor({ value, onSave }: { value: PortfolioContent["hero"]; onSave: (v: PortfolioContent["hero"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  // const patch = (p: Partial<PortfolioContent["hero"]>) => onSave({ ...value, ...p });

  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Name"><Input value={preValue.name} onChange={(e) => setPreValue({...preValue, name: e.target.value})} /></Field>
        <Field label="Tagline"><Input value={preValue.tagline} onChange={(e) => setPreValue({...preValue, tagline: e.target.value})} /></Field>
      </div>
      <Field label="Photo URL"><Input value={preValue.photo} placeholder="/image.jpg or https://..." onChange={(e) => setPreValue({...preValue, photo: e.target.value})} /></Field>
      <Field label="Description"><Textarea rows={4} value={preValue.description} onChange={(e) => setPreValue({...preValue, description: e.target.value})} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Availability"><Input value={preValue.availability} onChange={(e) => setPreValue({...preValue, availability: e.target.value})} /></Field>
        <Field label="Resume URL"><Input value={preValue.resumeUrl} onChange={(e) => setPreValue({...preValue, resumeUrl: e.target.value})} /></Field>
      </div>
      <Field label="Rotating roles">
        <StringListEditor values={preValue.roles} onChange={(roles) => setPreValue({...preValue, roles})} placeholder="e.g. Java Developer" addLabel="Add role" />
      </Field>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-muted-foreground">Socials</Label>
          <AddButton onClick={()=>setPreValue({...preValue, socials: [...preValue.socials, { label: "New", href: "#", icon: "github" }]})} label="Add social" />
        </div>
        <div className="space-y-2">
          {preValue.socials.map((s, i) => (
            <ItemCard
              key={i}
              title={s.label}
              index={i}
              total={preValue.socials.length}
              onUp={() => setPreValue({...preValue, socials: move(preValue.socials, i, -1) })}
              onDown={() => setPreValue({...preValue, socials: move(preValue.socials, i, 1) })}
              onDelete={() => setPreValue({...preValue, socials: preValue.socials.filter((_, k) => k !== i) })}
            >
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Label"><Input value={s.label} onChange={(e) => setPreValue({...preValue, socials: preValue.socials.map((social, j) => j === i ? {...social, label: e.target.value} : social)})} /></Field>
                <Field label="URL"><Input value={s.href} onChange={(e) => setPreValue({...preValue, socials: preValue.socials.map((social, j) => j === i ? {...social, href: e.target.value} : social)})} /></Field>
                <Field label="Icon">
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={s.icon}
                    onChange={(e) => setPreValue({...preValue, socials: preValue.socials.map((social, j) => j === i ? {...social, icon: e.target.value as never} : social)})}
                  >
                    <option value="github">github</option>
                    <option value="linkedin">linkedin</option>
                    <option value="mail">mail</option>
                  </select>
                </Field>
              </div>
            </ItemCard>
          ))}
        </div>
        {isChanged() && 
          <div className="flex items-center justify-end mt-4">
            <div className="mt-6">
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={()=>onSave(preValue)}>
                <Check className="h-3.5 w-3.5 mr-1" /> Save changes
              </Button>
            </div>
          </div>
        }
        </div>
    </div>
  );
}

function AboutEditor({ value, onSave }: { value: PortfolioContent["about"]; onSave: (v: PortfolioContent["about"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  // const patch = (p: Partial<PortfolioContent["about"]>) => onSave({ ...value, ...p });
  return (
    <div className="space-y-5">
      <Field label="Title"><Input value={preValue.title} onChange={(e) => setPreValue({...preValue, title: e.target.value})} /></Field>
      <Field label="Description"><Textarea rows={3} value={preValue.description} onChange={(e) => setPreValue({...preValue, description: e.target.value})} /></Field>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-muted-foreground">Pillars</Label>
          <AddButton onClick={() => setPreValue({...preValue, pillars: [...preValue.pillars, { icon: "sparkles", title: "New pillar", text: "" }] })} label="Add pillar" />
        </div>
        <div className="space-y-2">
          {preValue.pillars.map((p, i) => (
            <ItemCard key={i} title={p.title} index={i} total={preValue.pillars.length}
              onUp={() => setPreValue({...preValue, pillars: move(preValue.pillars, i, -1) })}
              onDown={() => setPreValue({...preValue, pillars: move(preValue.pillars, i, 1) })}
              onDelete={() => setPreValue({...preValue, pillars: preValue.pillars.filter((_, k) => k !== i) })}
            >
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Icon">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={p.icon}
                    onChange={(e) => { const n = preValue.pillars.slice(); n[i] = { ...p, icon: e.target.value as never }; setPreValue({...preValue, pillars: n }); }}>
                    {["server","layers","brain","sparkles"].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Title"><Input value={p.title} onChange={(e) => { const n = preValue.pillars.slice(); n[i] = { ...p, title: e.target.value }; setPreValue({...preValue, pillars: n }); }} /></Field>
                <Field label="Text"><Input value={p.text} onChange={(e) => { const n = preValue.pillars.slice(); n[i] = { ...p, text: e.target.value }; setPreValue({...preValue, pillars: n }); }} /></Field>
              </div>
            </ItemCard>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-muted-foreground">Timeline</Label>
          <AddButton onClick={() => setPreValue({...preValue, timeline: [...preValue.timeline, { year: "", label: "" }] })} label="Add entry" />
        </div>
        <div className="space-y-2">
          {preValue.timeline.map((t, i) => (
            <ItemCard key={i} title={`${t.year} — ${t.label}`} index={i} total={preValue.timeline.length}
              onUp={() => setPreValue({...preValue, timeline: move(preValue.timeline, i, -1) })}
              onDown={() => setPreValue({...preValue, timeline: move(preValue.timeline, i, 1) })}
              onDelete={() => setPreValue({...preValue, timeline: preValue.timeline.filter((_, k) => k !== i) })}
            >
              <div className="grid md:grid-cols-[120px_1fr] gap-3">
                <Field label="Year"><Input value={t.year} onChange={(e) => { const n = preValue.timeline.slice(); n[i] = { ...t, year: e.target.value }; setPreValue({...preValue, timeline: n }); }} /></Field>
                <Field label="Label"><Input value={t.label} onChange={(e) => { const n = preValue.timeline.slice(); n[i] = { ...t, label: e.target.value }; setPreValue({...preValue, timeline: n }); }} /></Field>
              </div>
            </ItemCard>
          ))}
        </div>
      </div>
      { isChanged() && 
        <div className="flex items-center justify-end mt-4">
          <div className="mt-6">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
              Save Changes
            </Button>
          </div>
      </div>}
    </div>
  );
}

function StackEditor({ value, onSave }: { value: PortfolioContent["stack"]; onSave: (v: PortfolioContent["stack"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  return (
    <div className="space-y-3">
      {preValue.map((g, i) => (
        <ItemCard key={i} title={g.title} index={i} total={value.length}
          onUp={() => setPreValue(moveWithSortOrder(preValue, i, -1))}
          onDown={() => setPreValue(moveWithSortOrder(preValue, i, 1))}
          onDelete={() => setPreValue(updateSortOrder(preValue.filter((_, k) => k !== i)))}
        >
          <Field label="Group title"><Input value={g.title} onChange={(e) => { const n = preValue.slice(); n[i] = { ...g, title: e.target.value }; setPreValue(n); }} /></Field>
          <Field label="Items">
            <StringListEditor
              values={g.items}
              onChange={(items) => { const n = preValue.slice(); n[i] = { ...g, items }; setPreValue(n); }}
              placeholder="e.g. Java"
              addLabel="Add item"
            />
          </Field>
        </ItemCard>
      ))}
      <AddButton onClick={() => setPreValue([...preValue, { title: "New group", items: [] }])} label="Add group" />
        {isChanged() && 
          <div className="flex items-center justify-end mt-4">
            <div className="mt-6">
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
                Save Changes
              </Button>
            </div>
          </div>
        }
    </div>
  );
}

function ExperienceEditor({ value, onSave }: { value: PortfolioContent["experience"]; onSave: (v: PortfolioContent["experience"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  return (
    <div className="space-y-3">
      {preValue.map((x, i) => (
        <ItemCard key={i} title={`${x.company} — ${x.role}`} index={i} total={value.length}
          onUp={() => setPreValue(moveWithSortOrder(preValue, i, -1))}
          onDown={() => setPreValue(moveWithSortOrder(preValue, i, 1))}
          onDelete={() => setPreValue(updateSortOrder(preValue.filter((_, k) => k !== i)))}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Company"><Input value={x.company} onChange={(e) => { const n = preValue.slice(); n[i] = { ...x, company: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Role"><Input value={x.role} onChange={(e) => { const n = preValue.slice(); n[i] = { ...x, role: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Period"><Input value={x.period} onChange={(e) => { const n = preValue.slice(); n[i] = { ...x, period: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Location"><Input value={x.location} onChange={(e) => { const n = preValue.slice(); n[i] = { ...x, location: e.target.value }; setPreValue(n); }} /></Field>
          </div>
          <Field label="Bullets">
            <StringListEditor values={x.bullets} onChange={(bullets) => { const n = preValue.slice(); n[i] = { ...x, bullets }; setPreValue(n); }} placeholder="Achievement…" addLabel="Add bullet" />
          </Field>
          <Field label="Tags">
            <StringListEditor values={x.tags} onChange={(tags) => { const n = preValue.slice(); n[i] = { ...x, tags }; setPreValue(n); }} placeholder="e.g. Java" addLabel="Add tag" />
          </Field>
        </ItemCard>
      ))}
      <AddButton onClick={() => setPreValue([...preValue, { company: "", role: "", period: "", location: "", bullets: [], tags: [] }])} label="Add experience" />
        {isChanged() && 
          <div className="flex items-center justify-end mt-4">
            <div className="mt-6">
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
                Save Changes
              </Button>
            </div>
          </div>
        }
    </div>
  );
}

function ProjectsEditor({ value, onSave }: { value: PortfolioContent["projects"]; onSave: (v: PortfolioContent["projects"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  return (
    <div className="space-y-3">
      {preValue.map((p, i) => (
        <ItemCard key={i} title={p.name} index={i} total={value.length}
          onUp={() => setPreValue(moveWithSortOrder(preValue, i, -1))}
          onDown={() => setPreValue(moveWithSortOrder(preValue, i, 1))}
          onDelete={() => setPreValue(updateSortOrder(preValue.filter((_, k) => k !== i)))}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Name"><Input value={p.name} onChange={(e) => {const n = preValue.slice(); n[i] = { ...p, name: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Tagline"><Input value={p.tagline} onChange={(e) => { const n = preValue.slice(); n[i] = { ...p, tagline: e.target.value }; setPreValue(n); }} /></Field>
          </div>
          <Field label="Description"><Textarea rows={3} value={p.description} onChange={(e) => { const n = preValue.slice(); n[i] = { ...p, description: e.target.value }; setPreValue(n); }} /></Field>
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Accent (tailwind)"><Input value={p.accent} onChange={(e) => { const n = preValue.slice(); n[i] = { ...p, accent: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="GitHub URL"><Input value={p.github ?? ""} onChange={(e) => { const n = preValue.slice(); n[i] = { ...p, github: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Live URL"><Input value={p.live ?? ""} onChange={(e) => { const n = preValue.slice(); n[i] = { ...p, live: e.target.value }; setPreValue(n); }} /></Field>
          </div>
          <Field label="Tags">
            <StringListEditor values={p.tags} onChange={(tags) => { const n = preValue.slice(); n[i] = { ...p, tags }; setPreValue(n); }} placeholder="e.g. Spring Boot" addLabel="Add tag" />
          </Field>
          <Field label="Highlights">
            <StringListEditor values={p.highlights} onChange={(highlights) => { const n = preValue.slice(); n[i] = { ...p, highlights }; setPreValue(n); }} placeholder="e.g. JWT Auth" addLabel="Add highlight" />
          </Field>
          <Field label="Preview image URL (shown near cursor on hover)">
            <Input value={p.previewImage ?? ""} onChange={(e) => { const n = preValue.slice(); n[i] = { ...p, previewImage: e.target.value }; setPreValue(n); }} placeholder="https://..." />
          </Field>
          <Field label="Case study images">
            <StringListEditor
              values={p.caseStudy?.images ?? []}
              onChange={(images) => { const n = preValue.slice(); n[i] = { ...p, caseStudy: { ...(p.caseStudy ?? {}), images } }; setPreValue(n); }}
              placeholder="https://..."
              addLabel="Add image URL"
            />
          </Field>
          <Field label="Case study sections">
            <div className="space-y-2">
              {(p.caseStudy?.sections ?? []).map((sec, si) => (
                <div key={si} className="rounded-lg border border-border/60 p-3 space-y-2 bg-secondary/20">
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={sec.heading}
                      placeholder="Heading (e.g. The Challenge)"
                      onChange={(e) => {
                        const sections = (p.caseStudy?.sections ?? []).slice();
                        sections[si] = { ...sec, heading: e.target.value };
                        const n = preValue.slice(); n[i] = { ...p, caseStudy: { ...(p.caseStudy ?? {}), sections } };
                        setPreValue(n);
                      }}
                    />
                    <div className="flex gap-1 shrink-0">
                      <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={si === 0} onClick={() => {
                        const sections = move(p.caseStudy?.sections ?? [], si, -1);
                        const n = preValue.slice(); n[i] = { ...p, caseStudy: { ...(p.caseStudy ?? {}), sections } };
                        setPreValue(n);
                      }}><ArrowUp className="h-3.5 w-3.5" /></Button>
                      <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={si === (p.caseStudy?.sections?.length ?? 0) - 1} onClick={() => {
                        const sections = move(p.caseStudy?.sections ?? [], si, 1);
                        const n = preValue.slice(); n[i] = { ...p, caseStudy: { ...(p.caseStudy ?? {}), sections } };
                        setPreValue(n);
                      }}><ArrowDown className="h-3.5 w-3.5" /></Button>
                      <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                        const sections = (p.caseStudy?.sections ?? []).filter((_, k) => k !== si);
                        const n = preValue.slice(); n[i] = { ...p, caseStudy: { ...(p.caseStudy ?? {}), sections } };
                        setPreValue(n);
                      }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                  <Textarea
                    rows={3}
                    value={sec.body}
                    placeholder="Details, results, tech decisions…"
                    onChange={(e) => {
                      const sections = (p.caseStudy?.sections ?? []).slice();
                      sections[si] = { ...sec, body: e.target.value };
                      const n = preValue.slice(); n[i] = { ...p, caseStudy: { ...(p.caseStudy ?? {}), sections } };
                      setPreValue(n);
                    }}
                  />
                </div>
              ))}
              <AddButton onClick={() => {
                const sections = [...(p.caseStudy?.sections ?? []), { heading: "New section", body: "" }];
                const n = preValue.slice(); n[i] = { ...p, caseStudy: { ...(p.caseStudy ?? {}), sections } };
                setPreValue(n);
              }} label="Add case study section" />
            </div>
          </Field>
        </ItemCard>
      ))}
      <AddButton onClick={() => setPreValue([...preValue, { name: "New project", tagline: "", description: "", tags: [], highlights: [], accent: "from-primary/30 to-accent/30" }])} label="Add project" />
      {isChanged() && 
        <div className="flex items-center justify-end mt-4">
          <div className="mt-6">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
              Save Changes
            </Button>
          </div>
        </div>
      }
    </div>
  );
}

function ServicesEditor({ value, onSave }: { value: PortfolioContent["services"]; onSave: (v: PortfolioContent["services"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  return (
    <div className="space-y-3">
      {preValue.map((s, i) => (
        <ItemCard key={i} title={s.name} index={i} total={preValue.length}
          onUp={() => setPreValue(moveWithSortOrder(preValue, i, -1))}
          onDown={() => setPreValue(moveWithSortOrder(preValue, i, 1))}
          onDelete={() => setPreValue(updateSortOrder(preValue.filter((_, k) => k !== i)))}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Name"><Input value={s.name} onChange={(e) => { const n = preValue.slice(); n[i] = { ...s, name: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Tagline"><Input value={s.tagline} onChange={(e) => { const n = preValue.slice(); n[i] = { ...s, tagline: e.target.value }; setPreValue(n); }} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={s.highlighted} onChange={(e) => { const n = preValue.slice(); n[i] = { ...s, highlighted: e.target.checked }; setPreValue(n); }} />
            Highlighted (featured card)
          </label>
          <Field label="Features">
            <StringListEditor values={s.features} onChange={(features) => { const n = preValue.slice(); n[i] = { ...s, features }; setPreValue(n); }} placeholder="Feature…" addLabel="Add feature" />
          </Field>
        </ItemCard>
      ))}
      <AddButton onClick={() => setPreValue([...preValue, { name: "New service", tagline: "", features: [], highlighted: false }])} label="Add service" />
      {isChanged() && 
        <div className="flex items-center justify-end mt-4">
          <div className="mt-6">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
              Save Changes
            </Button>
          </div>
        </div>
      }
    </div>
  );
}

const WHY_ICONS = ["rocket","code","sparkles","shield","timer","message","test","users","award"];

function WhyHireEditor({ value, onSave }: { value: PortfolioContent["whyHire"]; onSave: (v: PortfolioContent["whyHire"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  return (
    <div className="space-y-3">
      {preValue.map((it, i) => (
        <ItemCard key={i} title={it.title} index={i} total={preValue.length}
          onUp={() => setPreValue(moveWithSortOrder(preValue, i, -1))}
          onDown={() => setPreValue(moveWithSortOrder(preValue, i, 1))}
          onDelete={() => setPreValue(updateSortOrder(preValue.filter((_, k) => k !== i)))}
        >
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Icon">
              <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={it.icon}
                onChange={(e) => { const n = preValue.slice(); n[i] = { ...it, icon: e.target.value }; setPreValue(n); }}>
                {WHY_ICONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Title"><Input value={it.title} onChange={(e) => { const n = preValue.slice(); n[i] = { ...it, title: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Text"><Input value={it.text} onChange={(e) => { const n = preValue.slice(); n[i] = { ...it, text: e.target.value }; setPreValue(n); }} /></Field>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => setPreValue([...preValue, { icon: "sparkles", title: "New reason", text: "" }])} label="Add reason" />
        {isChanged() && 
          <div className="flex items-center justify-end mt-4">
            <div className="mt-6">
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
                Save Changes
              </Button>
            </div>
          </div>
        }
    </div>
  );
}

function SkillsEditor({ value, onSave }: { value: PortfolioContent["skills"]; onSave: (v: PortfolioContent["skills"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  return (
    <div className="space-y-3">
      {preValue.map((s, i) => (
        <ItemCard key={i} title={`${s.name} — ${s.level}%`} index={i} total={preValue.length}
          onUp={() => setPreValue(moveWithSortOrder(preValue, i, -1))}
          onDown={() => setPreValue(moveWithSortOrder(preValue, i, 1))}
          onDelete={() => setPreValue(updateSortOrder(preValue.filter((_, k) => k !== i)))}
        >
          <div className="grid md:grid-cols-[1fr_140px] gap-3">
            <Field label="Skill"><Input value={s.name} onChange={(e) => { const n = value.slice(); n[i] = { ...s, name: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Level (0–100)">
              <Input type="number" min={0} max={100} value={s.level}
                onChange={(e) => { const n = value.slice(); n[i] = { ...s, level: Math.max(0, Math.min(100, Number(e.target.value) || 0)) }; setPreValue(n); }} />
            </Field>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => setPreValue([...preValue, { name: "New skill", level: 70 }])} label="Add skill" />
      {isChanged() && 
        <div className="flex items-center justify-end mt-4">
          <div className="mt-6">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
              Save Changes
            </Button>
          </div>
        </div>
      }
    </div>
  );
}

function CodingEditor({ value, onSave }: { value: PortfolioContent["coding"]; onSave: (v: PortfolioContent["coding"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  return (
    <div className="space-y-3">
      {preValue.map((c, i) => (
        <ItemCard key={i} title={c.name} index={i} total={preValue.length}
          onUp={() => setPreValue(moveWithSortOrder(preValue, i, -1))}
          onDown={() => setPreValue(moveWithSortOrder(preValue, i, 1))}
          onDelete={() => setPreValue(updateSortOrder(preValue.filter((_, k) => k !== i)))}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Platform"><Input value={c.name} onChange={(e) => { const n = value.slice(); n[i] = { ...c, name: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Handle"><Input value={c.handle} onChange={(e) => { const n = value.slice(); n[i] = { ...c, handle: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Icon"><Input value={c.icon} onChange={(e) => { const n = value.slice(); n[i] = { ...c, icon: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="URL"><Input value={c.href ?? ""} onChange={(e) => { const n = value.slice(); n[i] = { ...c, href: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Stat"><Input value={c.stat} onChange={(e) => { const n = value.slice(); n[i] = { ...c, stat: e.target.value }; setPreValue(n); }} /></Field>
            <Field label="Meta"><Input value={c.meta} onChange={(e) => { const n = value.slice(); n[i] = { ...c, meta: e.target.value }; setPreValue(n); }} /></Field>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => setPreValue([...preValue, { name: "New profile", handle: "", icon: "code", stat: "", meta: "", href: "#" }])} label="Add profile" />
      {isChanged() && 
        <div className="flex items-center justify-end mt-4">
          <div className="mt-6">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
              Save Changes
            </Button>
          </div>
        </div>
      }
    </div>
  );
}

function ContactEditor({ value, onSave }: { value: PortfolioContent["contact"]; onSave: (v: PortfolioContent["contact"]) => void }) {
  const [preValue, setPreValue] = useState(value);
  const isChanged = () => JSON.stringify(preValue) !== JSON.stringify(value);
  return (
    <div className="space-y-4">
      <Field label="Email"><Input value={preValue.email} onChange={(e) => setPreValue({ ...preValue, email: e.target.value })} /></Field>
      <Field label="Location"><Input value={preValue.location} onChange={(e) => setPreValue({ ...preValue, location: e.target.value })} /></Field>
      <Field label="Calendar URL"><Input value={preValue.calendarUrl} onChange={(e) => setPreValue({ ...preValue, calendarUrl: e.target.value })} /></Field>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-primary" /> Changes save automatically.
      </div>
      {isChanged() && (
        <div className="flex items-center justify-end mt-4">
          <div className="mt-6">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onSave(preValue)}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
