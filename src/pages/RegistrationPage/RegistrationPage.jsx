import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../RegistrationPage/RegistrationPage.module.css"; 
import { ReactComponent as LogoIcon } from "../../assets/Vector.svg"; 
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Иконки глаза

const RegisterPage = () => {
  const [login, setLogin] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Стейт для показа пароля
  const navigate = useNavigate();

  const handleRegistration = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ login, name, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка регистрации: ${errorText}`);
      }

      const data = await response.json();
      console.log("Успешная регистрация:", data);

      localStorage.setItem("token", data.access_token);
      navigate("/main");
    } catch (error) {
      console.error("Ошибка регистрации:", error.message);
      alert("Ошибка регистрации. Проверьте данные!");
    }
  };

  return (
    <div className={styles["register-page"]}>
      <div className={styles["register-container"]}>
        <div className={styles["header"]}>
          <div className={styles["header-logo"]}>
            <LogoIcon className={styles["logo-icon"]} />
            <span className={styles["rp-logo-text"]}>HeartON</span>
          </div>
          <div className={styles["auth-link"]}>Регистрация</div>
        </div>

        <div className={styles["rp-content"]}>
          <h1 className={styles["title"]}>HeartON</h1>

          <form className={styles["rp-register-form"]} onSubmit={handleRegistration}>
            <label htmlFor="username" className={styles["rp-form-label"]}>
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              className={styles["rp-form-input"]}
              placeholder="Введите имя пользователя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="email" className={styles["rp-form-label"]}>
              Логин (почта/телефон)
            </label>
            <input
              type="text"
              id="email"
              className={styles["rp-form-input"]}
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />

            <label htmlFor="password" className={styles["rp-form-label"]}>
              Пароль
            </label>
            <div className={styles["password-container"]}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles["rp-form-input"]}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles["toggle-password"]}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label className={styles["form-checkbox"]}>
              <input type="checkbox" required />
              <span className={styles["checkbox-text"]}>Я принимаю условия использования</span>
            </label>

            <button type="submit" className={styles["register-button"]}>
              Зарегистрироваться
            </button>
          </form>

          <p className={styles["account-text"]}>
            Уже есть аккаунт? <a href="/" className={styles["login-link"]}>Войти</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
