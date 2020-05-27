import React, { PureComponent, createContext } from 'react';
import L from './leaflet';

const Context = createContext('leaflet-map');

const mapStyle = { height: '100%', width: '100%' };

const defaultValue = {
  center: [39.833333, -98.583333], // center of US
  zoom: 5,
  minZoom: 2,
  maxBounds: [[-85, -180], [85, 180]],
};

class Map extends PureComponent {
  state = { map: null };

  componentDidMount = () => {
    const options = this.props.value || this.props.defaultValue;
    const map = L.map(this.mapEl, options);

    map.on('move', this.handleChange);

    Object.entries(this.props.on).forEach(([event, cb]) => {
      map.on(event, cb);
    });

    this.setState({ map });
  };

  componentDidUpdate = () => {
    if (!this.props.value) return;

    L.Util.setOptions(this.state.map, this.props.value);

    const { zoom, center } = this.props.value;
    const newView = center.toString() + zoom;
    const prevView =
      this.state.map.getCenter().toString() + this.state.map.getZoom();

    if (newView === prevView) return;

    this.state.map.setView(L.latLng(center), zoom, { animate: true });
  };

  componentWillUnmount = () => {
    Object.entries(this.props.on).forEach(([event, cb]) => {
      this.state.map.off(event, cb);
    });

    this.state.map.remove();
  };

  setMap = el => (this.mapEl = el);

  handleChange = event => {
    const center = this.state.map.getCenter();
    const zoom = this.state.map.getZoom();

    this.props.onChange({ center, zoom }, event);
  };

  render() {
    return (
      <div ref={this.setMap} style={mapStyle}>
        {this.state.map && (
          <Context.Provider value={this.state}>
            {this.props.children}
          </Context.Provider>
        )}
      </div>
    );
  }
}

Map.defaultProps = {
  defaultValue,
  onChange: () => {},
};

export default Map;

// Consumer component for connecting map components
export const MapConsumer = Context.Consumer;
