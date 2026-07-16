import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border py-12 mt-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-bold text-sm">A</span>
              Akash Kumar Parida
            </div>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm">
              Backend Software Engineer building scalable systems with Java, Spring Boot & Spring AI.
            </p>
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground mb-3">QUICK LINKS</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-muted-foreground hover:text-foreground transition">About</a></li>
              <li><a href="#projects" className="text-muted-foreground hover:text-foreground transition">Projects</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-foreground transition">Services</a></li>
              <li><a href="/resume.pdf" className="text-muted-foreground hover:text-foreground transition">Resume</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground mb-3">CONNECT</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition inline-flex items-center gap-2"><Github className="h-3.5 w-3.5" /> GitHub</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition inline-flex items-center gap-2"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</a></li>
              <li><a href="mailto:akash.parida@example.com" className="text-muted-foreground hover:text-foreground transition inline-flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Email</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} Akash Kumar Parida · Crafted with care.
          </div>
          <a href="#top" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full glass-card px-3 py-1.5">
            Back to top <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}