import React, { useEffect, useState } from "react";
import { List, Spin } from "antd";
import "antd/dist/antd.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import "./ArchivePage.css";

const ArchivePage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [patientFiles, setPatientFiles] = useState({});
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const russianPlural = (count, word, cases = [2, 0, 1, 1, 1, 2]) => {
    return `${count} ${word}${
      count % 100 > 4 && count % 100 < 20
        ? 'ов'
        : ['', 'а', 'ов'][cases[Math.min(count % 10, 5)]]
    }`;
  };

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
    
        const response = await fetch("http://localhost:4000/api/v1/patients/list", {
          method: "PUT",
          headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ limit: 100, offset: 0, search: "" }),
        });
    
        const data = await response.json();
        setPatients(data.patients || []);
        setFilteredPatients(data.patients || []);
      } catch (error) {
        console.error("Ошибка загрузки пациентов:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.surname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const fetchPatientFiles = async (patientId) => {
    if (patientFiles[patientId]) return;
    
    setFilesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/v1/analyse/list_edf", {
        method: "PUT",
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient_id: patientId }),
      });
      
      const data = await response.json();
      setPatientFiles(prev => ({
        ...prev,
        [patientId]: data.files || []
      }));
    } catch (error) {
      console.error("Ошибка загрузки файлов пациента:", error);
    } finally {
      setFilesLoading(false);
    }
  };

  const handlePatientClick = (patientId) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
      setSelectedPatient(null);
    } else {
      setExpandedPatient(patientId);
      setSelectedPatient(patientId);
      fetchPatientFiles(patientId);
    }
  };

  return (
    <div className="archive-page-container">
      <AppHeader />
      <div className="header-container">
        <span className="breadcrumb">Главная > Архив анализов > </span>
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

        <div className="search-result-container">
          <p className="search-result">
            Найдено {russianPlural(filteredPatients.length, 'пациент')}
          </p>
        </div>

        {loading ? (
          <div className="spinner-container">
            <Spin size="large" />
          </div>
        ) : (
          <div className="patients-list-container">
            <List
              itemLayout="vertical"
              dataSource={filteredPatients}
              renderItem={(patient) => (
                <div 
                  className={`patient-item-container ${selectedPatient === patient.id ? 'selected' : ''}`}
                  onClick={() => handlePatientClick(patient.id)}
                >
                  <div className="patient-item">
                    <div className="patient-info">
                      <p className="patient-text"><strong>Имя:</strong> {patient.name}</p>
                      <p className="patient-text"><strong>Фамилия:</strong> {patient.surname}</p>
                      <p className="patient-text"><strong>Дата рождения:</strong> {new Date(patient.birthday).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div className={`patient-indicator ${selectedPatient === patient.id ? 'expanded' : ''}`}>
                      {selectedPatient === patient.id ? '▼' : '►'}
                    </div>
                  </div>
                  
                  {expandedPatient === patient.id && (
                    <div className="files-container">
                      {filesLoading ? (
                        <div className="files-loading">
                          <Spin size="small" />
                        </div>
                      ) : (
                        <div className="files-list">
                          {patientFiles[patient.id]?.length > 0 ? (
                            <List
                              dataSource={patientFiles[patient.id]}
                              renderItem={(file) => (
                                <List.Item className="file-item">
                                  <div>
                                    <p><strong>Файл:</strong> {file.filename}</p>
                                    <p><strong>Размер:</strong> {Math.round(file.size / 1024)} KB</p>
                                    <p><strong>Дата создания:</strong> {new Date(file.created_at).toLocaleString('ru-RU')}</p>
                                  </div>
                                </List.Item>
                              )}
                            />
                          ) : (
                            <p className="no-files">Нет файлов для этого пациента</p>
                          )}
                        </div>
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