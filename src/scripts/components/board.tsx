import * as React from 'react';
import Block from './block';
import BoardInterface from '../interfaces/BoardInterface';
import { MineType } from '../enums/mineType';
import BoardState from '../states/BoardState';
import BlockPointer from '../types/blockPointer';
import BlockType from '../types/BlockType';
// import '../../css/board.less';
import Alert from './Alert';
import AlertState from '../states/AlertState';
import { PageView } from '../enums/pageView';
import { View, Dimensions, Vibration } from 'react-native';
import BoardStyles from '../../styles/boardStyles';

export default class Board extends React.Component<BoardInterface, BoardState> {
        private mines: number[][];
        private isAnyBlockClicked = false;
        private boardState: BoardState;
        private shouldCheckIfLevelIsSolved = false;
        private isMineClicked: boolean = false;
        private puzzleRef: any;

        constructor(props: any) {
                super(props);
                this.boardState = new BoardState();
                this.boardState.alertState = new AlertState();

                this.loadLevel();

                this.puzzleRef = React.createRef();

                this.updateDimensions = this.updateDimensions.bind(this);
        }

        loadLevel() {
                this.isMineClicked = false;
                this.isAnyBlockClicked = false;
                this.initializeMines();
                // Mark mines
                this.AddMines(this.props.smallMinesCount, MineType.Small);
                this.AddMines(this.props.mediumMinesCount, MineType.Medium);
                this.AddMines(this.props.bigMinesCount, MineType.Large);
                this.initializeValues();
        }

        calculateBlockSize(scaleFactor: number): number {
                return (this.boardState.frameSize) / this.props.levelWidth * scaleFactor;
        }

        initializeValues() {
                let blockStates: BlockType[][] = [];

                for (let i = 0; i < this.props.levelWidth; i++) {
                        blockStates[i] = [];
                        for (let j = 0; j < this.props.levelHeight; j++) {
                                blockStates[i][j] = new BlockType();
                                blockStates[i][j].Left = i;
                                blockStates[i][j].Top = j;
                                blockStates[i][j].HasMine = this.mines[i][j] > 0 ? true : false;
                                blockStates[i][j].Mine = this.mines[i][j] > 0 ? this.mines[i][j] : undefined;
                                blockStates[i][j].Value = 0;
                                blockStates[i][j].IsClicked = false;
                        }
                }
                this.boardState.blocks = blockStates;
        }

        initializeMines() {
                this.mines = this.getDoubleNumberArray(this.props.levelWidth, this.props.levelHeight);
        }

        getDoubleNumberArray(width: number, height: number) {
                let newArray = Array.apply(undefined, Array(width)).map(Number.prototype.valueOf, 0);
                // tslint:disable-next-line:forin
                for (let i in newArray) {
                        newArray[i] = Array.apply(undefined, Array(height)).map(Number.prototype.valueOf, 0);
                }
                return newArray;
        }

        handleBlockClick(left: number, top: number) {
                let boardState = this.boardState;
                if (boardState.blocks[left][top].HasMine) {
                        if (this.isAnyBlockClicked) {
                                this.isMineClicked = true;
                                for (let row of boardState.blocks) {
                                        for (let block of row) {
                                                if (!block.IsClicked) {
                                                        this.setBlockValues(block.Left, block.Top, boardState.blocks);
                                                }
                                                if (block.HasMine) {
                                                        block.MarkedState = block.Mine;
                                                        block.IsClicked = false;
                                                }
                                        }
                                }
                                boardState.blocks[left][top].IsClicked = true;
                                Vibration.vibrate([30, 50, 100, 60, 40, 140], false);

                        } else {
                                // make sure the first click is not a mine
                                do {
                                        this.loadLevel();
                                } while (boardState.blocks[left][top].HasMine);
                                this.setState({ blocks: boardState.blocks });
                                this.handleBlockClick(left, top);
                        }
                } else {
                        this.isAnyBlockClicked = true;
                        boardState.blocks[left][top].MarkedState = 0;
                        this.setBlockValues(left, top, boardState.blocks);
                }
                this.setState({ blocks: boardState.blocks });

        }

        pushBlock(blocks: BlockPointer[], left: number, top: number) {
                if (!this.boardState.blocks[left][top].IsClicked) {
                        blocks.push({ Position: { X: left, Y: top }, Value: this.mines[left][top] });
                }
        }

        setBlockValues(left: number, top: number, blocksStates: BlockType[][]) {
                let surroundingBlocks: BlockPointer[] = new Array();
                if (left > 0) {
                        this.pushBlock(surroundingBlocks, left - 1, top);
                        if (top > 0) {
                                this.pushBlock(surroundingBlocks, left - 1, top - 1);
                        }
                        if (top < this.props.levelHeight - 1) {
                                this.pushBlock(surroundingBlocks, left - 1, top + 1);
                        }
                }

                if (left < this.props.levelWidth - 1) {
                        this.pushBlock(surroundingBlocks, left + 1, top);
                        if (top > 0) {
                                this.pushBlock(surroundingBlocks, left + 1, top - 1);
                        }
                        if (top < this.props.levelHeight - 1) {
                                this.pushBlock(surroundingBlocks, left + 1, top + 1);
                        }
                }

                if (top > 0) {
                        this.pushBlock(surroundingBlocks, left, top - 1);
                }

                if (top < this.props.levelHeight - 1) {
                        this.pushBlock(surroundingBlocks, left, top + 1);
                }

                let value: number = 0;
                for (let block of surroundingBlocks) {
                        value += block.Value;
                }

                blocksStates[left][top].IsClicked = true;
                blocksStates[left][top].Value = value;
                blocksStates[left][top].MarkedState = 0;
                if (value === 0) {
                        for (let block of surroundingBlocks) {
                                this.setBlockValues(block.Position.X, block.Position.Y, blocksStates);
                        }
                } else {
                        blocksStates[left][top].MarkedState = 0;
                }
        }

