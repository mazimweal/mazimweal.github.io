import React from 'react';
import L from 'leaflet';
import './Map.css';

const mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=';
const token = 'pk.eyJ1Ijoic3RlcGhlbmFyYWthIiwiYSI6ImNrYXBvbWppYzA0Ym4ycXB3cjB6b2J6NW8ifQ.zWw1M-X6a7F2P-Eypnj61g';

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLegend: false
    }
  }

  componentDidMount() {
    const grayscale = L.tileLayer(mapboxUrl + token, {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1
    });
    const streets = L.tileLayer(mapboxUrl + token, {
      id: 'mapbox/streets-v9',
      tileSize: 512,
      zoomOffset: -1
    });
    const dark = L.tileLayer(mapboxUrl + token, {
      id: 'mapbox/dark-v9',
      tileSize: 512,
      zoomOffset: -1
    });

    const baseMaps = {
      "Grayscale": grayscale,
      "Dark": dark,
      "Streets": streets,
    };

    this.map = L.map('map', {
      center: [2.54, 35.0],
      zoom: 7.5,
      maxZoom: 9,
      minZoom: 7,
      zoomControl: true,
      layers: [grayscale, streets, dark]
    });

    L.control.layers(baseMaps, null, { position: 'topleft'} ).addTo(this.map);

    const mapGeoJson = (data) => L.geoJson(data, {
      style: (feature) => this.style(feature),
      onEachFeature: (feature, layer) => {
        console.log(feature);
        const place = feature.properties.place.toLocaleString();
        const spi = feature.properties.spi.toLocaleString();
        const eventClassification = feature.properties.eventClassification.toLocaleString();
        const hazardPotential = feature.properties.hazardPotential.toLocaleString();
        const elementAtRisk = feature.properties.elementAtRisk.toLocaleString();
        const vulnerability = feature.properties.vulnerability.toLocaleString();
        const expectedLoss = feature.properties.expectedLoss.toLocaleString();
        const damagePotential = feature.properties.damagePotential.toLocaleString();

        return (
          layer.bindPopup(`
          ${place && `<p><span style="font-weight: bold">District:</span> ${place}</p>`}
          ${spi && `<p><span style="font-weight: bold;">SPI:</span> ${spi}</p>`}
          ${eventClassification && `<p><span style="font-weight: bold;">Classification of event:</span> ${eventClassification}</p>`}
          ${hazardPotential && `<p><span style="font-weight: bold;">Hazard potential:</span> ${hazardPotential}</p>`}
          ${elementAtRisk && `<p><span style="font-weight: bold;">Element at risk:</span> ${elementAtRisk.split('_')[0]}</p>`}
          ${vulnerability && `<p><span style="font-weight: bold;">Vulnerability:</span> ${vulnerability}</p>`}
          ${expectedLoss && `<p><span style="font-weight: bold;">Expected loss (million UGX):</span> ${expectedLoss}</p>`}
          ${damagePotential && `<p><span style="font-weight: bold;">Damage potential:</span> ${damagePotential}</p>`}
          `)
        );
      }
    }).addTo(this.map);

    this.mapGeoJson = mapGeoJson;
  }

  componentDidUpdate(prevProps) {
    if (this.props.geojson !== prevProps.geojson) {
      this.mapGeoJson(this.props.geojson);
      if (this.state.hasLegend === false) {
        this.createLegend();
      }
    }
  }

  createLegend() {
    this.setState({ hasLegend: true });
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [-2, -1.5, -.1, 1, 1.5, 2];
      let labels = ['<div style="text-align: center;"><strong>SPI</strong></div>'];
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
      fillColor: this.getColor(parseFloat(feature.properties.spi)),
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
