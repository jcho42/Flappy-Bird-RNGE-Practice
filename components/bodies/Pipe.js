import React, { Component } from 'react';
import { View } from 'react-native';

export default class Pipe extends Component {
  render() {
    const { bounds, position } = this.props.body;

    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const x = position.x - width / 2;
    const y = position.y - height / 2;

    return (
      <View
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width,
          height,
          backgroundColor: this.props.color,
        }}
      />
    );
  }
}
