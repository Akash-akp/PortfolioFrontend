import { Section } from "./section";
import { motion } from "framer-motion";
import { Brain, Layers, Server, Sparkles, Coffee, User, Compass } from "lucide-react";
import { usePortfolioContent } from "@/lib/portfolio-content";

const iconMap = { server: Server, layers: Layers, brain: Brain, sparkles: Sparkles } as const;

export function About() {
  const { content } = usePortfolioContent();
  const { about } = content;
  return (
    <Section
      id="about"
      eyebrow="About"
      title={about.title}
      description={about.description}
      floatingIcons={[
        { Icon: User, className: "top-16 right-[12%] h-10 w-10", delay: 0 },
        { Icon: Coffee, className: "bottom-20 left-[8%] h-8 w-8", delay: 1.2 },
        { Icon: Compass, className: "top-1/2 right-[6%] h-9 w-9", delay: 2.4 },
        { Icon: Sparkles, className: "bottom-10 right-1/3 h-7 w-7", delay: 3.5 },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-10">
        <div className="grid grid-cols-2 gap-4">
          {about.pillars.map((p, i) => {
            const Icon = iconMap[p.icon] ?? Sparkles;
            return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-5 hover:-translate-y-1 transition-transform"
            >
              <Icon className="h-5 w-5 text-primary mb-3" />
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{p.text}</div>
            </motion.div>
            );
          })}
        </div>

        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
          {about.timeline.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative pl-6 pb-6 last:pb-0"
            >
              <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <div className="text-xs font-mono text-primary">{t.year}</div>
              <div className="text-sm text-foreground mt-1">{t.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}