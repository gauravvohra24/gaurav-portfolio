import { lazy } from "react";

// Heavy, below-the-fold components ship as separate chunks. They're preloaded
// right after the first paint (see preloadDeferredChunks in main.jsx), so they're
// ready long before the visitor scrolls to them — the hero just doesn't wait.
const loaders = [];

export function lazyNamed(loader, name) {
  loaders.push(loader);
  return lazy(() => loader().then((m) => ({ default: m[name] })));
}

export function preloadDeferredChunks() {
  loaders.forEach((load) => load().catch(() => {}));
}
