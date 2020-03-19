import React from 'react';
import './Button.css';

const Button = (props) => {
  return (
    <button className={`ButtonDefault Button${props.styleType}`} onClick={props.onClick}>
      {props.iconComponent}&nbsp;{props.label}
    </button>
  );
};

export default Button;
