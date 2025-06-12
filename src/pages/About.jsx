import React from "react";

function About() {
    const values = [
        {
            icon: "🎯",
            title: "Innovation",
            description:
                "Nous créons des solutions technologiques qui révolutionnent la recherche d'emploi et de talents.",
        },
        {
            icon: "🤝",
            title: "Connexion",
            description:
                "Nous rapprochons les écoles, les entreprises et les étudiants pour créer des opportunités uniques.",
        },
        {
            icon: "💼",
            title: "Professionnalisme",
            description:
                "Nous garantissons une expérience de qualité pour tous nos utilisateurs avec un service d'excellence.",
        },
        {
            icon: "🚀",
            title: "Croissance",
            description:
                "Nous accompagnons la croissance professionnelle de chaque étudiant et le développement des entreprises.",
        },
    ];

    const team = [
        {
            name: "Thibault Liebaert",
            role: "Chef de projet",
            description:
                "Coordonne l'ensemble du projet et assure la cohésion entre les différentes équipes.",
            image: "👨‍💼",
        },
        {
            name: "Camille Leglise",
            role: "Marketing & Communication",
            description:
                "Développe la stratégie marketing et gère la communication externe de Jobyfind.",
            image: "👩‍💼",
        },
        {
            name: "Margaux Perroy",
            role: "Marketing & Communication",
            description:
                "Spécialisée dans la création de contenu et l'engagement communautaire.",
            image: "👩‍💼",
        },
        {
            name: "Alice Ait-Kaci",
            role: "Graphiste & UI Designer",
            description:
                "Conçoit l'identité visuelle et l'expérience utilisateur de la plateforme.",
            image: "👩‍🎨",
        },
        {
            name: "Alistair Piot",
            role: "Développeur Full Stack",
            description:
                "Développe et maintient l'architecture technique de la plateforme Jobyfind.",
            image: "👨‍💻",
        },
    ];

    const stats = [
        { number: "10,000+", label: "Étudiants inscrits" },
        { number: "500+", label: "Entreprises partenaires" },
        { number: "50+", label: "Écoles connectées" },
        { number: "95%", label: "Taux de satisfaction" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-primary-light to-white py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight">
                            À Propos de Jobyfind
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Nous révolutionnons la façon dont les étudiants
                            trouvent des opportunités professionnelles et dont
                            les entreprises découvrent les talents de demain.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-4 lg:py-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                Notre Mission
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Chez Jobyfind, nous croyons que chaque étudiant
                                mérite d'accéder aux meilleures opportunités
                                professionnelles. Notre mission est de créer un
                                écosystème où les talents émergents rencontrent
                                les entreprises innovantes.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Nous facilitons les connexions entre écoles,
                                entreprises et étudiants grâce à une plateforme
                                intuitive qui valorise les compétences et les
                                aspirations de chacun.
                            </p>
                        </div>
                        <div className="bg-gray-100 rounded-2xl p-8 text-center">
                            <div className="text-6xl mb-4">🌟</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Vision 2025
                            </h3>
                            <p className="text-gray-600">
                                Devenir la référence européenne pour connecter
                                les talents étudiants avec les opportunités
                                professionnelles de demain.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Valeurs Section */}
            <div className="py-16 lg:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            Nos Valeurs
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Les principes qui guident notre action quotidienne
                            et notre vision du futur du travail.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="text-4xl mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistiques Section */}
            <div className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            Jobyfind en Chiffres
                        </h2>
                        <p className="text-lg text-gray-600">
                            Des résultats qui témoignent de notre impact.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-lg text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Équipe Section */}
            <div className="py-16 lg:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            Notre Équipe
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Des experts passionnés qui travaillent chaque jour
                            pour révolutionner le monde du recrutement étudiant.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="text-6xl mb-4">
                                    {member.image}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-primary font-medium mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 lg:py-24 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Rejoignez l'Aventure Jobyfind
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Que vous soyez étudiant, école ou entreprise, découvrez
                        comment Jobyfind peut transformer votre approche des
                        opportunités professionnelles.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/signup"
                            className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
                        >
                            Créer un compte
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary hover:border-primary hover:shadow-lg transition-all duration-300"
                        >
                            Nous contacter
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
