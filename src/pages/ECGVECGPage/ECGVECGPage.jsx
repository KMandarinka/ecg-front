import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ECGVisualization from "../../components/ECGVisualizationForECGVECGPage/ECGVisualization";
import VECGVisualization from "../../components/VECGVisualization/VECGVisualization";
import styles from "./ECGVECGPage.module.css"; // Импорт стилей
import AppHeader from "../../components/AppHeader/AppHeader.jsx";

const ECGVECGPage = () => {
    return (
        <div className={styles.wrapper}>
            <AppHeader />
            <div className={styles["header-container"]}>
                <span className={styles["breadcrumb"]}>Главная > Ввод данных > Страница пациента > </span>
                <span className={styles["contact-link"]}>Остались вопросы? Напишите нам</span>
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
