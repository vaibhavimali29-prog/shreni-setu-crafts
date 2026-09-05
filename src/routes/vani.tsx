import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Languages, Mic, Sparkles } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { detectSample } from "@/lib/ai";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vani")({
  head: () => ({
    meta: [
      { title: "Shreni Vani — Voice Assistant for Artisans" },
      {
        name: "description",
        content:
          "Speak in your own Indian language to create listings, check orders and navigate ShreniKart.",
      },
      { property: "og:title", content: "Shreni Vani — Your voice, your language" },
      {
        property: "og:description",
        content: "Voice-first assistant that understands 11 Indian languages for artisans.",
      },
    ],
  }),
  component: Vani,
});

const COMMANDS = [
  "Add a new product",
  "Search my products",
  "Check my orders",
  "Check my earnings",
  "Open Shreni AI",
  "Reply to customers",
  "View marketplace",
  "Translate my product",
];

type Phase = "idle" | "listening" | "understanding" | "done";

function Vani() {
  const { language } = useStore();
  const sample = detectSample(language);
  const [phase, setPhase] = useState<Phase>("idle");
  const [command, setCommand] = useState("Create a product listing for my handmade basket.");
  const navigate = useNavigate();

  useEffect(() => {
    if (phase === "listening") {
      const t = setTimeout(() => setPhase("understanding"), 2200);
      return () => clearTimeout(t);
    }
    if (phase === "understanding") {
      const t = setTimeout(() => setPhase("done"), 1400);
      return () => clearTimeout(t);
    }
    return;
  }, [phase]);

  return (
    <AppShell>
      <ScreenHeader
        title="Shreni Vani"
        subtitle="Your voice. Your language. Your marketplace."
        back="/dashboard"
        action={<DemoBadge label="Demo voice" />}
      />

      <div className="flex flex-col items-center px-5 pt-8">
        <button
          type="button"
          onClick={() => setPhase(phase === "idle" || phase === "done" ? "listening" : "idle")}
          aria-label="Start speaking"
          className={cn(
            "relative flex h-36 w-36 items-center justify-center rounded-full text-primary-foreground shadow-lift transition-transform active:scale-95",
            phase === "listening" ? "bg-secondary" : "bg-primary",
          )}
        >
          {phase === "listening" && (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-secondary/30" />
              <span className="absolute -inset-4 animate-pulse rounded-full bg-secondary/15" />
            </>
          )}
          <Mic className="h-14 w-14" strokeWidth={1.6} />
        </button>

        <div className="mt-6 flex h-10 items-end gap-1.5" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-1.5 rounded-full",
                phase === "listening" ? "bg-primary" : "bg-border",
              )}
              style={{
                height: `${18 + ((i * 7) % 22)}px`,
                animation:
                  phase === "listening"
                    ? `wave-bar 0.9s ${i * 0.06}s ease-in-out infinite`
                    : undefined,
              }}
            />
          ))}
        </div>

        <p className="mt-4 text-base font-semibold">
          {phase === "idle" && "Tap the microphone and speak"}
          {phase === "listening" && "Shreni Vani is listening…"}
          {phase === "understanding" && "Understanding your words…"}
          {phase === "done" && "I understood:"}
        </p>
      </div>

      {phase === "done" && (
        <div className="space-y-3 px-5 pt-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Languages className="h-3.5 w-3.5" /> Detected Language
            </p>
            <p className="text-sm font-bold text-primary">{sample.language}</p>
            <p className="mt-3 text-xs font-semibold text-muted-foreground">You said</p>
            <p className="text-base leading-relaxed">{sample.transcript}</p>
          </div>

          <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <Sparkles className="h-4 w-4 text-primary" /> AI Understanding
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              You want to create a new product listing. Shall I open Add Product and fill it with
              what you said?
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => navigate({ to: "/add-product" })}
                className="h-12 flex-1 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft"
              >
                Yes, create listing
              </button>
              <button
                type="button"
                onClick={() => setPhase("idle")}
                className="h-12 rounded-2xl border border-border bg-card px-4 text-sm font-semibold"
              >
                Speak again
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="px-5 py-6">
        <h2 className="text-sm font-semibold">Try saying</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {COMMANDS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCommand(c);
                setPhase("listening");
              }}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm transition-colors",
                command === c
                  ? "border-primary bg-primary/10 font-semibold text-primary"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              “{c}”
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Speech recognition is simulated in this prototype; the interface is built so a real speech
          service can be connected later.
        </p>
      </section>
    </AppShell>
  );
}
