import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, ChevronRight, IndianRupee, LogOut, Package, Settings } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { formatINR } from "@/lib/data";
import { languageLabel } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Artisan Profile — ShreniKart" },
      {
        name: "description",
        content: "Your artisan profile, craft category, region, verification status and earnings.",
      },
      { property: "og:title", content: "Artisan Profile — ShreniKart" },
      {
        property: "og:description",
        content: "Manage your artisan identity, listings and account settings.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { artisan, products, language, signOut } = useStore();
  const navigate = useNavigate();

  return (
    <AppShell>
      <ScreenHeader title="Profile" back="/dashboard" />

      <section className="px-5 pt-5">
        <div className="rounded-3xl border border-border bg-card p-5 text-center shadow-soft">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
            {artisan.avatar}
          </span>
          <h2 className="mt-3 text-xl font-semibold">{artisan.name}</h2>
          <p className="text-sm text-muted-foreground">
            {artisan.craftCategory} · {artisan.region}
          </p>
          {artisan.verified && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1.5 text-xs font-semibold text-success">
              <BadgeCheck className="h-4 w-4" /> Verified via MeriPehchaan (demo)
            </span>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-muted p-3">
              <Package className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 font-bold">{products.length}</p>
              <p className="text-[11px] text-muted-foreground">Products</p>
            </div>
            <div className="rounded-2xl bg-muted p-3">
              <IndianRupee className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 font-bold">{formatINR(118244)}</p>
              <p className="text-[11px] text-muted-foreground">Earnings</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 p-5">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
        >
          <Settings className="h-5 w-5 text-primary" />
          <span className="flex-1">
            <span className="block font-semibold">Settings</span>
            <span className="block text-xs text-muted-foreground">
              Language ({languageLabel(language ?? "en")}), notifications, voice, AI, privacy
            </span>
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <Link
          to="/help"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
        >
          <span className="flex-1 font-semibold">Help & Support</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <button
          type="button"
          onClick={() => {
            signOut();
            navigate({ to: "/auth" });
          }}
          className="flex w-full items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left font-semibold text-destructive"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </section>
    </AppShell>
  );
}
