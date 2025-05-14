// src/components/ECGVisualization/ECGVisualization.jsx

import React, { useState, useEffect, useRef } from "react";
import ecgData from "../../assets/ecg_json.json";
import { Link } from "react-router-dom";
import styles from "./ECGVisualization.module.css";

const dpi = 96;
const mmToPx = dpi / 25.4;
const verticalScaleMmPerMv = 10;

const ECGVisualization = () => {
  const [speed, setSpeed] = useState(25);
  const [scale, setScale] = useState(1);
  const canvasRefs = useRef({});

  const handleZoomIn = () => setScale((s) => s * 1.2);
  const handleZoomOut = () => setScale((s) => s / 1.2);
  const handleResetScale = () => setScale(1);

  const drawLead = (lead, data) => {
    const canvas = canvasRefs.current[lead];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const pxPerSec = speed * mmToPx * scale;
    const ampScale = verticalScaleMmPerMv * mmToPx * scale;

    // Рисуем сигнал
    ctx.strokeStyle = "#1E67F8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    data.x.forEach((t, i) => {
      const x = t * pxPerSec;
      const y = h / 2 - data.y[i] * ampScale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Временные метки
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.font = "14px 'Frank Ruhl Libre', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const duration = Math.max(...data.x) - Math.min(...data.x);
    for (let t = 0; t <= duration; t++) {
      const x = t * pxPerSec;
      ctx.fillText(`${t}s`, x, h - 18);
      ctx.beginPath();
      ctx.moveTo(x, h - 22);
      ctx.lineTo(x, h - 16);
      ctx.stroke();
    }

    // Подписи lead + параметры
    const label = `${lead} 10 мм/мВ ${speed} мм/с`;
    ctx.font = "16px 'Frank Ruhl Libre', serif";
    ctx.textBaseline = "top";
    const pad = 4;
    const metrics = ctx.measureText(label);
    const rectH = parseInt(ctx.font, 10) + pad * 2;

    // На 1с
    if (duration >= 1) {
      const x1 = 1 * pxPerSec;
      const rectW1 = metrics.width + pad * 2;
      const rectX1 = x1 - rectW1 / 2;
      const rectY = 8;
      ctx.fillStyle = "rgba(255, 255, 255, 0.54)";
      ctx.fillRect(rectX1, rectY, rectW1, rectH);
      ctx.fillStyle = "#007AFF";
      ctx.fillText(label, x1, rectY + pad);
    }
    // Повтор через 7s
    for (let t = 7; t <= duration; t += 7) {
      const x2 = t * pxPerSec;
      const rectW2 = metrics.width + pad * 2;
      const rectX2 = x2 - rectW2 / 2;
      const rectY = 8;
      ctx.fillStyle = "rgba(255, 255, 255, 0.53)";
      ctx.fillRect(rectX2, rectY, rectW2, rectH);
      ctx.fillStyle = "#007AFF";
      ctx.fillText(label, x2, rectY + pad);
    }
  };

  useEffect(() => {
    Object.entries(ecgData).forEach(([lead, data]) => {
      const canvas = canvasRefs.current[lead];
      if (!canvas) return;
      const duration = Math.max(...data.x) - Math.min(...data.x);
      canvas.width = duration * speed * mmToPx * scale;
      canvas.height = 200;
      drawLead(lead, data);
    });
  }, [speed, scale]);

  return (
    <div className={styles.ecgContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Визуализация сигнала ЭКГ</h2>
        <div className={styles.speedSelector}>
          <label>Скорость (мм/с):</label>
          <select value={speed} onChange={(e) => setSpeed(+e.target.value)}>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className={styles.ecgBody}>
        {/* Залипающие кнопки */}
        <div className={styles.zoomButtons}>
          <button onClick={handleZoomIn} title="Увеличить">🔍+</button>
          <button onClick={handleZoomOut} title="Уменьшить">🔍−</button>
          <button onClick={handleResetScale} title="Сбросить">↺</button>
        </div>

        {/* Скроллируемая область */}
        <div className={styles.ecgScrollWrapper}>
          <div className={styles.ecgScrollContainer}>
            {Object.entries(ecgData).map(([lead, data]) => (
              <div className={styles.leadBlock} key={lead}>
                <div className={styles.leadHeader} />
                <div className={styles.plotWrapper}>
                  <canvas ref={(el) => (canvasRefs.current[lead] = el)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link to="/ecgvecg" className={styles.detailsText}>
        Подробнее &gt;
      </Link>
    </div>
  );
};

export default ECGVisualization;
