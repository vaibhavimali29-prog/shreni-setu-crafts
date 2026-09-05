import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Check, Globe, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { LANGUAGES } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ShreniKart" },
      {
        name: "description",
        content:
          "Change your app language, notifications, voice speed, AI preferences and privacy options.",
      },
      { property: "og:title", content: "Settings — ShreniKart" },
      {
        property: "og:description",
        content: "Control language, voice and AI behaviour across the ShreniKart app.",
      },
    ],
  }),
  component: SettingsScreen,
});

function SettingsScreen() {
  const { language, setLanguage } = useStore();
  const [toggles, setToggles] = useState({
    orderAlerts: true,
    inquiryAlerts: true,
    slowVoice: false,
    aiAutoDescribe: true,
    aiAutoTranslate: true,
  });

  const toggle = (key: keyof typeof toggles) =>
    setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <AppShell>
      <ScreenHeader title="Settings" back="/profile" />

      <section className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Globe className="h-4 w-4 text-primary" /> Language
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={cn(
                "flex items-center justify-center gap-1 rounded-xl border px-2 py-3 text-sm font-semibold transition-colors",
                language === l.code
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {language === l.code && <Check className="h-3.5 w-3.5" />}
              {l.native}
            </button>
          ))}
        </div>
      </section>

      <Group icon={Bell} title="Notifications">
        <Row label="New order alerts" on={toggles.orderAlerts} onClick={() => toggle("orderAlerts")} />
        <Row
          label="Buyer inquiry alerts"
          on={toggles.inquiryAlerts}
          onClick={() => toggle("inquiryAlerts")}
        />
      </Group>

      <Group icon={Mic} title="Voice settings">
        <Row
          label="Speak slowly and clearly"
          on={toggles.slowVoice}
          onClick={() => toggle("slowVoice")}
        />
      </Group>

      <Group icon={Sparkles} title="AI preferences">
        <Row
          label="Auto-write descriptions"
          on={toggles.aiAutoDescribe}
          onClick={() => toggle("aiAutoDescribe")}
        />
        <Row
          label="Auto-translate listings to English"
          on={toggles.aiAutoTranslate}
          onClick={() => toggle("aiAutoTranslate")}
        />
      </Group>

      <section className="p-5 pt-0">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-success" /> Privacy
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            ShreniKart stores only your verified name, craft details and listings. Identity
            documents, Aadhaar data and biometrics are never stored, and sessions are handled by the
            server.
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function Group({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 pb-5">
      <h2 className="flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h2>
      <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {children}
      </div>
    </section>
  );
}

function Row({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between p-4 text-left"
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "flex h-7 w-12 items-center rounded-full p-1 transition-colors",
          on ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full bg-card shadow transition-transform",
            on && "translate-x-5",
          )}
        />
      </span>
    </button>
  );
}
