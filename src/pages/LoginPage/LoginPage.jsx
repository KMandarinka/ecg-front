import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../LoginPage/LoginPage.module.css"; 
import { ReactComponent as LogoIcon } from "../../assets/Vector.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Импорт иконок

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Состояние для отображения пароля
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка авторизации: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Успешный вход:", data);
  
      localStorage.setItem("token", data.access_token); // Сохраняем токен в localStorage
      console.log(localStorage.getItem("token"));
      navigate("/main"); // Переход на страницу main
    } catch (error) {
      console.error("Ошибка входа:", error.message);
      alert("Ошибка входа. Проверьте данные!");
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-container"]}>
        <div className={styles["header"]}>
          <div className={styles["header-logo"]}>
            <LogoIcon className={styles["logo-icon"]} />
            <span className={styles["logo-text"]}>HeartON</span>
          </div>
          <div className={styles["auth-link"]}>Авторизация</div>
        </div>

        <div className={styles["content"]}>
          <h1 className={styles["title"]}>HeartON</h1>

          <form className={styles["login-form"]} onSubmit={handleLogin}>
            <label htmlFor="email" className={styles["form-label"]}>
              Почта/Телефон
            </label>
            <input
              type="text"
              id="email"
              className={styles["form-input"]}
              placeholder="Введите почту или телефон"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />

            <label htmlFor="password" className={styles["form-label"]}>
              Пароль
            </label>
            <div className={styles["password-container"]}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles["form-input"]}
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

            <button type="submit" className={styles["login-button"]}>
              Вход
            </button>
          </form>

          <button
            className={styles["forgot-password"]}
            onClick={() => navigate("/change-password")}
          >
            Восстановить пароль
          </button>


          <p className={styles["account-text"]}>
            Нет аккаунта? <a href="/register" className={styles["login-link"]}>Создать</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
