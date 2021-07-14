// This component uses single search
import React from 'react';
import Select from 'react-select';
import sourcesList from '../../helpers/queries.json';

import './SingleSearch.css';

const datasources = sourcesList.map((source) => {
  return {
    label: source.name,
    query: source.query
  }
});

class SingleSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selected) {
    this.setState({
      selected
    });
    
    (selected !== null) ? this.props.onQueryChange(selected.query) : this.props.onQueryChange('');
  }

  render() {
    const value = this.state.selected;

    return (
      <div>
        <Select
          isClearable
          isSearchable
          className="SelectComponent"
          classNamePrefix="select"
          value={value}
          options={datasources}
          onChange={this.handleChange}
          placeholder='Select a query from the list...'
        // openMouseOnClick={false}
        />
      </div>
    );
  }
}

export default SingleSearch;
