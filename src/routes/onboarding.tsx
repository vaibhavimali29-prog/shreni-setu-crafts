import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Fingerprint,
  FileText,
  Hammer,
  Image as ImageIcon,
  Loader2,
  Mic,
  Palette,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { AuthShell } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { LANGUAGES } from "@/lib/i18n";
import type { LanguageCode } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import {
  CRAFT_CATEGORIES,
  CRAFT_VOICE_SAMPLE,
  DOCUMENT_CHECKS,
  LEARNED_OPTIONS,
  ONBOARDING_STEPS,
  PORTFOLIO_SIGNALS,
  structureCraftFromVoice,
} from "@/lib/onboarding";
import type { ArtworkEntry, OnboardingStepKey } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Artisan Onboarding & Verification — ShreniKart" },
      {
        name: "description",
        content:
          "Complete your ShreniKart artisan onboarding: profile, identity, documents, craft details, portfolio and making process.",
      },
      { property: "og:title", content: "Artisan Onboarding & Verification — ShreniKart" },
      {
        property: "og:description",
        content:
          "Step-by-step artisan verification with demo identity checks, portfolio and process evidence.",
      },
    ],
  }),
  component: Onboarding,
});

function fileList(files: FileList | null) {
  return Array.from(files ?? []).map((f) => URL.createObjectURL(f));
}

