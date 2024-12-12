import React, { useState } from "react";
import "../SelectPatientPage/SelectPatientPage.css"; // Импорт стилей
import AppHeader from "../../components/AppHeader/AppHeader.jsx";

const SelectPatientPage = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Флаг для отслеживания поиска

  // Заглушка для API
  const fetchPatients = async (query) => {
    console.log("Выполняется запрос на сервер с параметром:", query);

    // Симуляция задержки запроса (например, 1 секунда)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Пример данных, которые могут вернуться с сервера
    const mockPatients = [
      { id: 1, name: "Иванов Иван Иванович", age: 30, diagnosis: "Грипп" },
      { id: 2, name: "Петров Пётр Петрович", age: 40, diagnosis: "ОРВИ" },
      { id: 3, name: "Сидоров Сидор Сидорович", age: 35, diagnosis: "Ангина" },
    ];

    // Фильтрация данных по введённому ФИО
    return mockPatients.filter((patient) =>
      patient.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearch = async () => {
    if (!query.trim()) return; // Если поле пустое, не выполнять поиск

    setIsLoading(true);
    setHasSearched(true); // Устанавливаем флаг, что поиск был выполнен

    try {
      const results = await fetchPatients(query); // Заглушка для API
      setPatients(results);
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
      <div className="search-result-container">
        {hasSearched && !isLoading && (
          <p className="search-result">
            {patients.length > 0
              ? `Найдено ${patients.length} пациентов`
              : "Пациенты не найдены"}
          </p>
        )}
      </div>

      <div className="patient-list">
        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          patients.map((patient) => (
            <div key={patient.id} className="patient-item">
              <p><strong>ФИО:</strong> {patient.name}</p>
              <p><strong>Возраст:</strong> {patient.age} лет</p>
              <p><strong>Диагноз:</strong> {patient.diagnosis}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectPatientPage;
