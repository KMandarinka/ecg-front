import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./ECGVisualization.module.css";

const dpi = 96;
const mmToPx = dpi / 25.4;
const verticalScaleMmPerMv = 10;

// Компонент принимает ecgData и нормализует каналовую структуру, генерируя timestamps при отсутствии
const ECGVisualization = ({ ecgData }) => {
  const [speed, setSpeed] = useState(25);
  const [scale, setScale] = useState(1);
  const canvasRefs = useRef({});

  // Преобразуем API-формат в объект { lead: {x, y} }
  const dataObj = useMemo(() => {
    console.log("[ECG] Incoming ecgData:", ecgData);
    if (!ecgData) return null;

    let parsed = ecgData;
    if (typeof ecgData === "string") {
      try {
        console.log("[ECG] Parsing JSON string...");
        parsed = JSON.parse(ecgData);
        console.log("[ECG] Parsed object:", parsed);
      } catch (err) {
        console.error("[ECG] JSON.parse error:", err);
        return null;
      }
    }

    const normalizeChannels = (channels) =>
      channels.reduce((acc, ch) => {
        console.log("[ECG] Processing channel:", ch.label, ch);
        const { label, signal, timestamps, sample_frequency } = ch;
        if (!Array.isArray(signal)) {
          console.warn(`[ECG] Skipping channel ${label}: no signal array`);
          return acc;
        }

        let xArr;
        if (Array.isArray(timestamps)) {
          console.log(`[ECG] Using provided timestamps for ${label}`);
          xArr = timestamps;
        } else if (typeof sample_frequency === "number") {
          console.log(
          `[ECG] Generating timestamps for ${label} at ${sample_frequency} Hz`
        );
          xArr = signal.map((_, i) => i / sample_frequency);
        } else {
          console.warn(
          `[ECG] Skipping channel ${label}: no timestamps or sample_frequency`
        );
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
    // Если уже в формате { lead: {x,y} }
    return parsed;
  }, [ecgData]);

  const handleZoomIn = () => setScale((s) => s * 1.2);
  const handleZoomOut = () => setScale((s) => s / 1.2);
  const handleResetScale = () => setScale(1);

  const drawLead = (lead, data) => {
    if (!data || !Array.isArray(data.x) || !Array.isArray(data.y)) {
      console.error(`[ECG] drawLead: invalid data for ${lead}`, data);
      return;
    }

    const canvas = canvasRefs.current[lead];
    if (!canvas) {
      console.error(`[ECG] drawLead: no canvas ref for ${lead}`);
      return;
    }

    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const pxPerSec = speed * mmToPx * scale;
    const ampScale = verticalScaleMmPerMv * mmToPx * scale;

    // Рисуем сигнал
    console.log(`[ECG] Drawing lead ${lead}: points=${data.x.length}`);
    ctx.strokeStyle = "#1E67F8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    data.x.forEach((t, i) => {
      const x = t * pxPerSec;
      const y = h / 2 - data.y[i] * ampScale;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Временные метки
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

    // Подписи lead + параметры
    const label = `${lead} 10 мм/мВ ${speed} мм/с`;
    console.log(
      `[ECG] Label for ${lead}: "${label}", canvas size=${w}×${h}`
    );
    ctx.font = "16px 'Frank Ruhl Libre', serif";
    ctx.textBaseline = "top";
    const pad = 4;
    const metrics = ctx.measureText(label);
    const rectH = parseInt(ctx.font, 10) + pad * 2;
    [1, 7].forEach((interval) => {
      for (let t = 1; t <= duration; t += 7) {
        const xPos = t * pxPerSec;
        const rectW = metrics.width + pad * 2;
        const rectX = xPos - rectW / 2;
        const rectY = 8;
        ctx.fillStyle = "rgba(255, 255, 255, 0.54)";
        ctx.fillRect(rectX, rectY, rectW, rectH);
        ctx.fillStyle = "#007AFF";
        ctx.fillText(label, xPos, rectY + pad);
      }
    });
  };

useEffect(() => {
  if (!dataObj) return;
  console.log("[ECG] dataObj normalized:", dataObj);

  Object.entries(dataObj).forEach(([lead, data]) => {
    console.log(`[ECG] useEffect: setting up canvas for ${lead}`);
    const canvas = canvasRefs.current[lead];
    if (!canvas) {
      console.error(`[ECG] useEffect: missing canvas for ${lead}`);
      return;
    }

    const duration = Math.max(...data.x) - Math.min(...data.x);
    const pxWidth = duration * speed * mmToPx * scale;

    console.log(
      `[ECG] Canvas ${lead} → width=${pxWidth.toFixed(2)}, height=200`
    );

    canvas.width = pxWidth;
    canvas.height = 200;
    drawLead(lead, data);
  });
}, [speed, scale, dataObj]);

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
          <button onClick={handleZoomIn} title="Увеличить">
            🔍+
          </button>
          <button onClick={handleZoomOut} title="Уменьшить">
            🔍−
          </button>
          <button onClick={handleResetScale} title="Сбросить">
            ↺
          </button>
        </div>
        <div className={styles.ecgScrollWrapper}>
          <div className={styles.ecgScrollContainer}>
            {dataObj ? (
              Object.entries(dataObj).map(([lead, data]) => (
                <div className={styles.leadBlock} key={lead}>
                  <div className={styles.leadHeader} />
                  <div className={styles.plotWrapper}>
                    <canvas
                      ref={(el) => (canvasRefs.current[lead] = el)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>Данные ЭКГ отсутствуют</p>
            )}
          </div>
        </div>
      </div>
      <Link
       to="/ecgvecg"
       state={{ ecgData }}               // ← вот тут передаём ecgData
       className={styles.detailsText}
     >
       Подробнее &gt;
     </Link>
    </div>
  );
};

export default ECGVisualization;