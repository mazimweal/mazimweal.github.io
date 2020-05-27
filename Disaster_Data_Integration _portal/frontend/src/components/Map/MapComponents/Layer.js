import L from './leaflet';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connectMap from './connectMap';

class Layer extends PureComponent {
  componentDidMount = () => {
    const { map, type, value, options, layerRef, ...props } = this.props;

    this.layer = L[type](value, options);

    Object.entries(props).forEach(([key, value]) => {
      if (typeof this.layer[key] === 'function') {
        this.layer[key](value);
        return;
      }

      console.warn(`No leaflet function: ${key}`);
    });

    if (layerRef) layerRef(this.layer);

    this.layer.addTo(map);
  };

  componentWillUnmount = () => {
    (this.props.layer || this.layer).remove();
  };

  render() {
    return null;
  }
}

Layer.propTypes = {
  map: PropTypes.object,
};

export default connectMap(Layer);
