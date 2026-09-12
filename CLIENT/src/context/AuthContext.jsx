import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:8000/api";

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [vendeuse, setVendeuse] = useState(() => {
        const vendeuseStockee = localStorage.getItem("vendeuse");
        return vendeuseStockee ? JSON.parse(vendeuseStockee) : null;
    });
    const chargement = false;

    const login = async (email, mot_de_passe) => {
        const reponse = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, mot_de_passe }),
        });

        const donnees = await reponse.json();

        if (!reponse.ok) {
            throw new Error(donnees.message || "Erreur de connexion.");
        }

        // stockage du jwt
        localStorage.setItem("token", donnees.token);
        localStorage.setItem("vendeuse", JSON.stringify(donnees.vendeuse));

        setToken(donnees.token);
        setVendeuse(donnees.vendeuse);

        return donnees.vendeuse;
    };

    const register = async (nom, email, mot_de_passe) => {
        const reponse = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, email, mot_de_passe }),
        });

        const donnees = await reponse.json();

        if (!reponse.ok) {
            throw new Error(donnees.message || "Erreur lors de l'inscription.");
        }

        localStorage.setItem("token", donnees.token);
        localStorage.setItem("vendeuse", JSON.stringify(donnees.vendeuse));

        setToken(donnees.token);
        setVendeuse(donnees.vendeuse);

        return donnees.vendeuse;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("vendeuse");
        setToken(null);
        setVendeuse(null);
    };

    return (
        <AuthContext.Provider
            value={{ vendeuse, token, login, register, logout, estConnectee: Boolean(token), chargement }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("error: useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};