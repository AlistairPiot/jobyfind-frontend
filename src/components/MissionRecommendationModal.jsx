import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSchoolStudents, recommendMission } from "../services/api";

function MissionRecommendationModal({ isOpen, onClose, mission }) {
    const { userId } = useAuth();
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const timeoutRef = useRef(null);

    // Charger les étudiants badgés par l'école
    useEffect(() => {
        if (isOpen && userId) {
            loadStudents();
        }
    }, [isOpen, userId]);

    // Nettoyer le timeout au démontage
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const studentsData = await getSchoolStudents(userId);
            setStudents(studentsData);
        } catch (error) {
            console.error("Erreur lors du chargement des étudiants:", error);
            setMessage({
                type: "error",
                text: "Erreur lors du chargement des étudiants",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStudentToggle = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map((s) => s.id));
        }
    };

    const handleSubmit = async () => {
        if (selectedStudents.length === 0) {
            setMessage({
                type: "error",
                text: "Veuillez sélectionner au moins un étudiant",
            });
            return;
        }

        setSubmitting(true);
        try {
            const result = await recommendMission(
                mission.id,
                userId,
                selectedStudents
            );

            setMessage({
                type: "success",
                text: `${result.created} recommandation(s) créée(s) avec succès !`,
            });

            setSelectedStudents([]);

            // Fermer automatiquement après 2 secondes
            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, 2000);

            // Rafraîchir la liste des recommandations si disponible
            if (window.refreshSchoolRecommendations) {
                window.refreshSchoolRecommendations();
            }
        } catch (error) {
            console.error("Erreur lors de la recommandation:", error);
            setMessage({
                type: "error",
                text: "Erreur lors de la recommandation",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setSelectedStudents([]);
        setMessage({ type: "", text: "" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* En-tête */}
                <div className="border-b p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Recommander la mission
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {mission && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                            <h3 className="font-medium text-blue-800">
                                {mission.name}
                            </h3>
                            {mission.user?.nameCompany && (
                                <p className="text-sm text-blue-600 mt-1">
                                    {mission.user.nameCompany}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Contenu */}
                <div className="p-6 overflow-y-auto max-h-96">
                    {/* Message de retour */}
                    {message.text && (
                        <div
                            className={`mb-4 p-3 rounded ${
                                message.type === "success"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                            <p className="ml-4 text-gray-600">
                                Chargement des étudiants...
                            </p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                Aucun étudiant badgé trouvé.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Seuls les étudiants que vous avez badgés peuvent
                                recevoir des recommandations.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Sélectionner les étudiants (
                                    {students.length})
                                </h3>
                                <button
                                    onClick={handleSelectAll}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    {selectedStudents.length === students.length
                                        ? "Tout désélectionner"
                                        : "Tout sélectionner"}
                                </button>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                        onClick={() =>
                                            handleStudentToggle(student.id)
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(
                                                student.id
                                            )}
                                            onChange={() =>
                                                handleStudentToggle(student.id)
                                            }
                                            className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">
                                                {student.first_name &&
                                                student.last_name
                                                    ? `${student.first_name} ${student.last_name}`
                                                    : student.email}
                                            </p>
                                            {student.first_name &&
                                                student.last_name && (
                                                    <p className="text-sm text-gray-600">
                                                        {student.email}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedStudents.length > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 rounded">
                                    <p className="text-sm text-blue-700">
                                        {selectedStudents.length} étudiant(s)
                                        sélectionné(s)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pied de page */}
                <div className="border-t p-6 flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={submitting}
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={
                            submitting ||
                            selectedStudents.length === 0 ||
                            students.length === 0
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <svg
                                    className="inline-block animate-spin h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Recommandation...
                            </>
                        ) : (
                            `Recommander à ${selectedStudents.length} étudiant(s)`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MissionRecommendationModal;
