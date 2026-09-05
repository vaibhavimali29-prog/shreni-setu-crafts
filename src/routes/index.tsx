import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Globe } from "lucide-react";
import { AuthShell } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { LANGUAGES } from "@/lib/i18n";
import type { LanguageCode } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShreniKart — AI Marketplace for Indian Artisans" },
      {
        name: "description",
        content:
          "ShreniKart helps marginalised Indian artisans list, price and sell handmade crafts using voice and AI in 11 Indian languages.",
      },
      { property: "og:title", content: "ShreniKart — Empowering Artisans, Connecting Traditions" },
      {
        property: "og:description",
        content:
          "Voice-first, AI-powered cataloguing and market linkage for Indian handicraft artisans.",
      },
    ],
  }),
  component: LanguageScreen,
});

function LanguageScreen() {
  const { language, setLanguage, authenticated, onboarded, ready } = useStore();
  const [selected, setSelected] = useState<LanguageCode>(language ?? "en");
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && authenticated && onboarded) navigate({ to: "/dashboard" });
  }, [ready, authenticated, onboarded, navigate]);

  return (
    <AuthShell>
      <div className="mt-10 flex-1">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
          <Globe className="h-3.5 w-3.5" /> Step 1 of 3
        </span>
        <h1 className="mt-4 text-3xl leading-tight font-semibold">
          Choose your
          <br />
          language
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          अपनी भाषा चुनें · तुमची भाषा निवडा · உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => {
            const active = selected === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelected(lang.code)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98]",
                  active
                    ? "border-primary bg-primary/8 shadow-soft"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                  )}
                >
                  {active ? <Check className="h-5 w-5" /> : lang.script}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold">{lang.native}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {lang.english}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 -mx-6 mt-6 border-t border-border bg-background/95 px-6 pt-4 pb-2 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            setLanguage(selected);
            navigate({ to: "/auth" });
          }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
        >
          Continue <ArrowRight className="h-5 w-5" />
        </button>
        <div className="mt-3 flex justify-center">
          <DemoBadge label="SIH prototype · demo data" />
        </div>
      </div>
    </AuthShell>
  );
}
