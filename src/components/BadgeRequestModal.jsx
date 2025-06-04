import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createBadgeRequest, getSchools } from "../services/api";

function BadgeRequestModal({ onClose }) {
    const { userId } = useAuth();
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                setLoading(true);
                const schoolsData = await getSchools();
                setSchools(schoolsData);
            } catch (err) {
                console.error("Erreur lors du chargement des écoles:", err);
                setError("Impossible de charger la liste des écoles");
            } finally {
                setLoading(false);
            }
        };

        fetchSchools();
    }, []);

    // Nettoyer le timeout quand le composant se démonte
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleClose = () => {
        // Annuler le timeout s'il existe
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        // Rafraîchir le badge si la demande a été envoyée avec succès
        if (success && typeof window.refreshUserBadge === "function") {
            window.refreshUserBadge();
        }
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSchool) {
            setError("Veuillez sélectionner une école");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await createBadgeRequest(userId, {
                school: selectedSchool,
            });

            console.log("Réponse de la création de la demande:", response);
            setSuccess(true);

            // Programmer la fermeture automatique après 3 secondes
            timeoutRef.current = setTimeout(() => {
                if (typeof window.refreshUserBadge === "function") {
                    window.refreshUserBadge();
                }
                onClose();
            }, 3000);
        } catch (err) {
            console.error("Erreur lors de la demande de badge:", err);
            setError("Erreur lors de l'envoi de la demande de badge");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Demande de badge
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-green-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Demande envoyée avec succès
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Votre demande de badge a été envoyée à l'école. Vous
                            recevrez une notification lorsqu'elle sera traitée.
                        </p>
                        <button
                            onClick={handleClose}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                <p className="ml-4 text-gray-600">
                                    Chargement des écoles...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="school"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Choisissez votre école
                                    </label>
                                    <select
                                        id="school"
                                        value={selectedSchool}
                                        onChange={(e) =>
                                            setSelectedSchool(e.target.value)
                                        }
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">
                                            -- Sélectionnez une école --
                                        </option>
                                        {schools.map((school) => (
                                            <option
                                                key={school.id}
                                                value={`/api/users/${school.id}`}
                                            >
                                                {school.nameSchool ||
                                                    school.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md disabled:opacity-50"
                                    >
                                        {submitting
                                            ? "Envoi en cours..."
                                            : "Envoyer ma demande"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default BadgeRequestModal;
