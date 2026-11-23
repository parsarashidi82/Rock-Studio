import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./components/common/ScrollToTop";
import DataRain from "./components/ui/data-rain";
import { initImagePreloader } from "./lib/preloadImages";
import { useMobile } from "./hooks/useMobile";

// بارگذاری تنبل و کد-اسپلیتینگ صفحه کیس‌استادی برای کاهش حجم باندل اولیه صفحه اصلی
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));

/**
 * کامپوننت ریشه برنامه (App Root).
 * 
 * بهینه‌سازی‌ها و وظایف:
 * ۱. بارگذاری تنبل (Lazy Loading) صفحه جزئیات پروژه‌ها جهت بهینه‌سازی حجم بارگذاری اولیه (FCP)
 * ۲. مقداردهی اولیه سیستم پیش‌بارگذاری هوشمند تصاویر در پس‌زمینه (initImagePreloader)
 * ۳. تشخیص ابعاد صفحه با هوک اختصاصی useMobile جهت تنظیم هوشمند چگالی ذرات
 * ۴. رندر پس‌زمینه زنده ذرات باران داده (DataRain) در عمیق‌ترین لایه z-index
 * ۵. پیکربندی مسیرها (SPA Routing) بین صفحه اصلی و صفحات پروژه
 */
function App() {
  const isMobile = useMobile(768);
  const particleCount = isMobile ? 320 : 750;

  useEffect(() => {
    initImagePreloader();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* باران متحرک پس‌زمینه دقیقاً در عمیق‌ترین لایه پشت تمام المان‌ها */}
      <DataRain className="-z-50" count={particleCount} flowSpeed={0.85} />
      <div className="relative z-10 isolate">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
