import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Bienvenue sur Jobyfind</h1>
            <button>
                <Link to="/signup">Création d'un compte</Link>
            </button>
        </div>
    );
}

export default Home;
