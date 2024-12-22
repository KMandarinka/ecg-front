import React from 'react';
import styles from './SignalInfo.module.css';

const SignalInfo = () => (
    <div className={styles["signal-info"]}>
        <h2>Общая информация о сигнале</h2>
        <div className={styles["info-grid"]}>
            <div>
                <p><strong>ЧСС</strong></p>
                <p>Минимальная: 55 уд./мин.</p>
                <p>Максимальная: 95 уд./мин.</p>
                <p>Средняя: 75 уд./мин.</p>
            </div>
            <div>
                <p><strong>Комплекс QRS</strong></p>
                <p>Ширина QRS: 120 мс</p>
                <p>Амплитуда QRS: 0,6 мВ</p>
                <p>Электрическая ось: -30°</p>
            </div>
        </div>
        <a href="#" className={styles["details-link"]}>Подробнее ></a>
    </div>
);

export default SignalInfo;