import {Dimensions} from 'react-native';

export interface Window {
  width: number;
  height: number;
}

const getWindow = (): Window => {
  return Dimensions.get('window');
};

export {getWindow};

/**
 * Interface is compatible with all `Marker` entities.
 */
export interface Pos2D {
  posX: number;
  posY: number;
}
