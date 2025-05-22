// src/components/ECGVisualization/ECGVisualization.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./ECGVisualization.module.css";

const dpi = 96;
const mmToPx = dpi / 25.4;
const verticalScaleMmPerMv = 10;

const ECGVisualization = ({ ecgData }) => {
  const [speed, setSpeed] = useState(25);
  const [scale, setScale] = useState(1);
  const canvasRefs = useRef({});

  // 1) Нормализация входных данных:
  const dataObj = useMemo(() => {
    if (!ecgData) return null;

    let parsed = ecgData;
    if (typeof ecgData === "string") {
      try {
        parsed = JSON.parse(ecgData);
      } catch {
        console.error("Invalid JSON in ecgData");
        return null;
      }
    }

    const normalizeChannels = (channels) =>
      channels.reduce((acc, ch) => {
        const { label, signal, timestamps, sample_frequency } = ch;
        if (!Array.isArray(signal)) return acc;

        let xArr;
        if (Array.isArray(timestamps)) {
          xArr = timestamps;
        } else if (typeof sample_frequency === "number") {
          xArr = signal.map((_, i) => i / sample_frequency);
        } else {
          return acc;
        }

        acc[label] = { x: xArr, y: signal };
        return acc;
      }, {});

    if (parsed.channels && Array.isArray(parsed.channels)) {
      return normalizeChannels(parsed.channels);
    }
    if (Array.isArray(parsed)) {
      return normalizeChannels(parsed);
    }
    // Если уже в формате { lead: { x, y } }
    return parsed;
  }, [ecgData]);

  const handleZoomIn = () => setScale((s) => s * 1.2);
  const handleZoomOut = () => setScale((s) => s / 1.2);
  const handleResetScale = () => setScale(1);

  // 2) Отрисовка одного отведения
  const drawLead = (lead, data) => {
    if (!data || !Array.isArray(data.x) || !Array.isArray(data.y)) return;

    const canvas = canvasRefs.current[lead];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const pxPerSec = speed * mmToPx * scale;
    const ampScale = verticalScaleMmPerMv * mmToPx * scale;

    // рисуем линию
    ctx.strokeStyle = "#1E67F8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    data.x.forEach((t, i) => {
      const x = t * pxPerSec;
      const y = h / 2 - data.y[i] * ampScale;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 3) Временные метки через каждые 7 секунд
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.font = "14px 'Frank Ruhl Libre', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const duration = Math.max(...data.x) - Math.min(...data.x);
    for (let t = 0; t <= duration; t ++) {
      const x = t * pxPerSec;
      ctx.fillText(`${t}s`, x, h - 18);
      ctx.beginPath();
      ctx.moveTo(x, h - 22);
      ctx.lineTo(x, h - 16);
      ctx.stroke();
    }

    // подписи lead
    const label = `${lead} 10 мм/мВ ${speed} мм/с`;
    ctx.font = "16px 'Frank Ruhl Libre', serif";
    ctx.textBaseline = "top";
    const pad = 4;
    const metrics = ctx.measureText(label);
    const rectH = parseInt(ctx.font, 10) + pad * 2;
    for (let t = 1; t <= duration; t += 7) {
      const xPos = t * pxPerSec;
      const rectW = metrics.width + pad * 2;
      const rectX = xPos - rectW / 2;
      const rectY = 8;
      ctx.fillStyle = "rgba(255,255,255,0.54)";
      ctx.fillRect(rectX, rectY, rectW, rectH);
      ctx.fillStyle = "#007AFF";
      ctx.fillText(label, xPos, rectY + pad);
    }
  };

  // 4) Хук, который устанавливает размеры canvas и вызывает drawLead
  useEffect(() => {
    if (!dataObj) return;
    Object.entries(dataObj).forEach(([lead, data]) => {
      const canvas = canvasRefs.current[lead];
      if (!canvas) return;
      const duration = Math.max(...data.x) - Math.min(...data.x);
      canvas.width = duration * speed * mmToPx * scale;
      canvas.height = 200;
      drawLead(lead, data);
    });
  }, [speed, scale, dataObj]);

  if (!dataObj) {
    return <p>Данные ЭКГ отсутствуют или неверный формат</p>;
  }

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
        <div className={styles.zoomButtons}>
          <button onClick={handleZoomIn} title="Увеличить">🔍+</button>
          <button onClick={handleZoomOut} title="Уменьшить">🔍−</button>
          <button onClick={handleResetScale} title="Сбросить">↺</button>
        </div>

        <div className={styles.ecgScrollWrapper}>
          <div className={styles.ecgScrollContainer}>
            {Object.entries(dataObj).map(([lead, data]) => (
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

      <Link to="/ecgvecg" state={{ ecgData }} className={styles.detailsText}>
        Подробнее &gt;
      </Link>
    </div>
  );
};

export default ECGVisualization;
