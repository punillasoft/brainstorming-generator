import React, { useState, useEffect } from 'react';
import './BrainstormingGenerator.css';
import Modal from './Modal';

const BrainstormingGenerator = () => {
  const [ideas, setIdeas] = useState([]);
  const [currentIdeas, setCurrentIdeas] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [intervalTime, setIntervalTime] = useState(2000); // Default 2 seconds
  const [showModal, setShowModal] = useState(false);
  const [capturedIdeas, setCapturedIdeas] = useState([]);

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

  useEffect(() => {
    const storedCapturedIdeas = JSON.parse(localStorage.getItem('capturedIdeas')) || [];
    setCapturedIdeas(storedCapturedIdeas);
  }, []);

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
    const id = setInterval(shuffleIdeas, intervalTime);
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
    let newCapturedIdeas = [...capturedIdeas, currentIdeas];
    setCapturedIdeas(newCapturedIdeas);
    localStorage.setItem('capturedIdeas', JSON.stringify(newCapturedIdeas));
    alert('Ideas capturadas!');
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
            min="0.5"
            max="10"
            step="0.5"
            defaultValue="2"
            onChange={handleRangeChange}
          />
        </div>
      </div>
      <button onClick={openModal} style={{position: 'fixed', top: 20, right: 20, padding: '10px', fontSize: '1em', cursor: 'pointer', color: 'white', backgroundColor: 'black', border: '1px solid white', borderRadius: '5px'}}>
        Ver Ideas Capturadas
      </button>
      <Modal showModal={showModal} setShowModal={setShowModal} capturedIdeas={capturedIdeas} />
    </div>
  );
};

export default BrainstormingGenerator;
