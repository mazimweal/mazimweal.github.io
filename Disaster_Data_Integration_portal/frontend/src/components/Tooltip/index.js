import React from 'react';
import './Tooltip.css';

const TooltipInfo = ({ place, damage, hazard }) => {
  return (
    <div className="Tooltip">
      <Place place={place} />
      <DamagePotential damage={damage} />
      <HazardPotential hazard={hazard} />
    </div>
  )
};

const Place = ({ place }) => (
  <div className="TooltipItem">Place:  <span>{ place }</span>  </div>
);

const DamagePotential = ({ damage }) => (
  <div className="TooltipItem">Damage Potential:  <span>{ damage }</span></div>
);

const HazardPotential = ({ hazard }) => (
  <div className="TooltipItem">Hazard Potential:  <span>{ hazard }</span></div>
);

export default TooltipInfo;
