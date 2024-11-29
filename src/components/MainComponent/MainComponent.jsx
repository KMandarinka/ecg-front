import React from 'react';
import "../MainComponent/MainComponent.css"; // Import CSS module

const MainComponent = () => {
  return (
    <div className="main-container">
      
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

export default MainComponent;
