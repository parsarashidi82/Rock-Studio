import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import ScrollToTop from "./components/common/ScrollToTop";
import DataRain from "./components/ui/data-rain";
import { initImagePreloader } from "./lib/preloadImages";

function App() {
  const [particleCount, setParticleCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 320 : 750,
  );

  useEffect(() => {
    initImagePreloader();
    const updateCount = () => {
      setParticleCount(window.innerWidth < 768 ? 320 : 750);
    };
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
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
