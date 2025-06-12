import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
import { createMission, getTypes } from "./../services/api";
import SkillSelector from "./SkillSelector";

function CreateMissionForm() {
    const [name, setName] = useState("");
    const [typeId, setTypeId] = useState("");
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const { isAuthenticated, userId, userRole } = useAuth();

    const navigate = useNavigate();

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
        setSubmitting(true);

        if (!isAuthenticated) {
            alert("Veuillez vous connecter avant de soumettre la mission.");
            setSubmitting(false);
            return;
        }

        if (userRole !== "ROLE_COMPANY") {
            alert("Seules les entreprises peuvent créer des missions.");
            setSubmitting(false);
            return;
        }

        if (!userId) {
            alert("Utilisateur non valide.");
            setSubmitting(false);
            return;
        }

        if (!typeId) {
            alert("Veuillez sélectionner un type de mission.");
            setSubmitting(false);
            return;
        }

        try {
            // Préparer les skills pour l'API (format IRI)
            const skillsIRI = selectedSkills.map(
                (skill) => `/api/skills/${skill.id}`
            );

            // Affiche les données avant envoi pour le débogage
            console.log("Données envoyées à l'API:", {
                name,
                description,
                user: `/api/users/${userId}`,
                type: typeId,
                skills: skillsIRI,
            });

            // Création de la mission
            await createMission({
                name,
                description,
                user: `/api/users/${userId}`,
                type: typeId,
                skills: skillsIRI,
            });

            alert("Mission créée avec succès !");
            navigate("/dashboard/company");
        } catch (error) {
            console.error("Erreur détaillée:", error);

            if (error.response) {
                const errorDetails =
                    error.response.data["hydra:description"] ||
                    error.response.data.detail ||
                    error.response.statusText ||
                    "Erreur inconnue";
                alert(
                    `Erreur lors de la création de la mission: ${errorDetails}`
                );
            } else {
                alert(
                    "Erreur de connexion au serveur. Veuillez vérifier votre connexion internet."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">Chargement des types...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nom de la mission
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Titre de la mission"
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="6"
                        placeholder="Décrivez les détails de la mission"
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Type de mission
                    </label>
                    <select
                        id="type"
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                        <option value="">-- Sélectionnez un type --</option>
                        {types.map((type) => (
                            <option key={type["@id"]} value={type["@id"]}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compétences requises pour la mission
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4">
                        <SkillSelector
                            selectedSkills={selectedSkills}
                            onSkillsChange={setSelectedSkills}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Sélectionnez les compétences nécessaires pour cette
                        mission. Les candidats pourront voir ces exigences.
                    </p>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md disabled:opacity-50"
                >
                    {submitting ? "Création en cours..." : "Créer la mission"}
                </button>
            </div>
        </form>
    );
}

export default CreateMissionForm;
