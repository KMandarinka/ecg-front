
import React from "react";
import Plot from "react-plotly.js";
import styles from "./VECGVisualization.module.css";

const VECGVisualization = ({ vecgData }) => {
  if (!vecgData) {
    return <p className={styles.error}>3D-данные не найдены</p>;
  }

  // ecgData должен быть объектом { x: [], y: [], z: [] }
  const { x, y, z } = vecgData;

  return (
    <div className={styles["ecg-3d-container"]}>
      <div className={styles["ecg-title-container"]}>
        <h2 className={styles["ecg-title"]}>3D Визуализация сигнала ЭКГ</h2>
      </div>
      <div className={styles["ecg-body"]}>
        <Plot
          data={[
            {
              x,
              y,
              z,
              mode: "lines",
              type: "scatter3d",
              line: { color: "#1E67F8", width: 2 },
            },
          ]}
          layout={{
            autosize: true,
            scene: {
              xaxis: { title: "X" },
              yaxis: { title: "Y" },
              zaxis: { title: "Z" },
            },
            margin: { l: 0, r: 0, t: 0, b: 0 },
            plot_bgcolor: "transparent",
            paper_bgcolor: "transparent",
          }}
          config={{ responsive: true }}
          className={styles.plot}
        />
      </div>
    </div>
  );
};

export default VECGVisualization;