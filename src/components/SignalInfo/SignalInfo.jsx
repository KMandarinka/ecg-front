  import React from 'react';
  import styles from './SignalInfo.module.css';


  const SignalInfo = () => (
    <div className={styles["signal-info"]}>
      {/* Верхняя панель с заголовком */}
      <div className={styles["signal-title-container"]}>
        <h2 className={styles["signal-title"]}>
          Общая информация о сигнале
        </h2>
      </div>

      {/* Основной блок с данными */}
      <div className={styles["signal-info-body"]}>
        <div className={styles["info-grid"]}>
          <div>
            <p className={styles["category-title"]}>ЧСС</p>

            <div className={styles["parameter-row"]}>
              <span className={styles["sub-label"]}>Минимальная:</span>
              <span className={styles["sub-value"]}>55 уд./мин.</span>
            </div>
            <div className={styles["parameter-row"]}>
              <span className={styles["sub-label"]}>Максимальная:</span>
              <span className={styles["sub-value"]}>95 уд./мин.</span>
            </div>
            <div className={styles["parameter-row"]}>
              <span className={styles["sub-label"]}>Средняя:</span>
              <span className={styles["sub-value"]}>75 уд./мин.</span>
            </div>
          </div>

          <div>
            <p className={styles["category-title"]}>Комплекс QRS</p>

            <div className={styles["parameter-row"]}>
              <span className={styles["sub-label"]}>Ширина QRS:</span>
              <span className={styles["sub-value"]}>120 мс</span>
            </div>
            <div className={styles["parameter-row"]}>
              <span className={styles["sub-label"]}>Амплитуда QRS:</span>
              <span className={styles["sub-value"]}>0,6 мВ</span>
            </div>
            <div className={styles["parameter-row"]}>
              <span className={styles["sub-label"]}>Электрическая ось:</span>
              <span className={styles["sub-value"]}>-30°</span>
            </div>
          </div>
        </div>

        <a href="#" className={styles["details-link"]}>
          Подробнее &gt;
        </a>
      </div>
    </div>
  );

  export default SignalInfo;