import React, { Component } from 'react';
import { Animated } from 'react-native';

import { bird1, bird2, bird3 } from '../../assets/images';

export default class Bird extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(this.props.body.velocity.y);
  }

  render() {
    const { bounds, position } = this.props.body;

    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const x = position.x - width / 2;
    const y = position.y - height / 2;

    this.animatedValue.setValue(this.props.body.velocity.y);
    let rotation = this.animatedValue.interpolate({
      inputRange: [-10, 0, 10, 20],
      outputRange: ['-20deg', '0deg', '15deg', '60deg'],
      extrapolate: 'clamp',
    });

    const birdPoses = {
      1: bird1,
      2: bird2,
      3: bird3,
    };
    const image = birdPoses[this.props.pose];

    return (
      <Animated.Image
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width,
          height,
          transform: [{ rotate: rotation }],
        }}
        source={image}
        resizeMode="stretch"
      />
    );
  }
}
