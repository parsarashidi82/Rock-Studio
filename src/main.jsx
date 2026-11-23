import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/**
 * نقطه ورود اصلی برنامه React و سوار شدن روی ریشه DOM (#root).
 */
createRoot(document.getElementById("root")).render(<App />);
