import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, Loader2, Lock, Phone, ShieldCheck, User } from "lucide-react";
import { AuthShell } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { languageLabel } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to ShreniKart" },
      {
        name: "description",
        content:
          "Artisan sign in and account creation for ShreniKart, with MeriPehchaan identity authentication.",
      },
      { property: "og:title", content: "Sign in to ShreniKart" },
      {
        property: "og:description",
        content: "Secure artisan sign in with mobile number or MeriPehchaan.",
      },
    ],
  }),
  component: AuthScreen,
});

function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"none" | "form" | "mp">("none");
  const { language } = useStore();
  const navigate = useNavigate();

  const submit = () => {
    if (mobile.replace(/\D/g, "").length !== 10) {
      setError("Please enter your 10-digit mobile number.");
      return;
    }
    if (mode === "signup" && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    setError("");
    setBusy("form");
    setTimeout(
      () =>
        navigate({
          to: "/meripehchaan",
          search: { name: mode === "signup" ? name.trim() : "" },
        }),
      700,
    );
  };

  return (
    <AuthShell>
      <div className="mt-8 flex-1">
        <h1 className="text-3xl font-semibold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage your crafts, orders and earnings."
            : "Join ShreniKart and take your craft to buyers across India."}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={cn(
                "h-11 rounded-xl text-sm font-semibold transition-all",
                mode === m ? "bg-card text-foreground shadow-soft" : "text-muted-foreground",
              )}
            >
              {m === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {mode === "signup" && (
            <Field icon={User} label="Your name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sunita Deshmukh"
                className="h-full w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
              />
            </Field>
          )}
          <Field icon={Phone} label="Mobile number">
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
              inputMode="numeric"
              placeholder="98765 43210"
              className="h-full w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
            />
          </Field>
          <Field icon={Lock} label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="h-full w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
            />
          </Field>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={busy !== "none"}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          {busy === "form" && <Loader2 className="h-5 w-5 animate-spin" />}
          Continue
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => {
            setBusy("mp");
            setTimeout(() => navigate({ to: "/meripehchaan", search: { name: "" } }), 600);
          }}
          disabled={busy !== "none"}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-secondary bg-card text-base font-semibold text-secondary transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          {busy === "mp" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
          Continue with MeriPehchaan
        </button>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="/" className="font-semibold text-primary">
            🌐 {languageLabel(language ?? "en")}
          </Link>
          <Link to="/help" className="flex items-center gap-1.5 text-muted-foreground">
            <HelpCircle className="h-4 w-4" /> Help & Support
          </Link>
        </div>
      </div>

      <div className="mt-6 flex justify-center pb-2">
        <DemoBadge label="Demo authentication · not real identity verification" />
      </div>
    </AuthShell>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      <span className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4 focus-within:border-primary">
        <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
        {children}
      </span>
    </label>
  );
}
