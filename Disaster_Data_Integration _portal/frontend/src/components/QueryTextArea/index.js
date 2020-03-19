import React from 'react';
import './QueryTextArea.css';

class QueryTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (this.props.selectionIsActive) {
      this.props.deactivateSelection();
    }
    this.setState({
      query: e.target.value
    });
    this.props.onTextChange(this.state.query);
  }

  render() {
    return (
      <div className="QueryTextAreaContainer">
        <textarea
          className="QueryTextArea"
          rows="15"
          onChange={this.handleChange}
          value={this.props.selectionIsActive ? this.props.queryValue : this.state.query}
        />
      </div>
    );
  }
}

export default QueryTextArea;
