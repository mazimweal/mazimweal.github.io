import React from 'react';
import L from 'leaflet';
import statesData from '../../helpers/us-states.geo.json'
import './Map.css';

const mapboxAccessToken = 'pk.eyJ1Ijoic3RlcGhlbmFyYWthIiwiYSI6ImNrYXBvbWppYzA0Ym4ycXB3cjB6b2J6NW8ifQ.zWw1M-X6a7F2P-Eypnj61g';

class LeafletMap extends React.Component {
  componentDidMount() {
    console.log(this.props.geojson)
    this.map = L.map('map', {
      center: [1, 34],
      zoom: 8,
      zoomControl: false
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
      id: 'mapbox/light-v9',
      // attribution: ...,
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);

    const mapGeoJson = (data) => L.geoJson(data, {
      style: (feature) => this.style(feature),
      onEachFeature: this.onEachFeature
    }).addTo(this.map);

    this.mapGeoJson = mapGeoJson;
    this.mapGeoJson(statesData)
  }

  componentDidUpdate(prevProps){
    if(this.props.geojson !== prevProps.geojson) {
      this.mapGeoJson(this.props.geojson)
    }
  }

  getColor(d) {
    return d > 200 ? 'yellow' : 'red';
  }

  style(feature) {
    return {
      fillColor: this.getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  highlightFeature(e) {
    const layer = e.target;

    console.log(layer);

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  // resetHighlight(e) {
  //   this.geojson.resetStyle(e.target);
  // }

  zoomToFeature(e) {
    this.map.fitBounds(e.target.getBounds());
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature,
      // mouseout: this.resetHighlight,
      click: this.zoomToFeature
    });
  }

  render() {
    return (
      <div id='map' className="MapContainer" />
    );
  }
}

export default LeafletMap;
