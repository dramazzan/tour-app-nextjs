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
        console.log("Успешный логин");
        console.log("Токен:", response.token);
        localStorage.setItem("authToken", response.token);
        router.push("/");
      } else {
        console.error("Ошибка при логине");
        setErrorMessage("Ошибка при логине. Проверьте данные или попробуйте позже.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setErrorMessage("Ошибка при логине. Проверьте данные или попробуйте позже.");
    } finally {
      setLoading(false);
    }
    
    console.log("Данные для логина:", loginData);
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Login"}
        </button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <Link href="/register">Register</Link>
    </div>
  );
};

export default LoginPage;
