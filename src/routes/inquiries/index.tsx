import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquareText } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/inquiries/")({
  head: () => ({
    meta: [
      { title: "Inquiries — ShreniKart" },
      {
        name: "description",
        content: "Read and answer buyer questions about your crafts, with AI-suggested replies.",
      },
      { property: "og:title", content: "Inquiries — ShreniKart" },
      {
        property: "og:description",
        content: "Buyer conversations with voice, text and Shreni AI replies.",
      },
    ],
  }),
  component: Inquiries,
});

function Inquiries() {
  const { inquiries, products } = useStore();
  const unread = inquiries.filter((q) => q.unread).length;

  return (
    <AppShell>
      <ScreenHeader title="Inquiries" subtitle={`${unread} waiting for your reply`} />
      <div className="space-y-3 p-5">
        {inquiries.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
            <MessageSquareText className="h-10 w-10 text-primary" strokeWidth={1.6} />
            <p className="mt-3 text-sm text-muted-foreground">No customer inquiries yet.</p>
          </div>
        )}
        {inquiries.map((q) => {
          const product = products.find((p) => p.id === q.product_id);
          const last = q.messages[q.messages.length - 1];
          return (
            <Link
              key={q.id}
              to="/inquiries/$id"
              params={{ id: q.id }}
              className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {q.buyerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold">{q.buyerName}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{last?.time}</span>
                </span>
                <span className="block truncate text-xs text-primary">{product?.title}</span>
                <span className="mt-0.5 line-clamp-1 block text-sm text-muted-foreground">
                  {last?.text}
                </span>
              </span>
              {q.unread && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
