import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, Clock, IndianRupee, TrendingUp } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { earningsByMonth, formatINR, transactions } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pay")({
  head: () => ({
    meta: [
      { title: "Shreni Pay — Earnings & Payments" },
      {
        name: "description",
        content:
          "Track total earnings, monthly income, pending payouts and every craft transaction in one place.",
      },
      { property: "og:title", content: "Shreni Pay — Earnings & Payments" },
      {
        property: "og:description",
        content: "Simple earnings and payout tracking for Indian artisans.",
      },
    ],
  }),
  component: Pay,
});

function Pay() {
  const total = 118244;
  const thisMonth = 16044;
  const pending = transactions
    .filter((t) => t.status !== "Settled")
    .reduce((s, t) => s + t.amount, 0);
  const completed = total - pending;
  const max = Math.max(...earningsByMonth.map((m) => m.amount));

  const cards = [
    { label: "Total Earnings", value: formatINR(total), icon: IndianRupee, tone: "bg-primary/8" },
    { label: "This Month", value: formatINR(thisMonth), icon: TrendingUp, tone: "bg-success/10" },
    { label: "Pending Payments", value: formatINR(pending), icon: Clock, tone: "bg-gold/15" },
    {
      label: "Completed Payments",
      value: formatINR(completed),
      icon: ArrowDownToLine,
      tone: "bg-secondary/8",
    },
  ];

  return (
    <AppShell>
      <ScreenHeader
        title="Shreni Pay"
        subtitle="Payments and earnings for your craft."
        back="/dashboard"
        action={<DemoBadge label="Simulated payments" />}
      />

      <section className="grid grid-cols-2 gap-3 p-5">
        {cards.map((c) => (
          <div key={c.label} className={cn("rounded-2xl border border-border p-4 shadow-soft", c.tone)}>
            <c.icon className="h-5 w-5 text-primary" />
            <p className="mt-2 text-lg font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </section>

      <section className="px-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <h2 className="text-sm font-semibold">Earnings, last 6 months</h2>
          <div className="mt-4 flex h-36 items-end gap-3">
            {earningsByMonth.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {(m.amount / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full rounded-t-lg bg-primary/85 transition-all duration-500"
                  style={{ height: `${(m.amount / max) * 100}%` }}
                />
                <span className="text-[11px] font-semibold text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="p-5">
        <div className="flex items-end justify-between">
          <h2 className="text-base font-semibold">Transactions</h2>
          <button type="button" className="text-sm font-semibold text-primary">
            Earnings details
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IndianRupee className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.productTitle}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.buyerName} · {t.created_at} · #{t.order_id}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{formatINR(t.amount)}</p>
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    t.status === "Settled"
                      ? "text-success"
                      : t.status === "Processing"
                        ? "text-gold-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 h-13 w-full rounded-2xl border border-primary py-3.5 text-sm font-semibold text-primary"
        >
          View all transactions
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Payments are simulated for this prototype. No real payment gateway is connected.
        </p>
      </section>
    </AppShell>
  );
}
