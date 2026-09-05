import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { CHAT_PROMPTS, chatAnswer } from "@/lib/ai";
import { languageLabel } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "Shreni AI — Your Business Assistant" },
      {
        name: "description",
        content:
          "Ask Shreni AI for product descriptions, fair prices, translations and buyer replies.",
      },
      { property: "og:title", content: "Shreni AI — Your intelligent business assistant" },
      {
        property: "og:description",
        content: "AI help with cataloguing, pricing, translation and customer replies for artisans.",
      },
    ],
  }),
  component: AIChat,
});

interface Msg {
  from: "ai" | "user";
  text: string;
}

function AIChat() {
  const { language } = useStore();
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "ai",
      text: `Namaste! I am Shreni AI. I am answering in ${languageLabel(language ?? "en")}. Ask me anything about your craft business.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const ask = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "ai", text: chatAnswer(text) }]);
      setThinking(false);
    }, 1000);
  };

  return (
    <AppShell>
      <ScreenHeader
        title="Shreni AI"
        subtitle="Your intelligent business assistant."
        back="/dashboard"
        action={<DemoBadge label="Demo AI" />}
      />

      <div className="space-y-3 p-5">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line shadow-soft",
                m.from === "user"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md border border-border bg-card",
              )}
            >
              {m.from === "ai" && (
                <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Shreni AI
                </span>
              )}
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3.5 shadow-soft">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  style={{ animation: `wave-bar 1s ${i * 0.15}s ease-in-out infinite` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-1">
          {CHAT_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => ask(p)}
              className="shrink-0 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 p-4 pt-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            placeholder="Ask Shreni AI…"
            className="h-12 flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            aria-label="Send message"
            onClick={() => ask(input)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
