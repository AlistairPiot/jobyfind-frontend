import SchoolBadgeRequests from "../components/SchoolBadgeRequests";
import SchoolBadgedStudents from "../components/SchoolBadgedStudents";

function DashboardSchool() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">
                    Dashboard École
                </h1>
            </div>

            {/* Composant pour gérer les demandes de badge */}
            <SchoolBadgeRequests />

            {/* Composant pour afficher les étudiants badgés */}
            <SchoolBadgedStudents />
        </div>
    );
}

export default DashboardSchool;
