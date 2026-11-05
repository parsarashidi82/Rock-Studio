import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import ScrollToTop from "./components/common/ScrollToTop";
import DataRain from "./components/ui/data-rain";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Dynamic Background Data Rain strictly behind everything */}
      <DataRain className="-z-50" count={750} flowSpeed={0.85} />
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
