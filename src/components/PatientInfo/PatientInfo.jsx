import React from 'react';
import styles from './PatientInfo.module.css';

const PatientInfo = ({ patient }) => (
    <div className={styles["patient-info"]}>
        <h2>Информация от пациента</h2>
        <p><strong>ФИО:</strong> {patient.name}</p>
        <p><strong>Возраст:</strong> {patient.age}</p>
        <p><strong>Вес:</strong> {patient.weight}</p>
        <p><strong>Рост:</strong> {patient.height}</p>
        <p><strong>Диагноз:</strong> {patient.diagnosis}</p>
        <p><strong>Телефон:</strong> {patient.phone}</p>
        <p><strong>Почта:</strong> {patient.email}</p>
    </div>
);

export default PatientInfo;