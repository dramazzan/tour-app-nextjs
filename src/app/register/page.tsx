"use client";

import { registerUser } from "@/services/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await registerUser(registerData);
      if (response) {
        router.push("/login");
      } else {
        alert("Ошибка при регистрации. Проверьте данные или попробуйте позже.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register Page</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label" htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={registerData.username}
          onChange={handleChange}
          required
          className="register-input"
        />
        <label className="register-label" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={registerData.email}
          onChange={handleChange}
          required
          className="register-input"
        />
        <label className="register-label" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={registerData.password}
          onChange={handleChange}
          required
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
