import React from 'react';
import PatientInfo from '../../components/PatientInfo/PatientInfo';
import ECGVisualization from '../../components/ECGVisualization/ECGVisualization';
import SignalInfo from '../../components/SignalInfo/SignalInfo';
import styles from './PatientPage.module.css';
import AppHeader from "../../components/AppHeader/AppHeader.jsx";

const PatientPage = () => {
    const patient = {
        name: 'Смирнов Андрей Аристархович',
        age: 62,
        weight: 97,
        height: 197,
        diagnosis: 'Амилоидоз',
        phone: '+7 416 723 49 65',
        email: 'hjl@mail.ru'
    };

    return (
        <div className={styles["patient-page"]}>
            <AppHeader />
            <div className={styles["main-body-container"]}>
                <div className={styles["header-container"]}>
                    <span className={styles["breadcrumb"]}>Главная > Ввод данных > Страница пациента > </span>
                    <span className={styles["contact-link"]}>Остались вопросы? Напишите нам</span>
                </div>
                <div className={styles["content-container"]}>
                   <div className={styles["info-container"]}>
                        <PatientInfo patient={patient} />
                    </div>
                    <div className={styles["visualization-container"]}>
                         <div className={styles["ecg-wrapper"]}>
                            <ECGVisualization />
                        </div>
                        <SignalInfo />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientPage;