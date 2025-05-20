import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App.js qui va contenir le routage
import { AuthProvider } from "./context/AuthContext"; // Import du provider pour l'authentification
import "./index.css"; // Import du CSS global

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
);
