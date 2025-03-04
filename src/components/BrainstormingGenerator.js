import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './BrainstormingGenerator.css';

const BrainstormingGenerator = () => {
  const [ideas, setIdeas] = useState([]);
  const [currentIdeas, setCurrentIdeas] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [intervalTime, setIntervalTime] = useState(800); // Default 0.8 seconds
  const [capturedIdeas, setCapturedIdeas] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado inicial en false
  const [speed, setSpeed] = useState(5); // Default speed of 5 seconds

  useEffect(() => {
    fetch('/ideas.json')
      .then(response => response.json())
      .then(data => setIdeas(data));
  }, []);

  useEffect(() => {
    const handleSpaceBar = (event) => {
      if (event.code === 'Space') {
        captureIdeas();
      }
    };

    window.addEventListener('keydown', handleSpaceBar);

    return () => {
      window.removeEventListener('keydown', handleSpaceBar);
    };
  }, [currentIdeas]);

  const shuffleIdeas = () => {
    if (ideas.length > 0) {
      let newIdeas = [];
      for (let i = 0; i < 6; i++) {
        newIdeas.push(ideas[Math.floor(Math.random() * ideas.length)]);
      }
      setCurrentIdeas(newIdeas);
    }
  };

  const startShuffle = () => {
    shuffleIdeas();
    const id = setInterval(shuffleIdeas, speed * 1000);
    setIntervalId(id);
  };

  const stopShuffle = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const handleRangeChange = (event) => {
    const newIntervalTime = event.target.value * 1000; // Convert seconds to milliseconds
    setIntervalTime(newIntervalTime);
    if (intervalId) {
      clearInterval(intervalId);
      const id = setInterval(shuffleIdeas, newIntervalTime);
      setIntervalId(id);
    }
  };

  const captureIdeas = () => {
    const captured = [...capturedIdeas, ...currentIdeas];
    setCapturedIdeas(captured);
    localStorage.setItem('capturedIdeas', JSON.stringify(captured));
  };

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className="brainstorming-generator">
      <div className="grid">
        {currentIdeas.map((idea, index) => (
          <div key={index} className="grid-item">{idea}</div>
        ))}
      </div>
      <div className="controls">
        <button className="play" onClick={startShuffle}>
          &#9658; {/* Play icon */}
        </button>
        <button className="stop" onClick={stopShuffle}>
          &#9632; {/* Stop icon */}
        </button>
        <button className="capture" onClick={captureIdeas}>
          &#128247; {/* Capture icon */}
          <span className="tooltip">Presione la barra espaciadora</span>
        </button>
        <div className="range-input">
          <label className="range-label" htmlFor="speedRange">Velocidad: {intervalTime / 1000}s</label>
          <input 
            id="speedRange"
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            defaultValue="0.8"
            onChange={handleRangeChange}
          />
        </div>
      </div>
      <button onClick={openModal} style={{position: 'fixed', top: 20, right: 20, padding: '10px', fontSize: '1em', cursor: 'pointer', color: 'white', backgroundColor: 'black', border: '1px solid white', borderRadius: '5px'}}>
        Ver Ideas Capturadas
      </button>
      {showModal && (
        <Modal setShowModal={setShowModal} capturedIdeas={capturedIdeas} />
      )}
    </div>
  );
};

export default BrainstormingGenerator;
