import React, { useState, useEffect, useRef } from "react";
import ecgData from "../../assets/ecg_json.json";
import { Link } from "react-router-dom";
import styles from "./ECGVisualization.module.css";

const dpi = 96;
const mmToPx = dpi / 25.4;
const verticalScaleMmPerMv = 10;

const ECGVisualization = () => {
  const [speed, setSpeed] = useState(25);
  const canvasRefs = useRef({});

  const drawLead = (lead, data) => {
    const canvas = canvasRefs.current[lead];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Рисуем кривую
    const pxPerSec = speed * mmToPx;
    const ampScale = verticalScaleMmPerMv * mmToPx;
    ctx.strokeStyle = "#1E67F8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    data.x.forEach((t,i) => {
      const x = t * pxPerSec;
      const y = h/2 - data.y[i]*ampScale;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.stroke();
  };

  useEffect(() => {
    Object.entries(ecgData).forEach(([lead, data]) => {
      const canvas = canvasRefs.current[lead];
      if (!canvas) return;
      
      const duration = Math.max(...data.x) - Math.min(...data.x);
      canvas.width = duration * speed * mmToPx;
      canvas.height = 200;
      
      drawLead(lead, data);
    });
  }, [speed]);

  return (
    <div className={styles.ecgContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Визуализация сигнала ЭКГ</h2>
        <div className={styles.speedSelector}>
          <label>Скорость развертки (мм/c):</label>
          <select value={speed} onChange={e => setSpeed(+e.target.value)}>
            <option value={25}>25 мм/с</option>
            <option value={50}>50 мм/с</option>
          </select>
        </div>
      </div>

      <div className={styles.ecgBody}>
        <div className={styles.ecgScrollContainer}>
          {Object.entries(ecgData).map(([lead]) => (
            <div className={styles.leadBlock} key={lead}>
              <div className={styles.leadHeader}>
                <span className={styles.leadTitle}>{lead}</span>
                <span className={styles.leadSpeed}>{speed} мм/с</span>
              </div>
              <div className={styles.plotWrapper}>
                <canvas ref={el => (canvasRefs.current[lead] = el)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/ecgvecg" className={styles.detailsText}>
        Подробнее &gt;
      </Link>
    </div>
  );
};

export default ECGVisualization;