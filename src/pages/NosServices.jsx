import React from "react";
import { Link } from "react-router-dom";

// Import des images (à adapter selon leur emplacement réel)

const NosServices = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
                    Nos Services
                </h1>
                {/* Section 1 : 2 grandes cartes horizontales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Carte 1 - Adaptée à la maquette */}
                    <div className="bg-white rounded-xl shadow flex flex-col p-0 overflow-hidden">
                        {/* Image mission en haut */}
                        <img
                            src="/mission.png"
                            alt="Mission"
                            className="w-full h-60 object-cover rounded-t-xl"
                            style={{ background: "#eaf3fa" }}
                        />
                        {/* Bloc texte sur fond blanc */}
                        <div className="bg-white p-8 rounded-b-xl flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                MISSIONS QUALIFIÉES POUR FREELANCES ET ÉTUDIANTS
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Accédez à des missions sélectionnées selon vos
                                compétences, votre statut et votre secteur
                                d'activité.
                            </p>
                            <div className="flex justify-end">
                                <Link
                                    to="#"
                                    className="inline-block px-8 py-3 rounded-full bg-[#A6A6DF] text-white font-semibold text-base shadow-sm hover:bg-[#8a8ad6] transition"
                                >
                                    EN SAVOIR PLUS
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Carte 2 - Déjà adaptée à la maquette */}
                    <div className="bg-white rounded-xl shadow flex flex-col p-0 overflow-hidden">
                        {/* Image puzzle en haut */}
                        <img
                            src="/puzzle.png"
                            alt="Puzzle"
                            className="w-full h-60 object-cover rounded-t-xl"
                            style={{ background: "#eaf3fa" }}
                        />
                        {/* Bloc texte sur fond blanc */}
                        <div className="bg-white p-8 rounded-b-xl flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                UN LIEN DIRECT ENTRE FORMATION ET EMPLOI
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Offres ciblées pour les étudiants, tableaux de
                                suivi pour les écoles, profils filtrés pour les
                                recruteurs.
                            </p>
                            <div className="flex justify-end">
                                <Link
                                    to="#"
                                    className="inline-block px-8 py-3 rounded-full bg-[#A6A6DF] text-white font-semibold text-base shadow-sm hover:bg-[#8a8ad6] transition"
                                >
                                    EN SAVOIR PLUS
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section 2 : Grille de 3 cartes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Paiement sécurisé */}
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center relative">
                        {/* Image shield-card au-dessus */}
                        <img
                            src="/shield-card.png"
                            alt="Sécurité"
                            className="h-16 mb-2"
                        />
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <img
                                src="/paypal.png"
                                alt="PayPal"
                                className="h-8"
                            />
                            <img
                                src="/stripe.png"
                                alt="Stripe"
                                className="h-8"
                            />
                            <img
                                src="/applepay.png"
                                alt="Apple Pay"
                                className="h-8"
                            />
                            <img
                                src="/gpay.png"
                                alt="Google Pay"
                                className="h-8"
                            />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-center">
                            DES MISSIONS PAYÉES EN TOUTE SIMPLICITÉ
                        </h3>
                        <p className="text-gray-600 text-center mb-4">
                            Les paiements sont réalisés via Stripe ou PayPal,
                            une fois la mission validée par les deux parties.
                        </p>
                        <Link
                            to="#"
                            className="inline-block px-6 py-2 rounded-md bg-indigo-200 text-indigo-800 font-medium text-sm text-center"
                        >
                            EN SAVOIR PLUS
                        </Link>
                    </div>
                    {/* Booster profil/offres */}
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <img
                            src="/radar.png"
                            alt="Radar"
                            className="h-32 mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2 text-center">
                            BOOSTEZ VOTRE PROFIL OU VOS OFFRES
                        </h3>
                        <p className="text-gray-600 text-center mb-4">
                            Gagnez en visibilité localement, nationalement ou à
                            l'international grâce à nos boosters et jetons.
                        </p>
                        <Link
                            to="#"
                            className="inline-block px-6 py-2 rounded-md bg-indigo-200 text-indigo-800 font-medium text-sm text-center"
                        >
                            EN SAVOIR PLUS
                        </Link>
                    </div>
                    {/* Déblocage infos clients - Adaptée à la maquette */}
                    <div
                        className="bg-white rounded-xl shadow flex flex-col p-0 overflow-hidden relative"
                        style={{
                            background:
                                "radial-gradient(circle, #f8f8fa 80%, #f0f0f5 100%)",
                        }}
                    >
                        {/* Fond à petits points (SVG pattern) */}
                        <svg
                            className="absolute inset-0 w-full h-full"
                            style={{ zIndex: 0 }}
                            width="100%"
                            height="100%"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <pattern
                                    id="dots"
                                    x="0"
                                    y="0"
                                    width="20"
                                    height="20"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <circle
                                        cx="1"
                                        cy="1"
                                        r="1"
                                        fill="#d3d3e6"
                                    />
                                </pattern>
                            </defs>
                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#dots)"
                            />
                        </svg>
                        {/* Cercles et images en haut */}
                        <div className="flex justify-center items-start gap-16 pt-8 pb-2 relative z-10">
                            <div className="flex flex-col items-center">
                                <div className="rounded-full bg-white shadow-md flex items-center justify-center w-32 h-32 mb-2">
                                    <img
                                        src="/jeton.png"
                                        alt="Jeton"
                                        className="h-20 w-20"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="rounded-full bg-white shadow-md flex items-center justify-center w-32 h-32 mb-2">
                                    <img
                                        src="/sans-contact.png"
                                        alt="Sans contact"
                                        className="h-20 w-20"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Lignes de liaison (SVG) */}
                        <svg
                            className="absolute left-0 right-0 mx-auto"
                            style={{
                                top: "140px",
                                zIndex: 5,
                                width: "100%",
                                height: "60px",
                                pointerEvents: "none",
                            }}
                            width="100%"
                            height="60"
                        >
                            <path
                                d="M 25 10 Q 200 60 400 10"
                                stroke="#bfc6e6"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M 375 10 Q 500 60 700 10"
                                stroke="#bfc6e6"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                        {/* Carte mission stylisée (image ou placeholder) */}

                        {/* Bloc texte */}
                        <div className="bg-white p-8 rounded-b-xl flex flex-col gap-4 relative z-10">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                                CHOISISSEZ COMMENT DÉBLOQUER LES INFOS CLIENTS
                            </h3>
                            <p className="text-gray-600 text-center mb-4">
                                Abonnement ou jetons : vous avez le choix pour
                                accéder aux détails des clients et proposer vos
                                services.
                            </p>
                            <div className="flex justify-center">
                                <Link
                                    to="#"
                                    className="inline-block px-8 py-3 rounded-full bg-[#A6A6DF] text-white font-semibold text-base shadow-sm hover:bg-[#8a8ad6] transition"
                                >
                                    EN SAVOIR PLUS
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NosServices;
