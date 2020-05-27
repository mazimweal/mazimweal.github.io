import React from 'react';
import Layer from './Layer';
import PropTypes from 'prop-types';

const getAttribution = x => ({
  attribution: `Map data © ${x} contributors`,
});

const value = {
  osm: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  wiki: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
};

const option = {
  osm: getAttribution('<a href="https://openstreetmap.org">OpenStreetMap</a>'),
  wiki: getAttribution('<a href="https://maps.wikimedia.org">WikiMedia</a>'),
};

const Tile = ({ type }) => (
  <Layer type="tileLayer" value={value[type]} options={option[type]} />
);

Tile.propTypes = {
  type: PropTypes.oneOf(Object.keys(value)),
};

export default Tile;
