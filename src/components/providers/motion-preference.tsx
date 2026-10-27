"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "am-motion";
const CHANGE_EVENT = "am-motion-change";
const QUERY = "(prefers-reduced-motion: reduce)";

interface MotionPreference {
  // True when heavy motion (shader, smooth scroll, pinned scenes) should run
  enabled: boolean;
  // OS asked for reduced motion; the user can still opt back in
  systemReduced: boolean;
  toggle: () => void;
}

const MotionContext = createContext<MotionPreference>({
  enabled: false,
  systemReduced: false,
  toggle: () => {},
});

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    query.removeEventListener("change", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// Fallback when localStorage is blocked (private mode): the choice lasts for this visit
let memoryChoice: string | null = null;

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memoryChoice;
  } catch {
    return memoryChoice;
  }
}

// Encoded as one string so useSyncExternalStore can compare snapshots by value
function snapshot(): string {
  return `${window.matchMedia(QUERY).matches ? 1 : 0}:${readStored() ?? ""}`;
}

// The server renders the still version: start disabled, enable after hydration
const serverSnapshot = () => "ssr";

export function MotionPreferenceProvider({ children }: PropsWithChildren) {
  const state = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const hydrated = state !== "ssr";
  const [reducedFlag = "0", stored = ""] = state.split(":");
  const systemReduced = reducedFlag === "1";
  const enabled = hydrated && (stored ? stored === "on" : !systemReduced);

  const toggle = useCallback(() => {
    const next = enabled ? "off" : "on";
    memoryChoice = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Blocked storage: memoryChoice still carries the choice
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, [enabled]);

  return <MotionContext value={{ enabled, systemReduced, toggle }}>{children}</MotionContext>;
}

export function useMotionPreference(): MotionPreference {
  return useContext(MotionContext);
}
