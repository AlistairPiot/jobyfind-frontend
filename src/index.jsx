import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SkillTest from "./SkillTest.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* <App /> */}
        <SkillTest />
    </StrictMode>
);
