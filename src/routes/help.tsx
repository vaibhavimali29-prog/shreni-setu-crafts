import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, MessageCircle, PhoneCall } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — ShreniKart" },
      {
        name: "description",
        content: "Get help with ShreniKart by phone, chat or voice guide in your own language.",
      },
      { property: "og:title", content: "Help & Support — ShreniKart" },
      {
        property: "og:description",
        content: "Artisan support in 11 Indian languages, by call or chat.",
      },
    ],
  }),
  component: Help,
});

const OPTIONS = [
  {
    icon: PhoneCall,
    title: "Call an artisan helper",
    body: "Toll free 1800-000-000, 9 AM to 8 PM, in your language.",
  },
  {
    icon: MessageCircle,
    title: "Chat with Shreni AI",
    body: "Ask any question about listing, pricing or payments.",
  },
  {
    icon: BookOpen,
    title: "Voice guide",
    body: "Listen to a short guide on how to add your first product.",
  },
];

function Help() {
  return (
    <AppShell nav={false}>
      <ScreenHeader title="Help & Support" subtitle="We are here in your language." back="/auth" />
      <div className="space-y-3 p-5">
        {OPTIONS.map((o) => (
          <div key={o.title} className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <o.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{o.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{o.body}</p>
            </div>
          </div>
        ))}
        <p className="pt-2 text-center text-xs text-muted-foreground">
          Support details are sample content for this prototype.
        </p>
      </div>
    </AppShell>
  );
}
