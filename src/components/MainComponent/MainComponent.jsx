import React from 'react';
import "../MainComponent/MainComponent.css"; // Импорт стилей

const MainComponent = () => {
  return (
    <div className="main-container">
      {/* Header section with links */}
      <div className="header-container">
        <span className="breadcrumb">Главная > </span>
        <span className="contact-link">Остались вопросы? Напишите нам</span>
      </div>

      {/* Top section of the main container */}
      <div className="top-container">
        <h1 className="hearton-text">HeartON</h1>
        {/* Добавляем полосочки и текст */}
        <div className="line-container">
          <div className="line"></div>
          <span className="since-text">since 2024</span>
          <div className="line"></div>
        </div>
        <p className="description-text">Приложение для анализа сигналов ЭКГ, использующее алгоритмы машинного обучения.</p>
      </div>

      <div className="bottom-container">
      <div className="top-buttons-container">
        <button className="button">
          <div className="first-line">Загрузите файлы ЭКГ</div>
          <div className="second-line">или перетащите файлы</div>
        </button>
        <button className="button">
          <div className="first-line">История анализов ЭКГ</div>
        </button>
      </div>
      <button className="how-it-works-button">Как работает программа?</button>
    </div>


    </div>
  );
};

export default MainComponent;
