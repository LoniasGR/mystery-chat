import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root.tsx";

import "@fontsource/barlow/400.css";
import "@fontsource/barlow/700.css";
import "@fontsource/barlow/400-italic.css";
import "@fontsource/barlow/700-italic.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
