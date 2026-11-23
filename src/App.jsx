import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import ScrollToTop from "./components/common/ScrollToTop";
import DataRain from "./components/ui/data-rain";
import { initImagePreloader } from "./lib/preloadImages";
import { useMobile } from "./hooks/useMobile";

/**
 * کامپوننت ریشه برنامه (App Root).
 * 
 * وظایف:
 * ۱. مقداردهی اولیه سیستم پیش‌بارگذاری هوشمند تصاویر (initImagePreloader)
 * ۲. تشخیص ابعاد صفحه با هوک اختصاصی useMobile جهت تنظیم هوشمند چگالی ذرات
 * ۳. رندر پس‌زمینه زنده ذرات باران داده (DataRain) در عمیق‌ترین لایه z-index
 * ۴. پیکربندی مسیرها (SPA Routing) بین صفحه اصلی و صفحات پروژه
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
      {/* Dynamic Background Data Rain strictly behind everything */}
      <DataRain className="-z-50" count={particleCount} flowSpeed={0.85} />
      <div className="relative z-10 isolate">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
