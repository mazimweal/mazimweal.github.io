import { Map, Tile } from './MapComponents';
import React from 'react';

const mapContainerStyle = {
  height: `100%`,
  width: `100%`,
};

const defaultMapState = {
  center: [0.34, 32.5],
  zoom: 6,
  zoomSnap: 0,
  zoomDelta: 0.5,
};

const logEvent = console.log;

export default ({ children, defaultValue, ...props }) => (
  <div style={mapContainerStyle}>
    <Map
      on={{
        resize: logEvent,
        move: logEvent,
        zoom: logEvent,
      }}
      defaultValue={{ ...defaultMapState, ...defaultValue }}
      {...props}
    >
      <Tile type="wiki" />
      {children}
    </Map>
  </div>
);
