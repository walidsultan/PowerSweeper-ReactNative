import BlockInterface from '../interfaces/BlockInterface';
import AlertState from './AlertState';
import BlockType from '../types/BlockType';
import { Animated } from 'react-native';

export default class BoardState {
    constructor(blocks: BlockType[][]) {
        this.alertState = new AlertState();
        this.puzzlePositionOffset = new Animated.ValueXY();
        this.blocks=blocks;
    }

    blocks: BlockInterface[][];
    blockSize: number;
    alertState: AlertState;
    zoomFactor: number=1;
    puzzlePositionOffset:Animated.ValueXY;

    panTrace:string;
}