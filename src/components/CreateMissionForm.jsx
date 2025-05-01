import React, { useEffect, useState } from "react";
import { useAuth } from "./../context/AuthContext"; // Assure-toi que tu as bien importé useAuth
import { createMission, getTypes } from "./../services/api";

function CreateMissionForm() {
    const [name, setName] = useState("");
    const [typeId, setTypeId] = useState("");
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, userId, userRole } = useAuth(); // Utilisation du hook correctement

    useEffect(() => {
        const loadTypes = async () => {
            try {
                const data = await getTypes();
                console.log("Types récupérés:", data); // Vérifie les données dans la console
                setTypes(data); // On assigne directement `data` ici, car il s'agit de la liste
            } catch (error) {
                console.error("Erreur lors du chargement des types:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification si l'utilisateur est authentifié
        if (!isAuthenticated) {
            console.error("Utilisateur non connecté");
            alert("Veuillez vous connecter avant de soumettre la mission.");
            return;
        }

        // Affiche le rôle utilisateur pour vérifier la valeur
        console.log("Rôle utilisateur:", userRole);

        // Vérification si l'utilisateur est une entreprise
        if (userRole !== "ROLE_COMPANY") {
            console.error("Rôle utilisateur non autorisé");
            alert("Seules les entreprises peuvent créer des missions.");
            return;
        }

        // Affiche l'objet `userId` pour vérifier son contenu
        console.log("Utilisateur connecté:", userId);

        // Vérifie si l'utilisateur a un ID avant de créer la mission
        if (!userId) {
            console.error("Utilisateur non valide");
            alert("Utilisateur non valide.");
            return;
        }

        try {
            // Créer une mission avec les données fournies
            const response = await createMission({
                name,
                user: `/api/users/${userId}`, // Utilise l'ID de l'utilisateur, pas son rôle
                type: typeId, // IRI déjà en valeur de select
            });

            console.log("Mission créée avec succès:", response); // Affiche la réponse de l'API dans la console
            alert("Mission créée avec succès !");
            setName("");
            setTypeId("");
        } catch (error) {
            if (error.response) {
                console.error(
                    "Erreur lors de la création de la mission:",
                    error.response.data
                );
                console.error("Statut:", error.response.status);
                console.error("Headers:", error.response.headers);

                // Affiche les erreurs spécifiques renvoyées par l'API
                const errorDetails =
                    error.response.data["hydra:description"] ||
                    "Erreur inconnue";
                alert(
                    `Erreur lors de la création de la mission: ${errorDetails}`
                );
            } else {
                console.error("Erreur inconnue:", error);
                alert("Erreur inconnue lors de la création de la mission.");
            }
        }
    };

    if (loading) return <p>Chargement des types...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nom de la mission :</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Type :</label>
                <select
                    value={typeId}
                    onChange={(e) => setTypeId(e.target.value)}
                    required
                >
                    <option value="">-- Sélectionnez un type --</option>
                    {types.map((type) => (
                        <option key={type["@id"]} value={type["@id"]}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit">Créer la mission</button>
        </form>
    );
}

export default CreateMissionForm;
