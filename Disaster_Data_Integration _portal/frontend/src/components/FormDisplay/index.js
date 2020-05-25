import React from 'react';
import axios from 'axios';
import MultiSearch from '../MultiSearch';
import SingleSearch from '../SingleSearch';
import QueryTextArea from '../QueryTextArea';
import Button from '../Button';
import { FaRocket, FaStopCircle, FaMapPin } from 'react-icons/fa';
import wkt from 'terraformer-wkt-parser';
import prefixes from '../../helpers/prefixes.json';
import './FormDisplay.css';
import Spinner from '../Spinner';

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
    }
    // or if there were results
    if (this.state.results.length > 0) {
      this.setState({ results: [] });
    }

    // input validation
    // if (!this.state.query || !datasources.length > 0) {
    //   this.setState({
    //     inputError: 'Please select datasource & enter query'
    //   });
    // } else {
      const query = {
        datasources,
        query: queryToExecute
      }

      window.location.href = '#query-results';
      this.setState({ loading: true, results: [] });

      axios.post('/api/query', query)
        .then(response => {
          this.setState({ loading: false, results: response.data.data });
          console.log(response.data.data);
        })
        .catch(error => {
          this.setState({ loading: false, error: 'ERROR occured: TIMEOUT - cross-check query and try again!' });
          console.log(error)
        });
    // }
  }

  mapQuery() {
    const resultsArray = this.state.results;
    let multipolygonArray = [];
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

        if (resultObject.hasOwnProperty("?name")) {
          const pointName = resultObject["?name"]["value"];
          namesArray.push(pointName);
        }
      });

      // if polygons, calls this
      if (multipolygonArray.length > 0) {
        this.props.hasPolygons(multipolygonArray);
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
              styleType='Execute'
              onClick={this.executeQuery}
              label='execute'
              iconComponent={<FaRocket />}
            />

            {
              this.state.loading &&
              <Button
                styleType='Stop'
                onClick={this.executeQuery}
                label='stop'
                iconComponent={<FaStopCircle />}
              />
            }

            <Button
              styleType='Map'
              onClick={this.mapQuery}
              label='map query'
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


        <div id="query-results" className="FormQueryResults">
          <h2>Query results</h2>
          <div className="QueryResultsDisplay">
            {this.state.loading && <Spinner />}
            {this.state.error ? this.state.error : (
              this.state.results.map((result, index) => (
                <div key={index}>
                  {Object.keys(result).map((keyName, index) => (
                    <div key={index}><p className="QueryResultHeading1">{keyName}&nbsp;:</p> {
                      Object.keys(result[keyName]).map((keyName2, index) => (
                        typeof result[keyName][keyName2] !== 'object' ?
                          <div key={index}><p className="QueryResultHeading2">{keyName2}&nbsp;:</p> {result[keyName][keyName2]}</div> :
                          Object.keys(result[keyName][keyName2]).map((keyName3, index) => (
                            <div key={index}>{keyName3}: {result[keyName][keyName2][keyName3]}</div>
                          ))
                      ))
                    } <br key={index} /></div>
                  ))}
                </div>
              )
              )
            )}
          </div>
        </div>
      </div>
    )
  }
}
