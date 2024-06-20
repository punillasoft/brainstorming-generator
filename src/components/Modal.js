import React, { useState, useEffect } from 'react';
import './BrainstormingGenerator.css';

const Modal = ({ setShowModal, capturedIdeas }) => {
  const [experimentalMode, setExperimentalMode] = useState(false);
  const [floatingItems, setFloatingItems] = useState([]);

  useEffect(() => {
    if (experimentalMode) {
      const intervalId = setInterval(() => {
        const randomItems = [];
        const len = capturedIdeas.length;
        for (let i = 0; i < 4; i++) {
          randomItems.push(capturedIdeas[Math.floor(Math.random() * len)]);
        }
        setFloatingItems(randomItems);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [experimentalMode, capturedIdeas]);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Captured Ideas</h2>
          <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
        </div>
        {!experimentalMode && (
          <div className="modal-body">
            <div className="captured-idea">
              {capturedIdeas.map((idea, index) => (
                <div key={index} >{idea}</div>
              ))}
            </div>
          </div>
        )}
        <button className="boton-experimental-mode" onClick={() => setExperimentalMode(!experimentalMode)}>
          {experimentalMode ? 'Disable' : 'Enable'} Experimental Mode
        </button>
        {experimentalMode && (
          <div className="floating-container">
            {floatingItems.map((item, index) => (
              <div key={index} className="floating-item"
              style={{
                top: `${Math.random() * 50}vh`, // Posición vertical aleatoria dentro del 0-80% de la altura del modal
                left: `${Math.random() * 50}vw`, // Posición horizontal aleatoria dentro del 0-80% del ancho del modal
                transform: `rotate(${(Math.random() - 0.5) * 40}deg)` // Rotación aleatoria entre -15deg y 15deg
              }}
              >{item}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;