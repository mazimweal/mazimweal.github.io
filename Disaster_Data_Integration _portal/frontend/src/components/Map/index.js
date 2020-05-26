import React from 'react';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import { Icon, CRS } from 'leaflet';

import './Map.css';

export const icon = new Icon({
  iconUrl: '/icon.svg',
  iconSize: [25, 25]
})

const LeafletMap = (props) => {
  const [activePark, setActivePark] = React.useState(null);

  return (
    <div className="MapContainer">
      {/* //! KAMPALA <Map center={[0.34, 32.5]} zoom={12}> */}

      {/* Has default className .leaflet-container */}
      {/* <Map crs={CRS.EPSG4326} center={[0.34, 32.5]} zoom={12}> */}
      <Map center={[0.34, 32.5]} zoom={6}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {props.polygonsToPlot.length > 0 && (
          <Polygon
            positions={props.polygonsToPlot}
            color="red"
          />
        )}

        {props.pointsToPlot.length > 0 && (
          props.pointsToPlot.map((location, index) => (
            <Marker
              key={index}
              position={location.coordinates}
              icon={icon}
              onClick={() => {
                setActivePark(location);
              }}
            />
          ))
        )}

        {activePark && (
          <Popup
            position={activePark.coordinates}
            onClose={() => {
              setActivePark(null);
            }}
          >
            <div>
              <h2>{activePark.name}</h2>
            </div>
          </Popup>
        )}

      </Map>
    </div>
  );
}

export default LeafletMap;
