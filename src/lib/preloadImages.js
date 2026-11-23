import { projects } from "@/data/projects";

/**
 * سیستم پیش‌بارگذاری هوشمند تصاویر در پس‌زمینه (Image Preloader).
 * 
 * تمام تصاویر بندانگشتی و پیش‌نمایش‌های اسکرول را در زمان بی‌کاری مرورگر (requestIdleCallback)
 * پیشاپیش در کش رم بارگذاری می‌کند تا وقتی کاربر به سکشن کارهای برگزیده می‌رسد یا روی پروژه‌ای کلیک می‌کند،
 * تصاویر با سرعت صفر میلی‌ثانیه و بدون معطلی رندر شوند.
 */
export function initImagePreloader() {
  if (typeof window === "undefined") return;

  const runPreload = () => {
    // جمع‌آوری آدرس‌های منحصر‌به‌فرد تصاویر کاور و اسکرول
    const urls = new Set();
    projects.forEach((p) => {
      if (p.image) urls.add(p.image);
      if (p.scrollImage) urls.add(p.scrollImage);
    });

    // بارگذاری ناهمگام هر تصویر در کش مرورگر
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
