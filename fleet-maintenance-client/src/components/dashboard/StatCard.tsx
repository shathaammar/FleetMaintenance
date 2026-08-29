import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  change?: number;
  icon: LucideIcon;
  accent:
    | "orange"
    | "blue"
    | "green"
    | "purple";
  delay?: number;
}

const accentStyles = {
  orange: {
    icon: "bg-primary/12 text-primary",
    glow: "bg-primary/10",
    border: "group-hover:border-primary/30",
  },
  blue: {
    icon: "bg-blue-500/12 text-blue-400",
    glow: "bg-blue-500/10",
    border: "group-hover:border-blue-500/30",
  },
  green: {
    icon: "bg-emerald-500/12 text-emerald-400",
    glow: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/30",
  },
  purple: {
    icon: "bg-violet-500/12 text-violet-400",
    glow: "bg-violet-500/10",
    border: "group-hover:border-violet-500/30",
  },
};

export function StatCard({
  title,
  value,
  description,
  change,
  icon: Icon,
  accent,
  delay = 0,
}: StatCardProps) {
  const styles = accentStyles[accent];
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -4,
      }}
      className={[
        "group relative overflow-hidden rounded-2xl border border-border-dark bg-surface/75 p-5 backdrop-blur-xl transition-colors",
        styles.border,
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute -right-12 -top-12 size-32 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125",
          styles.glow,
        ].join(" ")}
      />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between">
          <div
            className={[
              "grid size-12 place-items-center rounded-2xl",
              styles.icon,
            ].join(" ")}
          >
            <Icon size={23} strokeWidth={2.2} />
          </div>

          {change !== undefined && (
            <div
              className={[
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-danger/10 text-danger",
              ].join(" ")}
            >
              {isPositive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}

              {Math.abs(change)}%
            </div>
          )}
        </div>

        <p className="mb-1 text-sm font-medium text-text-muted">
          {title}
        </p>

        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-3xl font-extrabold tracking-tight text-text-main">
            {value}
          </h3>

          <span className="mb-1 text-right text-[11px] text-text-muted/80">
            {description}
          </span>
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-background">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "68%" }}
            transition={{
              duration: 0.8,
              delay: delay + 0.2,
            }}
            className={[
              "h-full rounded-full",
              accent === "orange" &&
                "bg-gradient-to-r from-primary-dark to-primary-light",
              accent === "blue" &&
                "bg-gradient-to-r from-blue-600 to-blue-400",
              accent === "green" &&
                "bg-gradient-to-r from-emerald-600 to-emerald-400",
              accent === "purple" &&
                "bg-gradient-to-r from-violet-600 to-violet-400",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </div>
      </div>
    </motion.article>
  );
}