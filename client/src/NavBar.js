import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./hooks/useUser";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home </Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/articles"> Article</Link>
        </li>
      </ul>
      <div className="nav-right">
        {user ? (
          <button onClick={() => signOut(getAuth())}>Log Out</button>
        ) : (
          <button onClick={() => navigate("/login")}>Log In</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
