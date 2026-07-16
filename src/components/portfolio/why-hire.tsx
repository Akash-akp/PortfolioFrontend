import { Section } from "./section";
import { motion } from "framer-motion";
import { Rocket, ShieldCheck, Sparkles, MessageCircle, Timer, Code, TestTube, Users, Award, ThumbsUp, Target } from "lucide-react";
import { usePortfolioContent } from "@/lib/portfolio-content";

const iconMap: Record<string, typeof Rocket> = {
  rocket: Rocket, code: Code, sparkles: Sparkles, shield: ShieldCheck,
  timer: Timer, message: MessageCircle, test: TestTube, users: Users, award: Award,
};

export function WhyHire() {
  const { content } = usePortfolioContent();
  const items = content.whyHire;
  return (
    <Section
      eyebrow="Why Hire Me"
      title={<>What you can <span className="gradient-primary-text">expect</span>.</>}
      floatingIcons={[
        { Icon: ThumbsUp, className: "top-14 left-[10%] h-10 w-10", delay: 0 },
        { Icon: ShieldCheck, className: "top-20 right-[8%] h-11 w-11", delay: 1.3 },
        { Icon: Target, className: "bottom-20 left-[14%] h-9 w-9", delay: 2.5 },
        { Icon: Award, className: "bottom-16 right-[12%] h-10 w-10", delay: 3.6 },
      ]}
    >
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((it, i) => {
          const Icon = iconMap[it.icon] ?? Sparkles;
          return (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="glass-card p-5 hover:border-primary/40 transition group"
          >
            <div className="h-9 w-9 rounded-lg grid place-items-center bg-primary/10 text-primary group-hover:scale-110 transition-transform mb-3">
              <Icon className="h-4 w-4" />
            </div>
            <div className="font-semibold">{it.title}</div>
            <p className="text-sm text-muted-foreground mt-1">{it.text}</p>
          </motion.div>
          );
        })}
      </div>
    </Section>
  );
}