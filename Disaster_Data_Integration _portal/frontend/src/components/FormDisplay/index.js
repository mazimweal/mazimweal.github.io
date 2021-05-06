import React from 'react';
import axios from 'axios';
import MultiSearch from '../MultiSearch';
import SingleSearch from '../SingleSearch';
import QueryTextArea from '../QueryTextArea';
import Button from '../Button';
import { FaPlay, FaStopCircle, FaMapPin, FaChevronDown } from 'react-icons/fa';
import wkt from 'terraformer-wkt-parser';
import prefixes from '../../helpers/prefixes.json';
import './FormDisplay.css';

let cancel;
const CancelToken = axios.CancelToken;

export default class FormDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datasourceUrls: [],
      query: '',
      isQuerySelected: false,
      results: [],
      loading: false,
      error: '',
      inputError: '',
      queryTime: '',
      hasResults: false,
      showQuery: false
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.toggleOffSelectedQuery = this.toggleOffSelectedQuery.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.executeQuery = this.executeQuery.bind(this);
    this.handleDatasourceChange = this.handleDatasourceChange.bind(this);
    this.compileDataSources = this.compileDataSources.bind(this);
    this.mapQuery = this.mapQuery.bind(this);
    this.stopQuery = this.stopQuery.bind(this);
    this.toggleShowQuery = this.toggleShowQuery.bind(this);
  }

  handleDatasourceChange(input) {
    if (this.state.inputError) {
      this.setState({
        inputError: ''
      });
    }
    if (this.state.error) {
      this.setState({
        error: ''
      });
    }
    this.setState({
      datasourceUrls: input
    });
  }

  handleQueryChange(input) {
    if (this.state.inputError) {
      this.setState({
        inputError: ''
      });
    }
    if (this.state.error) {
      this.setState({
        error: ''
      });
    }
    if (input !== '' && !this.state.isQuerySelected) {
      this.setState({
        isQuerySelected: true
      });
    }
    if (input === '' && this.state.isQuerySelected) {
      this.setState({
        isQuerySelected: false
      });
    }
    this.setState({
      query: input
    });
  }

  toggleOffSelectedQuery() {
    this.setState({
      isQuerySelected: false
    });
  }
  
  toggleShowQuery() {
    this.setState({
      showQuery: !this.state.showQuery
    })
  }

  handleTextInputChange(e) {
    this.toggleOffSelectedQuery();
    if (this.state.inputError) {
      this.setState({
        inputError: ''
      });
    }
    if (this.state.error) {
      this.setState({
        error: ''
      });
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  compileDataSources() {
    let datasources = [];
    const { datasourceUrls } = this.state;
    if (datasourceUrls.length > 0) {
      datasourceUrls.map((datasource) => {
        datasources.push(datasource.value);
        return null;
      });
    }
    return datasources;
  }

  /* this function does:
   1. gets all prefixes from prefixes.json
   2. appends all the prefixes to the query
   3. returns complete query i.e PREFIXES + QUERY
  */
  compileQuery() {
    let prefixesString = '';
    Object.keys(prefixes).map((key) => {
      prefixesString = prefixesString + `PREFIX ${key}: <${prefixes[key]}> \n `;
      return null;
    });
    return `${prefixesString}${this.state.query}`;
  }

  // send compiled query to backend
  executeQuery() {
    const datasources = this.compileDataSources();
    const queryToExecute = this.compileQuery();

    // TIMING THE QUERY
    let startTime, endTime;

    const startTimer = () => {
      startTime = new Date();
    };

    const endTimer = () => {
      endTime = new Date();
      let timeDiff = endTime - startTime; //in ms
      // strip the ms
      timeDiff /= 1000;

      // get seconds 
      const seconds = Math.round(timeDiff);
      this.setState({ queryTime: `${seconds} seconds` });
    }
    // END OF TIMER FUNCTION


    // clear/reset results area
    // if there was an error
    if (this.state.error) {
      this.setState({ error: '' });
      this.props.hasResults(this.state.error, []);
    }
    // or if there were results
    if (this.state.hasResults || this.state.results.length > 0) {
      this.setState({ results: [], hasResults: false });
      this.props.hasResults(this.state.error, []);
    }

    // input validation
    if (!this.state.query && !datasources.length > 0) {
      this.setState({
        inputError: 'Datasource(s) and a query are required'
      });
    } else if (this.state.query && !datasources.length > 0) {
      this.setState({
        inputError: 'Please select at least one datasource'
      });
    } else if (!this.state.query && datasources.length > 0) {
      this.setState({
        inputError: 'Please select or type a query'
      });
    } else {
      const query = {
        datasources,
        query: queryToExecute
      }

      this.setState({ loading: true, results: [] });

      startTimer();

      axios.post('/api/query', query, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
        .then(response => {
          this.setState({ loading: false, results: response.data.data, hasResults: true });
          this.props.hasResults(this.state.error, this.state.results);
          endTimer();
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            this.setState({ loading: false, error: 'Request cancelled' });
            this.props.hasResults(this.state.error, this.state.results);
            endTimer();
          } else {
            if (error.response.status === 400 && error.response.data.message === "Parse error") {
              this.setState({ loading: false, error: 'Parse error. Cross-check query and try again!' });
            } else {
              this.setState({ loading: false, error: 'ERROR occured: TIMEOUT - cross-check query and try again!' });
            }
            this.props.hasResults(this.state.error, this.state.results);
            endTimer();
          }
        });
    }
  }

  mapQuery() {
    const resultsArray = this.state.results;
    let multipolygonArray = [];
    let polygonsArray = [];
    let geojsonArray = [];
    let pointsArray = [];
    let namesArray = [];
    let pointsWithNames = [];

    if (!(resultsArray.length > 0)) {
      console.log('No results to map');
    } else {
      resultsArray.forEach(resultObject => {
        if (resultObject.hasOwnProperty("?xwkt")) {
          let coordinatesString = resultObject["?xwkt"]["value"].toString();

          // CHECK FOR MULTIPOLYGON
          if (coordinatesString.includes('MULTIPOLYGON')) {
            coordinatesString = `MULTIPOLYGON ${coordinatesString.split("MULTIPOLYGON").pop()}`;
            const formattedPolygon = wkt.parse(coordinatesString);

            if (formattedPolygon.hasOwnProperty("coordinates")) {
              let latLongPolygon = [];
              formattedPolygon["coordinates"][0][0].forEach(polygonArray => {
                latLongPolygon.push([polygonArray[1], polygonArray[0]]);
              });
              multipolygonArray.push(latLongPolygon);
            } else {
              console.log("Coordinates array not found");
            }
          }

          // CHECK FOR POINTS
          if (coordinatesString.includes('POINT')) {
            const formattedPoint = wkt.parse(coordinatesString);

            if (formattedPoint.hasOwnProperty("coordinates")) {
              pointsArray.push([formattedPoint["coordinates"][1], formattedPoint["coordinates"][0]]);
            } else {
              console.log("Coordinates array not found");
            }
          }
        }

        // FOR POLYGONS
        if (resultObject.hasOwnProperty("?polygon")) {
          let coordinatesString = resultObject["?polygon"]["value"].toString();

          if (coordinatesString.includes('POLYGON')) {
            coordinatesString = `POLYGON ${coordinatesString.split("POLYGON").pop()}`;
            const formattedPolygon = wkt.parse(coordinatesString);

            if (formattedPolygon.hasOwnProperty("coordinates")) {
              let latLongPolygon = [];
              let coordinates = formattedPolygon['coordinates'][0];

              coordinates.forEach((coordinateParentArray) => {
                let latLongCoordinate = [];
                if (coordinateParentArray.length === 2) {
                  latLongCoordinate.push(coordinateParentArray[1], coordinateParentArray[0]);
                  latLongPolygon.push(latLongCoordinate);
                } else {
                  coordinateParentArray.forEach((coordinateChildArray) => {
                    latLongCoordinate.push(coordinateChildArray[1], coordinateChildArray[0]);
                    latLongPolygon.push(latLongCoordinate);
                  });
                }
              });

              polygonsArray.push(latLongPolygon);
            } else {
              console.log("Coordinates array not found");
            }
          }
        }

        // FOR CHOROPLETHS WITH POLYGONS
        if (resultObject.hasOwnProperty("?polygon") && resultObject.hasOwnProperty("?spi")) {
          console.log(resultObject);

          let coordinatesString = resultObject["?polygon"]["value"].toString();
          const spiValue = parseFloat(resultObject["?spi"]["value"]).toFixed(4);
          const areaName = resultObject["?place"]["value"].toString().split('HazardousEvent#').pop(); // obtained by getting link in ?place.value and picking only Substring at the end
          const classification = resultObject["?hazardous"]["value"].toString().split('HazardousEvent#').pop();
          const hazardPotential = resultObject["?par"]["value"].toString().split('HazardousEvent#').pop();
          const riskElement = resultObject.hasOwnProperty("?o") ? resultObject["?o"]["value"].toString().split('VVD#').pop() : "";
          const vulnerability = resultObject.hasOwnProperty("?pa") ? resultObject["?pa"]["value"].toString().split('VVD#').pop() : "";
          const loss = resultObject.hasOwnProperty("?exl") ? parseFloat(resultObject["?exl"]["value"]).toFixed(2) : "";
          const damagePotential = resultObject.hasOwnProperty("?exlPar") ? resultObject["?exlPar"]["value"].toString().split('VVD#').pop() : "";

          if (coordinatesString.includes('POLYGON')) {
            coordinatesString = `POLYGON ${coordinatesString.split("POLYGON").pop()}`;
            const formattedPolygon = wkt.parse(coordinatesString);

            if (formattedPolygon.hasOwnProperty("coordinates")) {
              let latLongPolygon = [];
              let coordinates = formattedPolygon['coordinates'][0];

              coordinates.forEach((coordinateParentArray) => {
                let latLongCoordinate = [];
                if (coordinateParentArray.length === 2) {
                  latLongCoordinate.push(coordinateParentArray[0], coordinateParentArray[1]);
                  latLongPolygon.push(latLongCoordinate);
                } else {
                  coordinateParentArray.forEach((coordinateChildArray) => {
                    latLongCoordinate.push(coordinateChildArray[0], coordinateChildArray[1]);
                    latLongPolygon.push(latLongCoordinate);
                  });
                }
              });

              let feature = {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [latLongPolygon]
                },
                properties: {
                  place: areaName,
                  spi: spiValue,
                  eventClassification: classification,
                  hazardPotential,
                  elementAtRisk: riskElement,
                  vulnerability,
                  expectedLoss: loss,
                  damagePotential
                }
              }

              geojsonArray.push(feature);
            } else {
              console.log("Coordinates array not found");
            }
          }
        }

        if (resultObject.hasOwnProperty("?name")) {
          const pointName = resultObject["?name"]["value"];
          namesArray.push(pointName);
        }
      });

      // if multipolygons, calls this
      if (multipolygonArray.length > 0) {
        this.props.hasPolygons(multipolygonArray);
      }

      // if polygons, calls this
      if (polygonsArray.length > 0) {
        this.props.hasPolygons(polygonsArray);
      }

      // if choropleth, call this
      if (geojsonArray.length > 0) {
        this.props.hasChoropleth(geojsonArray);
      }

      // if points, call this instead
      if (pointsArray.length > 0) {
        pointsArray.forEach((pointGroup, index) => {
          const location = {
            name: namesArray[index],
            coordinates: pointGroup
          }
          pointsWithNames.push(location);
          debugger;
        });
        this.props.hasPoints(pointsWithNames);
      }
    }
  }

  stopQuery() {
    this.setState({ loading: false, results: [] });
    cancel();
  }

  render() {
    return (
      <div className="FormContainer">
        <div className="FormHeading">
          <h1>query the web of linked data</h1>
          <hr />
        </div>

        <div className="Form">
          <div className="FormDataSourceArea">
            <div className="Label">1. Select Datasource(s)</div>
            <MultiSearch
              onDatasourceChange={this.handleDatasourceChange}
            />
          </div>

          <div className="FormQueryArea">
            <div className="Label">2. Select a Query...</div>
            <SingleSearch
              onQueryChange={this.handleQueryChange}
            />

          <div className="QuerySection">
            <div className="ShowQueryBtn"
              role="presentation"
              onClick={this.toggleShowQuery}
            >
              <>{this.state.showQuery ? 'hide query' : 'show query'}</>
              <FaChevronDown className={`ChevronIcon ${this.state.showQuery && 'Rotate'}`} />
            </div>

          {this.state.showQuery && (
            <>
            <div>You can edit the query below</div>

            <QueryTextArea
              name="query"
              value={this.state.isQuerySelected ? this.state.query : this.state.query}
              onChange={(e) => this.handleTextInputChange(e)}
            />
            </>
          )}
          </div>

            <div className="FormQueryAreaButtons">
              <Button
                disable={false}
                loading={this.state.loading}
                styleType='Execute'
                onClick={this.executeQuery}
                label='run'
                iconComponent={<FaPlay />}
              />

              {
                this.state.loading &&
                <Button
                  disable={false}
                  styleType='Stop'
                  onClick={this.stopQuery}
                  label='stop'
                  iconComponent={<FaStopCircle />}
                />
              }

              <Button
                disable={this.state.results.length > 0 ? false : true}
                styleType='Map'
                onClick={this.mapQuery}
                label='map'
                iconComponent={<FaMapPin />}
              />
            </div>

            {this.state.inputError && (
              <div className="InputError">
                {this.state.inputError}
              </div>
            )}

            {this.state.error && (
              <div className="InputError">
                {this.state.error}
              </div>
            )}

            {this.state.hasResults && (
              <div className="CounterContainer">
                <div className="CounterInfo">
                  <p><span>Result Count:</span>&nbsp;{this.state.results.length}</p>
                  <p><span>Time Taken:</span>&nbsp;{this.state.queryTime}</p>
                </div>
              </div>
            )}

            <hr />
          </div>
        </div>
      </div>
    )
  }
}
