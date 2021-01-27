import React, { Component } from 'react';
import { View, Image } from 'react-native';

import { pipeCore } from '../../assets/images';

export default class Pipe extends Component {
  render() {
    const { bounds, position } = this.props.body;

    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const x = position.x - width / 2;
    const y = position.y - height / 2;

    const heightRatio = (width / 160) * 60;
    const imageIteration = Math.ceil(height / heightRatio);

    return (
      <View
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width,
          height,
          overflow: 'hidden',
          flexDirection: 'column',
        }}
      >
        {Array.apply(null, Array(imageIteration)).map((el, idx) => {
          return (
            <Image
              style={{ width: width, height: heightRatio }}
              key={idx}
              source={pipeCore}
              resizeMode="stretch"
            />
          );
        })}
      </View>
    );
  }
}
