import React from 'react';
import "../AppHeader/AppHeader.css" // Import CSS module
import { ReactComponent as LogoIcon } from '../../assets/Vector.svg'; // Path to your SVG file

const AppHeader = () => {
  return (
    <div className="main-container">
      {/* Navbar (Header) */}
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

   
      <div className="top-container">
        <p>Here is your main content area!</p>
      </div>

      {/* Bottom container with buttons */}
      <div className="bottom-container">
        <button className="button">Button 1</button>
        <button className="button">Button 2</button>
      </div>
    </div>
  );
};

export default AppHeader;
