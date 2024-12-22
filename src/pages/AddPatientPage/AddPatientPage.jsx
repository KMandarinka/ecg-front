import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddPatientPage.module.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { ReactComponent as BackIcon } from '../../assets/back.svg'; // Иконка "Закрыть"

const AddPatientPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles["app-add-patient-page"]}>
      <AppHeader />
      <div className={styles["app-header-container"]}>
        <span className={styles["app-breadcrumb"]}>Главная > Ввод данных ></span>
        <span className={styles["app-contact-link"]}>Остались вопросы? Напишите нам</span>
      </div>

      <div className={styles["app-info-container"]}>
        <h1 className={styles["app-h1"]}>Введите данные нового пациента</h1>
        <button
          className={styles["app-back-button"]}
          onClick={() => navigate("/select-patient")}
        >
          <BackIcon className={styles["app-back-icon"]} />
          <span>Назад к поиску пациентов</span>
        </button>

      </div>

      <div className={styles["app-form-container"]}>
        <form>
          <div className={styles["app-form-grid"]}>
            <label className={styles["app-form-label"]}>
              Имя:
              <input className={styles["app-form-input"]} type="text" placeholder="Имя" />
            </label>
            <label className={styles["app-form-label"]}>
              Фамилия:
              <input className={styles["app-form-input"]} type="text" placeholder="Фамилия" />
            </label>
            <label className={styles["app-form-label"]}>
              Отчество:
              <input className={styles["app-form-input"]} type="text" placeholder="Отчество" />
            </label>
            <label className={styles["app-form-label"]}>
              Возраст:
              <input className={styles["app-form-input"]} type="number" placeholder="Возраст" />
            </label>
            <label className={styles["app-form-label"]}>
              Вес:
              <input className={styles["app-form-input"]} type="number" placeholder="Вес" />
            </label>
            <label className={styles["app-form-label"]}>
              Рост:
              <input className={styles["app-form-input"]} type="number" placeholder="Рост" />
            </label>
            <label className={styles["app-form-label"]}>
              Диагноз:
              <input className={styles["app-form-input"]} type="text" placeholder="Диагноз" />
            </label>
            <label className={styles["app-form-label"]}>
              Телефон:
              <input className={styles["app-form-input"]} type="tel" placeholder="Телефон" />
            </label>
            <label className={styles["app-form-label"]}>
              Почта:
              <input className={styles["app-form-input"]} type="email" placeholder="Почта" />
            </label>
          </div>
          <button
            className={styles["app-form-button"]}
            type="button"
            onClick={() => navigate("/patient")}
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatientPage;
