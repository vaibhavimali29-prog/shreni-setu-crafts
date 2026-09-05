import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Package, Plus, Search, ShoppingBag } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { StatusChip } from "@/components/product-card";
import { formatINR } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "My Products — ShreniKart" },
      {
        name: "description",
        content: "Search, filter and manage every craft you have listed on Shreni Bazaar.",
      },
      { property: "og:title", content: "My Products — ShreniKart" },
      {
        property: "og:description",
        content: "Track views, orders and status for each handmade product you sell.",
      },
    ],
  }),
  component: Products,
});

const FILTERS = ["All", "Published", "Draft", "Sold", "Low Stock"] as const;

function Products() {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const list = products.filter((p) => {
    const matchQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    const key = filter.toLowerCase().replace(" ", "-");
    return matchQuery && (filter === "All" || p.status === key);
  });

  return (
    <AppShell>
      <ScreenHeader
        title="My Products"
        subtitle={`${products.length} crafts in your catalogue`}
        action={
          <Link
            to="/add-product"
            className="flex h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            <Plus className="h-4 w-4" /> Add
          </Link>
        }
      />

      <div className="space-y-3 px-5 pt-4">
        <label className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your products"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
          />
        </label>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 p-5">
        {list.length === 0 ? (
          <EmptyProducts />
        ) : (
          list.map((p) => (
            <article
              key={p.id}
              className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <img
                src={p.images[0]}
                alt={p.title}
                loading="lazy"
                width={768}
                height={768}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="line-clamp-2 text-sm leading-snug font-semibold">{p.title}</h2>
                  <StatusChip status={p.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.category}</p>
                <p className="mt-1 text-base font-bold text-primary">{formatINR(p.price)}</p>
                <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {p.views.toLocaleString("en-IN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="h-3.5 w-3.5" /> {p.orders} orders
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </AppShell>
  );
}

function EmptyProducts() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Package className="h-8 w-8" strokeWidth={1.6} />
      </span>
      <h2 className="mt-4 text-lg font-semibold">No Products Yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your first masterpiece is waiting to be listed.
      </p>
      <Link
        to="/add-product"
        className="mt-5 flex h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft"
      >
        <Plus className="h-4 w-4" /> Add Your First Product
      </Link>
    </div>
  );
}
