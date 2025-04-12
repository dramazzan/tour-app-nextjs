"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import "@/styles/navbar.css";

const NavBar: React.FC = () => {
  const router = useRouter();
  const { token, setToken } = useAuth();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Вы уверены, что хотите выйти?");
    if (!confirmLogout) return;

    localStorage.removeItem("authToken");
    setToken(null);
    alert("Вы успешно вышли из системы!");
    router.push("/login");
  };

  const authValue = token ? "Logout" : "Login";
  const authUrl = token ? "#" : "/login";

  return (
    <nav className="navbar-container">
      <h1 className="navbar-title">Tour App</h1>
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link className="navbar-link" href="/">Home</Link>
        </li>
        <li className="navbar-item">
          {token ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="navbar-link"
            >
              {authValue}
            </a>
          ) : (
            <Link className="navbar-link" href={authUrl}>
              {authValue}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
