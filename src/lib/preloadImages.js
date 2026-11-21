import { projects } from "@/data/projects";

/**
 * Preload all project thumbnails and scroll previews in the background
 * during idle moments so when user scrolls to Selected Work or clicks a project,
 * all images are already cached in browser memory (0ms render time).
 */
export function initImagePreloader() {
  if (typeof window === "undefined") return;

  const runPreload = () => {
    // Collect all unique image URLs
    const urls = new Set();
    projects.forEach((p) => {
      if (p.image) urls.add(p.image);
      if (p.scrollImage) urls.add(p.scrollImage);
    });

    urls.forEach((url) => {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
    });
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(runPreload, { timeout: 1500 });
  } else {
    setTimeout(runPreload, 300);
  }
}
