import BlockInterface from '../interfaces/BlockInterface';
import AlertState from './AlertState';
import BlockType from '../types/BlockType';
import BlockPosition from '../types/blockPosition';

export default class BoardState {
    constructor(blocks: BlockType[][]) {
        this.alertState = new AlertState();
        this.puzzlePositionOffset = new BlockPosition();
        this.blocks=blocks;
    }

    blocks: BlockInterface[][];
    blockSize: number;
    alertState: AlertState;
    zoomFactor: number=1;
    puzzlePositionOffset:BlockPosition;

    panTrace:string;
}