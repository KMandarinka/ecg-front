import React, { useState, useEffect } from 'react';
import styles from './Conclusion.module.css';

const Conclusion = ({ fileId, name }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (fileId && token) {
      const fetchAnalysis = async () => {
        try {
          const response = await fetch(
            'http://localhost:4000/api/v1/analyse/run',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
              },
              body: JSON.stringify({
                file_ids: [fileId],
                name: name || '',
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка запроса');
          }

          const data = await response.json();
          // Берём первый анализ из массива
          const first = Array.isArray(data.analyses) && data.analyses.length > 0
            ? data.analyses[0]
            : null;
          setAnalysis(first);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAnalysis();
    }
  }, [fileId, name, token]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error)   return <div className={styles.error}>Ошибка: {error}</div>;
  if (!analysis) return <div className={styles.error}>Анализ не найден</div>;

  // Форматируем значения до 3 знаков после запятой
  const formattedPredict =
    typeof analysis.predict === 'string'
      ? parseFloat(analysis.predict).toFixed(3)
      : analysis.predict != null
      ? analysis.predict.toFixed(3)
      : '—';

  const formattedResult =
    typeof analysis.result === 'number'
      ? analysis.result.toFixed(3)
      : !isNaN(parseFloat(analysis.result))
      ? parseFloat(analysis.result).toFixed(3)
      : '—';

  return (
    <div className={styles['conclusion-container']}>
      <div className={styles['conclusion-title-container']}>
        <h2 className={styles['conclusion-title']}>Заключение</h2>
      </div>

      <div className={styles['conclusion-body']}>
        <div className={styles['conclusion-field']}>
          <span className={styles['conclusion-label']}>Predict:</span>
          <span className={styles['conclusion-value']}>{formattedPredict}</span>
        </div>
        <div className={styles['conclusion-field']}>
          <span className={styles['conclusion-label']}>Result:</span>
          <span className={styles['conclusion-value']}>{formattedResult}</span>
        </div>
      </div>
    </div>
  );
};

export default Conclusion;