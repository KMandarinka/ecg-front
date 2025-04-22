import React from 'react';
import styles from './Conclusion.module.css';

const Conclusion = ({ predict, result }) => (
  <div className={styles["conclusion-container"]}>
    {/* Верхняя панель с заголовком */}
    <div className={styles["conclusion-title-container"]}>
      <h2 className={styles["conclusion-title"]}>
        Заключение
      </h2>
    </div>

    {/* Основной блок с данными */}
    <div className={styles["conclusion-body"]}>
      <div className={styles["conclusion-field"]}>
        <span className={styles["conclusion-label"]}>Predict:</span>
        <span className={styles["conclusion-value"]}>{predict}</span>
      </div>
      <div className={styles["conclusion-field"]}>
        <span className={styles["conclusion-label"]}>Result:</span>
        <span className={styles["conclusion-value"]}>{result}</span>
      </div>
    </div>
  </div>
);

export default Conclusion;