import React, { Component } from 'react';
import { View, Image } from 'react-native';

import { bird1, bird2, bird3 } from '../../assets/images';

export default class Bird extends Component {
  render() {
    const { bounds, position } = this.props.body;

    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const x = position.x - width / 2;
    const y = position.y - height / 2;

    const birdPoses = {
      1: bird1,
      2: bird2,
      3: bird3,
    };

    const image = birdPoses[this.props.pose];

    return (
      <Image
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width,
          height,
        }}
        source={image}
        resizeMode="stretch"
      />
    );
  }
}
