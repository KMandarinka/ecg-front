import React from 'react';
import "../MainComponent/MainComponent.css"; // Импорт стилей

const MainComponent = () => {
  return (
    <div className="main-container">
      {/* Top section of the main container (below the header) */}
      <div className="top-container">
        <h1 className="hearton-text">HeartON</h1>
        <p className="description-text">Приложение для анализа сигналов ЭКГ, использующего алгоритмы машинного обучения.</p>
      </div>

      {/* Bottom container with buttons */}
      <div className="bottom-container">
        <button className="button">
          <div className="first-line">Загрузите файлы ЭКГ</div>
          <div className="second-line">или перетащите файлы</div>
        </button>
        <button className="button">
          <div className="first-line">История анализов</div>
          <div className="second-line">ЭКГ</div>
        </button>
      </div>
    </div>
  );
};

export default MainComponent;
