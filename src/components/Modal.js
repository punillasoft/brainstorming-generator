import React from 'react';
import './BrainstormingGenerator.css';

const Modal = ({ showModal, setShowModal, capturedIdeas }) => {
  return (
    <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
        <h2>Ideas Capturadas</h2>
        <div className="captured-ideas">
          {capturedIdeas.map((ideas, index) => (
            <div key={index} className="captured-idea">
              {ideas.join(', ')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
