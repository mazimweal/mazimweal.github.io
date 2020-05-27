import React from 'react';
import Choropleth from './Choropleth';
import './Map.css';

const LeafletMap = (props) => {
  return (
    <div className="MapContainer">
      <Choropleth data={props.geojson}/>
    </div>
  );
}

export default LeafletMap;
