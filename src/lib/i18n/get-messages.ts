import "server-only";
import type { Locale } from "./config";

const messages = {
  en: () => import("../../../messages/en.json").then((m) => m.default),
  ar: () => import("../../../messages/ar.json").then((m) => m.default),
} as const;

export async function getMessages(locale: Locale) {
  return messages[locale]();
}
