import { Section } from "./section";
import { motion } from "framer-motion";
import { Building2, Briefcase, Award, Calendar, Trophy } from "lucide-react";
import { usePortfolioContent } from "@/lib/portfolio-content";

export function Experience() {
  const { content } = usePortfolioContent();
  const experiences = content.experience;
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title={<>Where I've <span className="gradient-primary-text">worked</span>.</>}
      floatingIcons={[
        { Icon: Briefcase, className: "top-14 right-[10%] h-11 w-11", delay: 0 },
        { Icon: Award, className: "bottom-24 left-[6%] h-10 w-10", delay: 1.5 },
        { Icon: Calendar, className: "top-1/3 left-[45%] h-8 w-8", delay: 2.5 },
        { Icon: Trophy, className: "bottom-16 right-[16%] h-9 w-9", delay: 3.5 },
      ]}
    >
      <div className="relative">
        <div className="absolute left-4 md:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
        {experiences.map((e, i) => (
          <motion.div
            key={e.company}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative pl-14 md:pl-20 pb-10 last:pb-0"
          >
            <div className="absolute left-0 md:left-1 top-1 grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground glow-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="glass-card p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-xl font-semibold">{e.company}</h3>
                  <p className="text-primary font-medium">{e.role}</p>
                </div>
                <div className="text-sm text-muted-foreground font-mono">{e.period}</div>
              </div>
              <ul className="mt-4 space-y-2">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 rounded-full bg-primary shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}