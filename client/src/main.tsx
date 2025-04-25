import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set default language if not already set
if (!localStorage.getItem("lang")) {
  localStorage.setItem("lang", "en");
}

// Set the initial HTML direction based on stored language
const direction = localStorage.getItem("lang") === "ar" ? "rtl" : "ltr";
document.documentElement.dir = direction;
document.documentElement.lang = localStorage.getItem("lang") || "en";

createRoot(document.getElementById("root")!).render(<App />);
