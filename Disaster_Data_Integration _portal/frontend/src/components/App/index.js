import React from 'react';
import LeafletMap from '../Map';
import FormDisplay from '../FormDisplay';
import "./App.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      polygon: [],
      points: []
    };

    this.getPolygons = this.getPolygons.bind(this)
    this.getPoints = this.getPoints.bind(this)
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

  render() {
    return (
      <div className="AppContainer">
        <div className="AppContent">
          <FormDisplay
            hasPolygons={this.getPolygons}
            hasPoints={this.getPoints}
          />
          <LeafletMap
            polygonsToPlot={this.state.polygon}
            pointsToPlot={this.state.points}
          />
        </div>
      </div>
    );
  }
}

export default App;
