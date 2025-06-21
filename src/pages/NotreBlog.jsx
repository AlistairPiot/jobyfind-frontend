// Composants SVG pour les icônes
const InstagramIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const LinkedinIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const XIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 6L6 18"></path>
        <path d="M6 6l12 12"></path>
    </svg>
);

function NotreBlog() {
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                    {/* Ligne du haut */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
                            <div className="relative bg-gray-50 p-4">
                                {/* Desktop Layout: Star Shape */}
                                <div className="hidden lg:flex items-center justify-center h-48">
                                    <img
                                        src="/etoile.png"
                                        alt="Étoile"
                                        className="w-40 h-40"
                                    />
                                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <div className="flex justify-center gap-x-22">
                                                <ArticleBubble text="L'intelligence artificielle et l'avenir du travail" />
                                                <ArticleBubble text="Comment booster son entreprise" />
                                            </div>
                                            <div className="flex justify-center gap-x-40">
                                                <ArticleBubble text="Erreurs marketing à éviter" />
                                                <ArticleBubble text="Le codage va évoluer avec IA" />
                                            </div>
                                            <div className="flex justify-center gap-x-44">
                                                <ArticleBubble text="Extensions Chrome utiles" />
                                                <ArticleBubble text="Toute les astuces SEO" />
                                            </div>
                                            <div className="flex justify-center gap-x-40">
                                                <ArticleBubble text="Comment fidéliser ses premiersclients" />
                                                <ArticleBubble text="UX/UI : les tendances à suivre" />
                                            </div>
                                            <div className="flex justify-center gap-x-28">
                                                <ArticleBubble text="Freelance : construire un portfolio qui vend" />
                                                <ArticleBubble text="Monétiser son expertise sur internet" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Layout: Flex Wrap */}
                                <div className="lg:hidden relative flex items-center justify-center py-4">
                                    <img
                                        src="/etoile.png"
                                        alt=""
                                        className="w-64 h-64 absolute opacity-20"
                                    />
                                    <div className="flex flex-wrap justify-center gap-2 p-4">
                                        <ArticleBubble text="L'intelligence artificielle et l'avenir du travail" />
                                        <ArticleBubble text="Comment booster son entreprise" />
                                        <ArticleBubble text="Erreurs marketing à éviter" />
                                        <ArticleBubble text="Le codage va évoluer avec IA" />
                                        <ArticleBubble text="Extensions Chrome utiles" />
                                        <ArticleBubble text="Toute les astuces SEO" />
                                        <ArticleBubble text="Comment fidéliser ses premiersclients" />
                                        <ArticleBubble text="UX/UI : les tendances à suivre" />
                                        <ArticleBubble text="Freelance : construire un portfolio qui vend" />
                                        <ArticleBubble text="Monétiser son expertise sur internet" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    NOS MEILLEURS ARTICLES
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Découvrez nos analyses et conseils sur le
                                    monde du travail de demain. Que vous soyez
                                    freelance, recruteur ou étudiant, notre blog
                                    vous offre les clés pour naviguer dans
                                    l'écosystème numérique, optimiser votre
                                    profil et saisir les meilleures
                                    opportunités.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
                            <img
                                src="/recrutement.jpg"
                                alt="Recrutement"
                                className="w-full h-44 object-cover"
                            />
                            <div className="p-6 flex-grow">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    TOUTES LES DERNIÈRES TENDANCES POUR LE
                                    RECRUTEMENT
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Le recrutement évolue. De l'intelligence
                                    artificielle à la marque employeur, restez à
                                    la pointe des nouvelles méthodes pour
                                    attirer les talents qui feront la
                                    différence. Nous décryptons pour vous les
                                    stratégies gagnantes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ligne du bas */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg h-full">
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div className="space-y-1.5">
                                        <SocialProfile
                                            name="Anthony Smith"
                                            detail="Boost Viewers Instagram +45%"
                                            icon={<InstagramIcon />}
                                            iconBg="bg-pink-500"
                                        />
                                        <SocialProfile
                                            name="John Doe"
                                            detail="Boost Likes LinkedIn +20%"
                                            icon={<LinkedinIcon />}
                                            iconBg="bg-blue-700"
                                        />
                                        <SocialProfile
                                            name="Jane Roe"
                                            detail="Boost Followers X +15%"
                                            icon={<XIcon />}
                                            iconBg="bg-gray-800"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <img
                                            src="/compteur.png"
                                            alt="Compteur"
                                            className="h-40 w-auto"
                                        />
                                    </div>
                                </div>
                                <div className="lg:py-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                                        COMMENT AUGMENTER SA VISIBILITÉ SUR LES
                                        RÉSEAUX
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-4">
                                        À l'ère du digital, une présence en
                                        ligne soignée est cruciale. Apprenez à
                                        transformer vos profils sociaux en
                                        véritables atouts professionnels pour
                                        attirer des clients et des
                                        collaborateurs de qualité.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg h-full">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-1/2 space-y-3 pt-2">
                                        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded-md w-5/6"></div>
                                        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded-md w-4/6"></div>
                                        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded-md w-3/6"></div>
                                    </div>
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src="/photo-profil.png"
                                            alt="Profil CV"
                                            className="w-32 h-auto rounded-lg"
                                        />
                                        <img
                                            src="/book.png"
                                            alt="Livre"
                                            className="absolute -bottom-3 -left-3 w-12 h-12"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        LES MEILLEURS TIPS POUR BOOSTER SON CV !
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Votre CV est votre première vitrine.
                                        Découvrez nos astuces pour créer un
                                        document percutant qui capte l'attention
                                        des recruteurs : mots-clés pertinents,
                                        mise en valeur des compétences et
                                        personnalisation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ArticleBubble = ({ text }) => (
    <div className="bg-white px-2.5 py-1.5 rounded-full shadow-md text-[0.5rem] text-gray-700 font-semibold whitespace-nowrap">
        {text}
    </div>
);

const SocialProfile = ({ name, detail, icon, iconBg }) => (
    <div className="flex items-center space-x-2 p-1.5 bg-gray-100 rounded-lg">
        <img
            src="/photo-profil.png"
            alt={name}
            className="w-7 h-7 rounded-full"
        />
        <div className="flex-grow">
            <p className="font-semibold text-gray-800 text-xs">{name}</p>
            <p className="text-[10px] text-gray-500">{detail}</p>
        </div>
        <div className={`p-1 rounded-full text-white ${iconBg}`}>{icon}</div>
    </div>
);

export default NotreBlog;
