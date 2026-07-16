import { Section } from "./section";
import { motion } from "framer-motion";
import { Boxes, Database, Cloud, Cpu, GitBranch, Container } from "lucide-react";
import { usePortfolioContent } from "@/lib/portfolio-content";

export function Stack() {
  const { content } = usePortfolioContent();
  const groups = content.stack;
  groups.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  console.log("groups",groups);
  return (
    <Section
      id="stack"
      eyebrow="Tech Stack"
      title={<>Tools I use to <span className="gradient-primary-text">ship</span>.</>}
      description="From backend frameworks to databases and DevOps — the technologies I reach for daily."
      floatingIcons={[
        { Icon: Database, className: "top-14 left-[8%] h-10 w-10", delay: 0 },
        { Icon: Cloud, className: "top-24 right-[10%] h-12 w-12", delay: 1 },
        { Icon: Container, className: "bottom-20 left-[15%] h-9 w-9", delay: 2 },
        { Icon: GitBranch, className: "bottom-14 right-[14%] h-8 w-8", delay: 3 },
        { Icon: Cpu, className: "top-1/2 left-[45%] h-9 w-9", delay: 2.5 },
        { Icon: Boxes, className: "top-1/3 right-1/3 h-8 w-8", delay: 4 },
      ]}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="glass-card p-6 group hover:border-primary/40 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{g.title}</h3>
              <span className="text-[10px] font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <span
                  key={it}
                  className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 text-secondary-foreground border border-border hover:border-primary/40 hover:text-primary transition"
                >
                  {it}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}