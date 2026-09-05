import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { BazaarCard } from "@/components/product-card";
import { categories } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bazaar")({
  head: () => ({
    meta: [
      { title: "Shreni Bazaar — Handmade Indian Crafts Marketplace" },
      {
        name: "description",
        content:
          "Discover India's extraordinary handmade crafts — pottery, handloom, bamboo, brass, folk art and jewellery direct from artisans.",
      },
      { property: "og:title", content: "Shreni Bazaar — Discover India's handmade crafts" },
      {
        property: "og:description",
        content: "The buyer marketplace where artisan listings from ShreniKart come alive.",
      },
    ],
  }),
  component: Bazaar,
});

function Bazaar() {
  const { products } = useStore();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const live = products.filter((p) => p.status !== "draft");
  const list = live.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.title.toLowerCase().includes(query.toLowerCase()),
  );
  const featured = live[0];

  return (
    <AppShell>
      <ScreenHeader
        title="Shreni Bazaar"
        subtitle="Discover India's extraordinary handmade crafts."
        back="/dashboard"
      />

      <div className="px-5 pt-4">
        <label className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crafts, regions, artisans"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
          />
        </label>
      </div>

      <div className="-mx-0 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              category === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {featured && category === "All" && !query && (
        <section className="px-5 pt-5">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <img
              src={featured.images[0]}
              alt={featured.title}
              width={768}
              height={768}
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <span className="text-xs font-bold tracking-wide text-primary uppercase">
                Featured craft
              </span>
              <h2 className="mt-1 text-lg font-semibold">{featured.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{featured.story}</p>
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pt-6">
        <h2 className="text-base font-semibold">
          {category === "All" ? "Popular products" : category}
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {list.map((p) => (
            <BazaarCard key={p.id} product={p} />
          ))}
        </div>
        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No crafts match this search yet.
          </p>
        )}
      </section>

      <section className="px-5 py-6">
        <h2 className="text-base font-semibold">Artisan stories</h2>
        <div className="mt-3 space-y-3">
          {live.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {p.artisanName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{p.artisanName}</p>
                <p className="text-xs text-primary">{p.region}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.story}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
