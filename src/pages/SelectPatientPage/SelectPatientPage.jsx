import React, { useState, useEffect } from "react";
import "../SelectPatientPage/SelectPatientPage.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const SelectPatientPage = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем переданный файл через navigate из FileUploadModal
  useEffect(() => {
    if (location.state?.file) {
      setUploadedFile(location.state.file);
    }
  }, [location.state]);

  const fetchPatients = async (query) => {
    setIsLoading(true);
    try {
      var token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/api/v1/patients/list", {
        method: "PUT",
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 100,
          offset: 0,
          search: query
        })
      });

      if (!response.ok) {
        throw new Error("Ошибка при запросе пациентов.");
      }

      const data = await response.json();
      return data.patients || [];
    } catch (error) {
      console.error("Ошибка при запросе пациентов:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
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

  const handlePatientClick = async (patientId) => {
    if (!uploadedFile) {
        alert("Файл не найден. Загрузите файл перед отправкой.");
        return;
    }

    try {
        const formData = new FormData();
        const token = localStorage.getItem("token");

        // Важно: Убедись, что ключи совпадают с теми, которые сервер ожидает
        formData.append("patient_id", String(patientId)); // Преобразование patientId в строку
        formData.append("file", uploadedFile); // Файл добавляется с ключом 'file'

        const response = await fetch("http://localhost:4000/api/v1/analyse/upload", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `${token}` 
            }
        });

        if (response.status !== 201) {  // Сервер должен вернуть 201 при успешной загрузке
            const errorMessage = await response.text();
            throw new Error(`Ошибка при загрузке файла на сервер: ${errorMessage}`);
        }

        const responseData = await response.json();
        console.log("Файл успешно загружен:", responseData);
        alert("Файл успешно загружен!");

        // Перенаправление на следующую страницу или обновление списка пациентов
        navigate(`/patient/${patientId}`);
    } catch (error) {
        console.error("Ошибка при отправке файла:", error);
        alert("Ошибка при отправке файла.");
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
        <p className="search-result">Найдено {patients.length} пациентов</p>
      </div>

      <div className="patient-list">
        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="scrollable-list">
            {patients.map((patient) => {
              const patientId = patient.patient_id || patient.id || patient._id;
              return (
                <div
                  key={patientId}
                  className="patient-item hoverable"
                  onClick={() => handlePatientClick(patientId)}
                >
                  <p><strong>Имя:</strong> {patient.name}</p>
                  <p><strong>Фамилия:</strong> {patient.surname}</p>
                  <p><strong>День рождения:</strong> {new Date(patient.birthday).toLocaleDateString('ru-RU')}</p>
                </div>
              );
            })}

          </div>

        )}
      </div>
    </div>
  );
};

export default SelectPatientPage;
