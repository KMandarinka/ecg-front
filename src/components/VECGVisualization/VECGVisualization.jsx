import React from "react";
import Plot from "react-plotly.js";
import ecgData from "../../assets/vecg_json.json";
import styles from "./VECGVisualization.module.css"; // Импорт модульных стилей

const VECGVisualization = () => {
    // Форматируем данные из JSON
    const { x, y, z } = ecgData;

    return (
        <div className={styles["ecg-3d-container"]}>
            {/* Шапка (заголовок) */}
            <div className={styles["ecg-title-container"]}>
                <h2 className={styles["ecg-title"]}>3D Визуализация сигнала ЭКГ</h2>
            </div>

            {/* Основной блок с 3D графиком */}
            <div className={styles["ecg-body"]}>
                <Plot
                    data={[
                        {
                            x: x,
                            y: y,
                            z: z,
                            mode: "lines",
                            type: "scatter3d",
                            line: { color: "#1E67F8", width: 2 },
                        },
                    ]}
                    layout={{
                        title: "",
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
                    className={styles.plot}
                    config={{ responsive: true }}
                />
            </div>
        </div>
    );
};

export default VECGVisualization;
