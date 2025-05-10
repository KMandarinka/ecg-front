import React, { useState, useEffect } from "react";
import "../SelectPatientPage/SelectPatientPage.module.css";
import styles from "./SelectPatientPage.module.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiUserPlus, FiUpload, FiUser } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

const SelectPatientPage = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const russianPlural = (count, word, cases = [2, 0, 1, 1, 1, 2]) => {
    return `${count} ${word}${
      count % 100 > 4 && count % 100 < 20
        ? 'ов'
        : ['', 'а', 'ов'][cases[Math.min(count % 10, 5)]]}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (location.state?.file) {
      setUploadedFile(location.state.file);
    }
  }, [location.state]);

  const fetchPatients = async (query) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
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

      if (!response.ok) throw new Error("Ошибка при запросе пациентов.");
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
    const defaultPatients = await fetchPatients("");
    setPatients(defaultPatients);
  };

  useEffect(() => {
    loadDefaultPatients();
  }, []);

  const handleSearch = async () => {
    setHasSearched(true);
    const results = await fetchPatients(query);
    setPatients(results);
  };

  const handlePatientClick = async (patientId) => {
    if (!uploadedFile) {
      alert("Файл не найден. Загрузите файл перед отправкой.");
      return;
    }

    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");
      formData.append("patient_id", String(patientId));
      formData.append("file", uploadedFile);

      const response = await fetch("http://localhost:4000/api/v1/analyse/upload", {
        method: "POST",
        body: formData,
        headers: { "Authorization": `${token}` }
      });

      if (response.status !== 201) {
        const errorMessage = await response.text();
        throw new Error(`Ошибка при загрузке файла на сервер: ${errorMessage}`);
      }

      const responseData = await response.json();
      console.log("Файл успешно загружен:", responseData);
      navigate(`/patient/${patientId}`);
    } catch (error) {
      console.error("Ошибка при отправке файла:", error);
      alert("Ошибка при отправке файла.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AppHeader />

      <div className={styles.headerContainer}>
      <span className={styles.breadcrumb}>
        <span onClick={() => navigate("/main")} className={styles.breadcrumbLink}>
          Главная
        </span>
        <FiChevronRight className={styles.breadcrumbArrow} />
        <span>Ввод данных</span>
      </span>

        <span className={styles.contactLink}>Остались вопросы? Напишите нам</span>
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Введите данные пациента</h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="ФИО пациента"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.searchInput}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <FiSearch className={styles.icon} />
            Поиск
          </button>
          <button
            className={styles.createButton}
            onClick={() => navigate("/add-patient")}
          >
            <FiUserPlus className={styles.icon} />
            Создать пациента
          </button>
        </div>

        {uploadedFile && (
          <div className={styles.fileInfo}>
            <FiUpload className={styles.icon} />
            <span>Выбран файл: {uploadedFile.name}</span>
          </div>
        )}

        <div className={styles.searchResultContainer}>
          <p>Найдено {russianPlural(patients.length, 'пациент')}</p>
        </div>

        <div className={styles.patientList}>
          {isLoading ? (
            <div className={styles.spinner}></div>
          ) : (
            <div className={styles.scrollableList}>
              {patients.map((patient) => {
                const patientId = patient.patient_id || patient.id || patient._id;
                return (
                  <div
                    key={patientId}
                    className={styles.patientItem}
                    onClick={() => handlePatientClick(patientId)}
                  >
                    <p><strong><FiUser /> Имя:</strong> {patient.name}</p>
                    <p><strong>Фамилия:</strong> {patient.surname}</p>
                    <p><strong>День рождения:</strong> {new Date(patient.birthday).toLocaleDateString('ru-RU')}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <footer className={styles["app-footer"]}>
        <p>© 2025 HeartON. Все права защищены.</p>
      </footer>

    </div>
  );
};

export default SelectPatientPage;
