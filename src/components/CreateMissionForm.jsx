import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
import { createMission, getTypes } from "./../services/api";

function CreateMissionForm() {
    const [name, setName] = useState("");
    const [typeId, setTypeId] = useState("");
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");
    const { isAuthenticated, userId, userRole } = useAuth();

    const navigate = useNavigate(); // 👈 Initialisation du hook de navigation

    useEffect(() => {
        const loadTypes = async () => {
            try {
                const data = await getTypes();
                console.log("Types récupérés:", data);
                setTypes(data);
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

        if (!isAuthenticated) {
            alert("Veuillez vous connecter avant de soumettre la mission.");
            return;
        }

        if (userRole !== "ROLE_COMPANY") {
            alert("Seules les entreprises peuvent créer des missions.");
            return;
        }

        if (!userId) {
            alert("Utilisateur non valide.");
            return;
        }

        try {
            await createMission({
                name,
                description,
                user: `/api/users/${userId}`,
                type: typeId,
            });

            alert("Mission créée avec succès !");
            navigate("/dashboard/company"); // ✅ Redirection après succès
        } catch (error) {
            if (error.response) {
                const errorDetails =
                    error.response.data["hydra:description"] ||
                    "Erreur inconnue";
                alert(
                    `Erreur lors de la création de la mission: ${errorDetails}`
                );
            } else {
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
                <label>Description :</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
