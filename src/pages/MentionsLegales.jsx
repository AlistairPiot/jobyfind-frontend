function MentionsLegales() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-primary mb-6 text-center">
                    Mentions Légales – JobyFind
                </h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Éditeur du site :
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Le présent site web, accessible à l'adresse
                            www.jobyfind.com (ou URL temporaire du projet), est
                            édité par :
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="text-gray-600 space-y-2">
                                <li>
                                    <strong>
                                        Nom de l'entreprise / structure :
                                    </strong>{" "}
                                    [Nom de l'entreprise ou auto-entreprise]
                                </li>
                                <li>
                                    <strong>Forme juridique :</strong> SAS
                                </li>
                                <li>
                                    <strong>Capital social :</strong> 1 000 €
                                </li>
                                <li>
                                    <strong>Siège social :</strong> [Adresse
                                    postale complète]
                                </li>
                                <li>
                                    <strong>Numéro SIRET / RCS :</strong> [SIRET
                                    ou RCS de l'entreprise]
                                </li>
                                <li>
                                    <strong>
                                        Numéro de TVA intracommunautaire :
                                    </strong>{" "}
                                    [si applicable]
                                </li>
                                <li>
                                    <strong>
                                        Responsable de la publication :
                                    </strong>{" "}
                                    Liebaert Thibault / CEO
                                </li>
                                <li>
                                    <strong>Email de contact :</strong>{" "}
                                    [contact@jobyfind.com]
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Hébergement du site :
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Le site est hébergé par :
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="text-gray-600 space-y-2">
                                <li>
                                    <strong>Hébergeur principal :</strong> Ionos
                                </li>
                                <li>
                                    <strong>Adresse :</strong> 304 chemin de
                                    traverse, Paris
                                </li>
                                <li>
                                    <strong>Render :</strong> 100 Pine Street,
                                    Suite 1250, San Francisco, CA 94111,
                                    États-Unis
                                </li>
                                <li>
                                    <strong>Vercel :</strong> 340 S Lemon Ave
                                    #4133, Walnut, CA 91789, États-Unis
                                </li>
                                <li>
                                    <strong>Site web :</strong>{" "}
                                    <a
                                        href="https://www.ionos.fr"
                                        className="text-primary hover:underline"
                                    >
                                        https://www.ionos.fr
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Développement technique :
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>
                                <strong>Développement web et mobile :</strong>{" "}
                                Équipe interne JobyFind
                            </li>
                            <li>
                                <strong>Technologies utilisées :</strong> React,
                                Symfony, MySQL, Firebase, Stripe
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Conditions d'utilisation :
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            L'utilisation du site JobyFind implique
                            l'acceptation pleine et entière des Conditions
                            Générales d'Utilisation (CGU), disponibles à
                            l'adresse suivante :
                            <a
                                href="/cgu"
                                className="text-primary hover:underline ml-1"
                            >
                                [URL CGU]
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Propriété intellectuelle :
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            L'ensemble des contenus présents sur le site
                            (textes, images, logo, code, base de données...) est
                            protégé par le Code de la propriété intellectuelle.
                            Toute reproduction, représentation ou diffusion,
                            même partielle, sans autorisation écrite préalable
                            est strictement interdite.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Responsabilité :
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            JobyFind s'efforce d'assurer l'exactitude des
                            informations publiées, mais ne saurait être tenue
                            responsable :
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Des erreurs ponctuelles ou omissions ;</li>
                            <li>Des interruptions du site ;</li>
                            <li>
                                Des dommages liés à l'usage du site ou d'un
                                service tiers.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Données personnelles :
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Les traitements de données à caractère personnel
                            sont décrits dans la Politique de confidentialité
                            (RGPD) accessible ici : [lien vers la section RGPD]
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Conformément à la réglementation en vigueur (RGPD et
                            loi Informatique & Libertés), chaque utilisateur
                            dispose d'un droit d'accès, de rectification,
                            d'opposition, de limitation et de suppression de ses
                            données.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Pour exercer ces droits : [email de contact RGPD]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Crédits visuels :
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Icônes, illustrations, et éléments graphiques issus
                            de [Figma / Flaticon / Freepik / créations
                            internes]. Photos libres de droits ou fournies par
                            les utilisateurs avec autorisation.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default MentionsLegales;
