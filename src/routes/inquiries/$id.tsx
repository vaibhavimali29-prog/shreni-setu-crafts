import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mic, RefreshCw, Send, Sparkles } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { generateReply } from "@/lib/ai";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inquiries/$id")({
  head: () => ({
    meta: [
      { title: "Buyer Conversation — ShreniKart" },
      {
        name: "description",
        content: "Answer a buyer question by text, voice or with a Shreni AI suggested reply.",
      },
      { property: "og:title", content: "Buyer Conversation — ShreniKart" },
      {
        property: "og:description",
        content: "Polite, ready-to-send AI replies for artisan customer conversations.",
      },
    ],
  }),
  component: Conversation,
});

function Conversation() {
  const { id } = useParams({ from: "/inquiries/$id" });
  const { inquiries, products, replyToInquiry } = useStore();
  const inquiry = inquiries.find((q) => q.id === id);
  const product = products.find((p) => p.id === inquiry?.product_id);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  if (!inquiry) {
    return (
      <AppShell>
        <ScreenHeader title="Conversation" back="/inquiries" />
        <p className="p-5 text-sm text-muted-foreground">This conversation is no longer available.</p>
      </AppShell>
    );
  }

  const lastBuyerMessage =
    [...inquiry.messages].reverse().find((m) => m.from === "buyer")?.text ?? "";

  const runAI = () => {
    setThinking(true);
    setSuggestion("");
    setTimeout(() => {
      setSuggestion(generateReply(lastBuyerMessage));
      setThinking(false);
    }, 1100);
  };

  return (
    <AppShell>
      <ScreenHeader title={inquiry.buyerName} subtitle={product?.title} back="/inquiries" />

      <div className="space-y-3 p-5 pb-2">
        {inquiry.messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.from === "artisan" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                m.from === "artisan"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md border border-border bg-card",
              )}
            >
              {m.text}
              <span
                className={cn(
                  "mt-1 block text-[10px]",
                  m.from === "artisan" ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5">
        <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-bold">
              <Sparkles className="h-4 w-4 text-primary" /> Use Shreni AI to Reply
            </p>
            <DemoBadge label="Demo AI" />
          </div>

          {!suggestion && !thinking && (
            <button
              type="button"
              onClick={runAI}
              className="mt-3 h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
            >
              Suggest a polite reply
            </button>
          )}

          {thinking && (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Shreni AI is preparing your reply…
            </p>
          )}

          {suggestion && (
            <>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                rows={4}
                className="mt-3 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    replyToInquiry(inquiry.id, suggestion);
                    setSuggestion("");
                  }}
                  className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                >
                  <Send className="h-4 w-4" /> Send
                </button>
                <button
                  type="button"
                  onClick={runAI}
                  className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold"
                >
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 mt-4 flex items-center gap-2 border-t border-border bg-background/95 p-4 backdrop-blur">
        <button
          type="button"
          aria-label="Reply with voice"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
        >
          <Mic className="h-5 w-5" />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a reply…"
          className="h-12 flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          aria-label="Send reply"
          onClick={() => {
            if (!draft.trim()) return;
            replyToInquiry(inquiry.id, draft.trim());
            setDraft("");
          }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </AppShell>
  );
}
