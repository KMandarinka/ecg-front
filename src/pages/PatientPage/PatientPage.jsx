import React, { useState, useEffect } from 'react';
import PatientInfo from '../../components/PatientInfo/PatientInfo';
import ECGVisualization from '../../components/ECGVisualization/ECGVisualization';
import SignalInfo from '../../components/SignalInfo/SignalInfo';
import Conclusion from '../../components/Conclusion/Conclusion';
import styles from './PatientPage.module.css';
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { get as idbGet } from "idb-keyval";


const PatientPage = () => {
  const navigate = useNavigate();

  // Сохраняем пациентские данные из localStorage
  const name = localStorage.getItem("patientName") || "";
  const birthday = localStorage.getItem("patientBirthday") || "";
  const patient = { name, birthday };

  // Локальный стейт для ЭКГ
  const [ecgData, setEcgData] = useState(null);
  const [ecgLoading, setEcgLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Получаем данные ЭКГ из IndexedDB
        const stored = await idbGet("ecgData");
        if (stored) {
          // Если в IndexedDB лежит строка, парсим её, иначе считаем уже объектом
          const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
          console.log("[PatientPage] Loaded ECG from IndexedDB:", parsed);
          setEcgData(parsed);
        } else {
          console.warn("[PatientPage] No ECG found in IndexedDB");
        }
      } catch (err) {
        console.error("[PatientPage] Error reading ECG from IndexedDB:", err);
      } finally {
        setEcgLoading(false);
      }
    })();
  }, []);

  return (
    <div className={styles["patient-page"]}>
      <AppHeader />
      <div className={styles["main-body-container"]}>
        <div className={styles.headerContainer}>
          <span className={styles.breadcrumb}>
            <span onClick={() => navigate("/main")} className={styles.breadcrumbLink}>
              Главная
            </span>
            <FiChevronRight className={styles.breadcrumbArrow} />
            <span>Страница пациента</span>
          </span>
          <span className={styles.contactLink}>Остались вопросы? Напишите нам</span>
        </div>

        <div className={styles["content-container"]}>
          <div className={styles["left-column"]}>
            <PatientInfo patient={patient} />
            <Conclusion predict="Нормальный синусовый ритм" result="Без патологий" />
          </div>
          <div className={styles["right-column"]}>
            <div className={styles["ecg-wrapper"]}>
              {ecgLoading ? (
                <p>Загрузка данных ЭКГ...</p>
              ) : ecgData ? (
                <ECGVisualization ecgData={ecgData} />
              ) : (
                <p>Данные ЭКГ не найдены</p>
              )}
            </div>
            <SignalInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;