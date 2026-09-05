import type { LanguageCode } from "./i18n";

/**
 * Demo AI layer (Shreni AI).
 * Deterministic, simulated responses so the flow can be demonstrated without
 * a model connected. The shape mirrors a real API response so the calls can be
 * swapped for server functions later.
 */

export interface CatalogResult {
  title: string;
  description: string;
  category: string;
  craftType: string;
  tags: string[];
  suggestedPrice: number;
  priceRange: [number, number];
  detectedLanguage: string;
  transcript: string;
  translation: string;
}

export const VOICE_SAMPLES: Record<string, { transcript: string; language: string }> = {
  mr: {
    transcript:
      "ही माझ्या हाताने विणलेली पैठणी शैलीतील पारंपरिक साडी आहे, शुद्ध रेशीम आणि सोनेरी जरी वापरून तयार केली आहे.",
    language: "Marathi (मराठी)",
  },
  hi: {
    transcript:
      "यह मेरे हाथ से बनाया गया टेराकोटा दीपक है, नदी की मिट्टी से चाक पर बनाया गया है।",
    language: "Hindi (हिंदी)",
  },
  en: {
    transcript:
      "This is a handmade Paithani-inspired traditional textile created using pure silk and gold zari on a pit loom.",
    language: "English",
  },
};

export function detectSample(lang: LanguageCode | null) {
  const key = lang && VOICE_SAMPLES[lang] ? lang : "en";
  return VOICE_SAMPLES[key] ?? VOICE_SAMPLES["en"]!;
}

export function generateCatalog(lang: LanguageCode | null): CatalogResult {
  const sample = detectSample(lang);
  return {
    detectedLanguage: sample.language,
    transcript: sample.transcript,
    translation:
      "This is a traditional handwoven textile made by hand using pure silk and gold zari thread.",
    title: "Handcrafted Traditional Maharashtrian Textile",
    description:
      "A traditional handwoven textile crafted on a pit loom using pure silk and fine gold zari. Every motif on the border is woven thread by thread, without any machine work, following a technique carried through generations of weavers. The deep lustrous body and ornate border make it suitable for weddings, festivals and heirloom gifting.",
    category: "Handwoven Textiles",
    craftType: "Traditional Handloom",
    tags: ["Handmade", "Traditional", "Indian Craft", "Handwoven", "Silk"],
    suggestedPrice: 2499,
    priceRange: [2200, 2800],
  };
}

export const PRICE_FACTORS = [
  { label: "Craft complexity", value: "High", weight: 92 },
  { label: "Material", value: "Pure silk & zari", weight: 84 },
  { label: "Time required", value: "18–20 days", weight: 78 },
  { label: "Product uniqueness", value: "Rare", weight: 88 },
  { label: "Category", value: "Handwoven Textiles", weight: 70 },
  { label: "Market demand", value: "Rising", weight: 81 },
];

export const ENHANCEMENT_STEPS = [
  "Removing background",
  "Improving lighting",
  "Improving sharpness",
  "Cleaning image",
  "Enhancing colours",
  "Improving product visibility",
  "Creating marketplace-ready image",
];

const REPLY_TEMPLATES: Record<string, string> = {
  size: "Namaste! Yes, we can check availability for another size. Please tell us the size you are looking for and we will confirm within a day.",
  bulk: "Namaste! Thank you for your interest. Bulk orders are welcome — for 20 pieces we would need about 12 days. Shall we share a quotation?",
  default:
    "Namaste! Thank you for reaching out. Each piece is made by hand in our workshop, and we are happy to help with any detail you need before ordering.",
};

export function generateReply(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("size")) return REPLY_TEMPLATES["size"]!;
  if (lower.includes("20") || lower.includes("bulk") || lower.includes("corporate"))
    return REPLY_TEMPLATES["bulk"]!;
  return REPLY_TEMPLATES["default"]!;
}

export const CHAT_PROMPTS = [
  "Create a product description",
  "Suggest a price",
  "Translate my product",
  "How can I sell more?",
  "Reply to this customer",
  "Improve my product title",
  "Which products are popular?",
  "Help me list this product",
];

export function chatAnswer(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("price"))
    return "For a handwoven silk piece of this quality I suggest **₹2,499**, with a fair range of ₹2,200–₹2,800. Buyers in metro cities pay more for verified handloom, so do not price below ₹2,200.";
  if (p.includes("translate"))
    return "I can publish your listing in English, हिंदी and मराठी together. Buyers see it in their own language, and your voice note stays the original source.";
  if (p.includes("sell more"))
    return "Three things help most:\n1. Add 3–4 photos per product, including one in use.\n2. Reply to inquiries within a day — buyers order 3x more often.\n3. List festive sets before Diwali; demand for diyas and décor rises sharply.";
  if (p.includes("title"))
    return 'A stronger title: **"Handcrafted Paithani Silk Saree with Gold Zari Peacock Border"** — it names the craft, the material and the motif, which is what buyers search for.';
  if (p.includes("popular"))
    return "Right now your Oxidised Silver Jhumka (73 orders) and Terracotta Diya Set (41 orders) lead. Jewelry and festive pottery are your strongest categories this season.";
  if (p.includes("customer") || p.includes("reply"))
    return 'Here is a polite reply you can send:\n\n"Namaste! Yes, we can check availability for another size. Please tell us the size you are looking for."';
  if (p.includes("description"))
    return "Tell me the craft, the material and roughly how long it took. I will write a warm, culturally accurate description in your language and in English.";
  return "I can help you write listings, set fair prices, translate your products and answer buyers. Tell me what you are making today.";
}
