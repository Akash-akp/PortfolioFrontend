import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Download, Mail, Github, Linkedin, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioContent } from "@/lib/portfolio-content";

const socialIcons = { github: Github, linkedin: Linkedin, mail: Mail } as const;

function useTyping(roles: string[]) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles.length) return;
    const full = roles[i];
    const t = setTimeout(
      () => {
        if (!deleting) {
          setText(full.slice(0, text.length + 1));
          if (text.length + 1 === full.length) setTimeout(() => setDeleting(true), 1400);
        } else {
          setText(full.slice(0, text.length - 1));
          if (text.length - 1 === 0) {
            setDeleting(false);
            setI((v) => (v + 1) % roles.length);
          }
        }
      },
      deleting ? 40 : 80,
    );
    return () => clearTimeout(t);
  }, [text, deleting, i, roles]);

  return text;
}

export function Hero() {
  const { content } = usePortfolioContent();
  const { hero } = content;
  const typed = useTyping(hero.roles);
  const [firstName, ...rest] = hero.name.split(" ");
  const lastName = rest.length ? rest[rest.length - 1] : "";
  const middleNames = rest.length > 1 ? rest.slice(0, -1).join(" ") : rest.slice(0, -1).join(" ");
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute top-1/4 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      </div>

      <div className="mx-auto max-w-6xl px-6 w-full">
        <div className="grid lg:grid-cols-[1.2fr_1fr] items-center gap-12 lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs text-muted-foreground mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {hero.availability}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bold tracking-tight leading-[0.95]"
            >
              {firstName} {middleNames}
              <br />
              <span className="gradient-primary-text">{lastName}.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 flex items-center gap-3 text-xl md:text-2xl text-muted-foreground"
            >
              <Code2 className="h-5 w-5 text-primary" />
              <span>{hero.tagline}</span>
              <span className="text-border">/</span>
              <span className="font-mono text-foreground min-w-[120px]">
                {typed}
                <span className="inline-block w-[2px] h-6 bg-primary translate-y-1 animate-glow-pulse ml-0.5" />
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 border-0 glow-primary group">
                <a href="#contact">
                  Hire Me <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full glass-card hover:bg-secondary/60">
                <a href="#projects"><Sparkles className="mr-1 h-4 w-4" /> View Projects</a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full">
                <a href={hero.resumeUrl} target="_blank" download><Download className="mr-1 h-4 w-4" /> Resume</a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10 flex items-center gap-4"
            >
              {hero.socials.map((s) => {
                const Icon = socialIcons[s.icon] ?? Mail;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full glass-card text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
              <div className="ml-2 text-xs text-muted-foreground font-mono">LeetCode · HackerRank</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:flex justify-center items-center"
          >
            <div className="relative w-[360px] h-[360px] xl:w-[420px] xl:h-[420px]">
              <div className="absolute inset-0 rounded-full bg-[image:var(--gradient-primary)] blur-2xl opacity-30 animate-blob" />
              <div className="absolute inset-3 rounded-full border border-border/50 overflow-hidden shadow-soft bg-background/50 backdrop-blur-sm">
                <img
                  src={hero.photo}
                  alt={hero.name}
                  width={420}
                  height={420}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass-card text-xs font-medium text-muted-foreground">
                {hero.tagline}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}