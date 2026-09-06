import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LanguageCode } from "./i18n";
import {
  artisan as defaultArtisan,
  inquiries as seedInquiries,
  orders as seedOrders,
  products as seedProducts,
} from "./data";
import type { Inquiry, Order, Product } from "./data";
import { emptyOnboarding } from "./onboarding";
import type { OnboardingState, OnboardingStepKey } from "./onboarding";

const STORAGE_KEY = "shrenikart.session.v1";

interface SessionState {
  language: LanguageCode | null;
  authenticated: boolean;
  onboarded: boolean;
  verifiedName: string;
  onboarding: OnboardingState;
}

interface StoreValue extends SessionState {
  ready: boolean;
  artisan: typeof defaultArtisan;
  products: Product[];
  orders: Order[];
  inquiries: Inquiry[];
  setLanguage: (code: LanguageCode) => void;
  signIn: (name?: string) => void;
  signOut: () => void;
  completeOnboarding: () => void;
  updateOnboarding: (patch: Partial<OnboardingState>) => void;
  completeStep: (key: OnboardingStepKey, nextIndex: number) => void;
  addProduct: (product: Product) => void;
  replyToInquiry: (id: string, text: string) => void;
  advanceOrder: (id: string) => void;
}

const defaultSession: SessionState = {
  language: null,
  authenticated: false,
  onboarded: false,
  verifiedName: defaultArtisan.name,
  onboarding: emptyOnboarding,
};

const StoreContext = createContext<StoreValue | null>(null);

const ORDER_FLOW: Order["status"][] = ["New", "Confirmed", "Preparing", "Shipped", "Delivered"];


export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(defaultSession);
  const [ready, setReady] = useState(false);
  const [productList, setProductList] = useState<Product[]>(seedProducts);
  const [orderList, setOrderList] = useState<Order[]>(seedOrders);
  const [inquiryList, setInquiryList] = useState<Inquiry[]>(seedInquiries);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SessionState>;
        setSession({
          ...defaultSession,
          ...parsed,
          onboarding: { ...emptyOnboarding, ...(parsed.onboarding ?? {}) },
        });
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: SessionState) => {
    setSession(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ...session,
      ready,
      artisan: {
        ...defaultArtisan,
        name: session.onboarding.profile.fullName || session.verifiedName,
        craftCategory: session.onboarding.craft.category || defaultArtisan.craftCategory,
        region: session.onboarding.profile.location || defaultArtisan.region,
      },
      products: productList,
      orders: orderList,
      inquiries: inquiryList,
      setLanguage: (code) => persist({ ...session, language: code }),
      signIn: (name) =>
        persist({ ...session, authenticated: true, verifiedName: name || session.verifiedName }),
      signOut: () => persist({ ...defaultSession, language: session.language }),
      completeOnboarding: () => persist({ ...session, onboarded: true }),
      updateOnboarding: (patch) =>
        persist({ ...session, onboarding: { ...session.onboarding, ...patch } }),
      completeStep: (key, nextIndex) =>
        persist({
          ...session,
          onboarding: {
            ...session.onboarding,
            stepIndex: nextIndex,
            completedSteps: session.onboarding.completedSteps.includes(key)
              ? session.onboarding.completedSteps
              : [...session.onboarding.completedSteps, key],
          },
        }),

      addProduct: (product) => setProductList((prev) => [product, ...prev]),
      replyToInquiry: (id, text) =>
        setInquiryList((prev) =>
          prev.map((q) =>
            q.id === id
              ? {
                  ...q,
                  unread: false,
                  status: "answered",
                  messages: [
                    ...q.messages,
                    {
                      from: "artisan" as const,
                      text,
                      time: new Date().toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "2-digit",
                      }),
                    },
                  ],
                }
              : q,
          ),
        ),
      advanceOrder: (id) =>
        setOrderList((prev) =>
          prev.map((o) => {
            if (o.id !== id) return o;
            const next = ORDER_FLOW[Math.min(ORDER_FLOW.indexOf(o.status) + 1, 4)];
            return { ...o, status: next ?? o.status };
          }),
        ),
    }),
    [session, ready, productList, orderList, inquiryList, persist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
