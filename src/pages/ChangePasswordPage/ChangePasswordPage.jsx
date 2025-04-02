import React, { useState } from "react";
import styles from "../LoginPage/LoginPage.module.css";
import { ReactComponent as LogoIcon } from "../../assets/Vector.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (event) => {
    event.preventDefault();

    try {
      var token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/api/v1/auth/update/password", {
        method: "PUT",
        credentials: "include", // отправляем куки на сервер
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: newPassword,
          old_password: oldPassword
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка смены пароля: ${errorText}`);
      }

      alert("Пароль успешно изменён!");
    } catch (error) {
      console.error("Ошибка смены пароля:", error.message);
      alert("Ошибка смены пароля. Проверьте данные!");
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
          <div className={styles["auth-link"]}>Смена пароля</div>
        </div>

        <div className={styles["content"]}>
          <h1 className={styles["title"]}>HeartON</h1>

          <form className={styles["login-form"]} onSubmit={handleChangePassword}>
            <label className={styles["form-label"]}>Старый пароль</label>
            <div className={styles["password-container"]}>
              <input
                type={showOldPassword ? "text" : "password"}
                className={styles["form-input"]}
                placeholder="Введите старый пароль"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles["toggle-password"]}
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label className={styles["form-label"]}>Новый пароль</label>
            <div className={styles["password-container"]}>
              <input
                type={showNewPassword ? "text" : "password"}
                className={styles["form-input"]}
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles["toggle-password"]}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className={styles["login-button"]}>
              Сменить пароль
            </button>

            <button
              type="button"
              className={styles["forgot-password"]}
              onClick={() => navigate("/")}
            >
              Вернуться назад
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