function Onboarding() {
  const { onboarding, updateOnboarding, completeStep, completeOnboarding } = useStore();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(false);
  const step = Math.min(onboarding.stepIndex, ONBOARDING_STEPS.length - 1);
  const current = ONBOARDING_STEPS[step]!;

  const go = (key: OnboardingStepKey, next: number) => {
    completeStep(key, Math.min(next, ONBOARDING_STEPS.length - 1));
    if (next >= ONBOARDING_STEPS.length) {
      updateOnboarding({ verificationStatus: "evidence-received" });
      setSummary(true);
    }
    window.scrollTo({ top: 0 });
  };

  const back = () => {
    updateOnboarding({ stepIndex: Math.max(0, step - 1) });
    window.scrollTo({ top: 0 });
  };

  if (summary) return <Summary onEnter={() => {
    completeOnboarding();
    navigate({ to: "/dashboard" });
  }} />;

  return (
    <AuthShell>
      <div className="flex-1 pt-6 pb-4">
        <Progress step={step} />

        <div className="mt-6">
          {current.key === "account" && <AccountStep onNext={() => go("account", 1)} />}
          {current.key === "profile" && <ProfileStep onNext={() => go("profile", 2)} />}
          {current.key === "identity" && <IdentityStep onNext={() => go("identity", 3)} />}
          {current.key === "documents" && <DocumentsStep onNext={() => go("documents", 4)} />}
          {current.key === "craft" && <CraftStep onNext={() => go("craft", 5)} />}
          {current.key === "portfolio" && <PortfolioStep onNext={() => go("portfolio", 6)} />}
          {current.key === "process" && <ProcessStep onNext={() => go("process", 7)} />}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}

        <div className="mt-6 flex justify-center">
          <DemoBadge label="Demo Mode — no real Aadhaar data is processed or stored" />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Your progress is saved after every step — you can leave and continue later.
        </p>
      </div>
    </AuthShell>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Step {step + 1} of {ONBOARDING_STEPS.length}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        {ONBOARDING_STEPS.map((s, i) => (
          <span
            key={s.key}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              i < step ? "bg-success" : i === step ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
        {ONBOARDING_STEPS.map((s, i) => (
          <span key={s.key} className={cn(i === step && "font-bold text-primary")}>
            {s.label}
            {i < ONBOARDING_STEPS.length - 1 ? " →" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepHead({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98] disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
        className="h-13 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-base outline-none focus:border-primary"
      />
    </label>
  );
}

function AreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder ?? ""}
        className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none focus:border-primary"
      />
    </label>
  );
}

/* ---------------- Step 1 — Account ---------------- */

function AccountStep({ onNext }: { onNext: () => void }) {
  const { onboarding } = useStore();
  return (
    <div>
      <StepHead
        icon={ShieldCheck}
        title="Account created"
        subtitle="Your ShreniKart account is active and your session is secured."
      />
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <p className="text-sm font-semibold">
          {onboarding.account.channel === "email" ? "Email" : "Mobile"} verified
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {onboarding.account.identifier || "Verified with a one-time password"}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Access and refresh sessions are issued and rotated by the server in HTTP-only cookies.
          No tokens or one-time passwords are stored in this browser.
        </p>
      </div>
      <PrimaryButton onClick={onNext}>
        Continue <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </div>
  );
}

/* ---------------- Step 2 — Basic profile ---------------- */

function ProfileStep({ onNext }: { onNext: () => void }) {
  const { onboarding, updateOnboarding, language, setLanguage } = useStore();
  const p = onboarding.profile;
  const set = (patch: Partial<typeof p>) => updateOnboarding({ profile: { ...p, ...patch } });
  const valid = p.fullName.trim().length > 1 && p.location.trim().length > 1;

  return (
    <div>
      <StepHead
        icon={UserRound}
        title="Your basic profile"
        subtitle="Tell buyers who you are. You can edit all of this later in Settings."
      />

      <div className="mb-4 flex items-center gap-4">
        <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-muted">
          {p.photo ? (
            <img src={p.photo} alt="Your profile" className="h-full w-full object-cover" />
          ) : (
            <Camera className="h-7 w-7 text-muted-foreground" />
          )}
        </span>
        <label className="cursor-pointer rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold shadow-soft">
          {p.photo ? "Change photo" : "Add profile photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => set({ photo: fileList(e.target.files)[0] ?? "" })}
          />
        </label>
      </div>

      <div className="space-y-3">
        <TextField
          label="Full name"
          value={p.fullName}
          onChange={(v) => set({ fullName: v })}
          placeholder="Sunita Deshmukh"
        />
        <TextField
          label="Artist / stage name"
          value={p.artistName}
          onChange={(v) => set({ artistName: v })}
          placeholder="Sunita Paithani"
        />
        <TextField label="Date of birth" value={p.dob} onChange={(v) => set({ dob: v })} type="date" />
        <TextField
          label="Location"
          value={p.location}
          onChange={(v) => set({ location: v })}
          placeholder="Yeola, Maharashtra"
        />
        <div>
          <span className="mb-1.5 block text-sm font-semibold">Preferred language</span>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((l) => {
              const active = (p.language || language) === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    set({ language: l.code as LanguageCode });
                    setLanguage(l.code);
                  }}
                  className={cn(
                    "rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all",
                    active ? "border-primary bg-primary/8 text-primary" : "border-border bg-card",
                  )}
                >
                  {l.native}
                </button>
              );
            })}
          </div>
        </div>
        <AreaField
          label="A little about you"
          value={p.about}
          onChange={(v) => set({ about: v })}
          placeholder="Third-generation handloom weaver, working with a women's cluster of 12 artisans."
        />
      </div>

      <PrimaryButton onClick={onNext} disabled={!valid}>
        Save & continue <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </div>
  );
}

/* ---------------- Step 3 — Identity ---------------- */

function IdentityStep({ onNext }: { onNext: () => void }) {
  const { onboarding, updateOnboarding } = useStore();
  const [busy, setBusy] = useState<"" | "aadhaar-otp" | "aadhaar-biometric">("");
  const done = onboarding.identity.status === "verified";

  const run = (method: "aadhaar-otp" | "aadhaar-biometric") => {
    setBusy(method);
    setTimeout(() => {
      setBusy("");
      updateOnboarding({
        identity: {
          method,
          status: "verified",
          reference: `DEMO-REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          verifiedAt: new Date().toISOString(),
        },
      });
    }, 1600);
  };

  return (
    <div>
      <StepHead
        icon={Fingerprint}
        title="Identity verification"
        subtitle="Aadhaar-based verification is performed by an authorised UIDAI / AUA-KUA provider — it only confirms who you are, never your artistic ability."
      />

      <div className="rounded-2xl border border-secondary/40 bg-secondary/5 p-4">
        <p className="text-sm font-bold text-secondary">Demo Identity Verification</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Demo Mode — no real Aadhaar data is processed or stored. This is not real Aadhaar
          verification. The screen mirrors the authorised flow so a licensed provider can be
          connected later without changing the app.
        </p>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {[
          "Aadhaar numbers, images and biometrics never reach ShreniKart",
          "One-time passwords are used by the provider and never stored",
          "Only a pass/fail result and an opaque reference are saved",
        ].map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {line}
          </li>
        ))}
      </ul>

      {done ? (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-success/40 bg-success/8 p-4">
          <Check className="h-5 w-5 text-success" />
          <div>
            <p className="text-sm font-semibold">Identity verified (demo)</p>
            <p className="text-xs text-muted-foreground">
              Method: {onboarding.identity.method} · Reference {onboarding.identity.reference}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {(
            [
              ["aadhaar-otp", "Verify with OTP", "Provider sends the OTP to your Aadhaar-linked mobile"],
              [
                "aadhaar-biometric",
                "Verify with biometric",
                "At a nearby authorised assisted-service centre",
              ],
            ] as const
          ).map(([method, label, sub]) => (
            <button
              key={method}
              type="button"
              disabled={busy !== ""}
              onClick={() => run(method)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {busy === method ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-primary" />
              )}
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs text-muted-foreground">{sub}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      <PrimaryButton onClick={onNext} disabled={!done}>
        Continue <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </div>
  );
}

/* ---------------- Step 4 — Documents (optional) ---------------- */

function DocumentsStep({ onNext }: { onNext: () => void }) {
  const { onboarding, updateOnboarding } = useStore();
  const d = onboarding.documents;
  const [analysing, setAnalysing] = useState(false);

  const upload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setAnalysing(true);
    updateOnboarding({
      documents: {
        skipped: false,
        fileName: file.name,
        preview: URL.createObjectURL(file),
        docType: "Detecting…",
        checks: [],
      },
    });
    setTimeout(() => {
      setAnalysing(false);
      updateOnboarding({
        documents: {
          skipped: false,
          fileName: file.name,
          preview: URL.createObjectURL(file),
          docType: "Artisan / craft ID card",
          checks: DOCUMENT_CHECKS,
        },
      });
    }, 1800);
  };

  return (
    <div>
      <StepHead
        icon={FileText}
        title="Document verification — optional"
        subtitle="Upload a photo of any supporting document you already have. This step never blocks you."
      />

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <span className="text-sm font-semibold">
          {d.fileName || "Upload document photo"}
        </span>
        <span className="text-xs text-muted-foreground">
          Artisan card, cluster/SHG letter, award certificate, shop licence…
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
      </label>

      {d.preview && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <img
            src={d.preview}
            alt="Uploaded document"
            className="h-40 w-full rounded-xl object-cover"
          />
          <p className="mt-3 text-sm font-semibold">
            {analysing ? "Checking document…" : `Detected: ${d.docType}`}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {(analysing ? DOCUMENT_CHECKS : d.checks).map((c) => (
              <li key={c} className="flex items-center gap-2 text-muted-foreground">
                {analysing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Check className="h-4 w-4 text-success" />
                )}
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Checks run on the backend. The document image is used for verification only and is not
            kept once the result is recorded.
          </p>
        </div>
      )}

      <PrimaryButton onClick={onNext}>
        Continue <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
      <button
        type="button"
        onClick={() => {
          updateOnboarding({
            documents: { ...d, skipped: true },
          });
          onNext();
        }}
        className="mt-3 h-12 w-full text-sm font-semibold text-muted-foreground"
      >
        I don't have a document — continue with alternative verification
      </button>
    </div>
  );
}

/* ---------------- Step 5 — Craft profile ---------------- */

function CraftStep({ onNext }: { onNext: () => void }) {
  const { onboarding, updateOnboarding } = useStore();
  const c = onboarding.craft;
  const set = (patch: Partial<typeof c>) => updateOnboarding({ craft: { ...c, ...patch } });
  const [vani, setVani] = useState<"idle" | "listening" | "thinking" | "done">("idle");

  const speak = () => {
    setVani("listening");
    setTimeout(() => setVani("thinking"), 2000);
    setTimeout(() => {
      set(structureCraftFromVoice());
      setVani("done");
    }, 3600);
  };

  return (
    <div>
      <StepHead
        icon={Palette}
        title="Your craft"
        subtitle="Describe the craft you practise. Speak in your language and Shreni AI will fill the form."
      />

      <button
        type="button"
        onClick={speak}
        className="flex w-full items-center gap-3 rounded-2xl border border-primary/30 bg-primary/6 p-4 text-left"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {vani === "listening" || vani === "thinking" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </span>
        <span>
          <span className="block text-sm font-semibold">
            {vani === "listening"
              ? "Shreni Vani is listening…"
              : vani === "thinking"
                ? "Shreni AI is structuring your answer…"
                : "Describe your craft with Shreni Vani"}
          </span>
          <span className="block text-xs text-muted-foreground">
            {vani === "done" ? "Detected: मराठी · form filled below" : "Tap and speak naturally"}
          </span>
        </span>
      </button>

      {(vani === "thinking" || vani === "done") && (
        <p className="mt-3 rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
          “{CRAFT_VOICE_SAMPLE}”
        </p>
      )}

      <div className="mt-4">
        <span className="mb-1.5 block text-sm font-semibold">Craft category</span>
        <div className="flex flex-wrap gap-2">
          {CRAFT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => set({ category: cat })}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-semibold transition-all",
                c.category === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <TextField
          label="Years of experience"
          value={c.years}
          onChange={(v) => set({ years: v.replace(/\D/g, "").slice(0, 2) })}
          placeholder="18"
        />
        <div>
          <span className="mb-1.5 block text-sm font-semibold">How you learned the craft</span>
          <div className="flex flex-wrap gap-2">
            {LEARNED_OPTIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => set({ learnedFrom: o })}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-sm font-semibold",
                  c.learnedFrom === o
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border bg-card",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
        <TextField
          label="Materials & tools you use"
          value={c.materials}
          onChange={(v) => set({ materials: v })}
          placeholder="Silk yarn, zari, pit loom"
        />
        <AreaField
          label="Describe your work"
          value={c.description}
          onChange={(v) => set({ description: v })}
          placeholder="What you make, your style, motifs, who buys from you…"
        />
      </div>

      <PrimaryButton onClick={onNext} disabled={!c.category || !c.description.trim()}>
        Save & continue <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </div>
  );
}

/* ---------------- Step 6 — Portfolio ---------------- */

function PortfolioStep({ onNext }: { onNext: () => void }) {
  const { onboarding, updateOnboarding } = useStore();
  const items = onboarding.portfolio;

  const add = (files: FileList | null) => {
    const added: ArtworkEntry[] = Array.from(files ?? []).map((f, i) => ({
      id: `art_${Date.now()}_${i}`,
      title: "",
      craftType: onboarding.craft.category,
      description: "",
      materials: onboarding.craft.materials,
      preview: URL.createObjectURL(f),
      kind: f.type.startsWith("video") ? "video" : "photo",
    }));
    updateOnboarding({ portfolio: [...items, ...added] });
  };

  const patch = (id: string, p: Partial<ArtworkEntry>) =>
    updateOnboarding({ portfolio: items.map((a) => (a.id === id ? { ...a, ...p } : a)) });

  return (
    <div>
      <StepHead
        icon={ImageIcon}
        title="Show us your work"
        subtitle="Add photos or short videos of pieces you have made. More works make verification easier."
      />

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center">
        <Plus className="h-6 w-6 text-muted-foreground" />
        <span className="text-sm font-semibold">Add artwork photos or videos</span>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => add(e.target.files)}
        />
      </label>

      <div className="mt-4 space-y-4">
        {items.map((a, idx) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
            <div className="flex gap-3">
              {a.kind === "video" ? (
                <video src={a.preview} className="h-24 w-24 rounded-xl object-cover" muted />
              ) : (
                <img
                  src={a.preview}
                  alt={a.title || `Artwork ${idx + 1}`}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  value={a.title}
                  onChange={(e) => patch(a.id, { title: e.target.value })}
                  placeholder="Title"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
                <input
                  value={a.craftType}
                  onChange={(e) => patch(a.id, { craftType: e.target.value })}
                  placeholder="Craft type"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <textarea
              value={a.description}
              onChange={(e) => patch(a.id, { description: e.target.value })}
              rows={2}
              placeholder="Description and any additional details"
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              value={a.materials}
              onChange={(e) => patch(a.id, { materials: e.target.value })}
              placeholder="Materials used"
              className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => updateOnboarding({ portfolio: items.filter((x) => x.id !== a.id) })}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-muted p-3">
        <p className="text-sm font-semibold">What the backend looks at</p>
        <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
          {PORTFOLIO_SIGNALS.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          These are verification signals reviewed by a person — never absolute proof on their own.
        </p>
      </div>

      <PrimaryButton onClick={onNext} disabled={items.length === 0}>
        Continue <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </div>
  );
}

/* ---------------- Step 7 — Process ---------------- */

function ProcessStep({ onNext }: { onNext: () => void }) {
  const { onboarding, updateOnboarding } = useStore();
  const pr = onboarding.process;
  const [vani, setVani] = useState(false);

  const addTo = (key: "making" | "workspace" | "tools" | "materials", files: FileList | null) =>
    updateOnboarding({ process: { ...pr, [key]: [...pr[key], ...fileList(files)] } });

  const GROUPS = [
    { key: "making", label: "Making process", hint: "Photos or a short video of you working", icon: Hammer },
    { key: "workspace", label: "Workspace / studio", hint: "Where you create", icon: Camera },
    { key: "tools", label: "Tools & equipment", hint: "Loom, wheel, chisels, needles…", icon: Hammer },
    { key: "materials", label: "Raw materials", hint: "Yarn, clay, wood, beads…", icon: ImageIcon },
  ] as const;

  const total = GROUPS.reduce((n, g) => n + pr[g.key].length, 0);

  return (
    <div>
      <StepHead
        icon={Hammer}
        title="Show how you create"
        subtitle="A few pictures of your process, workspace, tools and materials help confirm your craft."
      />

      <div className="space-y-3">
        {GROUPS.map(({ key, label, hint, icon: Icon }) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-xs text-muted-foreground">{hint}</span>
            </span>
            <span className="text-sm font-bold text-primary">{pr[key].length || "+"}</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => addTo(key, e.target.files)}
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setVani(true);
          setTimeout(
            () =>
              updateOnboarding({
                process: {
                  ...pr,
                  voiceNote:
                    "Voice explanation recorded with Shreni Vani (मराठी) — describes yarn preparation, warping the pit loom and weaving the zari border.",
                },
              }),
            1800,
          );
        }}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-primary/30 bg-primary/6 p-4 text-left"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {vani && !pr.voiceNote ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </span>
        <span>
          <span className="block text-sm font-semibold">Optional voice explanation</span>
          <span className="block text-xs text-muted-foreground">
            {pr.voiceNote || "Explain your process in your own language with Shreni Vani"}
          </span>
        </span>
      </button>

      <PrimaryButton onClick={onNext} disabled={total === 0}>
        Submit for verification <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </div>
  );
}

/* ---------------- Summary ---------------- */

function Summary({ onEnter }: { onEnter: () => void }) {
  const { onboarding } = useStore();
  const rows = useMemo(
    () => [
      ["Account", onboarding.account.identifier || "Verified", true],
      ["Basic profile", onboarding.profile.fullName || "Saved", true],
      [
        "Identity",
        onboarding.identity.status === "verified" ? "Verified (demo)" : "Pending",
        onboarding.identity.status === "verified",
      ],
      [
        "Documents",
        onboarding.documents.skipped
          ? "Alternative verification"
          : onboarding.documents.fileName || "Not provided",
        !onboarding.documents.skipped && Boolean(onboarding.documents.fileName),
      ],
      ["Craft", onboarding.craft.category || "Saved", Boolean(onboarding.craft.category)],
      ["Portfolio", `${onboarding.portfolio.length} work(s)`, onboarding.portfolio.length > 0],
      [
        "Process evidence",
        `${
          onboarding.process.making.length +
          onboarding.process.workspace.length +
          onboarding.process.tools.length +
          onboarding.process.materials.length
        } file(s)`,
        true,
      ],
    ],
    [onboarding],
  );

  return (
    <AuthShell>
      <div className="flex-1 pt-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-success/12 text-success">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-3xl font-semibold">Evidence received</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your artisan verification is now <strong>under review</strong>. You can start using
          ShreniKart right away — we will tell you if any additional information is required.
        </p>

        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {rows.map(([label, value, ok]) => (
            <div key={String(label)} className="flex items-center gap-3 p-3.5">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  ok ? "bg-success/12 text-success" : "bg-muted text-muted-foreground",
                )}
              >
                <Check className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{String(label)}</span>
                <span className="block truncate text-xs text-muted-foreground">{String(value)}</span>
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Verification combines your profile, craft details, artwork, workspace, tools, materials
          and making process. Automated checks are signals only — a reviewer makes the final
          decision, and no system claims to have proven artistry on its own.
        </p>
      </div>

      <div className="pt-6 pb-2">
        <button
          type="button"
          onClick={onEnter}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
        >
          Enter ShreniKart
        </button>
        <div className="mt-3 flex justify-center">
          <DemoBadge label="Demo Mode — no real Aadhaar data is processed or stored" />
        </div>
      </div>
    </AuthShell>
  );
}
