import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../AppHeader/AppHeader.css";
import { ReactComponent as LogoIcon } from '../../assets/Vector.svg';
import { ReactComponent as HomeIcon } from '../../assets/home.svg';
import { ReactComponent as NotificationIcon } from '../../assets/notification.svg';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';

const AppHeader = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Левая часть - Логотип */}
        <div className="logo" onClick={() => navigate('/main')}>
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
          <CloseIcon className="iconnn" onClick={handleLogout} />
        </div>
      </nav>

      {/* Модальное окно подтверждения выхода */}
      {showLogoutConfirm && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Покинуть аккаунт?</p>
            <div className="logout-modal-buttons">
              <button onClick={confirmLogout}>Да</button>
              <button onClick={cancelLogout}>Нет</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;