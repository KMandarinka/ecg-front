import React from "react";
import "./MainComponent.css";
import { useNavigate } from "react-router-dom";

const MainComponent = ({ onShowModal }) => {
  const navigate = useNavigate();

  const handleArchiveClick = () => {
    navigate("/archive");
  };

  return (
    <div className="main-container">
      <div className="header-container">
        <span className="breadcrumb">Главная > </span>
        <span className="contact-link">Остались вопросы? Напишите нам</span>
      </div>

      <div className="top-container">
        <h1 className="hearton-text">HeartON</h1>
        <div className="line-container">
          <div className="line"></div>
          <span className="since-text">since 2024</span>
          <div className="line"></div>
        </div>
        <p className="description-text">
          Приложение для анализа сигналов ЭКГ, использующее алгоритмы машинного обучения.
        </p>
      </div>

      <div className="bottom-container">
        <div className="top-buttons-container">
          <button className="button" onClick={onShowModal}>
            <div className="first-line">Загрузите файлы ЭКГ</div>
            <div className="second-line">или перетащите файлы</div>
          </button>
          <button className="button" onClick={handleArchiveClick}>
            <div className="first-line">Архив анализов ЭКГ</div>
          </button>
        </div>

        <button className="how-it-works-button">Как работает программа?</button>
      </div>

      
    </div>
  );
};

export default MainComponent;
