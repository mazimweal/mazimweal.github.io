import React from 'react';
import { MapConsumer } from './Map';

const connectMap = Component => {
  class Connected extends React.Component {
    displayName = `ConnectMap(${Component.displayName})`;

    renderMap = ({ map }) => <Component {...this.props} map={map} />;

    render() {
      return <MapConsumer>{this.renderMap}</MapConsumer>;
    }
  }

  return Connected;
};

export default connectMap;
