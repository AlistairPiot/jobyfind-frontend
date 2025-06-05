import React from "react";

const InputField = ({
    id,
    label,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    error = null,
    disabled = false,
    className = "",
    showError = true,
}) => {
    // Déterminer les classes CSS basées sur l'état
    const inputClasses = `
        appearance-none block w-full px-4 py-3 border rounded-lg 
        placeholder-gray-400 focus:outline-none focus:ring-2 
        transition-colors duration-200
        ${
            error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        }
        ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        ${className}
    `
        .trim()
        .replace(/\s+/g, " ");

    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    };

    const handleBlur = (e) => {
        if (onBlur) {
            onBlur(e);
        }
    };

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium ${
                        error ? "text-red-700" : "text-gray-700"
                    }`}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={inputClasses}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${id}-error` : undefined}
                />

                {/* Icône d'erreur */}
                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Message d'erreur */}
            {error && showError && (
                <p
                    id={`${id}-error`}
                    className="text-sm text-red-600 flex items-center"
                    role="alert"
                >
                    <svg
                        className="h-4 w-4 mr-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;
