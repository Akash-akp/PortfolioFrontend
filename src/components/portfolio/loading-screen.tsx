import { motion, AnimatePresence } from "framer-motion";
import { Code2 } from "lucide-react";

export function LoadingScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-blob" />
            <div
              className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-blob"
              style={{ animationDelay: "2s" }}
            />
          </div>
          <div className="flex flex-col items-center gap-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-[image:var(--gradient-primary)] blur-xl opacity-70 animate-glow-pulse" />
              <div className="relative h-20 w-20 rounded-2xl grid place-items-center bg-[image:var(--gradient-primary)] text-primary-foreground shadow-2xl">
                <Code2 className="h-9 w-9" />
              </div>
            </motion.div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="gradient-primary-text">Akash Kumar Parida</span>
              </div>
              <div className="text-xs md:text-sm font-mono text-muted-foreground">
                Loading portfolio<AnimatedDots />
              </div>
            </div>
            <div className="relative h-1 w-56 overflow-hidden rounded-full bg-secondary/60">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/2 bg-[image:var(--gradient-primary)]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AnimatedDots() {
  return (
    <span className="inline-flex ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}