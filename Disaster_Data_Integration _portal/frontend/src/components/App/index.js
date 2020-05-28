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
      results: [],
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
        <div className={`AppRowOne ${this.state.results.length === 0 && 'AppRowOne-FullHeight'}`}>
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
