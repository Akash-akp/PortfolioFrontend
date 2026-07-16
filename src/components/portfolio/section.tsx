import { motion } from "framer-motion";
import type { ComponentType, ReactNode, SVGProps } from "react";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type FloatingIcon = {
  Icon: Icon;
  className?: string;
  delay?: number;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
  floatingIcons,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  floatingIcons?: FloatingIcon[];
}) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      {/* Floating decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-10 left-[10%] h-40 w-40 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-10 right-[8%] h-56 w-56 rounded-full bg-accent/10 blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl animate-float-slow"
          style={{ animationDelay: "4s" }}
        />
        {floatingIcons?.map(({ Icon, className: iconClass = "", delay = 0 }, i) => (
          <Icon
            key={i}
            aria-hidden
            className={`absolute text-primary/20 animate-float-slow ${iconClass}`}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-3xl"
        >
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full glass-card px-3 py-1 text-xs font-mono text-muted-foreground mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </div>
          )}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{title}</h2>
          {description && <p className="mt-4 text-muted-foreground text-base md:text-lg">{description}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}