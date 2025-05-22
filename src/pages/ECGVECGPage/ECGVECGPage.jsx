
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ECGVisualization from "../../components/ECGVisualizationForECGVECGPage/ECGVisualization";
import VECGVisualization from "../../components/VECGVisualization/VECGVisualization";
import styles from "./ECGVECGPage.module.css"; // Импорт стилей
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const ECGVECGPage = () => {

    const navigate = useNavigate();
    const location = useLocation();


    const passed = location.state?.ecgData || null;
  const [ecgData, setEcgData] = useState(passed);
  const [loading, setLoading] = useState(!passed);

  useEffect(() => {
    if (ecgData || !loading) return;
    // здесь, по желанию, можно делать fallback на IndexedDB
    setLoading(false);
  }, [ecgData, loading]);
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
                  ) : ecgData ? (
                    <ECGVisualization ecgData={ecgData} />
                  ) : (
                    <p>Данные ЭКГ не найдены</p>
                  )}
        +       </div>
                <div className={styles["right-pane"]}>
                    <VECGVisualization />
                </div>
            </div>
        </div>
    );
};

export default ECGVECGPage;
