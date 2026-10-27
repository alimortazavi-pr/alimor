const EVENT = "am-open-palette";

export function openPalette() {
  window.dispatchEvent(new Event(EVENT));
}

export function onOpenPalette(handler: () => void): () => void {
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
