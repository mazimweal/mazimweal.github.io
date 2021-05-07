import React from 'react';
import Spinner from '../Spinner';
import './Button.css';

const Button = (props) => {
  return (
    <button
    className={`ButtonDefault Button${props.styleType} ${props.disable && 'ButtonDisabled'}`}
    onClick={props.onClick}
    disabled={props.disable}>
      {props.loading ? (
        <Spinner />
      ) : (
        <>
          {props.iconComponent}&nbsp;{props.label}
        </>
        )}
    </button>
  );
};

export default Button;
