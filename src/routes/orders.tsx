import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { formatINR } from "@/lib/data";
import type { OrderStatus } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — ShreniKart" },
      {
        name: "description",
        content: "Follow every craft order from new to delivered, with buyer and payment details.",
      },
      { property: "og:title", content: "Your Orders — ShreniKart" },
      {
        property: "og:description",
        content: "Order tracking for artisans selling on Shreni Bazaar.",
      },
    ],
  }),
  component: Orders,
});

const FLOW: OrderStatus[] = ["New", "Confirmed", "Preparing", "Shipped", "Delivered"];

function Orders() {
  const { orders, products, advanceOrder } = useStore();

  return (
    <AppShell>
      <ScreenHeader title="Your Orders" subtitle={`${orders.length} orders this month`} />
      <div className="space-y-3 p-5">
        {orders.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
            <ShoppingBag className="h-10 w-10 text-primary" strokeWidth={1.6} />
            <p className="mt-3 text-sm text-muted-foreground">
              Your orders will appear here once customers start buying.
            </p>
          </div>
        )}
        {orders.map((o) => {
          const product = products.find((p) => p.id === o.product_id);
          const stage = FLOW.indexOf(o.status);
          return (
            <article key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex gap-3">
                {product && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-muted-foreground">#{o.id}</p>
                  <h2 className="line-clamp-1 text-sm font-semibold">{product?.title}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {o.buyerName} · {o.buyerCity} · {o.created_at}
                  </p>
                  <p className="mt-1 text-base font-bold text-primary">{formatINR(o.amount)}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                {FLOW.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center last:flex-none">
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                        i <= stage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {i <= stage ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    {i < FLOW.length - 1 && (
                      <span
                        className={cn("h-0.5 flex-1", i < stage ? "bg-primary" : "bg-border")}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {o.status} · Payment {o.payment_status}
                </span>
                {o.status !== "Delivered" && (
                  <button
                    type="button"
                    onClick={() => advanceOrder(o.id)}
                    className="rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    Move to {FLOW[Math.min(stage + 1, 4)]}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
