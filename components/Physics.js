import Matter from 'matter-js';
import Constants from './Constants';

import { Pipe, PipeTop } from './bodies';

let tick = 0;
let pipes = 0;

export const resetPipes = () => {
  pipes = 0;
  tick = 0;
};

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generatePipes = () => {
  const topPipeHeight = randomBetween(100, Constants.MAX_HEIGHT / 2);
  const bottomPipeHeight =
    Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE;

  let sizes = [topPipeHeight, bottomPipeHeight];
  if (Math.random() > 0.5) {
    sizes = sizes.reverse();
  }

  return sizes;
};

const addPipesAtLocation = (x, world, entities) => {
  let [pipe1Height, pipe2Height] = generatePipes();

  const pipeTopWidth = Constants.PIPE_WIDTH + 20;
  const pipeTopHeight = (pipeTopWidth / 206) * 94;

  pipe1Height = pipe1Height - pipeTopHeight;

  const pipe1Top = Matter.Bodies.rectangle(
    x,
    pipe1Height + pipeTopHeight / 2,
    pipeTopWidth,
    pipeTopHeight,
    { isStatic: true }
  );
  const pipe1 = Matter.Bodies.rectangle(
    x,
    pipe1Height / 2,
    Constants.PIPE_WIDTH,
    pipe1Height,
    { isStatic: true }
  );

  pipe2Height = pipe2Height - pipeTopHeight;

  const pipe2Top = Matter.Bodies.rectangle(
    x,
    Constants.MAX_HEIGHT - 50 - (pipe2Height + pipeTopHeight / 2),
    pipeTopWidth,
    pipeTopHeight,
    { isStatic: true }
  );
  const pipe2 = Matter.Bodies.rectangle(
    x,
    Constants.MAX_HEIGHT - 50 - pipe2Height / 2,
    Constants.PIPE_WIDTH,
    pipe2Height,
    { isStatic: true }
  );

  Matter.World.add(world, [pipe1, pipe1Top, pipe2, pipe2Top]);

  entities['pipe' + (pipes + 1)] = {
    body: pipe1,
    color: 'green',
    renderer: Pipe,
    scored: false,
  };
  entities['pipe' + (pipes + 1) + 'Top'] = {
    body: pipe1Top,
    renderer: PipeTop,
    scored: false,
  };
  entities['pipe' + (pipes + 2)] = {
    body: pipe2,
    color: 'green',
    renderer: Pipe,
    scored: false,
  };
  entities['pipe' + (pipes + 2) + 'Top'] = {
    body: pipe2Top,
    renderer: PipeTop,
    scored: false,
  };

  pipes += 2;
};

const Physics = (entities, { touches, time, dispatch }) => {
  const { engine, world } = entities.physics;
  const birdBody = entities.bird.body;

  let hadTouch = false;
  touches
    .filter((t) => t.type === 'press')
    .forEach((t) => {
      if (!hadTouch) {
        if (world.gravity.y === 0) {
          world.gravity.y = 1.3;
          addPipesAtLocation(
            Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
            world,
            entities
          );
          addPipesAtLocation(
            Constants.MAX_WIDTH * 3 - Constants.PIPE_WIDTH / 2,
            world,
            entities
          );
        }
        Matter.Body.setVelocity(birdBody, {
          x: birdBody.velocity.x,
          y: -10,
        });
        hadTouch = true;
      }
    });

  Matter.Engine.update(engine, time.delta);

  tick++;
  const bird = entities.bird;
  if (tick % 10 === 0) {
    bird.pose++;
    if (bird.pose > 3) {
      bird.pose = 1;
    }
  }

  Object.keys(entities).forEach((key) => {
    if (key.includes('pipe') && entities.hasOwnProperty(key)) {
      Matter.Body.translate(entities[key].body, { x: -2, y: 0 });

      if (!key.includes('Top') && parseInt(key.replace('pipe', '')) % 2 === 0) {
        if (
          entities[key].body.position.x <= birdBody.position.x &&
          !entities[key].scored
        ) {
          entities[key].scored = true;
          dispatch({ type: 'score' });
        }

        if (entities[key].body.position.x <= -1 * (Constants.PIPE_WIDTH / 2)) {
          const pipeIdx = parseInt(key.replace('pipe', ''));

          delete entities['pipe' + (pipeIdx - 1)];
          delete entities['pipe' + (pipeIdx - 1) + 'Top'];
          delete entities['pipe' + pipeIdx];
          delete entities['pipe' + pipeIdx + 'Top'];

          addPipesAtLocation(
            Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
            world,
            entities
          );
        }
      }
    }

    if (key.includes('floor')) {
      Matter.Body.translate(entities[key].body, { x: -2, y: 0 });

      if (entities[key].body.position.x <= -1 * (Constants.MAX_WIDTH / 2)) {
        Matter.Body.setPosition(entities[key].body, {
          x: Constants.MAX_WIDTH + Constants.MAX_WIDTH / 2,
          y: entities[key].body.position.y,
        });
      }
    }
  });

  return entities;
};

export default Physics;
