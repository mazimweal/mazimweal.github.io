import React from 'react';
import Spinner from '../Spinner';
import './Button.css';

const Button = (props) => {
  return (
    <button className={`ButtonDefault Button${props.styleType}`} onClick={props.onClick}>
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
