import React, { useState, useEffect } from "react";
import "../SelectPatientPage/SelectPatientPage.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { useNavigate } from "react-router-dom";

const SelectPatientPage = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // Заглушка для API
  const fetchPatients = async (query) => {
    console.log("Выполняется запрос на сервер с параметром:", query);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockPatients = [
      { id: 1, name: "Иванов Иван Иванович", age: 30, diagnosis: "Грипп" },
      { id: 4, name: "Иванов Сергей Иванович", age: 35, diagnosis: "Грипп" },
      { id: 2, name: "Петров Пётр Петрович", age: 40, diagnosis: "ОРВИ" },
      { id: 3, name: "Сидоров Сидор Сидорович", age: 35, diagnosis: "Ангина" },
    ];

    if (!query.trim()) return mockPatients;
    return mockPatients.filter((patient) =>
      patient.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const loadDefaultPatients = async () => {
    setIsLoading(true);
    try {
      const defaultPatients = await fetchPatients("");
      setPatients(defaultPatients);
    } catch (error) {
      console.error("Ошибка при загрузке пациентов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultPatients();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await fetchPatients(query);
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
          onClick={() => navigate("/add-patient")}
        >
          Создать пациента
        </button>
      </div>

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
            <div
              key={patient.id}
              className="patient-item hoverable"
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
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
