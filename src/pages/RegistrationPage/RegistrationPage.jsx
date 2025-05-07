import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../RegistrationPage/RegistrationPage.module.css"; 
import { ReactComponent as LogoIcon } from "../../assets/Vector.svg"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
  const [login, setLogin] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async (event) => {
    event.preventDefault();
    setError("");

    if (!login || !name || !password) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);

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
        throw new Error(errorText || "Ошибка регистрации");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/main");
    } catch (error) {
      console.error("Ошибка регистрации:", error.message);
      setError(error.message || "Ошибка регистрации. Проверьте данные!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles["login-page"]} ${styles["register-page"]}`}>
      <div className={styles["login-container"]}>
        <div className={styles["header"]}>
          <div className={styles["header-logo"]}>
            <LogoIcon className={styles["logo-icon"]} />
            <span className={styles["logo-text"]}>HeartON</span>
          </div>
          <div className={styles["auth-link"]}>Регистрация</div>
        </div>

        <div className={styles["content"]}>
          <h1 className={styles["title"]}>HeartON</h1>

          {error && (
            <div className={styles["error-message"]}>
              {error}
            </div>
          )}

          <form className={styles["login-form"]} onSubmit={handleRegistration}>
            <label className={styles["form-label"]}>Имя пользователя</label>
            <input
              type="text"
              className={styles["form-input"]}
              placeholder="Введите имя пользователя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className={styles["form-label"]}>Логин (почта/телефон)</label>
            <input
              type="text"
              className={styles["form-input"]}
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />

            <label className={styles["form-label"]}>Пароль</label>
            <div className={styles["password-container"]}>
              <input
                type={showPassword ? "text" : "password"}
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

            <div className={styles["checkbox-container"]}>
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className={styles["form-checkbox"]}
              />
              <label htmlFor="terms" className={styles["checkbox-label"]}>
                Я принимаю условия использования
              </label>
            </div>

            <button 
              type="submit" 
              className={styles["login-button"]}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Зарегистрироваться"}
            </button>

            <p className={styles["account-text"]}>
              Уже есть аккаунт?{' '}
              <a href="/" className={styles["login-link"]}>
                Войти
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;