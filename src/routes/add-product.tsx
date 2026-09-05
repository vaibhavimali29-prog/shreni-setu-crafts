import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Mic,
  Pencil,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/app-shell";
import { DemoBadge } from "@/components/brand";
import { ENHANCEMENT_STEPS, PRICE_FACTORS, detectSample, generateCatalog } from "@/lib/ai";
import type { CatalogResult } from "@/lib/ai";
import { craftImages, formatINR } from "@/lib/data";
import type { Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/add-product")({
  head: () => ({
    meta: [
      { title: "Add Product with AI — ShreniKart" },
      {
        name: "description",
        content:
          "Photograph your craft, describe it by voice, and let Shreni AI write the listing, enhance the image and suggest a fair price.",
      },
      { property: "og:title", content: "Add Product with AI — ShreniKart" },
      {
        property: "og:description",
        content: "Voice-to-listing product creation for Indian artisans.",
      },
    ],
  }),
  component: AddProduct,
});

const STEP_LABELS = ["Photos", "Enhance", "Describe", "Catalog", "Price", "Preview"];

function AddProduct() {
  const { language, addProduct, artisan } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<string[]>([craftImages.terracotta]);
  const [enhanced, setEnhanced] = useState(false);
  const [catalog, setCatalog] = useState<CatalogResult | null>(null);
  const [price, setPrice] = useState(2499);
  const [published, setPublished] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));

  const publish = () => {
    const product: Product = {
      id: "new-" + Date.now(),
      artisan_id: artisan.id,
      artisanName: artisan.name,
      region: artisan.region,
      title: catalog?.title ?? "Handcrafted Traditional Craft",
      description: catalog?.description ?? "",
      story: "Made by hand in " + artisan.region + ".",
      category: catalog?.category ?? "Handwoven Textiles",
      craft_type: catalog?.craftType ?? "Traditional Handloom",
      images,
      price,
      suggested_price: catalog?.suggestedPrice ?? price,
      tags: catalog?.tags ?? [],
      status: "published",
      views: 0,
      orders: 0,
      rating: 0,
      created_at: new Date().toISOString().slice(0, 10),
    };
    addProduct(product);
    setPublished(true);
  };

  if (published) return <PublishedScreen onAnother={() => navigate({ to: "/products" })} />;

  return (
    <AppShell>
      <ScreenHeader
        title="Add Product"
        subtitle={`Step ${step + 1} of ${STEP_LABELS.length} · ${STEP_LABELS[step]}`}
        back="/dashboard"
        action={<DemoBadge label="Demo AI" />}
      />

      <div className="flex gap-1.5 px-5 pt-4">
        {STEP_LABELS.map((l, i) => (
          <span
            key={l}
            className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-border")}
          />
        ))}
      </div>

      {step === 0 && (
        <StepPhotos images={images} setImages={setImages} onNext={next} />
      )}
      {step === 1 && (
        <StepEnhance
          image={images[0]!}
          enhanced={enhanced}
          setEnhanced={setEnhanced}
          onNext={next}
        />
      )}
      {step === 2 && (
        <StepVoice
          onDone={(result) => {
            setCatalog(result);
            setPrice(result.suggestedPrice);
            next();
          }}
          language={language}
        />
      )}
      {step === 3 && catalog && <StepCatalog catalog={catalog} onNext={next} />}
      {step === 4 && catalog && (
        <StepPrice catalog={catalog} price={price} setPrice={setPrice} onNext={next} />
      )}
      {step === 5 && catalog && (
        <StepPreview
          catalog={catalog}
          price={price}
          image={images[0]!}
          onEdit={() => setStep(3)}
          onPublish={publish}
        />
      )}
    </AppShell>
  );
}

