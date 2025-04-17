"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import "@/styles/navbar.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const NavBar: React.FC = () => {
  const router = useRouter();
  const { token, setToken } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: "Вы уверены?",
      text: "Вы действительно хотите выйти из аккаунта?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Да, выйти",
      cancelButtonText: "Отмена",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("authToken");
      setToken(null);
      setIsLoggedIn(false);

      await MySwal.fire({
        title: "Выход выполнен",
        text: "Вы успешно вышли из системы.",
        icon: "success",
        confirmButtonText: "Ок",
      });

      router.push("/login");
    }
  };

  return (
    <div className="navbar-box">
      <nav className="navbar-container">
        <h1 className="navbar-title">Tour App</h1>
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link className="navbar-link" href="/">Главный</Link>
          </li>
          <li>
            <Link className="navbar-link" href="/basket">Корзина</Link>
          </li>
          <li className="navbar-item">
            {isLoggedIn ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="navbar-link"
              >
                Выйти
              </a>
            ) : (
              <Link className="navbar-link" href="/login">
                Войти
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
