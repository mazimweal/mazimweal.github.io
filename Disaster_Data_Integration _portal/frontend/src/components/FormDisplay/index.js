import React from 'react';
import axios from 'axios';
import MultiSearch from '../MultiSearch';
import SingleSearch from '../SingleSearch';
import QueryTextArea from '../QueryTextArea';
import Button from '../Button';
import { FaPlay, FaStopCircle, FaMapPin } from 'react-icons/fa';
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
      inputError: ''
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.toggleOffSelectedQuery = this.toggleOffSelectedQuery.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.executeQuery = this.executeQuery.bind(this);
    this.handleDatasourceChange = this.handleDatasourceChange.bind(this);
    this.compileDataSources = this.compileDataSources.bind(this);
    this.mapQuery = this.mapQuery.bind(this);
    this.stopQuery = this.stopQuery.bind(this);
  }

  handleDatasourceChange(input) {
    if (this.state.inputError) {
      this.setState({
        inputError: ''
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

  handleTextInputChange(e) {
    this.toggleOffSelectedQuery();
    if (this.state.inputError) {
      this.setState({
        inputError: ''
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

    // clear/reset results area
    // if there was an error
    if (this.state.error) {
      this.setState({ error: '' });
      this.props.hasResults(this.state.error, []);
    }
    // or if there were results
    if (this.state.results.length > 0) {
      this.setState({ results: [] });
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

      axios.post('/api/query', query, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
        .then(response => {
          this.setState({ loading: false, results: response.data.data });
          this.props.hasResults(this.state.error, this.state.results);
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            this.setState({ loading: false, error: 'Request cancelled' });
            this.props.hasResults(this.state.error, this.state.results);
          } else {
            if (error.response.status === 400 && error.response.data.message === "Parse error") {
              this.setState({ loading: false, error: 'Parse error in query. Cross-check and try again!' });
            } else {
              this.setState({ loading: false, error: 'ERROR occured: TIMEOUT - cross-check query and try again!' });
            }
            this.props.hasResults(this.state.error, this.state.results);
          }
        });
    }
  }

  mapQuery() {
    const resultsArray = this.state.results;
    let multipolygonArray = [];
    let polygonsArray = [];
    let geojsonObject = {
      type: 'FeatureCollection',
      features: []
    };
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

              const findCoordinatesArray = (array) => {
                if (array.length > 1) {
                  return array;
                } else {
                  findCoordinatesArray(array[0])
                }
              }

              const coordinatesArray = findCoordinatesArray(coordinates);

              coordinatesArray.forEach((coordinateParentArray) => {
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

        // FOR CHOROPLETHS
        if (resultObject.hasOwnProperty("?polygon") && resultObject.hasOwnProperty("?spi")) {
          let coordinatesString = resultObject["?polygon"]["value"].toString();
          const spiValue = parseInt(resultObject["?spi"]["value"], 10);      
          const areaName = resultObject["?place"]["value"].toString().split('HazardousEvent#').pop(); // obtained by getting link in ?place.value and picking only Substring at the end

          if (coordinatesString.includes('POLYGON')) {
            coordinatesString = `POLYGON ${coordinatesString.split("POLYGON").pop()}`;
            const formattedPolygon = wkt.parse(coordinatesString);

            if (formattedPolygon.hasOwnProperty("coordinates")) {
              let latLongPolygon = [];
              let coordinates = formattedPolygon['coordinates'][0];

              const findCoordinatesArray = (array) => {
                if (array.length > 1) {
                  return array;
                } else {
                  findCoordinatesArray(array[0])
                }
              }

              const coordinatesArray = findCoordinatesArray(coordinates);

              coordinatesArray.forEach((coordinateParentArray) => {
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

              let feature = {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [latLongPolygon]
                },
                properties: {
                  area: areaName,
                  value: spiValue
                }
              }

              geojsonObject.features.push(feature)
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
      if (geojsonObject.features.length > 0) {
        this.props.hasChoropleth(geojsonObject);
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

        <div className="FormDataSourceArea">
          <p>1. Select Datasource(s)</p>
          <MultiSearch
            onDatasourceChange={this.handleDatasourceChange}
          />
        </div>

        <div className="FormQueryArea">
          <p>2. Select a Query...</p>
          <SingleSearch
            onQueryChange={this.handleQueryChange}
          />

          <p>...Or type a query below</p>
          <QueryTextArea
            name="query"
            value={this.state.isQuerySelected ? this.state.query : this.state.query}
            onChange={(e) => this.handleTextInputChange(e)}
          />

          <div className="FormQueryAreaButtons">
            <Button
              loading={this.state.loading}
              styleType='Execute'
              onClick={this.executeQuery}
              label='run'
              iconComponent={<FaPlay />}
            />

            {
              this.state.loading &&
              <Button
                styleType='Stop'
                onClick={this.stopQuery}
                label='stop'
                iconComponent={<FaStopCircle />}
              />
            }

            <Button
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

          <hr />
        </div>
      </div>
    )
  }
}
