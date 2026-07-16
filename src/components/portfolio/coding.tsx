import { Section } from "./section";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, Code2, Trophy, Terminal, Sigma, X, Loader2, ExternalLink } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { usePortfolioContent, type PortfolioContent } from "@/lib/portfolio-content";
import { getCodingProfileStats } from "@/lib/coding-stats.functions";
import type { CodingStatsResult, ContributionDay } from "@/lib/coding-stats.types";

type Profile = PortfolioContent["coding"][number];

const iconMap: Record<string, typeof Github> = {
  github: Github, code: Code2, terminal: Terminal, sigma: Sigma, trophy: Trophy,
};

export function Coding() {
  const { content } = usePortfolioContent();
  const profiles = content.coding;
  const [active, setActive] = useState<Profile | null>(null);
  return (
    <Section
      eyebrow="Coding Profiles"
      title={<>Consistency across <span className="gradient-primary-text">platforms</span>.</>}
      description="I practice daily — problem solving keeps my engineering sharp."
      floatingIcons={[
        { Icon: Github, className: "top-14 left-[8%] h-10 w-10", delay: 0 },
        { Icon: Code2, className: "top-20 right-[10%] h-11 w-11", delay: 1.4 },
        { Icon: Terminal, className: "bottom-20 left-[14%] h-9 w-9", delay: 2.5 },
        { Icon: Trophy, className: "bottom-14 right-[16%] h-10 w-10", delay: 3.6 },
        { Icon: Sigma, className: "top-1/2 left-1/2 h-8 w-8", delay: 2.8 },
      ]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((p, i) => {
          const Icon = iconMap[p.icon] ?? Github;
          return (
          <motion.button
            key={p.name}
            type="button"
            onClick={() => setActive(p)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="text-left glass-card p-5 flex items-center gap-4 hover:-translate-y-1 hover:border-primary/40 transition cursor-pointer"
          >
            <div className="h-11 w-11 rounded-xl grid place-items-center bg-[image:var(--gradient-primary)] text-primary-foreground shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-xs font-mono text-primary shrink-0">{p.stat}</div>
              </div>
              <div className="text-xs text-muted-foreground truncate">{p.handle} · {p.meta}</div>
            </div>
          </motion.button>
          );
        })}
      </div>
      <StatsModal profile={active} onClose={() => setActive(null)} />
    </Section>
  );
}

function StatsModal({ profile, onClose }: { profile: Profile | null; onClose: () => void }) {
  const loadStats = useServerFn(getCodingProfileStats);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodingStatsResult | null>(null);

  useEffect(() => {
    if (!profile) return;
    setLoading(true); setResult(null);
    let cancelled = false;
    loadStats({
      data: {
        name: profile.name,
        handle: profile.handle,
        stat: profile.stat,
        meta: profile.meta,
        href: profile.href,
      },
    }).then((r) => {
      if (cancelled) return;
      setResult(r);
      setLoading(false);
    }).catch((error: unknown) => {
      if (cancelled) return;
      setResult({
        ok: false,
        platform: profile.name,
        username: profile.handle.replace(/^@/, ""),
        error: error instanceof Error ? error.message : "Unable to fetch live stats",
        fallback: [
          { label: "Displayed Stat", value: profile.stat },
          { label: "Handle", value: profile.handle },
          { label: "Profile", value: profile.meta },
        ],
        extra: { url: profile.href },
      });
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [profile]);

  const Icon = profile ? (iconMap[profile.icon] ?? Github) : Github;
  const avatar = result?.extra?.avatar;
  const extUrl = result?.extra?.url ?? profile?.href;
  const stats = result ? (result.ok ? result.stats : result.fallback) : [];

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto glass-card rounded-2xl p-6 md:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-secondary/60 hover:bg-secondary transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-4">
              {avatar ? (
                <img src={avatar} alt="" className="h-14 w-14 rounded-xl object-cover border border-border/60" />
              ) : (
                <div className="h-14 w-14 rounded-xl grid place-items-center bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-mono text-primary">{profile.name}</div>
                <div className="font-semibold truncate">{profile.handle}</div>
                <div className="text-xs text-muted-foreground truncate">{profile.meta}</div>
              </div>
            </div>

            <div className="mt-6 min-h-[120px]">
              {loading && (
                <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Fetching live stats…
                </div>
              )}
              {result && !result.ok && (
                <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {result.error}
                  <div className="mt-1 text-xs text-muted-foreground">
                    Showing saved portfolio values. Confirm the exact username in admin if this profile should fetch live.
                  </div>
                </div>
              )}
              {result?.ok && result.note && (
                <div className="mb-4 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
                  {result.note}
                </div>
              )}
              {stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-xl border border-border/60 bg-secondary/30 p-3">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{s.label}</div>
                      <div className="text-lg font-bold mt-1 truncate">{s.value}</div>
                    </div>
                  ))}
                </div>
              )}
              {result?.ok && result.contributions && (
                <ContributionHeatmap total={result.contributions.total} days={result.contributions.days} />
              )}
            </div>

            {extUrl && extUrl !== "#" && (
              <a
                href={extUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Visit profile <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContributionHeatmap({ total, days }: { total: number; days: ContributionDay[] }) {
  const cells = buildContributionCells(days);

  return (
    <div className="mt-7 rounded-2xl border border-border/60 bg-secondary/20 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">GitHub consistency graph</div>
          <div className="text-xs text-muted-foreground">{total.toLocaleString()} contributions in the last year</div>
        </div>
        <div className="hidden text-xs font-mono text-primary sm:block">live</div>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="grid w-max grid-flow-col grid-rows-7 gap-1" aria-label="GitHub contribution heatmap">
          {cells.map((day, index) => (
            <div
              key={day?.date ?? `blank-${index}`}
              title={day ? `${day.count} contributions on ${day.date}` : undefined}
              className={`h-2.5 w-2.5 rounded-[2px] contribution-level-${day?.level ?? 0}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className={`h-2.5 w-2.5 rounded-[2px] contribution-level-${level}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function buildContributionCells(days: ContributionDay[]) {
  const ordered = days.slice(-371);
  if (!ordered.length) return [];

  const first = new Date(`${ordered[0].date}T00:00:00Z`);
  const leadingEmpty = Number.isNaN(first.getTime()) ? 0 : first.getUTCDay();
  const cells: Array<ContributionDay | null> = [
    ...Array.from({ length: leadingEmpty }, () => null),
    ...ordered,
  ];
  const trailingEmpty = (7 - (cells.length % 7)) % 7;

  return [...cells, ...Array.from({ length: trailingEmpty }, () => null)];
}