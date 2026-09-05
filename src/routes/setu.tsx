import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, Coins, Mic, Network, Sparkles, Store, User, Users } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";

export const Route = createFileRoute("/setu")({
  head: () => ({
    meta: [
      { title: "Shreni Setu — The Connected Artisan Ecosystem" },
      {
        name: "description",
        content:
          "See how voice, AI, the artisan app, the marketplace and payments connect one craft to a buyer and back to the artisan's earnings.",
      },
      { property: "og:title", content: "Shreni Setu — One connected ecosystem" },
      {
        property: "og:description",
        content: "The full journey from an artisan's voice to their earnings, in one view.",
      },
    ],
  }),
  component: Setu,
});

const JOURNEY = [
  { icon: User, title: "Artisan", body: "Speaks about the craft in their own language.", to: null },
  { icon: Mic, title: "Shreni Vani", body: "Understands the voice and the language.", to: "/vani" },
  {
    icon: Sparkles,
    title: "Shreni AI",
    body: "Writes the listing, sets a fair price, enhances photos.",
    to: "/ai",
  },
  {
    icon: Network,
    title: "ShreniKart",
    body: "Publishes and manages products, orders and inquiries.",
    to: "/dashboard",
  },
  {
    icon: Store,
    title: "Shreni Bazaar",
    body: "Buyers across India discover the craft.",
    to: "/bazaar",
  },
  { icon: Users, title: "Buyer", body: "Places an order and pays securely.", to: null },
  {
    icon: Coins,
    title: "Shreni Pay",
    body: "Settles the payment into artisan earnings.",
    to: "/pay",
  },
] as const;

function Setu() {
  return (
    <AppShell>
      <ScreenHeader
        title="Shreni Setu"
        subtitle="One ecosystem connecting your craft to the world."
        back="/dashboard"
      />

      <section className="px-5 pt-5">
        <div className="rounded-3xl border border-secondary/25 bg-secondary/8 p-5 text-center shadow-soft">
          <p className="text-xs font-bold tracking-wide text-secondary uppercase">Unified layer</p>
          <h2 className="mt-1 text-xl font-semibold">Shreni Setu</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The bridge between artisans, AI, buyers and payments.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["ShreniKart", "Main App"],
              ["Shreni Vani", "Voice"],
              ["Shreni AI", "Intelligence"],
            ].map(([title, sub]) => (
              <div key={title} className="rounded-xl border border-border bg-card p-2.5">
                <p className="text-[11px] font-bold">{title}</p>
                <p className="text-[10px] text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["Shreni Bazaar", "Marketplace"],
              ["Shreni Pay", "Payments"],
            ].map(([title, sub]) => (
              <div key={title} className="rounded-xl border border-border bg-card p-2.5">
                <p className="text-[11px] font-bold">{title}</p>
                <p className="text-[10px] text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-6">
        <h2 className="text-base font-semibold">The complete journey</h2>
        <div className="mt-4 space-y-1">
          {JOURNEY.map((step, i) => (
            <div key={step.title}>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.body}</p>
                </div>
                {step.to && (
                  <Link to={step.to} className="text-xs font-semibold text-primary">
                    Open
                  </Link>
                )}
              </div>
              {i < JOURNEY.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <ArrowDown className="h-4 w-4 text-primary/60" />
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-center py-1" aria-hidden="true">
            <ArrowDown className="h-4 w-4 text-primary/60" />
          </div>
          <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-center">
            <p className="font-semibold">Artisan Earnings</p>
            <p className="text-xs text-muted-foreground">
              Money reaches the maker — the loop closes and begins again.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
