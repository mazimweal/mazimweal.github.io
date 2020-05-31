import React from 'react';
import L from 'leaflet';
import statesData from '../../helpers/us-states.geo.json'
import './Map.css';

const mapboxAccessToken = 'pk.eyJ1Ijoic3RlcGhlbmFyYWthIiwiYSI6ImNrYXBvbWppYzA0Ym4ycXB3cjB6b2J6NW8ifQ.zWw1M-X6a7F2P-Eypnj61g';

class LeafletMap extends React.Component {
  componentDidMount() {
    this.map = L.map('map', {
      center: [1.34, 32.5],
      zoom: 7,
      zoomControl: false
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);

    const mapGeoJson = (data) => L.geoJson(data, {
      style: (feature) => this.style(feature),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<p><span style="font-weight: bold">Place:</span> ${feature.properties.area}</p> 
        <p><span style="font-weight: bold;">SPI:</span> ${feature.properties.value.toLocaleString()}</p>`)
      }
    }).addTo(this.map);

    this.mapGeoJson = mapGeoJson;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [-2, -1.5, -.1, 1, 1.5, 2];
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = parseFloat(grades[i]).toFixed(1);
        to = parseFloat(grades[i + 1]).toFixed(1);

        labels.push(
          '<div style="backround-color: white; display: flex;"><div style="margin-right: .5rem; width: 1rem; height: 1rem; background:' + this.getColor(from + 1) + '"></div> ' + from + (parseFloat(to) ? " &ndash; " + to : "+") + '</div>'
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(this.map);
  }

  componentDidUpdate(prevProps) {
    if (this.props.geojson !== prevProps.geojson) {
      console.log(this.props.geojson)
      this.mapGeoJson(this.props.geojson)
    }

    // if(this.props.polygonsToPlot !== prevProps.polygonsToPlot) {
    //   this.mapGeoJson(this.props.polygonsToPlot)
    // }
  }

  getColor(d) {
    return d < -2 ? '#FF0000' :
      d < -1.5 ? '#FF6666' :
        d < -1 ? '#FFB2B2' :
          d < 1 ? '#D5F8D5' :
            d < 1.5 ? '#81EB81' :
              d < 2 ? '#2EDF2E' :
                d < 3 ? '#2EDF2E' : 'red';
  }

  style(feature) {
    return {
      fillColor: this.getColor(parseFloat(feature.properties.value)),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  render() {
    return (
      <div id='map' className="MapContainer" />
    );
  }
}

export default LeafletMap;
