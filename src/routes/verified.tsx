import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthShell } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/verified")({
  head: () => ({
    meta: [
      { title: "Verification Successful — ShreniKart" },
      {
        name: "description",
        content: "Your artisan identity is verified and your Shreni Setu ecosystem is ready.",
      },
      { property: "og:title", content: "Verification Successful — ShreniKart" },
      {
        property: "og:description",
        content: "Enter the ShreniKart artisan dashboard after successful verification.",
      },
    ],
  }),
  component: VerifiedScreen,
});

function VerifiedScreen() {
  const { signIn, onboarded } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    let pending = "";
    try {
      pending = window.sessionStorage.getItem("shrenikart.pendingName") ?? "";
      window.sessionStorage.removeItem("shrenikart.pendingName");
    } catch {
      /* ignore */
    }
    signIn(pending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthShell>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full bg-success/12"
          style={{ animation: "float-soft 3.5s ease-in-out infinite" }}
        >
          <svg viewBox="0 0 52 52" className="h-16 w-16">
            <circle
              cx="26"
              cy="26"
              r="22"
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="3"
              strokeDasharray="140"
              strokeDashoffset="140"
              style={{ animation: "draw-check 0.7s ease-out forwards" }}
            />
            <path
              d="M16 27l7 7 14-14"
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset="40"
              style={{ animation: "draw-check 0.5s 0.6s ease-out forwards" }}
            />
          </svg>
        </div>

        <p className="mt-6 text-sm font-bold tracking-wide text-success uppercase">
          Verification Successful
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Welcome to ShreniKart</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Your Shreni Setu ecosystem is ready — voice, AI, marketplace and payments, all connected.
        </p>

        <div className="mt-8 grid w-full grid-cols-2 gap-3 text-left">
          {[
            ["Shreni Vani", "Voice in your language"],
            ["Shreni AI", "Listings & pricing"],
            ["Shreni Bazaar", "Buyers across India"],
            ["Shreni Pay", "Earnings & payouts"],
          ].map(([title, sub]) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-2">
        <button
          type="button"
          onClick={() => navigate({ to: onboarded ? "/dashboard" : "/onboarding" })}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
        >
          Enter ShreniKart
        </button>
        <div className="mt-3 flex justify-center">
          <DemoBadge label="Demo session · no real identity data stored" />
        </div>
      </div>
    </AuthShell>
  );
}
