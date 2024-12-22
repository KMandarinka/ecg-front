import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import styles from './ECGVisualization.module.css';

const generateRealisticECG = (
  amplitudeScale = 1.0,
  timeScale = 1.0,
  noiseLevel = 0.01,
  timeShift = 0.0,
  leadType = 'I'
) => {
  // ... ваш существующий код генерации
  const points = [];
  const sampleRate = 1000;
  const duration = 5;
  const totalSamples = sampleRate * duration;
  
  let pWaveAmplitude = 0.15;
  let rWaveAmplitude = 1.0;
  let sWaveAmplitude = 0.25;
  let tWaveAmplitude = 0.3;
  let qWaveAmplitude = 0.15;

  let leadSpecificModifiers = {
    I: {
      timeShiftModifier: 0.0,
      amplitudeModifier: 0.8,
      rWaveAmplitude: 0.9,
      sWaveAmplitude: 0.1,
      qWaveAmplitude: 0.05,
    },
    II: {
      timeShiftModifier: 0.01,
      amplitudeModifier: 1.0,
      rWaveAmplitude: 1.0,
      sWaveAmplitude: 0.15,
      qWaveAmplitude: 0.05,
    },
    V1: {
      timeShiftModifier: 0.01,
      amplitudeModifier: 0.7,
      rWaveAmplitude: 0.3,
      sWaveAmplitude: 0.3,
      qWaveAmplitude: 0.05,
    },
    V2: {
      timeShiftModifier: 0.02,
      amplitudeModifier: 0.9,
      rWaveAmplitude: 0.5,
      sWaveAmplitude: 0.2,
      qWaveAmplitude: 0.05,
    },
    V3: {
      timeShiftModifier: 0.03,
      amplitudeModifier: 1.0,
      rWaveAmplitude: 0.9,
      sWaveAmplitude: 0.1,
      qWaveAmplitude: 0.05,
    },
    V4: {
      timeShiftModifier: 0.04,
      amplitudeModifier: 1.0,
      rWaveAmplitude: 1.0,
      sWaveAmplitude: 0.1,
      qWaveAmplitude: 0.05,
    },
    V5: {
      timeShiftModifier: 0.05,
      amplitudeModifier: 1.1,
      rWaveAmplitude: 0.9,
      sWaveAmplitude: 0.1,
      qWaveAmplitude: 0.05,
    },
    V6: {
      timeShiftModifier: 0.06,
      amplitudeModifier: 1.2,
      rWaveAmplitude: 0.8,
      sWaveAmplitude: 0.1,
      qWaveAmplitude: 0.05,
    },
  };

  const modifier = leadSpecificModifiers[leadType] || {
    timeShiftModifier: 0.0,
    amplitudeModifier: 1.0,
    rWaveAmplitude: 1.0,
    sWaveAmplitude: 0.25,
  };

  pWaveAmplitude *= modifier.amplitudeModifier;
  rWaveAmplitude *= modifier.amplitudeModifier;
  sWaveAmplitude *= modifier.amplitudeModifier;
  tWaveAmplitude *= modifier.amplitudeModifier;
  qWaveAmplitude *= modifier.qWaveAmplitude;

  rWaveAmplitude *= modifier.rWaveAmplitude || 1.0;
  sWaveAmplitude *= modifier.sWaveAmplitude || 0.25;
  qWaveAmplitude *= modifier.qWaveAmplitude || 0.15;

  const heartRate = 70;
  const beatInterval = 60 / heartRate;
  const numberOfBeats = Math.floor(duration / beatInterval);

  for (let beat = 0; beat < numberOfBeats; beat++) {
    const beatStartTime = beat * beatInterval;
    for (let i = 0; i < totalSamples; i++) {
      const t = (i / sampleRate) * timeScale + timeShift + modifier.timeShiftModifier;
      const timeWithinBeat = t - beatStartTime;
      let y = 0;

      // P Wave
      if (timeWithinBeat > 0.05 * timeScale && timeWithinBeat < 0.15 * timeScale) {
        const pWaveTime = (timeWithinBeat - 0.05 * timeScale) / (0.1 * timeScale);
        y += pWaveAmplitude * Math.sin(Math.PI * pWaveTime) * amplitudeScale;
      }
      // Q Wave
      if (timeWithinBeat > 0.17 * timeScale && timeWithinBeat < 0.2 * timeScale) {
        const qWaveTime = (timeWithinBeat - 0.17 * timeScale) / (0.03 * timeScale);
        y -= qWaveAmplitude * Math.sin(Math.PI * qWaveTime) * amplitudeScale;
      }
      // R Wave
      if (timeWithinBeat > 0.2 * timeScale && timeWithinBeat < 0.26 * timeScale) {
        const rWaveTime = (timeWithinBeat - 0.2 * timeScale) / (0.06 * timeScale);
        y += rWaveAmplitude * Math.sin(Math.PI * rWaveTime) * amplitudeScale;
      }
      // S Wave
      if (timeWithinBeat > 0.26 * timeScale && timeWithinBeat < 0.3 * timeScale) {
        const sWaveTime = (timeWithinBeat - 0.26 * timeScale) / (0.04 * timeScale);
        y -= sWaveAmplitude * Math.sin(Math.PI * sWaveTime) * amplitudeScale;
      }
      // T Wave
      if (timeWithinBeat > 0.35 * timeScale && timeWithinBeat < 0.45 * timeScale) {
        const tWaveTime = (timeWithinBeat - 0.35 * timeScale) / (0.1 * timeScale);
        y += tWaveAmplitude * Math.sin(Math.PI * tWaveTime) * amplitudeScale;
      }

      // Добавляем шум
      y += (Math.random() - 0.5) * noiseLevel * 0.3;
      points.push({ x: t, y });
    }
  }

  return points;
};

