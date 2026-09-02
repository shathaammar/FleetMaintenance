import {
  motion,
} from "framer-motion";
import type {
  LucideIcon,
} from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

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
    icon:
      "bg-primary/12 text-primary",
    glow:
      "bg-primary/10",
    border:
      "group-hover:border-primary/30",
    progress:
      "bg-gradient-to-r from-primary-dark to-primary-light",
  },

  blue: {
    icon:
      "bg-blue-500/12 text-blue-400",
    glow:
      "bg-blue-500/10",
    border:
      "group-hover:border-blue-500/30",
    progress:
      "bg-gradient-to-r from-blue-600 to-blue-400",
  },

  green: {
    icon:
      "bg-emerald-500/12 text-emerald-400",
    glow:
      "bg-emerald-500/10",
    border:
      "group-hover:border-emerald-500/30",
    progress:
      "bg-gradient-to-r from-emerald-600 to-emerald-400",
  },

  purple: {
    icon:
      "bg-violet-500/12 text-violet-400",
    glow:
      "bg-violet-500/10",
    border:
      "group-hover:border-violet-500/30",
    progress:
      "bg-gradient-to-r from-violet-600 to-violet-400",
  },
} satisfies Record<
  StatCardProps["accent"],
  {
    icon: string;
    glow: string;
    border: string;
    progress: string;
  }
>;

export function StatCard({
  title,
  value,
  description,
  change,
  icon: Icon,
  accent,
  delay = 0,
}: StatCardProps) {
  const styles =
    accentStyles[accent];

  const hasChange =
    change !== undefined;

  const isPositive =
    hasChange && change >= 0;

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
        "group relative min-w-0 overflow-hidden rounded-2xl border border-border-dark bg-surface/75 p-4 backdrop-blur-xl transition-colors sm:p-5",
        styles.border,
      ].join(" ")}
    >
      {/* Decorative glow */}
      <div
        className={[
          "pointer-events-none absolute -right-12 -top-12 size-32 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125",
          styles.glow,
        ].join(" ")}
      />

      <div className="relative flex h-full min-w-0 flex-col">
        {/* Icon and percentage */}
        <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
          <div
            className={[
              "grid size-11 shrink-0 place-items-center rounded-xl sm:size-12 sm:rounded-2xl",
              styles.icon,
            ].join(" ")}
          >
            <Icon
              size={22}
              strokeWidth={2.2}
            />
          </div>

          {hasChange && (
            <div
              className={[
                "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-danger/10 text-danger",
              ].join(" ")}
            >
              {isPositive ? (
                <ArrowUpRight
                  size={14}
                />
              ) : (
                <ArrowDownRight
                  size={14}
                />
              )}

              {Math.abs(change)}%
            </div>
          )}
        </div>

        {/* Card information */}
        <p className="mb-1 text-sm font-medium text-text-muted">
          {title}
        </p>

        <div className="flex min-w-0 flex-col gap-1 xl:gap-2 2xl:flex-row 2xl:items-end 2xl:justify-between">
          <h3 className="min-w-0 break-words font-display text-3xl font-extrabold tracking-tight text-text-main">
            {value}
          </h3>

          <p className="break-words text-[11px] leading-4 text-text-muted/80 2xl:max-w-[55%] 2xl:text-right">
            {description}
          </p>
        </div>

        {/* Decorative progress line */}
        <div className="mt-auto pt-5">
          <div className="h-1 overflow-hidden rounded-full bg-background">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: "68%",
              }}
              transition={{
                duration: 0.8,
                delay: delay + 0.2,
              }}
              className={[
                "h-full rounded-full",
                styles.progress,
              ].join(" ")}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}