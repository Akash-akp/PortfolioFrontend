import { Section } from "./section";
import { motion } from "framer-motion";
import { Check, ArrowRight, Handshake, Wrench, Zap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioContent } from "@/lib/portfolio-content";

export function Services() {
  const { content } = usePortfolioContent();
  const services = content.services;
  return (
    <Section
      id="services"
      eyebrow="Freelance Services"
      title={<>Work <span className="gradient-primary-text">with me</span>.</>}
      description="Available for full-time roles, freelance projects, and contract work. Let's build something great."
      floatingIcons={[
        { Icon: Handshake, className: "top-16 left-[8%] h-11 w-11", delay: 0 },
        { Icon: Wrench, className: "bottom-20 right-[10%] h-10 w-10", delay: 1.4 },
        { Icon: Zap, className: "top-1/2 right-[6%] h-9 w-9", delay: 2.6 },
        { Icon: Briefcase, className: "bottom-12 left-1/3 h-8 w-8", delay: 3.8 },
      ]}
    >
      <div className="grid md:grid-cols-3 gap-5">
        {services.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${
              s.highlighted
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground glow-primary"
                : "glass-card"
            }`}
          >
            {s.highlighted && (
              <div className="absolute -top-3 left-6 rounded-full bg-background text-foreground text-[10px] font-mono px-2 py-1 border border-border">
                MOST POPULAR
              </div>
            )}
            <div className="text-xs font-mono opacity-80 mb-1">{s.tagline}</div>
            <h3 className="text-2xl font-bold mb-6">{s.name}</h3>
            <ul className="space-y-2.5 flex-1">
              {s.features.map((f) => (
                <li key={f} className="flex gap-2 items-start text-sm">
                  <Check className={`h-4 w-4 mt-0.5 shrink-0 ${s.highlighted ? "" : "text-primary"}`} />
                  <span className={s.highlighted ? "" : "text-muted-foreground"}>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-8 rounded-full ${
                s.highlighted
                  ? "bg-background text-foreground hover:bg-background/90 border-0"
                  : "bg-foreground text-background hover:bg-foreground/90 border-0"
              }`}
            >
              <a href="#contact">
                Request Quote <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}