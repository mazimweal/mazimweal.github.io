import React from 'react';
import './QueryTextArea.css';

const QueryTextArea = ({ name, value, onChange }) => (
  <div className="QueryTextAreaContainer">
    <textarea
      className="QueryTextArea"
      rows="15"
      onChange={(e) => onChange(e)}
      name={name}
      value={value}
    />
  </div>
);

export default QueryTextArea;