        handleRightClick(left: number, top: number) {
                if (!this.isMineClicked) {
                        let blocksStates = this.boardState.blocks;
                        if (blocksStates[left][top].MarkedState === MineType.Large) {
                                blocksStates[left][top].MarkedState = 0;
                        } else {
                                blocksStates[left][top].MarkedState++;
                        }
                        this.setState({ blocks: blocksStates });
                        this.shouldCheckIfLevelIsSolved = true;
                }
        }

        checkIfLevelIsSolved(): boolean {
                let mismatch = false;
                for (let row of this.boardState.blocks) {
                        for (let block of row) {
                                if (block.HasMine && block.MarkedState !== block.Mine) {
                                        mismatch = true;
                                        break;
                                }
                        }
                        if (mismatch) {
                                break;
                        }
                }
                return !mismatch;
        }

        AddMines(minesCount: number, mineType: MineType): void {
                let remainingMines: number = minesCount;
                do {
                        let leftIndex = Math.floor(Math.random() * this.props.levelWidth);
                        let topIndex = Math.floor(Math.random() * this.props.levelHeight);

                        if (this.mines[leftIndex][topIndex] === 0) {
                                this.mines[leftIndex][topIndex] = mineType;
                                remainingMines--;
                        }
                } while (remainingMines > 0);
        }

        generatePuzzle(_levelWidth: number, _levelHeight: number): any[] {
                let puzzle = [];

                // Add blocks
                for (let row of this.boardState.blocks) {
                        for (let block of row) {
                                puzzle.push(<Block key={block.Left + 'ID' + block.Top}
                                        Left={block.Left}
                                        Top={block.Top}
                                        BlockSize={this.boardState.blockSize}
                                        onClick={() => this.handleBlockClick(block.Left, block.Top)}
                                        onContextMenu={() => this.handleRightClick(block.Left, block.Top)}
                                        Value={block.Value}
                                        HasMine={block.HasMine}
                                        Mine={block.Mine}
                                        IsClicked={block.IsClicked}
                                        MarkedState={block.MarkedState} />);
                        }
                }
                return puzzle;
        }

        componentDidUpdate() {
                if (this.shouldCheckIfLevelIsSolved) {
                        if (this.checkIfLevelIsSolved()) {
                                let newState = Object.assign(this.state, { alertState: { showAlert: true } });
                                this.boardState.alertState.showAlert = true;
                                this.boardState.alertState.alertTitle = 'Congrats!';
                                this.boardState.alertState.alertMessage = 'You did it! Play again?';
                                this.setState(newState);
                        }

                        this.shouldCheckIfLevelIsSolved = false;
                }

                if (this.isMineClicked) {

                        let newState = Object.assign(this.state, { alertState: { showAlert: true } });
                        this.boardState.alertState.showAlert = true;
                        this.boardState.alertState.alertTitle = 'Game Over';
                        this.boardState.alertState.alertMessage = 'You clicked on a mine. Play again?';
                        this.setState(newState);
                        this.isMineClicked = false;
                }

        }

        componentDidMount() {

                this.updateDimensions();
        }

        updateDimensions() {
                // set frame width

                let innerWidth = Dimensions.get('window').width;
                let innerHeight = Dimensions.get('window').height;

                this.boardState.frameSize = Math.min(innerWidth, innerHeight);

                if (this.boardState.frameSize > innerWidth) {
                        this.boardState.frameSize = innerWidth;
                }

                // Set block size
                this.boardState.blockSize = this.calculateBlockSize(1);

                // Assign new state
                let newState = Object.assign(this.boardState, { blockSize: this.boardState.blockSize });
                this.setState(newState);
        }

        onAlertOkClick() {
                let newState = Object.assign(this.state, { alertState: { showAlert: false } });
                this.boardState.alertState.showAlert = false;
                this.setState(newState);
                this.loadLevel();
        }

        onAlertClose() {
                this.props.onRedirect(PageView.Menu);
        }

        onAlertCancel() {
                this.props.onRedirect(PageView.Menu);
        }

        render() {
                let puzzle = this.generatePuzzle(this.props.levelWidth, this.props.levelHeight);

                let puzzlePosition = {
                        top: (Dimensions.get('window').height - this.props.levelHeight * this.boardState.blockSize) / 2
                };
                return (
                        <View style={BoardStyles.board}>
                                <View style={BoardStyles.frame} >
                                        <View ref={this.puzzleRef} style={[BoardStyles.puzzle, puzzlePosition]}>
                                                {puzzle}
                                        </View>
                                </View>

                                <Alert title={this.boardState.alertState.alertTitle}
                                        showPopup={this.boardState.alertState.showAlert}
                                        message={this.boardState.alertState.alertMessage}
                                        onOkClick={() => this.onAlertOkClick()}
                                        onCancelClick={() => this.onAlertCancel()}
                                        onCloseClick={() => this.onAlertClose()}
                                ></Alert>
                        </View>
                );
        }

}