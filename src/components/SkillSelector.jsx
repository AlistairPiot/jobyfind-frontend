import { useEffect, useState } from "react";
import { getSkillCategories, getSkillsByCategory } from "../services/api";

function SkillSelector({ selectedSkills, onSkillsChange }) {
    const [categories, setCategories] = useState([]);
    const [skillsByCategory, setSkillsByCategory] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingSkills, setLoadingSkills] = useState({});

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await getSkillCategories();
                setCategories(categoriesData);

                // Initialiser les skills par catégorie
                const initialSkills = {};
                categoriesData.forEach((category) => {
                    initialSkills[category.id] = [];
                });
                setSkillsByCategory(initialSkills);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des catégories:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const toggleCategory = async (categoryId) => {
        const isExpanded = expandedCategories[categoryId];

        if (!isExpanded && skillsByCategory[categoryId].length === 0) {
            // Charger les skills de cette catégorie
            setLoadingSkills((prev) => ({ ...prev, [categoryId]: true }));
            try {
                const skills = await getSkillsByCategory(categoryId);
                setSkillsByCategory((prev) => ({
                    ...prev,
                    [categoryId]: skills,
                }));
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des compétences:",
                    error
                );
                // Fallback: afficher un message d'erreur ou essayer une autre méthode
                setSkillsByCategory((prev) => ({
                    ...prev,
                    [categoryId]: [],
                }));
            } finally {
                setLoadingSkills((prev) => ({ ...prev, [categoryId]: false }));
            }
        }

        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !isExpanded,
        }));
    };

    const toggleSkill = (skill) => {
        const isSelected = selectedSkills.some((s) => s.id === skill.id);

        if (isSelected) {
            onSkillsChange(selectedSkills.filter((s) => s.id !== skill.id));
        } else {
            onSkillsChange([...selectedSkills, skill]);
        }
    };

    const removeSkill = (skillId) => {
        onSkillsChange(selectedSkills.filter((s) => s.id !== skillId));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">
                    Chargement des compétences...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Compétences sélectionnées */}
            {selectedSkills.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                        Compétences sélectionnées ({selectedSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                            <span
                                key={skill.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                                {skill.name}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill.id)}
                                    className="ml-2 hover:text-blue-600"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Catégories de compétences */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                    Sélectionner les compétences par catégorie
                </h4>
                {categories.map((category) => (
                    <div key={category.id} className="border rounded-lg">
                        <button
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <span className="font-medium text-gray-800">
                                    {category.name}
                                </span>
                                <span className="text-sm text-gray-600 block">
                                    {category.description}
                                </span>
                            </div>
                            <svg
                                className={`w-5 h-5 transition-transform ${
                                    expandedCategories[category.id]
                                        ? "rotate-180"
                                        : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {expandedCategories[category.id] && (
                            <div className="border-t bg-gray-50 p-4">
                                {loadingSkills[category.id] ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : skillsByCategory[category.id].length ===
                                  0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Aucune compétence dans cette catégorie
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {skillsByCategory[category.id].map(
                                            (skill) => {
                                                const isSelected =
                                                    selectedSkills.some(
                                                        (s) => s.id === skill.id
                                                    );
                                                return (
                                                    <label
                                                        key={skill.id}
                                                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                                                            isSelected
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                toggleSkill(
                                                                    skill
                                                                )
                                                            }
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            {skill.name}
                                                        </span>
                                                    </label>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkillSelector;
