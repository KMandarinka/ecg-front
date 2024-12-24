import React, { useState } from "react";
import Plot from "react-plotly.js";

const ECGVisualization = () => {
  const [signals, setSignals] = useState([]);
  const [labels, setLabels] = useState([]);
  const [time, setTime] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const dataView = new DataView(arrayBuffer);

      // ----- 1) Парсим основной заголовок (256 байт) -----
      const headerBytes = new TextDecoder("ascii").decode(
        arrayBuffer.slice(0, 256)
      );

      // Количество записей (data records):
      const dataRecordsCount = parseInt(headerBytes.slice(236, 244).trim(), 10);
      // Длительность одной записи (record duration) [сек]:
      const recordDuration = parseFloat(headerBytes.slice(244, 252).trim());
      // Количество сигналов (каналов):
      const signalsCount = parseInt(headerBytes.slice(252, 256).trim(), 10);

      console.log("dataRecordsCount:", dataRecordsCount);
      console.log("recordDuration:", recordDuration);
      console.log("signalsCount:", signalsCount);

      if (
        isNaN(dataRecordsCount) || 
        isNaN(recordDuration) ||
        isNaN(signalsCount) ||
        dataRecordsCount <= 0 ||
        signalsCount <= 0
      ) {
        throw new Error("Некорректные поля заголовка EDF!");
      }

      // ----- 2) Читаем заголовки каналов (по 256 байт на канал) -----
      const signalHeadersStart = 256;
      const signalHeaderLength = 256;

      const channelLabels = [];
      const samplesPerRecordArr = [];
      const physMinArr = [];
      const physMaxArr = [];
      const digMinArr = [];
      const digMaxArr = [];

      for (let ch = 0; ch < signalsCount; ch++) {
        const start = signalHeadersStart + ch * signalHeaderLength;
        const end = start + signalHeaderLength;
        const block = new TextDecoder("ascii").decode(arrayBuffer.slice(start, end));

        // Название канала (Label) — байты 0..15
        const label = block.slice(0, 16).trim();
        channelLabels.push(label);

        // Physical Min / Max — байты 44..51 и 52..59
        const physMin = parseFloat(block.slice(44, 52).trim());
        const physMax = parseFloat(block.slice(52, 60).trim());
        physMinArr.push(isNaN(physMin) ? -1 : physMin);
        physMaxArr.push(isNaN(physMax) ? 1 : physMax);

        // Digital Min / Max — байты 60..67 и 68..75
        const digMin = parseInt(block.slice(60, 68).trim(), 10);
        const digMax = parseInt(block.slice(68, 76).trim(), 10);
        digMinArr.push(isNaN(digMin) ? -32768 : digMin);
        digMaxArr.push(isNaN(digMax) ? 32767 : digMax);

        // Число отсчётов в каждой записи — байты 92..99
        let samplesPerRecord = parseInt(block.slice(92, 100).trim(), 10);
        if (isNaN(samplesPerRecord) || samplesPerRecord <= 0) {
          // fallback — предположим 1000
          samplesPerRecord = 1000;
          console.warn(
            `Канал ${ch}: samplesPerRecord прочиталось некорректно, используем fallback = 1000`
          );
        }
        samplesPerRecordArr.push(samplesPerRecord);
      }

      console.log("channelLabels:", channelLabels);
      console.log("samplesPerRecordArr:", samplesPerRecordArr);

      // ----- 3) Считываем "сырые" данные -----
      // Начало данных:
      const dataRecordsStart = 256 + signalsCount * 256; 
      let pointer = dataRecordsStart;

      // Подготовим массив под каналы:
      const signalsData = Array.from({ length: signalsCount }, () => []);

      // Идём по всем data records:
      for (let rec = 0; rec < dataRecordsCount; rec++) {
        for (let ch = 0; ch < signalsCount; ch++) {
          const nbSamples = samplesPerRecordArr[ch];
          // Каждая точка — 2 байта (Int16):
          const channelSizeBytes = nbSamples * 2;

          // Проверка, чтобы не выйти за пределы файла:
          if (pointer + channelSizeBytes > arrayBuffer.byteLength) {
            console.error(
              `Недостаточно байт в файле для канала ${ch}, record ${rec}. Ожидалось ${
                pointer + channelSizeBytes
              }, а файл заканчивается на ${arrayBuffer.byteLength}`
            );
            break;
          }

          const channelBuffer = arrayBuffer.slice(pointer, pointer + channelSizeBytes);
          pointer += channelSizeBytes;

          const int16Data = new Int16Array(channelBuffer);
          // Дополняем signalsData[ch]
          signalsData[ch].push(...int16Data);
        }
      }

      // Для наглядности выведем длины массивов каждого канала:
      signalsData.forEach((arr, ch) => {
        console.log(
          `Канал ${ch} [${channelLabels[ch]}]: кол-во отсчётов = ${arr.length}`
        );
      });

      // ----- 4) Переведём в физ. значения (по формуле из EDF) -----
      const signalsDataPhysical = signalsData.map((channelData, ch) => {
        const pMin = physMinArr[ch];
        const pMax = physMaxArr[ch];
        const dMin = digMinArr[ch];
        const dMax = digMaxArr[ch];

        return channelData.map((val) => {
          return (
            ((val - dMin) * (pMax - pMin)) / (dMax - dMin) + pMin
          );
        });
      });

      // ----- 5) Создаём ось времени -----
      // Часто в EDF предполагается, что у каждого канала *может быть* разное samplesPerRecord.
      // Для демонстрации возьмём данные первого канала (или того, который нужен).
      // Общая продолжительность = dataRecordsCount * recordDuration (в секундах).
      // Кол-во отсчётов первого канала = dataRecordsCount * samplesPerRecordArr[0].
      // Частота дискретизации (F_s) = samplesPerRecordArr[0] / recordDuration, если оно не 0.

      const totalSamplesCh0 = signalsDataPhysical[0].length;
      // Если у первого канала есть данные:
      let timeArray = [];
      if (totalSamplesCh0 > 0 && recordDuration > 0) {
        const fs = samplesPerRecordArr[0] / recordDuration; // Hz
        for (let i = 0; i < totalSamplesCh0; i++) {
          timeArray.push(i / fs);
        }
      } else {
        // Fallback — просто от 0 до length-1
        console.warn("Не удалось вычислить частоту дискретизации — используем индекс");
        timeArray = signalsDataPhysical[0].map((_, i) => i);
      }

      // Сохраняем в state
      setSignals(signalsDataPhysical);
      setLabels(channelLabels);
      setTime(timeArray);
      setErrorMsg("");

    } catch (err) {
      console.error("EDF parsing error:", err);
      setErrorMsg("Ошибка при чтении/парсинге EDF-файла: " + err.message);
    }
  };

  return (
    <div className="ecg-visualization">
      <h2>Визуализация ЭКГ из EDF</h2>
      <input
        type="file"
        accept=".edf"
        onChange={handleFileUpload}
        className="upload-button"
      />
      {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}

      {signals.length > 0 &&
        signals.map((signal, chIndex) => (
          <div key={chIndex} className="ecg-plot">
            <h3>
              Канал {chIndex + 1}: {labels[chIndex] || `Signal ${chIndex + 1}`}
            </h3>
            <Plot
              data={[
                {
                  x: time,
                  y: signal,
                  type: "scatter",
                  mode: "lines",
                  line: { color: "blue" },
                },
              ]}
              layout={{
                title: `Сигнал: ${labels[chIndex] || `Channel ${chIndex + 1}`}`,
                xaxis: { title: "Время (с)" },
                yaxis: { title: "Амплитуда" },
              }}
              config={{ responsive: true }}
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        ))}
    </div>
  );
};

export default ECGVisualization;
