import React from 'react';
import "../AppHeader/AppHeader.css"; // Импорт стилей
import { ReactComponent as LogoIcon } from '../../assets/Vector.svg'; // Путь к вашему SVG файлу

const AppHeader = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <LogoIcon className="logo-icon" />
        HeartON
      </div>
      <ul className="navLinks">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#">Blog</a></li>
      </ul>
    </nav>
  );
};

export default AppHeader;
