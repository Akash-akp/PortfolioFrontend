import { Section } from "./section";
import { motion } from "framer-motion";
import { Code2, Terminal, Braces, GitMerge, FunctionSquare } from "lucide-react";
import { usePortfolioContent } from "@/lib/portfolio-content";

export function Skills() {
  const { content } = usePortfolioContent();
  const skills = content.skills;
  return (
    <Section
      eyebrow="Skills"
      title={<>Depth across the <span className="gradient-primary-text">stack</span>.</>}
      floatingIcons={[
        { Icon: Code2, className: "top-14 left-[8%] h-10 w-10", delay: 0 },
        { Icon: Terminal, className: "top-24 right-[10%] h-9 w-9", delay: 1.2 },
        { Icon: Braces, className: "bottom-20 left-[16%] h-9 w-9", delay: 2.4 },
        { Icon: FunctionSquare, className: "bottom-14 right-[14%] h-8 w-8", delay: 3.5 },
        { Icon: GitMerge, className: "top-1/2 left-1/2 h-8 w-8", delay: 2.8 },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
        {skills.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{s.name}</span>
              <span className="font-mono text-muted-foreground">{s.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.1 + i * 0.04 }}
                className="h-full bg-[image:var(--gradient-primary)] rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}