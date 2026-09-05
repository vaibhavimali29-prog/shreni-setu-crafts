export type LanguageCode =
  | "en"
  | "hi"
  | "mr"
  | "bn"
  | "ta"
  | "te"
  | "gu"
  | "kn"
  | "ml"
  | "pa"
  | "ur";

export interface LanguageOption {
  code: LanguageCode;
  native: string;
  english: string;
  script: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", native: "English", english: "English", script: "Aa" },
  { code: "hi", native: "हिंदी", english: "Hindi", script: "अ" },
  { code: "mr", native: "मराठी", english: "Marathi", script: "म" },
  { code: "bn", native: "বাংলা", english: "Bengali", script: "ব" },
  { code: "ta", native: "தமிழ்", english: "Tamil", script: "த" },
  { code: "te", native: "తెలుగు", english: "Telugu", script: "తె" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", script: "ગ" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", script: "ಕ" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", script: "മ" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", script: "ਪ" },
  { code: "ur", native: "اردو", english: "Urdu", script: "ا" },
];

type Dict = Record<string, string>;

/** Small curated dictionary for the most visible strings. */
const strings: Record<string, Dict> = {
  greeting: {
    en: "Namaste, {name}",
    hi: "नमस्ते, {name}",
    mr: "नमस्कार, {name}",
    bn: "নমস্কার, {name}",
    ta: "வணக்கம், {name}",
    te: "నమస్కారం, {name}",
    gu: "નમસ્તે, {name}",
    kn: "ನಮಸ್ಕಾರ, {name}",
    ml: "നമസ്കാരം, {name}",
    pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, {name}",
    ur: "السلام علیکم، {name}",
  },
  greetingSub: {
    en: "Let's take your craft to a bigger market.",
    hi: "आइए आपकी कला को बड़े बाज़ार तक ले चलें।",
    mr: "चला, तुमची कला मोठ्या बाजारपेठेत नेऊया.",
    bn: "চলুন আপনার শিল্পকে বড় বাজারে নিয়ে যাই।",
    ta: "உங்கள் கைவினையை பெரிய சந்தைக்கு கொண்டு செல்வோம்.",
    te: "మీ కళను పెద్ద మార్కెట్‌కు తీసుకెళ్దాం.",
    gu: "ચાલો તમારી કલાને મોટા બજારમાં લઈ જઈએ.",
    kn: "ನಿಮ್ಮ ಕಲೆಯನ್ನು ದೊಡ್ಡ ಮಾರುಕಟ್ಟೆಗೆ ಕೊಂಡೊಯ್ಯೋಣ.",
    ml: "നിങ്ങളുടെ കരകൗശലം വലിയ വിപണിയിലേക്ക് കൊണ്ടുപോകാം.",
    pa: "ਆਓ ਤੁਹਾਡੀ ਕਲਾ ਨੂੰ ਵੱਡੇ ਬਾਜ਼ਾਰ ਤੱਕ ਲੈ ਚੱਲੀਏ।",
    ur: "آئیے آپ کے ہنر کو بڑی منڈی تک لے چلیں۔",
  },
  addProduct: {
    en: "Add Product",
    hi: "उत्पाद जोड़ें",
    mr: "उत्पादन जोडा",
    bn: "পণ্য যোগ করুন",
    ta: "தயாரிப்பு சேர்",
    te: "ఉత్పత్తిని జోడించండి",
    gu: "ઉત્પાદન ઉમેરો",
    kn: "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
    ml: "ഉൽപ്പന്നം ചേർക്കുക",
    pa: "ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ",
    ur: "پروڈکٹ شامل کریں",
  },
  products: {
    en: "Products",
    hi: "उत्पाद",
    mr: "उत्पादने",
    bn: "পণ্য",
    ta: "தயாரிப்புகள்",
    te: "ఉత్పత్తులు",
    gu: "ઉત્પાદનો",
    kn: "ಉತ್ಪನ್ನಗಳು",
    ml: "ഉൽപ്പന്നങ്ങൾ",
    pa: "ਉਤਪਾਦ",
    ur: "مصنوعات",
  },
  orders: {
    en: "Your Orders",
    hi: "आपके ऑर्डर",
    mr: "तुमच्या ऑर्डर",
    bn: "আপনার অর্ডার",
    ta: "உங்கள் ஆர்டர்கள்",
    te: "మీ ఆర్డర్లు",
    gu: "તમારા ઓર્ડર",
    kn: "ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳು",
    ml: "നിങ്ങളുടെ ഓർഡറുകൾ",
    pa: "ਤੁਹਾਡੇ ਆਰਡਰ",
    ur: "آپ کے آرڈر",
  },
  inquiry: {
    en: "Inquiry",
    hi: "पूछताछ",
    mr: "चौकशी",
    bn: "জিজ্ঞাসা",
    ta: "விசாரணை",
    te: "విచారణ",
    gu: "પૂછપરછ",
    kn: "ವಿಚಾರಣೆ",
    ml: "അന്വേഷണം",
    pa: "ਪੁੱਛਗਿੱਛ",
    ur: "استفسار",
  },
};

export function t(key: string, lang: LanguageCode, vars?: Record<string, string>) {
  const entry = strings[key];
  let value = entry?.[lang] ?? entry?.en ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) value = value.replace(`{${k}}`, v);
  }
  return value;
}

export function languageLabel(code: LanguageCode) {
  return LANGUAGES.find((l) => l.code === code)?.native ?? "English";
}
