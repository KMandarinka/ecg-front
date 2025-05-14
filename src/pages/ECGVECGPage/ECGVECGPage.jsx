import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ECGVisualization from "../../components/ECGVisualizationForECGVECGPage/ECGVisualization";
import VECGVisualization from "../../components/VECGVisualization/VECGVisualization";
import styles from "./ECGVECGPage.module.css"; // Импорт стилей
import AppHeader from "../../components/AppHeader/AppHeader.jsx";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const ECGVECGPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
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
                    <ECGVisualization />
                </div>
                <div className={styles["right-pane"]}>
                    <VECGVisualization />
                </div>
            </div>
        </div>
    );
};

export default ECGVECGPage;
