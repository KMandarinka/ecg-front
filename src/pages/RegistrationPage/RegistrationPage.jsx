import React from "react";
import styles from "../RegistrationPage/RegistrationPage.module.css"; // Импорт стилей
import { ReactComponent as LogoIcon } from "../../assets/Vector.svg"; // Путь к вашему SVG логотипу

const RegisterPage = () => {
  return (
    <div className={styles["register-page"]}>
      <div className={styles["register-container"]}>
        {/* Верхняя панель */}
        <div className={styles["header"]}>
          <div className={styles["header-logo"]}>
            <LogoIcon className={styles["logo-icon"]} />
            <span className={styles["rp-logo-text"]}>HeartON</span>
          </div>
          <div className={styles["auth-link"]}>Регистрация</div>
        </div>

        {/* Основное содержимое */}
        <div className={styles["rp-content"]}>
          <h1 className={styles["title"]}>HeartON</h1>

          {/* Форма регистрации */}
          <form className={styles["rp-register-form"]}>
            <label htmlFor="username" className={styles["rp-form-label"]}>
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              className={styles["rp-form-input"]}
              placeholder="Введите имя пользователя"
            />

            <label htmlFor="email" className={styles["rp-form-label"]}>
              Электронная почта
            </label>
            <input
              type="email"
              id="email"
              className={styles["rp-form-input"]}
              placeholder="Введите электронную почту"
            />

            <label htmlFor="password" className={styles["rp-form-label"]}>
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className={styles["rp-form-input"]}
              placeholder="Введите пароль"
            />

            <label className={styles["form-checkbox"]}>
              <input type="checkbox" />
              <span className={styles["checkbox-text"]}>Я принимаю условия использования</span>
            </label>

            <button type="submit" className={styles["register-button"]}>
              Зарегистрироваться
            </button>
          </form>

          {/* Ссылка на авторизацию */}
          <p className={styles["account-text"]}>
            Уже есть аккаунт? <a href="/" className={styles["login-link"]}>Войти</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
