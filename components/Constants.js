import { Dimensions } from 'react-native';

export default Constants = {
  MAX_WIDTH: Dimensions.get('screen').width,
  MAX_HEIGHT: Dimensions.get('screen').height,
  GAP_SIZE: 250, // gap btw pipes
  PIPE_WIDTH: 100, // pipe width
  BIRD_WIDTH: 75,
  BIRD_HEIGHT: 62,
};
