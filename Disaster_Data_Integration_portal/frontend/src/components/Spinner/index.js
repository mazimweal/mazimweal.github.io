import React from 'react';
import './Spinner.css';

const Spinner = () => {
  return (
    <div className="SpinnerContainer">
      <svg className="spinner" width="1rem" height="1rem" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  );
}

export default Spinner;
