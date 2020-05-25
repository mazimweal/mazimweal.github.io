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
      resultsError: ''
    };

    this.getPolygons = this.getPolygons.bind(this)
    this.getPoints = this.getPoints.bind(this)
    this.getResults = this.getResults.bind(this)
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
    console.log(points);
  }

  getResults(error, queryResults){
    this.setState({
      resultsError: error,
      results: queryResults
    })
  }

  render() {
    return (
      <div className="AppContainer">
        <div className="AppContent">
          <FormDisplay
            hasPolygons={this.getPolygons}
            hasPoints={this.getPoints}
            hasResults={this.getResults}
          />
          <LeafletMap
            polygonsToPlot={this.state.polygon}
            pointsToPlot={this.state.points}
          />
          <ResultsArea
            results={this.state.results}
            error={this.state.resultsError}
          />
        </div>
      </div>
    );
  }
}

export default App;
