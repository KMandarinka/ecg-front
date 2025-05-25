import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { get as idbGet } from "idb-keyval";
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import ECGVisualization from "../../components/ECGVisualizationForECGVECGPage/ECGVisualization";
import VECGVisualization from "../../components/VECGVisualization/VECGVisualization";
import { FiChevronRight } from "react-icons/fi";
import styles from "./ECGVECGPage.module.css";

const ECGVECGPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Пытаемся взять сразу из location.state
  const passedChannels = location.state?.ecgChannels || null;
  const passedVecg     = location.state?.vecg        || null;

  const [ecgChannels, setEcgChannels] = useState(passedChannels);
  const [vecgData,     setVecgData]   = useState(passedVecg);
  const [loading,      setLoading]    = useState(!passedChannels || !passedVecg);

  useEffect(() => {
    if (!loading) return;

    (async () => {
      // fallback: читаем оба набора из IndexedDB
      try {
        if (!ecgChannels) {
          const storedChannels = await idbGet("ecgData");
          setEcgChannels(storedChannels || null);
        }
        if (!vecgData) {
          const storedVecg = await idbGet("vecgData");
          setVecgData(storedVecg || null);
        }
      } catch (err) {
        console.error("[ECGVECGPage] IndexedDB read error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [loading, ecgChannels, vecgData]);

  return (
    <div className={styles.wrapper}>
      <AppHeader />

      <div className={styles.headerContainer}>
        <span className={styles.breadcrumb}>
          <span onClick={() => navigate("/main")} className={styles.breadcrumbLink}>
            Главная
          </span>
          <FiChevronRight className={styles.breadcrumbArrow} />
          <span onClick={() => navigate("/patient")} className={styles.breadcrumbLink}>
            Страница пациента
          </span>
          <FiChevronRight className={styles.breadcrumbArrow} />
          3D Визуализация
        </span>
        <span className={styles.contactLink}>Остались вопросы? Напишите нам</span>
      </div>

      <div className={styles.container}>
        <div className={styles["left-pane"]}>
          {loading ? (
            <p>Загрузка ЭКГ...</p>
          ) : ecgChannels ? (
            <ECGVisualization ecgData={ecgChannels} />
          ) : (
            <p>Данные ЭКГ не найдены</p>
          )}
        </div>

        <div className={styles["right-pane"]}>
        {vecgData
            ? <VECGVisualization vecgData={vecgData} />
            : <p>3D-данные не найдены</p>}
        </div>
      </div>
    </div>
  );
};

export default ECGVECGPage;