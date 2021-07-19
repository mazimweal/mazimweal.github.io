import React from 'react';
import LeafletMap from '../Map';
import FormDisplay from '../FormDisplay';
import ResultsArea from '../ResultsArea';
import Matrix from '../Matrix';
import "./App.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      polygon: [],
      points: [],
      results: [],
      resultsError: '',
      geojson: null,
      showTable: false
    };

    this.getPolygons = this.getPolygons.bind(this);
    this.getPoints = this.getPoints.bind(this);
    this.getResults = this.getResults.bind(this);
    this.getGeojsonObject = this.getGeojsonObject.bind(this);
    this.toggleShowTable = this.toggleShowTable.bind(this);
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


  toggleShowTable() {
    this.setState({
      showTable: !this.state.showTable
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
        <div className="Header">
          <div className="FormHeading">
            <div className="Heading">early warning system</div>
            <div className="SubHeading">querying multi-agency data sources</div>
            {/* <hr /> */}
          </div>
        </div>
        <div className="AppRowOne">
          <FormDisplay
            hasPolygons={this.getPolygons}
            hasPoints={this.getPoints}
            hasResults={this.getResults}
            hasChoropleth={this.getGeojsonObject}
            toggleShowTable={this.toggleShowTable}
            showTable={this.state.showTable}
          />
          <LeafletMap
            polygonsToPlot={this.state.polygon}
            pointsToPlot={this.state.points}
            geojson={this.state.geojson}
          />
        </div>
        {(this.state.results.length > 0 && this.state.showTable) && (
          <div className="AppRowTwo">
            <ResultsArea
              results={this.state.results}
              error={this.state.resultsError}
            />
          </div>
        )}
        {/* {(this.state.results.length > 0) && ( */}
        {(true) && (
          <Matrix />
        )}
      </div>
    );
  }
}

export default App;
