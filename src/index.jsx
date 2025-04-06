import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App.js qui va contenir le routage

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
