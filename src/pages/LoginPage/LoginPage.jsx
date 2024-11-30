import React from "react";
import "../LoginPage/LoginPage.css"; // Импорт стилей
import { ReactComponent as LogoIcon } from "../../assets/Vector.svg"; // Путь к вашему SVG логотипу

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        {/* Верхняя панель */}
        <div className="header">
          <div className="header-logo">
            <LogoIcon className="logo-icon" />
            <span className="logo-text">HeartON</span>
          </div>
          <div className="auth-link">Авторизация</div>
        </div>

        {/* Основное содержимое */}
        <div className="content">
          <h1 className="title">HeartON</h1>

          {/* Форма авторизации */}
          <form className="login-form">
            <label htmlFor="email" className="form-label">
              Почта/Телефон
            </label>
            <input
              type="text"
              id="email"
              className="form-input"
              placeholder="Введите почту или телефон"
            />

            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Введите пароль"
            />

            <button type="submit" className="login-button">
              Вход
            </button>
          </form>

          {/* Ссылка на восстановление пароля */}
          <button
            className="forgot-password"
            onClick={() => {
              console.log("Восстановить пароль");
            }}
          >
            Восстановить пароль
          </button>

          {/* Фраза "Есть аккаунт?" */}
          <p className="account-text">
            Есть аккаунт? <a href="/register" className="login-link">Войти</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
