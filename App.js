import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import * as Font from 'expo-font';

import Constants from './components/Constants';
import { Bird, Floor } from './components/bodies';
import Physics, { resetPipes } from './components/Physics';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.gameEngine = null;
    this.entities = this.setupWorld();
    this.state = {
      running: true,
      score: 0,
      fontLoaded: false
    };
  }

  setupWorld = () => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    world.gravity.y = 0;

    const bird = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT / 2,
      50,
      50
    );
    const floor = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH,
      50,
      { isStatic: true }
    );

    Matter.World.add(world, [bird, floor]);

    Matter.Events.on(engine, 'collisionStart', (evt) => {
      this.gameEngine.dispatch({ type: 'game-over' });
    });

    return {
      physics: { engine, world },
      bird: { body: bird, color: 'red', renderer: Bird },
      floor: { body: floor, color: 'green', renderer: Floor },
    };
  };

  onEvent = (e) => {
    if (e.type === 'game-over') {
      this.setState({ running: false });
    } else if (e.type === "score") {
      this.setState({score: this.state.score + 1})
    }
  };

  reset = () => {
    this.gameEngine.swap(this.setupWorld())
    this.setState({running: true, score: 0})
    resetPipes()
  }

  async componentDidMount() {
    try {
      await Font.loadAsync({'pixelate': require('./assets/fonts/04b_19.ttf')})
      this.setState({fontLoaded: true});
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return null
    }
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => {
            this.gameEngine = ref;
          }}
          style={styles.gameContainer}
          systems={[Physics]}
          entities={this.entities}
          running={this.state.running}
          onEvent={this.onEvent}
        />
        <Text style={styles.score}>{this.state.score}</Text>
        {!this.state.running && (
          <TouchableOpacity onPress={this.reset}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gameContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  fullScreen: {
    height: "100%",
    backgroundColor: "black",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center"
  },
  gameOverText: {
    color: "white",
    fontSize: 48,
    fontFamily: "pixelate"
  },
   score: {
     position: "absolute",
     fontFamily: "pixelate",
     color: "white",
     fontSize: 72,
     top: 50,
     left: Constants.MAX_WIDTH / 2 - 20,
     textShadowColor: "black",
     textShadowOffset: {width: 2, height: 2},
     textShadowRadius: 2
   }
});
