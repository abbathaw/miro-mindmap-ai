// Sidebar.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import congratulations from '../public/congratulations.png';
import { ISideBarSubmitProps } from '../types';

const Sidebar: React.FC<ISideBarSubmitProps> = ({ onSubmit, onExpand, selectedTarget, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text) {
      onSubmit({ text });
      setText('');
    }
  };

  const handleExpand = () => {
    if (text) {
      onExpand({ text });
      setText('');
    }
  };

  return (
    <div className="grid form-sidebar">
      <div className="cs1 ce12">
        <Image src={congratulations} alt="Congratulations text" />
      </div>
      <form className="cs1 ce12 form-sidebar--main-content">
        <div className="form-group">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            className="input input-text"
            placeholder="Type your question"
            value={text}
            onChange={(e) => setText(e.target.value)}
            id="question"
          />
        </div>
      </form>
      <div className="cs1 ce6">
        <button className="button button-primary" type="button" disabled={!text} onClick={handleSubmit}>
          Create mind map
        </button>
      </div>
      {selectedTarget && (
        <div className="cs8 ce12">
          <button className="button button-primary" type="button" disabled={!text} onClick={handleExpand}>
            Expand
          </button>
        </div>
      )}
      {isLoading && (
        <div className="cs1 ce12">
          <span className="label label-info">Thinking...</span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
