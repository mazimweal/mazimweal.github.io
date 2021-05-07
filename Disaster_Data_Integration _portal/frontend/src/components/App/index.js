import React from 'react';
import LeafletMap from '../Map';
import FormDisplay from '../FormDisplay';
import ResultsArea from '../ResultsArea';
import "./App.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      polygon: [],
      points: [],
      results: [{"?val":{"termType":"Literal","value":"0.2","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#decimal"}},"?io":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#infomationOV_Amudat"},"?depend":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#DP_Crops_Amudat"},"?Qual":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Vulnerability_Crops_Amudat"},"?o":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Crops_Amudat"},"?ev":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/HazardousEvent#EWE11"},"?pa":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#veryLow"},"?des":{"termType":"Literal","value":"social economic vulnerability computed based on holistic approach for","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#string"}},"?region":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#VI_Crops_Amudat"}},{"?val":{"termType":"Literal","value":"0.5","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#decimal"}},"?io":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#infomationOV_Kitgum"},"?depend":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#DP_Crops_Kitgum"},"?Qual":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Vulnerability_Crops_Kitgum"},"?o":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Crops_Kitgum"},"?ev":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/HazardousEvent#EWE2"},"?pa":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#medium"},"?des":{"termType":"Literal","value":"social economic vulnerability computed based on holistic approach for","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#string"}},"?region":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#VI_Crops_Kitgum"}},{"?val":{"termType":"Literal","value":"0.9","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#decimal"}},"?io":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#infomationOV_Moroto"},"?depend":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#DP_Crops_Moroto"},"?Qual":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Vulnerability_Crops_Moroto"},"?o":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Crops_Moroto"},"?ev":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/HazardousEvent#EWE7"},"?pa":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#veryHigh"},"?des":{"termType":"Literal","value":"social economic vulnerability computed based on holistic approach for","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#string"}},"?region":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#VI_Crops_Moroto"}},{"?val":{"termType":"Literal","value":"0.6","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#decimal"}},"?io":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#infomationOV_Napak"},"?depend":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#DP_Crops_Napak"},"?Qual":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Vulnerability_Crops_Napak"},"?o":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Crops_Napak"},"?ev":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/HazardousEvent#EWE6"},"?pa":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#medium"},"?des":{"termType":"Literal","value":"social economic vulnerability computed based on holistic approach for","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#string"}},"?region":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#VI_Crops_Napak"}},{"?val":{"termType":"Literal","value":"0.95","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#decimal"}},"?io":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#infomationOV_Otuke"},"?depend":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#DP_Crops_Otuke"},"?Qual":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Vulnerability_Crops_Otuke"},"?o":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Crops_Otuke"},"?ev":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/HazardousEvent#EWE10"},"?pa":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#veryHigh"},"?des":{"termType":"Literal","value":"social economic vulnerability computed based on holistic approach for","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#string"}},"?region":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#VI_Crops_Otuke"}},{"?val":{"termType":"Literal","value":"0.6","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#decimal"}},"?io":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#infomationOV_Kotido"},"?depend":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#DP_Crops_Kotido"},"?Qual":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Vulnerability_Crops_Kotido"},"?o":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#Crops_kotido"},"?ev":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/HazardousEvent#EWE5"},"?pa":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#medium"},"?des":{"termType":"Literal","value":"social economic vulnerability computed based on holistic approach for","language":"","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#string"}},"?region":{"termType":"NamedNode","value":"http://w3id.org/gicentre/onto/VVD#VI_Crops_Kotido"}}],
      resultsError: '',
      geojson: null
    };

    this.getPolygons = this.getPolygons.bind(this);
    this.getPoints = this.getPoints.bind(this);
    this.getResults = this.getResults.bind(this);
    this.getGeojsonObject = this.getGeojsonObject.bind(this);
  }

  getPolygons(polygons) {
    this.setState({
      polygon: polygons
    });
  }

  getPoints(points) {
    this.setState({
      points: points
    });
  }

  getResults(error, queryResults) {
    this.setState({
      resultsError: error,
      results: queryResults
    })
  }

  getGeojsonObject(data) {
    this.setState({
      geojson: data
    })
  }

  render() {
    return (
      <div className="full-height-grow AppContainer">
        <div className="AppRowOne">
          <FormDisplay
            hasPolygons={this.getPolygons}
            hasPoints={this.getPoints}
            hasResults={this.getResults}
            hasChoropleth={this.getGeojsonObject}
          />
          <LeafletMap
            polygonsToPlot={this.state.polygon}
            pointsToPlot={this.state.points}
            geojson={this.state.geojson}
          />
        </div>
        {this.state.results.length > 0 && (
          <div className="AppRowTwo">
            <ResultsArea
              results={this.state.results}
              error={this.state.resultsError}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
