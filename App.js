import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

import Constants from './components/Constants'
import { Bird } from './components/bodies'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.gameEngine = null;
    this.entities = this.setupWorld()
  }

  setupWorld = () => {
    const engine = Matter.Engine.create();
    const world = engine.world;

    const bird = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT / 2, 50, 50)

    Matter.World.add(world, [bird])

    return {
      physics: {engine, world},
      bird: {body: bird, color: "red", renderer: Bird}
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <GameEngine
          ref={ref => { this.gameEngine = ref }}
          style={styles.gameContainer}
          entities={this.entities}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
