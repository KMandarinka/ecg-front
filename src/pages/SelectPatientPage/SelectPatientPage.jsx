import React, { useState } from "react";
import "../SelectPatientPage/SelectPatientPage.css"; // Импорт стилей
import AppHeader from "../../components/AppHeader/AppHeader.jsx";

const SelectPatientPage = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Флаг для отслеживания нажатия на поиск

  const handleSearch = async () => {
    if (!query.trim()) return; // Если поле пустое, не выполнять поиск

    setIsLoading(true);
    setHasSearched(true); // Устанавливаем флаг, что поиск был выполнен
    try {
      // Имитируем загрузку списка пациентов с сервера
      const response = await fetch(`/api/patients?query=${query}`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Ошибка при загрузке пациентов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="select-patient-page">
      <AppHeader />
      <div className="header-container">
        <span className="breadcrumb">Главная > Ввод данных > </span>
        <span className="contact-link">Остались вопросы? Напишите нам</span>
      </div>

      <h1>Введите данные пациента</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="ФИО пациента"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Поиск
        </button>
        <button
          className="create-button"
          onClick={() => console.log("Создать пациента")}
        >
          Создать пациента
        </button>
      </div>

      {/* Условие для отображения текста "Найдено N пациентов" */}
      {hasSearched && !isLoading && (
        <p className="search-result">
            {patients.length > 0
            ? `Найдено ${patients.length} пациентов`
            : "Пациенты не найдены"}
        </p>
        )}

      <div className="patient-list">
        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          patients.map((patient, index) => (
            <div key={index} className="patient-item">
              <p>{patient.name}</p>
              <p>{patient.age} лет</p>
              <p>{patient.diagnosis}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectPatientPage;
