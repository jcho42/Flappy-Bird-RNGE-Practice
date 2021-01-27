import React, { Component } from 'react';
import { View, Image } from 'react-native';

import { floor } from '../../assets/images';

export default class Floor extends Component {
  render() {
    const { bounds, position } = this.props.body;

    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const x = position.x - width / 2;
    const y = position.y - height / 2;

    const imageIterations = Math.ceil(width / height);

    return (
      <View
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width,
          height,
          overflow: 'hidden',
          flexDirection: 'row',
        }}
      >
        {Array.apply(null, Array(imageIterations)).map((el, idx) => {
          return (
            <Image
              style={{ width: height, height: height }}
              key={idx}
              source={floor}
              resizeMode="stretch"
            />
          );
        })}
      </View>
    );
  }
}
