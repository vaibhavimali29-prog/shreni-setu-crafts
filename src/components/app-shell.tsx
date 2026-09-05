import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, MessageSquareText, Package, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BrandLockup } from "./brand";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";

const NAV = [
  { to: "/products", key: "products", icon: Package },
  { to: "/orders", key: "orders", icon: ShoppingBag },
  { to: "/inquiries", key: "inquiry", icon: MessageSquareText },
] as const;

export function BottomNav() {
  const { pathname } = useRouterState({ select: (s) => s.location });
  const { language } = useStore();
  return (
    <nav
      className="sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {NAV.map(({ to, key, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 px-2 pt-2.5 pb-3 text-[11px] font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-14 items-center justify-center rounded-full transition-all",
                  active && "bg-primary/12",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.9} />
              </span>
              {t(key, language ?? "en")}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({
  children,
  nav = true,
  className,
}: {
  children: ReactNode;
  nav?: boolean;
  className?: string;
}) {
  return (
    <div className="min-h-screen craft-texture bg-background">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background shadow-lift sm:border-x sm:border-border">
        <main className={cn("flex-1", className)}>{children}</main>
        {nav && <BottomNav />}
      </div>
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string | undefined;
  back?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-5 pt-5 pb-4 backdrop-blur">
      <div className="flex items-start gap-3">
        {back && (
          <Link
            to={back}
            aria-label="Go back"
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="motif-band mt-4 h-3 opacity-60" aria-hidden="true" />
    </header>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="craft-texture flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-8 sm:border-x sm:border-border">
        <BrandLockup />
        {children}
      </div>
    </div>
  );
}
