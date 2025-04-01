import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SignUpForm from "./SignUpForm.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* <App /> */}
        {/* <SkillTest /> */}
        <SignUpForm />
    </StrictMode>
);
