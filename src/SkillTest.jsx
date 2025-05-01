import React, { useEffect } from "react";
import { getSkills } from "./services/api";

function SkillTest() {
    const [skills, setSkills] = React.useState([]);

    useEffect(() => {
        getSkills()
            .then((data) => {
                console.log("Données reçues :", data); //Debug
                setSkills(data);
            })
            .catch((error) => console.error("Error :", error));
    }, []);
    return (
        <div>
            <h1>Liste des Skills</h1>
            <ul>
                {skills.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default SkillTest;
