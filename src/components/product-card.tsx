import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatINR } from "@/lib/data";
import { cn } from "@/lib/utils";

export function PopularCard({ product }: { product: Product }) {
  return (
    <Link
      to="/bazaar"
      className="group block w-44 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 text-sm leading-snug font-semibold text-foreground">
          {product.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{product.artisanName}</p>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-sm font-bold text-primary">{formatINR(product.price)}</span>
          <span className="flex items-center gap-0.5 text-xs font-semibold text-gold-foreground">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {product.rating || "New"}
          </span>
        </div>
      </div>
    </Link>
  );
}

const STATUS_STYLE: Record<string, string> = {
  published: "bg-success/12 text-success",
  draft: "bg-muted text-muted-foreground",
  sold: "bg-secondary/12 text-secondary",
  "low-stock": "bg-gold/25 text-gold-foreground",
};

export function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
        STATUS_STYLE[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status.replace("-", " ")}
    </span>
  );
}

export function BazaarCard({ product }: { product: Product }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 text-sm leading-snug font-semibold">{product.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {product.artisanName} · {product.region.split(",")[0]}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-primary">{formatINR(product.price)}</span>
          <span className="flex items-center gap-0.5 text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {product.rating || "New"}
          </span>
        </div>
      </div>
    </div>
  );
}
