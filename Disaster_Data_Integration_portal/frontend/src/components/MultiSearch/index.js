// This component uses multiple search
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import sourcesList from '../../helpers/datasources.json';

import './SearchBar.css';

const datasources = sourcesList.map((source) => {
  return {
    label: source.name,
    value: source.url
  }
});

// make search bar animated when clearing option
const animatedComponents = makeAnimated();

class MultiSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selected) {
    this.setState({
      selected
    });

    (selected !== null) ? this.props.onDatasourceChange(selected) : this.props.onDatasourceChange([]);
  }

  render() {
    return (
      <div>
        <Select
          // isDisabled={false}
          isMulti
          components={animatedComponents}
          className="MultiSelectComponent"
          classNamePrefix="select"
          value={this.state.selected}
          options={datasources}
          onChange={this.handleChange}
          plaveholder='Choose at least one (or more) datasource(s)...'
          openMouseOnClick={false}
        />
      </div>
    );
  }
}

export default MultiSearch;
