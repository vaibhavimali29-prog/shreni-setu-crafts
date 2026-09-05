import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Coins,
  IndianRupee,
  MessageSquareText,
  Mic,
  Network,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ShreniMark } from "@/components/brand";
import { PopularCard } from "@/components/product-card";
import { formatINR } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Artisan Dashboard — ShreniKart" },
      {
        name: "description",
        content:
          "Manage products, orders, inquiries and earnings, and open Shreni Vani, Shreni AI, Shreni Bazaar and Shreni Pay.",
      },
      { property: "og:title", content: "Artisan Dashboard — ShreniKart" },
      {
        property: "og:description",
        content: "Your craft business in one place: listings, orders, buyers and earnings.",
      },
    ],
  }),
  component: Dashboard,
});

const QUICK = [
  {
    to: "/vani" as const,
    emoji: "🎙️",
    icon: Mic,
    title: "Shreni Vani",
    lead: "Speak & Create",
    body: "Describe your craft using your voice.",
    tone: "bg-primary/8 border-primary/20",
  },
  {
    to: "/ai" as const,
    emoji: "✨",
    icon: Sparkles,
    title: "Shreni AI",
    lead: "AI Assistant",
    body: "Get help with products, pricing and customers.",
    tone: "bg-gold/12 border-gold/35",
  },
  {
    to: "/bazaar" as const,
    emoji: "🛍️",
    icon: Store,
    title: "Shreni Bazaar",
    lead: "View Marketplace",
    body: "See how your products appear to buyers.",
    tone: "bg-secondary/8 border-secondary/20",
  },
  {
    to: "/pay" as const,
    emoji: "💰",
    icon: Coins,
    title: "Shreni Pay",
    lead: "Your Earnings",
    body: "Track sales, payments and earnings.",
    tone: "bg-success/10 border-success/25",
  },
];

function Dashboard() {
  const { artisan, products, orders, inquiries, language } = useStore();
  const mine = products.filter((p) => p.artisan_id === artisan.id || p.id.startsWith("new-"));
  const pending = inquiries.filter((q) => q.status === "open").length;
  const earnings = 118244;

  const stats = [
    { label: "Products Listed", value: String(products.length), icon: Package },
    { label: "Orders", value: String(orders.length), icon: ShoppingBag },
    { label: "Pending Inquiries", value: String(pending), icon: MessageSquareText },
    { label: "Total Earnings", value: formatINR(earnings), icon: IndianRupee },
  ];

  return (
    <AppShell>
      <div className="motif-band h-3 opacity-70" aria-hidden="true" />

      <header className="flex items-start justify-between gap-3 px-5 pt-5">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("greeting", language ?? "en", { name: artisan.name.split(" ")[0] ?? "Artisan" })} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("greetingSub", language ?? "en")}
          </p>
        </div>
        <Link
          to="/profile"
          aria-label="Profile and settings"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-base font-bold text-secondary-foreground shadow-soft"
        >
          {artisan.avatar}
        </Link>
      </header>

      <section className="px-5 pt-5">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-primary/8 p-5 shadow-soft">
          <div className="motif-band absolute inset-x-0 top-0 h-3 opacity-50" aria-hidden="true" />
          <div className="flex items-start gap-3 pt-2">
            <ShreniMark className="h-11 w-11" />
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Turn your craft into a professional online listing with AI.
              </p>
            </div>
          </div>
          <Link
            to="/add-product"
            className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" /> {t("addProduct", language ?? "en")}
          </Link>
        </div>
      </section>

      <section className="px-5 pt-6">
        <h2 className="text-base font-semibold">Quick actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {QUICK.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className={`group rounded-2xl border p-4 shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-lift active:scale-[0.98] ${q.tone}`}
            >
              <span className="text-2xl">{q.emoji}</span>
              <p className="mt-2 text-sm font-bold">{q.lead}</p>
              <p className="text-xs font-semibold text-primary">{q.title}</p>
              <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{q.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-6">
        <h2 className="text-base font-semibold">At a glance</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
            >
              <s.icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-6">
        <div className="flex items-end justify-between px-5">
          <h2 className="text-base font-semibold">Popular Picks</h2>
          <Link to="/bazaar" className="text-sm font-semibold text-primary">
            See all
          </Link>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
          {products
            .filter((p) => p.status !== "draft")
            .map((p) => (
              <PopularCard key={p.id} product={p} />
            ))}
        </div>
      </section>

      <section className="px-5 pt-4 pb-8">
        <Link
          to="/setu"
          className="flex items-center gap-3 rounded-2xl border border-secondary/25 bg-secondary/8 p-4 shadow-soft transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <Network className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">Shreni Setu</span>
            <span className="block text-xs text-muted-foreground">
              One ecosystem connecting your craft to the world.
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-secondary" />
        </Link>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Showing {mine.length} of your listings · demo data for prototype
        </p>
      </section>
    </AppShell>
  );
}
