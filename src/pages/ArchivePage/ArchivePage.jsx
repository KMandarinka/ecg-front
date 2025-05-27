import React, { useEffect, useState } from "react";
import { List, Spin } from "antd";
import "antd/dist/antd.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import "./ArchivePage.css";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { set as idbSet } from 'idb-keyval';

const ArchivePage = () => {
  // Функция для отображения текста диагноза
  const getDiagnosisLabel = (code) => {
    switch (code) {
      case 1:
        return "Есть заболевание";
      case 2:
        return "Нет заболевания";
      default:
        return String(code);
    }
  };

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patientFiles, setPatientFiles] = useState({});
  const [filesLoading, setFilesLoading] = useState(false);

  const [analyses, setAnalyses] = useState([]);
  const [analysesLoading, setAnalysesLoading] = useState(false);

  const navigate = useNavigate();

  // Русское склонение
  const russianPlural = (count, word, cases = [2, 0, 1, 1, 1, 2]) =>
    `${count} ${word}${
      count % 100 > 4 && count % 100 < 20
        ? "ов"
        : ["", "а", "ов"][cases[Math.min(count % 10, 5)]]
    }`;

  // Загрузка пациентов
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/v1/patients/list", {
          method: "PUT",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify({ limit: 100, offset: 0, search: "" }),
        });
        const data = await res.json();
        setPatients(data.patients || []);
        setFilteredPatients(data.patients || []);
      } catch (e) {
        console.error("Ошибка загрузки пациентов:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Фильтр пациентов
  useEffect(() => {
    setFilteredPatients(
      searchTerm
        ? patients.filter((p) => `${p.name} ${p.surname}`.toLowerCase().includes(searchTerm.toLowerCase()))
        : patients
    );
  }, [searchTerm, patients]);

  // Загрузка EDF-файлов
  const fetchPatientFiles = async (patientId) => {
    if (patientFiles[patientId]) return;
    setFilesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/v1/analyse/list_edf", {
        method: "PUT",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId }),
      });
      const data = await res.json();
      setPatientFiles((prev) => ({ ...prev, [patientId]: data.files || [] }));
    } catch (e) {
      console.error("Ошибка загрузки файлов пациента:", e);
    } finally {
      setFilesLoading(false);
    }
  };

  // Загрузка результатов анализов
  const fetchAnalyses = async (patientId) => {
    setAnalysesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/v1/analyse/patient/list", {
        method: "PUT",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId, filter: { limit: 100, offset: 0, search: "" } }),
      });
      const data = await res.json();
      setAnalyses(data.analyses || []);
    } catch (e) {
      console.error("Ошибка загрузки результатов анализов:", e);
    } finally {
      setAnalysesLoading(false);
    }
  };

  // Клик по пациенту: загрузка файлов и анализов
  const handlePatientClick = (patientId) => {
    const newSel = patientId === selectedPatient ? null : patientId;
    setSelectedPatient(newSel);
    setExpandedPatient(newSel);
    if (newSel) {
      fetchPatientFiles(newSel);
      fetchAnalyses(newSel);
    }
  };

  // Переход на страницу пациента, теперь передаем patientId и fileId
  const handleAnalyseClick = async (patient, file) => {
    try {
      const { filename = "—", data, created_at } = file;
      const analysis = analyses.find((a) => a.file_id === file.id);
      const result = analysis?.result ?? file.result;
      const predict = analysis?.predict ?? file.predict;
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const ecgChannels = parsed.channels;
      const vecg = parsed.vector_ecg_xyz;
      // Сохраняем данные в IndexedDB
      await idbSet("ecgData", ecgChannels);
      if (vecg) await idbSet("vecgData", vecg);

      // Сохраняем в localStorage
      localStorage.setItem("patientName", `${patient.name} ${patient.surname}`);
      localStorage.setItem("patientBirthday", patient.birthday);
      localStorage.setItem("filename", filename);
      localStorage.setItem("fileDate", created_at);
      localStorage.setItem("result", result);
      localStorage.setItem("predict", predict);
      // Добавляем patientId и fileId для передачи
      localStorage.setItem("patientId", patient.id);
      localStorage.setItem("fileId", file.id);

      // Навигация с передачей состояния
      navigate("/patient", { state: { ecgChannels, vecg, patientId: patient.id, fileId: file.id } });
    } catch (err) {
      console.error("[ArchivePage] handleAnalyseClick error:", err);
      alert(err.message || "Ошибка перехода к странице пациента");
    }
  };

  return (
    <div className="archive-page-container">
      <AppHeader />
      <div className="header-container">
        <span className="breadcrumb" onClick={() => navigate("/main")}>Главная <FiChevronRight /> Архив анализов</span>
        <span className="contact-link">Остались вопросы? Напишите нам</span>
      </div>
      <div className="archive-content">
        <h1 className="archive-title">Архив анализов ЭКГ</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск по имени или фамилии..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <p className="search-result">Найдено {russianPlural(filteredPatients.length, "пациент")}</p>
        {loading ? (
          <div className="spinner-container"><Spin size="large" /></div>
        ) : (
          <div className="patients-list-container">
            <List
              dataSource={filteredPatients}
              renderItem={(patient) => (
                <div className={`patient-item-container ${selectedPatient === patient.id ? "selected" : ""}`} onClick={() => handlePatientClick(patient.id)}>
                  <div className="patient-item">
                    <div className="patient-info">
                      <p><strong>Имя:</strong> {patient.name}</p>
                      <p><strong>Фамилия:</strong> {patient.surname}</p>
                      <p><strong>Дата рождения:</strong> {new Date(patient.birthday).toLocaleDateString("ru-RU")}</p>
                    </div>
                    <div className={`patient-indicator ${selectedPatient === patient.id ? "expanded" : ""}`}>{selectedPatient === patient.id ? "▼" : "►"}</div>
                  </div>
                  {expandedPatient === patient.id && (
                    <div className="files-container">
                      {(filesLoading || analysesLoading) ? (
                        <div className="files-loading"><Spin size="small" /></div>
                      ) : (
                        <List
                          dataSource={patientFiles[patient.id] || []}
                          renderItem={(file) => {
                            const analysis = analyses.find((a) => a.file_id === file.id);
                            const result = analysis?.result ?? file.result;
                            const predict = analysis?.predict ?? file.predict;
                            return (
                              <List.Item className="file-item">
                                <div className="file-info">
                                  <p><strong>Файл:</strong> {file.filename}</p>
                                  <p><strong>Размер:</strong> {Math.round(file.size / 1024)} KB</p>
                                  <p><strong>Дата анализа:</strong> {new Date(file.created_at).toLocaleString("ru-RU")}</p>
                                </div>
                                <div className="file-results">
                                  <p><strong>Результат:</strong> {getDiagnosisLabel(result)}</p>
                                  <p><strong>Предсказание:</strong> {getDiagnosisLabel(predict)}</p>
                                </div>
                                <div className="file-action">
                                  <button className="analyse-button" onClick={() => handleAnalyseClick(patient, file)}>Посмотреть анализ</button>
                                </div>
                              </List.Item>
                            );
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
