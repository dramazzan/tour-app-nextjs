"use client";

import React, { useState, FormEvent } from "react";
import { loginUser } from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    
    try {
      const response = await loginUser(loginData);
      if (response && response.token) {
        document.cookie = `token=${response.token}; path=/`;
        localStorage.setItem("authToken", response.token);
        router.push("/");
      } else {
        setErrorMessage("Ошибка при логине. Проверьте данные или попробуйте позже.");
      }
    } catch (error) {
      setErrorMessage("Ошибка при логине. Проверьте данные или попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login Page</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label" htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          required
          className="login-input"
        />

        <label className="login-label" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          required
          className="login-input"
        />

        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Загрузка..." : "Login"}
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Link href="/register" className="register-link">Register</Link>
    </div>
  );
};

export default LoginPage;
