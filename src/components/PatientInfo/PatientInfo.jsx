import React from 'react';
import styles from './PatientInfo.module.css';

const PatientInfo = ({ patient }) => (
  <div className={styles["patient-info"]}>
    <div className={styles["patient-title-container"]}>
      <h2 className={styles["patient-title"]}>
        Информация от пациенте <span className={styles["edit-icon"]}>✎</span>
      </h2>
    </div>

    <div className={styles["patient-info-body"]}>
      <p className={styles["label"]}>ФИО</p>
      <p className={styles["value"]}>{patient.name}</p>

      <p className={styles["label"]}>Дата рождения</p>
      <p className={styles["value"]}>{patient.data}</p>
      <hr className={styles["divider"]} />


      {/* можно вместо например ИМЯ ФАЙЛА */}
      <p className={styles["label"]}>Вес</p>
      <p className={styles["value"]}>{patient.weight}</p>

      <hr className={styles["divider"]} />
      <p className={styles["label"]}>Телефон</p>
      <p className={styles["value"]}>{patient.phone}</p>

      <p className={styles["label"]}>Почта</p>
      <p className={styles["value"]}>{patient.email}</p>
    </div>
  </div>
);

export default PatientInfo;