const ECGVisualization = () => {
  const [ecgData, setEcgData] = useState({});

  useEffect(() => {
    const leads = ['I', 'II', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
    const newEcgData = {};
    leads.forEach((lead) => {
      newEcgData[lead] = generateRealisticECG(
        1, // amplitudeScale
        1, // timeScale
        0.01, // noiseLevel
        Math.random() * 0.05 - 0.025, // timeShift
        lead
      );
    });
    setEcgData(newEcgData);
  }, []);

  return (
    <div className={styles["ecg-container"]}>
      {/* Шапка (заголовок) */}
      <div className={styles["ecg-title-container"]}>
        <h2 className={styles["ecg-title"]}>Визуализация сигнала ЭКГ</h2>
      </div>

      {/* Основной блок с графиками */}
      <div className={styles["ecg-body"]}>
        {Object.entries(ecgData).map(([lead, points]) => (
          <div className={styles["lead-block"]} key={lead}>
            {/* Заголовок для каждого отведения */}
            <h3 className={styles["lead-title"]}>Отведение {lead}</h3>

            <Plot
              style={{ width: '100%' }}
              data={[
                {
                  x: points.map((point) => point.x),
                  y: points.map((point) => point.y),
                  type: 'scatter',
                  mode: 'lines',
                  line: { shape: 'spline', color: '#1E67F8' },
                  name: lead,
                },
              ]}
              layout={{
                title: '',
                xaxis: {
                  title: 'Время (с)',
                  showgrid: true,
                  zeroline: false,
                  range: [0, 5],
                  gridcolor: '#F2F2F2',
                  automargin: true,
                },
                yaxis: {
                  title: 'Амплитуда (мВ)',
                  showgrid: true,
                  zeroline: false,
                  gridcolor: '#F2F2F2',
                  automargin: true,
                },
                plot_bgcolor: 'transparent',
                paper_bgcolor: 'transparent',
                margin: { l: 60, r: 60, t: 20, b: 40 },
                height: 300,
              }}
              config={{ responsive: true }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ECGVisualization;
