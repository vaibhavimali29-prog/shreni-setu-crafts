import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/meripehchaan")({
  head: () => ({
    meta: [
      { title: "MeriPehchaan Authentication — ShreniKart" },
      {
        name: "description",
        content:
          "Simulated MeriPehchaan single sign-on flow for artisan identity verification on ShreniKart.",
      },
      { property: "og:title", content: "MeriPehchaan Authentication — ShreniKart" },
      {
        property: "og:description",
        content: "Identity verification step before entering the ShreniKart artisan dashboard.",
      },
    ],
  }),
  component: MeriPehchaanScreen,
});

const STEPS = [
  "Redirecting to MeriPehchaan",
  "Authenticating with the identity provider",
  "Exchanging authorisation code for token",
  "Verifying token signature",
  "Creating your secure ShreniKart session",
];

function MeriPehchaanScreen() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!started) return;
    if (step >= STEPS.length) {
      const t = setTimeout(() => navigate({ to: "/verified" }), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [started, step, navigate]);

  return (
    <AuthShell>
      <div className="mt-10 flex-1">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-secondary-foreground shadow-soft">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold">MeriPehchaan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Single sign-on for citizen services. ShreniKart receives only your verified name and a
          session token — nothing else.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4 text-success" /> What ShreniKart never stores
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            {[
              "Aadhaar numbers or images",
              "Identity documents or biometrics",
              "OTPs beyond the moment of use",
              "Access tokens in browser storage",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Token exchange and session creation belong on the server, with HTTP-only cookies. This
            prototype simulates that flow in the browser.
          </p>
        </div>

        {started && (
          <ol className="mt-6 space-y-3">
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                      done
                        ? "border-success bg-success text-success-foreground"
                        : active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? (
                      <Check className="h-4 w-4" />
                    ) : active ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      done || active ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="mt-6 pb-2">
        {!started && (
          <button
            type="button"
            onClick={() => {
              setStarted(true);
              setStep(0);
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-secondary text-base font-semibold text-secondary-foreground shadow-soft transition-transform active:scale-[0.98]"
          >
            Authorise with MeriPehchaan
          </button>
        )}
        <div className="mt-3 flex justify-center">
          <DemoBadge label="Demo authentication — simulated, not government verification" />
        </div>
      </div>
    </AuthShell>
  );
}
