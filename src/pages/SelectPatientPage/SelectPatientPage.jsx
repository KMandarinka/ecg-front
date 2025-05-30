import React, { useState, useEffect } from "react";
import "../SelectPatientPage/SelectPatientPage.module.css";
import styles from "./SelectPatientPage.module.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import {FiSearch, FiUserPlus, FiUpload, FiUser, FiChevronRight, FiSkipForward} from "react-icons/fi";
import { set as idbSet } from "idb-keyval";

const SelectPatientPage = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [patientIdState, setPatientIdState] = useState("");
  const [fileId, setFileId] = useState("");


  const russianPlural = (count, word, cases = [2, 0, 1, 1, 1, 2]) =>
  `${count} ${word}${
    count % 100 > 4 && count % 100 < 20
      ? 'ов'
      : ['', 'а', 'ов'][cases[Math.min(count % 10, 5)]]
  }`;


  useEffect(() => {
    if (location.state?.file) {
      console.log(
        "[SelectPatientPage] Received uploaded file:",
        location.state.file
      );
      setUploadedFile(location.state.file);
    }
  }, [location.state]);

  const fetchPatients = async (query) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("[SelectPatientPage] fetchPatients:", query);
      const response = await fetch(
        "http://localhost:4000/api/v1/patients/list",
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ limit: 100, offset: 0, search: query }),
        }
      );
      if (!response.ok) {
        const text = await response.text();
        console.error("[SelectPatientPage] fetchPatients error:", text);
        throw new Error("Ошибка при запросе пациентов");
      }
      const data = await response.json();
      return data.patients || [];
    } catch (err) {
      console.error("[SelectPatientPage] fetchPatients exception:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const list = await fetchPatients("");
      setPatients(list);
    })();
  }, []);

  const handleSearch = async () => {
    const list = await fetchPatients(query);
    setPatients(list);
  };

  const handlePatientClick = async (patientId) => {
    if (!uploadedFile) {
      alert("Файл не найден. Загрузите файл перед отправкой.");
      return;
    }

    try {
      console.log("[SelectPatientPage] Uploading for patientId=", patientId);
      const formData = new FormData();
      formData.append("patient_id", String(patientId));
      formData.append("file", uploadedFile);

      for (let [k, v] of formData.entries()) {
        console.log(`FormData ${k}:`, v);
      }


      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/v1/analyse/upload",
        {
          method: "POST",
          headers: { Authorization: token },
          body: formData,
        }
      );

      console.log("[SelectPatientPage] Response status:", response.status);
      const text = await response.text();
      console.log("[SelectPatientPage] Raw response body:", text || "<empty>");

      if (response.status !== 201) {
       throw new Error(`Сервер вернул ${response.status}: ${text}`);
      }

      const files = JSON.parse(text);
      const meta = Array.isArray(files) && files.length > 0 ? files[0] : null;
      setFileId(meta.id); // <-- сохраняем fileId
      setPatientIdState(meta.patient_id); // <-- сохраняем patientId
      if (!meta) {
        throw new Error("Сервер вернул пустой массив метаданных");
      }

      const { id, patient_id, filename = "—", data: rawData } = meta;

      // Парсим вложенную строку data
      let parsedAll;
      try {
        parsedAll = JSON.parse(rawData);
        console.log(files);
        console.log('robot');
        
      } catch (e) {
        console.error("Не удалось распарсить meta.data:", e);
        throw new Error("Неверный формат данных ЭКГ от сервера");
      }

      // Сохраняем каналы ЭКГ (12-канальный) в IndexedDB
      const ecgChannels = parsedAll.channels || parsedAll;
      try {
        await idbSet("ecgData", ecgChannels);
        console.log("[SelectPatientPage] ECG channels saved to IndexedDB");
      } catch (idbErr) {
        console.error("[SelectPatientPage] IndexedDB set error:", idbErr);
      }

      // Сохраняем 3D-вектор из vector_ecg_xyz в IndexedDB
      const vecg = parsedAll.vector_ecg_xyz;
      if (vecg) {
        try {
          await idbSet("vecgData", vecg);
          console.log("[SelectPatientPage] VECG data saved to IndexedDB");
        } catch (idbErr) {
          console.error("[SelectPatientPage] IndexedDB vecg set error:", idbErr);
        }
      }

      // Сохраняем мелкие данные в localStorage
      const patient = patients.find(
        (p) => (p.patient_id || p.id || p._id) === patientId
      );
      if (patient) {
        localStorage.setItem(
          "patientName",
          `${patient.name} ${patient.surname}`
        );
        localStorage.setItem("patientBirthday", patient.birthday);
      }
      localStorage.setItem("filename", filename);

      // Навигация со state, чтобы сразу передать каналы и вектор
      navigate("/patient", {
        state: {
          ecgChannels,
          vecg,
          fileId: id,
          patientId: patient_id,
        },
      });

    } catch (err) {
      console.error("[SelectPatientPage] handlePatientClick error:", err);
      alert(err.message || "Ошибка при отправке файла");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AppHeader />

      <div className={styles.headerContainer}>
        <span className={styles.breadcrumb}>
          <span
            onClick={() => navigate("/main")}
            className={styles.breadcrumbLink}
          >
            Главная
          </span>
          <FiChevronRight className={styles.breadcrumbArrow} />
          <span>Ввод данных</span>
        </span>
        <span className={styles.contactLink}>
          Остались вопросы? Напишите нам
        </span>
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Введите данные пациента</h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="ФИО пациента"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            <FiSearch className={styles.icon} /> Поиск
          </button>
          <button
            onClick={() =>
              navigate("/add-patient", { state: { file: uploadedFile } })
            }
            className={styles.createButton}
          >
            <FiUserPlus className={styles.icon} /> Добавить пациента
          </button>
        </div>

        {uploadedFile && (
          <div className={styles.fileInfo}>
            <FiUpload className={styles.icon} /> Выбран файл:{" "}
            {uploadedFile.name}
          </div>
        )}

        <div className={styles.searchResultContainer}>
          <p>Найдено {russianPlural(patients.length, "пациент")}</p>
        </div>

        <div className={styles.patientList}>
          {isLoading ? (
            <div className={styles.spinner} />
          ) : (
            <div className={styles.scrollableList}>
              {patients.map((p) => {
                const id = p.patient_id || p.id || p._id;
                return (
                  <div
                    key={id}
                    className={styles.patientItem}
                    onClick={() => handlePatientClick(id)}
                  >
                    <p>
                      <strong>
                        <FiUser /> Имя:
                      </strong>{" "}
                      {p.name}
                    </p>
                    <p>
                      <strong>Фамилия:</strong> {p.surname}
                    </p>
                    <p>
                      <strong>День рождения:</strong>{" "}
                      {new Date(p.birthday).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.skipStepWrapper}>
        <button
          className={styles.skipStepButton}
          onClick={() => handlePatientClick(1)}
        >
          <FiSkipForward /> Пропустить
        </button>
      </div>

      <footer className={styles["app-footer"]}>
        <p>© 2025 HeartON. Все права защищены.</p>
      </footer>
    </div>
  );
};
export default SelectPatientPage;