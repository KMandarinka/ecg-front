import React from "react";
import "../RegistrationPage/RegistrationPage.css"; // Импорт стилей
import { ReactComponent as LogoIcon } from "../../assets/Vector.svg"; // Путь к вашему SVG логотипу

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        {/* Верхняя панель */}
        <div className="header">
          <div className="header-logo">
            <LogoIcon className="logo-icon" />
            <span className="logo-text">HeartON</span>
          </div>
          <div className="auth-link">Регистрация</div>
        </div>

        {/* Основное содержимое */}
        <div className="content">
          <h1 className="title">HeartON</h1>

          {/* Форма регистрации */}
          <form className="register-form">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Введите имя пользователя"
            />

            <label htmlFor="email" className="form-label">
              Электронная почта
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Введите электронную почту"
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

            <label className="form-checkbox">
              <input type="checkbox" />
              <span className="checkbox-text">Я принимаю условия использования</span>
            </label>

            <button type="submit" className="register-button">
              Зарегистрироваться
            </button>
          </form>

          {/* Ссылка на авторизацию */}
          <p className="account-text">
            Уже есть аккаунт? <a href="/" className="login-link">Войти</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
