import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js'

import Constants from './components/Constants'
import { Bird, Floor } from './components/bodies'
import Physics from './components/Physics'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.gameEngine = null;
    this.entities = this.setupWorld()
  }

  setupWorld = () => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    world.gravity.y = 0

    const bird = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT / 2,
      50,
      50
    )
    const floor = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH,
      50,
      {isStatic: true}
    )

    Matter.World.add(world, [bird, floor])

    return {
      physics: {engine, world},
      bird: {body: bird, color: "red", renderer: Bird},
      floor: {body: floor, color: "green", renderer: Floor}
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <GameEngine
          ref={ref => { this.gameEngine = ref }}
          style={styles.gameContainer}
          systems={[Physics]}
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
