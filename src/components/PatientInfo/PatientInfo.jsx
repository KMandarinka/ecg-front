import React from 'react';
import styles from './PatientInfo.module.css';

const PatientInfo = ({ patient }) => {
  // Берём приоритетно из пропсов, иначе — из localStorage, иначе — дефис
  const fullName =
    localStorage.getItem("patientName") 
      ? localStorage.getItem("patientName") || '—'
      : `${patient.name} ${patient.surname}` ;

    const rawBirthday = localStorage.getItem("patientBirthday");

    const birthday = rawBirthday
      ? (() => {
          const d = new Date(rawBirthday);
          const day   = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year  = d.getFullYear();
          return `${day}-${month}-${year}`;
        })()
      : '—';

  
  const filename =
    patient.filename // если передаётся из пропсов
      ? patient.filename
      : localStorage.getItem("filename") || '—';

  return (
    <div className={styles["patient-info"]}>
      <div className={styles["patient-title-container"]}>
        <h2 className={styles["patient-title"]}>
          Информация о пациенте <span className={styles["edit-icon"]}>✎</span>
        </h2>
      </div>

      <div className={styles["patient-info-body"]}>
        <p className={styles["label"]}>ФИО</p>
        <p className={styles["value"]}>{fullName}</p>

        <p className={styles["label"]}>Дата рождения</p>
        <p className={styles["value"]}>{birthday}</p>
        <hr className={styles["divider"]} />

        <p className={styles["label"]}>Имя файла</p>
        <p className={styles["value"]}>{filename}</p>
        <hr className={styles["divider"]} />

        <p className={styles["label"]}>Телефон</p>
        <p className={styles["value"]}>{patient.phone || '—'}</p>

        <p className={styles["label"]}>Почта</p>
        <p className={styles["value"]}>{patient.email || '—'}</p>
      </div>
    </div>
  );
};

export default PatientInfo;
