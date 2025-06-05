import { useCallback, useState } from "react";

const useValidation = () => {
    const [errors, setErrors] = useState({});

    // Règles de validation correspondant aux contraintes backend
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            maxLength: 255,
            pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            messages: {
                required: "Le prénom est obligatoire.",
                minLength: "Le prénom doit contenir au moins 2 caractères.",
                maxLength: "Le prénom ne peut pas dépasser 255 caractères.",
                pattern:
                    "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets.",
            },
        },
        lastName: {
            required: true,
            minLength: 2,
            maxLength: 255,
            pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            messages: {
                required: "Le nom de famille est obligatoire.",
                minLength:
                    "Le nom de famille doit contenir au moins 2 caractères.",
                maxLength:
                    "Le nom de famille ne peut pas dépasser 255 caractères.",
                pattern:
                    "Le nom de famille ne peut contenir que des lettres, espaces, apostrophes et tirets.",
            },
        },
        email: {
            required: true,
            maxLength: 180,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            messages: {
                required: "L'adresse email est obligatoire.",
                maxLength:
                    "L'adresse email ne peut pas dépasser 180 caractères.",
                pattern: "L'adresse email n'est pas valide.",
            },
        },
        nameCompany: {
            required: false,
            maxLength: 255,
            messages: {
                maxLength:
                    "Le nom de l'entreprise ne peut pas dépasser 255 caractères.",
            },
        },
        nameSchool: {
            required: false,
            maxLength: 255,
            messages: {
                maxLength:
                    "Le nom de l'école ne peut pas dépasser 255 caractères.",
            },
        },
        locationCode: {
            required: false,
            maxLength: 255,
            pattern: /^\d{5}$/,
            messages: {
                maxLength:
                    "Le code postal ne peut pas dépasser 255 caractères.",
                pattern: "Le code postal doit contenir exactement 5 chiffres.",
            },
        },
    };

    // Valider un champ spécifique
    const validateField = useCallback((fieldName, value) => {
        const rule = validationRules[fieldName];
        if (!rule) return null;

        // Vérifier si le champ est requis
        if (rule.required && (!value || value.trim() === "")) {
            return rule.messages.required;
        }

        // Si le champ n'est pas requis et est vide, pas d'erreur
        if (!rule.required && (!value || value.trim() === "")) {
            return null;
        }

        // Vérifier la longueur minimale
        if (rule.minLength && value.length < rule.minLength) {
            return rule.messages.minLength;
        }

        // Vérifier la longueur maximale
        if (rule.maxLength && value.length > rule.maxLength) {
            return rule.messages.maxLength;
        }

        // Vérifier le pattern (regex)
        if (rule.pattern && !rule.pattern.test(value)) {
            return rule.messages.pattern;
        }

        return null;
    }, []);

    // Valider tous les champs d'un objet
    const validateAll = useCallback(
        (data) => {
            const newErrors = {};
            let isValid = true;

            Object.keys(data).forEach((fieldName) => {
                const error = validateField(fieldName, data[fieldName]);
                if (error) {
                    newErrors[fieldName] = error;
                    isValid = false;
                }
            });

            setErrors(newErrors);
            return isValid;
        },
        [validateField]
    );

    // Valider un champ en temps réel
    const validateRealTime = useCallback(
        (fieldName, value) => {
            const error = validateField(fieldName, value);
            setErrors((prev) => ({
                ...prev,
                [fieldName]: error,
            }));
            return !error;
        },
        [validateField]
    );

    // Effacer les erreurs
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    // Effacer l'erreur d'un champ spécifique
    const clearFieldError = useCallback((fieldName) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    // Vérifier si un champ a une erreur
    const hasError = useCallback(
        (fieldName) => {
            return !!errors[fieldName];
        },
        [errors]
    );

    // Obtenir l'erreur d'un champ
    const getError = useCallback(
        (fieldName) => {
            return errors[fieldName] || null;
        },
        [errors]
    );

    // Vérifier si le formulaire a des erreurs
    const hasErrors = useCallback(() => {
        return Object.keys(errors).length > 0;
    }, [errors]);

    return {
        errors,
        validateField,
        validateAll,
        validateRealTime,
        clearErrors,
        clearFieldError,
        hasError,
        getError,
        hasErrors,
    };
};

export default useValidation;
