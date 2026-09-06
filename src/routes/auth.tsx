import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { HelpCircle, Loader2, Mail, Phone, ShieldCheck, User } from "lucide-react";
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
          "Artisan sign in and account creation for ShreniKart using mobile or email with one-time password verification.",
      },
      { property: "og:title", content: "Sign in to ShreniKart" },
      {
        property: "og:description",
        content: "Secure artisan sign in with a one-time password on mobile or email.",
      },
    ],
  }),
  component: AuthScreen,
});

const OTP_LENGTH = 6;

function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [channel, setChannel] = useState<"mobile" | "email">("mobile");
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [stage, setStage] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"none" | "send" | "verify" | "mp">("none");
  const [seconds, setSeconds] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);
  const { language, signIn, updateOnboarding, completeStep, onboarding } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const validIdentifier =
    channel === "mobile"
      ? identifier.replace(/\D/g, "").length === 10
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());

  const sendOtp = () => {
    if (!validIdentifier) {
      setError(
        channel === "mobile"
          ? "Please enter your 10-digit mobile number."
          : "Please enter a valid email address.",
      );
      return;
    }
    if (mode === "signup" && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    setBusy("send");
    setTimeout(() => {
      setBusy("none");
      setStage("otp");
      setSeconds(30);
      setTimeout(() => otpRef.current?.focus(), 50);
    }, 700);
  };

  const verifyOtp = () => {
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code we sent you.`);
      return;
    }
    setError("");
    setBusy("verify");
    setTimeout(() => {
      signIn(name.trim() || undefined);
      updateOnboarding({
        account: { identifier: identifier.trim(), channel, verified: true },
        profile: { ...onboarding.profile, fullName: name.trim() || onboarding.profile.fullName },
      });
      completeStep("account", 1);
      navigate({ to: "/onboarding" });
    }, 900);
  };

  return (
    <AuthShell>
      <div className="mt-8 flex-1">
        <h1 className="text-3xl font-semibold">
          {stage === "otp"
            ? "Enter your code"
            : mode === "signin"
              ? "Welcome back"
              : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {stage === "otp"
            ? `We sent a ${OTP_LENGTH}-digit one-time password to ${identifier}.`
            : mode === "signin"
              ? "Sign in with your mobile number or email — we will send a one-time password."
              : "Join ShreniKart and take your craft to buyers across India."}
        </p>

        {stage === "details" ? (
          <>
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

              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
                {(["mobile", "email"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setChannel(c);
                      setIdentifier("");
                      setError("");
                    }}
                    className={cn(
                      "h-10 rounded-xl text-sm font-semibold transition-all",
                      channel === c ? "bg-card text-foreground shadow-soft" : "text-muted-foreground",
                    )}
                  >
                    {c === "mobile" ? "Mobile number" : "Email"}
                  </button>
                ))}
              </div>

              {channel === "mobile" ? (
                <Field icon={Phone} label="Mobile number">
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                    inputMode="numeric"
                    placeholder="98765 43210"
                    className="h-full w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
                  />
                </Field>
              ) : (
                <Field icon={Mail} label="Email address">
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    inputMode="email"
                    placeholder="sunita@example.com"
                    className="h-full w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
                  />
                </Field>
              )}
            </div>
          </>
        ) : (
          <div className="mt-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">One-time password</span>
              <input
                ref={otpRef}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
                inputMode="numeric"
                placeholder="••••••"
                className="h-16 w-full rounded-2xl border border-border bg-card text-center text-2xl font-semibold tracking-[0.6em] outline-none focus:border-primary"
              />
            </label>
            <div className="mt-3 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStage("details");
                  setOtp("");
                  setError("");
                }}
                className="font-semibold text-muted-foreground"
              >
                Change {channel === "mobile" ? "number" : "email"}
              </button>
              <button
                type="button"
                disabled={seconds > 0}
                onClick={() => setSeconds(30)}
                className="font-semibold text-primary disabled:text-muted-foreground"
              >
                {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
              </button>
            </div>
            <p className="mt-4 rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
              Demo mode — any {OTP_LENGTH} digits work. In production the code is checked on the
              server, which then issues short-lived access and refresh sessions in HTTP-only
              cookies. Codes and tokens are never kept in browser storage.
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={stage === "details" ? sendOtp : verifyOtp}
          disabled={busy !== "none"}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          {(busy === "send" || busy === "verify") && <Loader2 className="h-5 w-5 animate-spin" />}
          {stage === "details" ? "Send OTP" : "Verify & continue"}
        </button>

        {stage === "details" && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or{" "}
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={() => {
                setBusy("mp");
                setTimeout(() => navigate({ to: "/meripehchaan" }), 600);
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
          </>
        )}

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
