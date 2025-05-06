import React, { useState, useEffect } from 'react';
import styles from './Conclusion.module.css';

const Conclusion = ({ fileId, patientId, name }) => { 
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (!token) {
          throw new Error('Токен авторизации отсутствует');
        }

        const response = await fetch('http://localhost:4000/api/v1/analyse/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify({
            file_id: fileId,
            patient_id: patientId,
            name: name || '',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка запроса');
        }

        const data = await response.json();
        setAnalysisData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fileId && patientId && token) {
      fetchAnalysis();
    } else {
      setLoading(false);
      if (!token) setError('Требуется авторизация');
    }
  }, [fileId, patientId, name, token]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <div className={styles["conclusion-container"]}>
      <div className={styles["conclusion-title-container"]}>
        <h2 className={styles["conclusion-title"]}>Заключение</h2>
      </div>

      <div className={styles["conclusion-body"]}>
        <div className={styles["conclusion-field"]}>
          <span className={styles["conclusion-label"]}>Predict:</span>
          <span className={styles["conclusion-value"]}>
            {analysisData?.predict || '—'}
          </span>
        </div>
        <div className={styles["conclusion-field"]}>
          <span className={styles["conclusion-label"]}>Result:</span>
          <span className={styles["conclusion-value"]}>
            {analysisData?.result ?? '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Conclusion;