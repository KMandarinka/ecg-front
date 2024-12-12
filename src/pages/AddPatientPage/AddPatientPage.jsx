import React from "react";
import { useNavigate } from "react-router-dom";
import "../AddPatientPage/AddPatientPage.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";

const AddPatientPage = () => {
  const navigate = useNavigate(); // Инициализация навигации

  return (
    <div className="add-patient-page">
        <AppHeader />
      <div className="header-container">
        <span className="breadcrumb">Главная > Ввод данных > </span>
        <span className="contact-link">Остались вопросы? Напишите нам</span>
      </div>

      <div className="info-container">
        <h1>Введите данные нового пациента</h1>
        <button className="back-button" onClick={() => navigate("/select-patient")}>
          ← Назад к поиску пациентов
        </button>
      </div>

      <div className="form-container">
        <form>
          <label>
            ФИО:
            <input type="text" placeholder="Введите ФИО" />
          </label>
          <label>
            Возраст:
            <input type="number" placeholder="Введите возраст" />
          </label>
          <label>
            Диагноз:
            <input type="text" placeholder="Введите диагноз" />
          </label>
          <button type="submit">Сохранить пациента</button>
        </form>
      </div>
    </div>
  );
};

export default AddPatientPage;
