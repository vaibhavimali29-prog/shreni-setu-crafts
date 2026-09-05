import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Sparkles, Store } from "lucide-react";
import { AuthShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Getting Started — ShreniKart" },
      {
        name: "description",
        content:
          "A short introduction to selling your craft with voice and AI on the ShreniKart artisan app.",
      },
      { property: "og:title", content: "Getting Started — ShreniKart" },
      {
        property: "og:description",
        content: "Learn how Shreni Vani and Shreni AI help you list and sell your craft.",
      },
    ],
  }),
  component: Onboarding,
});

const SLIDES = [
  {
    icon: Store,
    title: "Your Craft Deserves a Bigger Market",
    body: "Showcase your traditional skills to customers beyond your local market.",
  },
  {
    icon: Mic,
    title: "Speak in Your Language",
    body: "Use Shreni Vani to create listings and navigate the app naturally.",
  },
  {
    icon: Sparkles,
    title: "AI That Helps You Sell",
    body: "Shreni AI helps with cataloging, descriptions, pricing and customers.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const { completeOnboarding } = useStore();
  const navigate = useNavigate();
  const slide = SLIDES[i]!;
  const Icon = slide.icon;
  const last = i === SLIDES.length - 1;

  const finish = () => {
    completeOnboarding();
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-primary/10 text-primary">
          <Icon className="h-12 w-12" strokeWidth={1.6} />
        </div>
        <h1 className="mt-8 max-w-xs text-3xl leading-tight font-semibold">{slide.title}</h1>
        <p className="mt-3 max-w-xs text-base text-muted-foreground">{slide.body}</p>

        <div className="mt-8 flex gap-2">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-2 rounded-full transition-all",
                idx === i ? "w-8 bg-primary" : "w-2 bg-border",
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 pb-2">
        <button
          type="button"
          onClick={() => (last ? finish() : setI(i + 1))}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
        >
          {last ? "Start Selling" : "Next"}
        </button>
        {!last && (
          <button
            type="button"
            onClick={finish}
            className="h-11 w-full text-sm font-semibold text-muted-foreground"
          >
            Skip
          </button>
        )}
      </div>
    </AuthShell>
  );
}
