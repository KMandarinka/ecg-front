import React from "react";
import styles from "../LoginPage/LoginPage.module.css"; // Импорт стилей
import { ReactComponent as LogoIcon } from "../../assets/Vector.svg"; // Путь к вашему SVG логотипу

const LoginPage = () => {
  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-container"]}>
        {/* Верхняя панель */}
        <div className={styles["header"]}>
          <div className={styles["header-logo"]}>
            <LogoIcon className={styles["logo-icon"]} />
            <span className={styles["logo-text"]}>HeartON</span>
          </div>
          <div className={styles["auth-link"]}>Авторизация</div>
        </div>

        {/* Основное содержимое */}
        <div className={styles["content"]}>
          <h1 className={styles["title"]}>HeartON</h1>

          {/* Форма авторизации */}
          <form className={styles["login-form"]}>
            <label htmlFor="email" className={styles["form-label"]}>
              Почта/Телефон
            </label>
            <input
              type="text"
              id="email"
              className={styles["form-input"]}
              placeholder="Введите почту или телефон"
            />

            <label htmlFor="password" className={styles["form-label"]}>
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className={styles["form-input"]}
              placeholder="Введите пароль"
            />

            <button type="submit" className={styles["login-button"]}>
              Вход
            </button>
          </form>

          {/* Ссылка на восстановление пароля */}
          <button
            className={styles["forgot-password"]}
            onClick={() => {
              console.log("Восстановить пароль");
            }}
          >
            Восстановить пароль
          </button>

          {/* Фраза "Есть аккаунт?" */}
          <p className={styles["account-text"]}>
            Нет аккаунта? <a href="/register" className={styles["login-link"]}>Создать</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
