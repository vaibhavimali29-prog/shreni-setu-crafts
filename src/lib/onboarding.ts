import type { LanguageCode } from "./i18n";

/**
 * Onboarding / artisan verification model.
 *
 * Backend-ready shape: every step below maps to one server-side resource that a
 * real deployment would persist against the existing artisan profile record.
 * No Aadhaar number, Aadhaar image, biometric sample, OTP or raw identity
 * document is ever kept here — only the *result* of a verification performed by
 * an authorised provider (demo-simulated in this prototype).
 */

export const ONBOARDING_STEPS = [
  { key: "account", label: "Account" },
  { key: "profile", label: "Basic Profile" },
  { key: "identity", label: "Identity" },
  { key: "documents", label: "Documents" },
  { key: "craft", label: "Craft" },
  { key: "portfolio", label: "Portfolio" },
  { key: "process", label: "Process" },
] as const;

export type OnboardingStepKey = (typeof ONBOARDING_STEPS)[number]["key"];

export interface BasicProfile {
  fullName: string;
  artistName: string;
  dob: string;
  location: string;
  language: LanguageCode | "";
  photo: string; // data URL / object URL for the demo only
  about: string;
}

export interface IdentityResult {
  /** "aadhaar-otp" | "aadhaar-biometric" — the method the authorised provider used. */
  method: "" | "aadhaar-otp" | "aadhaar-biometric";
  status: "" | "verified" | "failed";
  /** Opaque reference returned by the provider. Never an Aadhaar number. */
  reference: string;
  verifiedAt: string;
}

export interface DocumentSubmission {
  skipped: boolean;
  fileName: string;
  preview: string;
  docType: string;
  checks: string[];
}

export interface CraftProfile {
  category: string;
  years: string;
  learnedFrom: string;
  materials: string;
  description: string;
}

export interface ArtworkEntry {
  id: string;
  title: string;
  craftType: string;
  description: string;
  materials: string;
  preview: string;
  kind: "photo" | "video";
}

export interface ProcessEvidence {
  making: string[];
  workspace: string[];
  tools: string[];
  materials: string[];
  voiceNote: string;
}

export type VerificationStatus =
  | "not-started"
  | "evidence-received"
  | "under-review"
  | "more-info-required"
  | "completed";

export interface OnboardingState {
  stepIndex: number;
  completedSteps: OnboardingStepKey[];
  account: { identifier: string; channel: "mobile" | "email" | ""; verified: boolean };
  profile: BasicProfile;
  identity: IdentityResult;
  documents: DocumentSubmission;
  craft: CraftProfile;
  portfolio: ArtworkEntry[];
  process: ProcessEvidence;
  verificationStatus: VerificationStatus;
}

export const emptyOnboarding: OnboardingState = {
  stepIndex: 0,
  completedSteps: [],
  account: { identifier: "", channel: "", verified: false },
  profile: { fullName: "", artistName: "", dob: "", location: "", language: "", photo: "", about: "" },
  identity: { method: "", status: "", reference: "", verifiedAt: "" },
  documents: { skipped: false, fileName: "", preview: "", docType: "", checks: [] },
  craft: { category: "", years: "", learnedFrom: "", materials: "", description: "" },
  portfolio: [],
  process: { making: [], workspace: [], tools: [], materials: [], voiceNote: "" },
  verificationStatus: "not-started",
};

export const CRAFT_CATEGORIES = [
  "Painting",
  "Pottery",
  "Weaving",
  "Jewellery",
  "Woodwork",
  "Embroidery",
  "Sculpture",
  "Metalwork",
  "Bamboo craft",
  "Textile",
  "Other",
];

export const LEARNED_OPTIONS = [
  "Family tradition",
  "Guru / master artisan",
  "Cluster or SHG training",
  "Institute or course",
  "Self taught",
];

/** Simulated signals an authorised backend pipeline would return. */
export const DOCUMENT_CHECKS = [
  "Image quality check",
  "OCR text extraction",
  "Document type identification",
  "Name match with profile",
  "Manipulation signals",
  "Issuer verification (where available)",
];

export const PORTFOLIO_SIGNALS = [
  "Duplicate / reused image check",
  "Portfolio consistency",
  "Image manipulation signals",
  "AI-generated image signals",
  "Craft-to-artwork consistency",
];

/** Demo voice transcript used by Shreni Vani in the craft step. */
export const CRAFT_VOICE_SAMPLE =
  "मी गेली अठरा वर्षे यौला येथे पैठणी साड्या हातमागावर विणते. रेशीम आणि जरी वापरते, आणि हे काम माझ्या आईकडून शिकले.";

export function structureCraftFromVoice(): Partial<CraftProfile> {
  return {
    category: "Weaving",
    years: "18",
    learnedFrom: "Family tradition",
    materials: "Pure silk yarn, zari thread, natural dyes, pit handloom",
    description:
      "Handloom Paithani weaver from Yeola, Maharashtra with 18 years at the pit loom. Works in pure silk with zari borders and traditional motifs, learnt from her mother and now weaving sarees on order.",
  };
}
