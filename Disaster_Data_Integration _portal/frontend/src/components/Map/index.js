import React from 'react';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import { Icon } from 'leaflet';
import Choropleth from 'react-leaflet-choropleth';
import geojson from '../../helpers/crimes_by_district.json';
import './Map.css';

const style = {
  // fillColor: '#F28F3B',
  weight: 2,
  // opacity: 1,
  color: 'white',
  // dashArray: '3',
  fillOpacity: 0.8
}

export const icon = new Icon({
  iconUrl: '/icon.svg',
  iconSize: [25, 25]
})

const LeafletMap = (props) => {
  const [activePark, setActivePark] = React.useState(null);

  return (
    <div className="MapContainer">
      {/* Has default className .leaflet-container */}
      <Map center={[0.34, 32.5]} zoom={6}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {props.geojson != null && (
          <Choropleth
            data={props.geojson}
            valueProperty={(feature) => feature.properties.value}
            // visible={(feature) => feature.id !== active.id}
            scale={['white', 'red']}
            steps={5}
            mode='e'
            style={style}
            onEachFeature={(feature, layer) => layer.bindPopup(feature.properties.area)}
          />
        )}

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
