import BlockInterface from '../interfaces/BlockInterface';
import AlertState from './AlertState';
import BlockType from '../types/BlockType';
import { Animated } from 'react-native';

export default class BoardState {
    constructor(blocks: BlockType[][]) {
        this.alertState = new AlertState();
        this.puzzlePositionOffset = new Animated.ValueXY();
        this.blockSize = new Animated.Value(0);
        this.blocks=blocks;
    }

    blocks: BlockInterface[][];
    blockSize: Animated.Value;
    alertState: AlertState;
    zoomFactor: number=1;
    puzzlePositionOffset:Animated.ValueXY;
    panTrace:string;
}