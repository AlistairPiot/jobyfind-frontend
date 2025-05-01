import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App.js qui va contenir le routage
import { AuthProvider } from "./context/AuthContext"; // Import du provider pour l'authentification

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
);
