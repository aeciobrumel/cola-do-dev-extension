import { Snippet } from "./types";

const STORAGE_KEY = "cola-do-dev.snippets";
const FALLBACK_KEY = "cola-do-dev.fallback-snippets";

function hasChromeStorage(): boolean {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

function readFallbackStorage(): Snippet[] | null {
  const raw = localStorage.getItem(FALLBACK_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Snippet[]) : null;
  } catch {
    return null;
  }
}

function writeFallbackStorage(snippets: Snippet[]): void {
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(snippets));
}

export function getStoredSnippets(): Promise<Snippet[] | null> {
  if (!hasChromeStorage()) {
    return Promise.resolve(readFallbackStorage());
  }

  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      const stored: unknown = result[STORAGE_KEY];
      resolve(Array.isArray(stored) ? (stored as Snippet[]) : null);
    });
  });
}

export function setStoredSnippets(snippets: Snippet[]): Promise<void> {
  if (!hasChromeStorage()) {
    writeFallbackStorage(snippets);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: snippets }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve();
    });
  });
}
