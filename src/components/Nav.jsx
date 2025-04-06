import { Link } from "react-router-dom";

function Nav() {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
                <li>
                    <Link to="/" className="text-white">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/signup" className="text-white">
                        Sign Up
                    </Link>
                </li>
                <li>
                    <Link to="/login" className="text-white">
                        Log In
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;
