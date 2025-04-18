"use client";

import { registerUser } from "@/services/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setErrors({
        ...errors,
        password: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { password: "" };

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.password = "Пароли не совпадают";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = registerData;

      const response = await registerUser(dataToSend);
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
        <h1 className="register-title">Регистрация</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-label" htmlFor="username">Имя пользователя</label>
          <input
              type="text"
              id="username"
              name="username"
              value={registerData.username}
              onChange={handleChange}
              required
              className="register-input"
          />
          <label className="register-label" htmlFor="email">Почта</label>
          <input
              type="email"
              id="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              required
              className="register-input"
          />
          <label className="register-label" htmlFor="password">Пароль</label>
          <input
              type="password"
              id="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              required
              className="register-input"
          />
          <label className="register-label" htmlFor="confirmPassword">Подтверждение пароля</label>
          <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleChange}
              required
              className="register-input"
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
          <button type="submit" className="register-button">Зарегистрироваться</button>
          <Link className="login-link" href="/login">Если уже есть аккаунт</Link>

        </form>
      </div>
  );
};

export default RegisterPage;