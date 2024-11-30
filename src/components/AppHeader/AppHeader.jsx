import React from 'react';
import "../AppHeader/AppHeader.css"; // Импорт стилей
import { ReactComponent as LogoIcon } from '../../assets/Vector.svg'; // Путь к вашему SVG файлу
import { ReactComponent as HomeIcon } from '../../assets/home.svg'; // Иконка "Дом"
import { ReactComponent as NotificationIcon } from '../../assets/notification.svg'; // Иконка "Уведомление"
import { ReactComponent as CloseIcon } from '../../assets/close.svg'; // Иконка "Закрыть"

const AppHeader = () => {
  return (
    <nav className="navbar">
      {/* Левая часть - Логотип */}
      <div className="logo">
        <LogoIcon className="logo-icon" />
        HeartON
      </div>

      {/* Правая часть - элементы */}
      <div className="right-section">
        <div className="user-home-group">
          <span className="username">Katesss</span>
          <HomeIcon className="iconn" />
        </div>
        <NotificationIcon className="icon" />
        <CloseIcon className="icon" />
      </div>
    </nav>
  );
};

export default AppHeader;
