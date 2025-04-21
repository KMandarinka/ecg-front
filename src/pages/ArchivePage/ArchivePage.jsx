import React, { useEffect, useState } from "react";
import { List, Spin } from "antd";
import "antd/dist/antd.css";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import "./ArchivePage.css";



const ArchivePage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Добавляем состояние для поиска


  
  // функция для русского склонения
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
          setFilteredPatients(data.patients || []); // Инициализируем отфильтрованный список
        } catch (error) {
          console.error("Ошибка загрузки пациентов:", error);
        } finally {
          setLoading(false);
        }
      };
      

    fetchPatients();
  }, []);

      // Добавляем эффект для фильтрации
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

  return (
    <div className="archive-page-container">
      <AppHeader />
      <div className="header-container">
        <span className="breadcrumb">Главная > Архив анализов > </span>
        <span className="contact-link">Остались вопросы? Напишите нам</span>
      </div>

      <div className="archive-content">
        <h1 className="archive-title">Архив анализов ЭКГ</h1>

          {/* Добавляем строку поиска */}
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
        Найдено {russianPlural(patients.length, 'пациент')}
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
              dataSource={filteredPatients} // Используем отфильтрованный список
              renderItem={(patient) => (
                <List.Item
                  className="patient-item"
                  onClick={() => console.log(`Пациент выбран: ${patient.name} ${patient.surname}`)}
                >
                  <div className="patient-info">
                    <p className="patient-text"><strong>Имя:</strong> {patient.name}</p>
                    <p className="patient-text"><strong>Фамилия:</strong> {patient.surname}</p>
                    <p className="patient-text"><strong>Дата рождения:</strong> {new Date(patient.birthday).toLocaleDateString('ru-RU')}</p>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;