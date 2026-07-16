import { Section } from "./section";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Github, ExternalLink, ArrowUpRight, X, Rocket, Code2, Layers3, Star } from "lucide-react";
import { usePortfolioContent, type PortfolioContent } from "@/lib/portfolio-content";

type Project = PortfolioContent["projects"][number];

export function Projects() {
  const { content } = usePortfolioContent();
  const projects = content.projects;
  const [active, setActive] = useState<Project | null>(null);
  return (
    <Section
      id="projects"
      eyebrow="Featured Projects"
      title={<>Selected <span className="gradient-primary-text">work</span>.</>}
      description="A handful of projects I've built — from full-stack platforms to backend systems and developer tooling."
      floatingIcons={[
        { Icon: Rocket, className: "top-14 right-[8%] h-11 w-11", delay: 0 },
        { Icon: Code2, className: "bottom-20 left-[10%] h-10 w-10", delay: 1.2 },
        { Icon: Layers3, className: "top-1/2 left-[6%] h-9 w-9", delay: 2.5 },
        { Icon: Star, className: "bottom-14 right-[18%] h-8 w-8", delay: 3.8 },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} onOpen={() => setActive(p)} />
        ))}
      </div>
      <CaseStudyModal project={active} onClose={() => setActive(null)} />
    </Section>
  );
}

function ProjectCard({ project: p, index: i, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const previewImg = p.previewImage ?? p.caseStudy?.images?.[0];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      className={`group relative overflow-hidden rounded-2xl glass-card p-6 md:p-8 hover:-translate-y-1 transition ${
        i === 0 ? "md:col-span-2" : ""
      }`}
    >
      <div className={`absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br ${p.accent} blur-3xl opacity-70 group-hover:opacity-100 transition`} />

      {/* Cursor-following preview image */}
      {previewImg && (
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              style={{ left: pos.x + 24, top: pos.y + 16 }}
              className="pointer-events-none absolute z-20 h-40 w-56 rounded-xl overflow-hidden border border-border/60 shadow-elevated hidden md:block"
            >
              <img src={previewImg} alt="" className="h-full w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-primary mb-1">{p.tagline}</div>
            <h3 className="text-2xl md:text-3xl font-bold">{p.name}</h3>
          </div>
          <div className="flex gap-2">
            <a href={p.github ?? "#"} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
            <a href={p.live ?? "#"} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition" aria-label="Live">
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground max-w-2xl">{p.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.highlights.map((h) => (
            <span key={h} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {h}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          {p.tags.map((t) => (
            <span key={t} className="text-[11px] font-mono text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
        <button
          onClick={onOpen}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary group/link cursor-pointer"
        >
          Read case study
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </button>
      </div>
    </motion.article>
  );
}

function CaseStudyModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl p-6 md:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-secondary/60 hover:bg-secondary transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-xs font-mono text-primary mb-1">{project.tagline}</div>
            <h3 className="text-3xl font-bold">{project.name}</h3>
            <p className="mt-3 text-muted-foreground">{project.description}</p>

            {project.caseStudy?.images && project.caseStudy.images.length > 0 && (
              <div className={`mt-6 grid gap-3 ${project.caseStudy.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {project.caseStudy.images.map((src, k) => (
                  <div key={k} className="rounded-xl overflow-hidden border border-border/60 aspect-video bg-secondary/40">
                    <img src={src} alt={`${project.name} screenshot ${k + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {project.caseStudy?.sections && project.caseStudy.sections.length > 0 && (
              <div className="mt-6 space-y-5">
                {project.caseStudy.sections.map((s, k) => (
                  <div key={k}>
                    <h4 className="font-semibold text-lg">{s.heading}</h4>
                    <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{s.body}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground font-mono">{t}</span>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <ExternalLink className="h-4 w-4" /> Live
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}