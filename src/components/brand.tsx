import { cn } from "@/lib/utils";

export function ShreniMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="h-3/5 w-3/5" fill="none" stroke="currentColor">
        <path
          d="M6 21c3-1.5 5-4 5-7.5S9 7 6 6c4.5-.5 8 1.5 10 5 2-3.5 5.5-5.5 10-5-3 1-5 4-5 7.5s2 6 5 7.5c-4.5.5-8-1.5-10-5-2 3.5-5.5 5.5-10 5Z"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="25.5" r="2" strokeWidth="1.7" />
      </svg>
    </span>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <ShreniMark className={compact ? "h-9 w-9" : "h-12 w-12"} />
      <div className="leading-tight">
        <p
          className={cn(
            "font-display font-semibold text-foreground",
            compact ? "text-lg" : "text-2xl",
          )}
        >
          ShreniKart
        </p>
        {!compact && (
          <p className="text-xs text-muted-foreground">Empowering Artisans, Connecting Traditions.</p>
        )}
      </div>
    </div>
  );
}

export function DemoBadge({ label = "Demo mode", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold-foreground",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      {label}
    </span>
  );
}