function StepPhotos({
  images,
  setImages,
  onNext,
}: {
  images: string[];
  setImages: (v: string[]) => void;
  onNext: () => void;
}) {
  const gallery = [craftImages.terracotta, craftImages.bamboo, craftImages.warli];
  return (
    <div className="space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold">Add photos of your craft</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Two or three clear photos help buyers trust your work.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setImages([...new Set([...images, craftImages.bamboo])])}
          className="flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary"
        >
          <Camera className="h-7 w-7" />
          <span className="text-sm font-semibold">Camera</span>
        </button>
        <button
          type="button"
          onClick={() => setImages([...new Set([...images, craftImages.warli])])}
          className="flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card text-muted-foreground"
        >
          <ImagePlus className="h-7 w-7" />
          <span className="text-sm font-semibold">Gallery</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {images.map((src) => (
          <div key={src} className="overflow-hidden rounded-xl border border-border">
            <img
              src={src}
              alt="Uploaded craft"
              loading="lazy"
              width={768}
              height={768}
              className="aspect-square w-full object-cover"
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Sample photos are used in this prototype. Tap Camera or Gallery to add more.
      </p>
      <p className="text-xs text-muted-foreground">
        Available samples: {gallery.length} craft photos.
      </p>

      <button
        type="button"
        onClick={onNext}
        className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft"
      >
        Enhance with Shreni AI
      </button>
    </div>
  );
}

function StepEnhance({
  image,
  enhanced,
  setEnhanced,
  onNext,
}: {
  image: string;
  enhanced: boolean;
  setEnhanced: (v: boolean) => void;
  onNext: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (stepIdx >= ENHANCEMENT_STEPS.length) {
      setRunning(false);
      setEnhanced(true);
      return;
    }
    const t = setTimeout(() => setStepIdx((s) => s + 1), 420);
    return () => clearTimeout(t);
  }, [running, stepIdx, setEnhanced]);

  return (
    <div className="space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold">AI image enhancement</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Make your photo marketplace-ready in one tap.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Before", cls: "brightness-90 contrast-75 saturate-75" },
          { label: "After", cls: enhanced ? "brightness-105 contrast-110 saturate-125" : "blur-[2px] opacity-50" },
        ].map((v) => (
          <div key={v.label} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={image}
              alt={`${v.label} enhancement`}
              loading="lazy"
              width={768}
              height={768}
              className={cn("aspect-square w-full object-cover transition-all duration-700", v.cls)}
            />
            <p className="p-2 text-center text-xs font-semibold">{v.label}</p>
          </div>
        ))}
      </div>

      <ul className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
        {ENHANCEMENT_STEPS.map((s, i) => {
          const done = enhanced || i < stepIdx;
          return (
            <li key={s} className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full",
                  done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="h-3 w-3" />
                ) : running && i === stepIdx ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : null}
              </span>
              <span className={done ? "font-medium" : "text-muted-foreground"}>{s}</span>
            </li>
          );
        })}
      </ul>

      {!enhanced ? (
        <button
          type="button"
          disabled={running}
          onClick={() => {
            setRunning(true);
            setStepIdx(0);
          }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
        >
          {running ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
          {running ? "Shreni AI is enhancing…" : "Enhance Image"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft"
        >
          Use Enhanced Image
        </button>
      )}
    </div>
  );
}

function StepVoice({
  onDone,
  language,
}: {
  onDone: (r: CatalogResult) => void;
  language: ReturnType<typeof useStore>["language"];
}) {
  const [phase, setPhase] = useState<"idle" | "listening" | "thinking" | "ready">("idle");
  const [result, setResult] = useState<CatalogResult | null>(null);
  const sample = detectSample(language);

  useEffect(() => {
    if (phase === "listening") {
      const t = setTimeout(() => setPhase("thinking"), 2200);
      return () => clearTimeout(t);
    }
    if (phase === "thinking") {
      const t = setTimeout(() => {
        setResult(generateCatalog(language));
        setPhase("ready");
      }, 1500);
      return () => clearTimeout(t);
    }
    return;
  }, [phase, language]);

  return (
    <div className="space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold">Tell us about your craft</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Speak naturally in your preferred language.
        </p>
      </div>

      <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 shadow-soft">
        <button
          type="button"
          aria-label="Start speaking"
          onClick={() => setPhase("listening")}
          className={cn(
            "relative flex h-28 w-28 items-center justify-center rounded-full text-primary-foreground shadow-lift transition-transform active:scale-95",
            phase === "listening" ? "bg-secondary" : "bg-primary",
          )}
        >
          {phase === "listening" && (
            <span className="absolute inset-0 animate-ping rounded-full bg-secondary/30" />
          )}
          <Mic className="h-12 w-12" strokeWidth={1.6} />
        </button>
        <p className="mt-4 text-sm font-semibold">
          {phase === "idle" && "Tap and describe your craft"}
          {phase === "listening" && "Shreni Vani is listening…"}
          {phase === "thinking" && "Understanding your description…"}
          {phase === "ready" && "Ready"}
        </p>
      </div>

      {result && (
        <>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <p className="text-xs font-semibold text-muted-foreground">Detected language</p>
            <p className="text-sm font-bold text-primary">{result.detectedLanguage}</p>
            <p className="mt-3 text-xs font-semibold text-muted-foreground">Transcribed</p>
            <p className="text-sm">{sample.transcript}</p>
            <p className="mt-3 text-xs font-semibold text-muted-foreground">
              AI-generated description
            </p>
            <p className="text-sm leading-relaxed">{result.description}</p>
            <div className="mt-3 flex gap-2">
              {[Pencil, RefreshCw, Sparkles].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border text-xs font-semibold"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {["Edit", "Regenerate", "Translate"][i]}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDone(result)}
            className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft"
          >
            Continue to smart cataloging
          </button>
        </>
      )}
    </div>
  );
}

function StepCatalog({ catalog, onNext }: { catalog: CatalogResult; onNext: () => void }) {
  return (
    <div className="space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold">Shreni AI smart cataloging</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review and edit anything you like.</p>
      </div>

      <Labeled label="Product title">
        <p className="text-base font-semibold">{catalog.title}</p>
      </Labeled>
      <Labeled label="Description">
        <p className="text-sm leading-relaxed">{catalog.description}</p>
      </Labeled>
      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Category">
          <p className="text-sm font-semibold">{catalog.category}</p>
        </Labeled>
        <Labeled label="Craft type">
          <p className="text-sm font-semibold">{catalog.craftType}</p>
        </Labeled>
      </div>
      <Labeled label="Suggested tags">
        <div className="flex flex-wrap gap-2">
          {catalog.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </Labeled>

      <button
        type="button"
        onClick={onNext}
        className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft"
      >
        See price recommendation
      </button>
    </div>
  );
}

function StepPrice({
  catalog,
  price,
  setPrice,
  onNext,
}: {
  catalog: CatalogResult;
  price: number;
  setPrice: (v: number) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4 p-5">
      <div className="rounded-3xl border border-gold/40 bg-gold/10 p-5 shadow-soft">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Sparkles className="h-4 w-4 text-primary" /> Shreni AI Price Insight
        </p>
        <p className="mt-3 text-xs font-semibold text-muted-foreground">Suggested price</p>
        <p className="text-4xl font-bold text-primary">{formatINR(catalog.suggestedPrice)}</p>
        <p className="mt-2 text-sm font-semibold">
          Recommended range {formatINR(catalog.priceRange[0])} – {formatINR(catalog.priceRange[1])}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Based on craft type, materials, uniqueness and marketplace trends.
        </p>

        <div className="mt-4 space-y-2">
          {PRICE_FACTORS.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{f.label}</span>
                <span className="text-muted-foreground">{f.value}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-card">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${f.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Labeled label="Set my price (₹)">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="h-12 w-full rounded-xl border border-border bg-background px-3 text-lg font-bold outline-none focus:border-primary"
        />
      </Labeled>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setPrice(catalog.suggestedPrice);
            onNext();
          }}
          className="h-14 flex-1 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft"
        >
          Use Suggested Price
        </button>
        <button
          type="button"
          onClick={onNext}
          className="h-14 flex-1 rounded-2xl border-2 border-primary text-sm font-semibold text-primary"
        >
          Set My Price
        </button>
      </div>
    </div>
  );
}

function StepPreview({
  catalog,
  price,
  image,
  onEdit,
  onPublish,
}: {
  catalog: CatalogResult;
  price: number;
  image: string;
  onEdit: () => void;
  onPublish: () => void;
}) {
  const { artisan } = useStore();
  return (
    <div className="space-y-4 p-5">
      <h2 className="text-lg font-semibold">Marketplace preview</h2>
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <img
          src={image}
          alt={catalog.title}
          loading="lazy"
          width={768}
          height={768}
          className="aspect-square w-full object-cover"
        />
        <div className="space-y-2 p-4">
          <span className="text-xs font-semibold text-primary">{catalog.category}</span>
          <h3 className="text-lg font-semibold">{catalog.title}</h3>
          <p className="text-2xl font-bold text-primary">{formatINR(price)}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{catalog.description}</p>
          <div className="border-t border-border pt-2 text-sm">
            <p className="font-semibold">{artisan.name}</p>
            <p className="text-xs text-muted-foreground">
              {artisan.region} · {catalog.craftType}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {catalog.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="h-14 flex-1 rounded-2xl border-2 border-primary text-sm font-semibold text-primary"
        >
          Edit Product
        </button>
        <button
          type="button"
          onClick={onPublish}
          className="h-14 flex-[1.4] rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft"
        >
          Publish to Shreni Bazaar
        </button>
      </div>
    </div>
  );
}

function PublishedScreen({ onAnother }: { onAnother: () => void }) {
  return (
    <AppShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full bg-success/12"
          style={{ animation: "float-soft 3.5s ease-in-out infinite" }}
        >
          <Check className="h-14 w-14 text-success" strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Your Craft is Live! 🎉</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your product is now available on Shreni Bazaar.
        </p>
        <div className="mt-8 w-full space-y-3">
          <Link
            to="/bazaar"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-soft"
          >
            View Product
          </Link>
          <button
            type="button"
            className="h-14 w-full rounded-2xl border-2 border-primary text-base font-semibold text-primary"
          >
            Share Product
          </button>
          <button
            type="button"
            onClick={onAnother}
            className="h-12 w-full text-sm font-semibold text-muted-foreground"
          >
            Add Another Product
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
