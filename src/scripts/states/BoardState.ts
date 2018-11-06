import BlockInterface from '../interfaces/BlockInterface';
import AlertState from './AlertState';

export default class BoardState {
    blocks: BlockInterface[][];
    blockSize: number;
    frameSize: number;
    alertState: AlertState;
}