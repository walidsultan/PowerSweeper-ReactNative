import * as React from 'react';
import Block from './block';
import BoardInterface from '../interfaces/BoardInterface';
import { MineType } from '../enums/mineType';
import BoardState from '../states/BoardState';
import BlockPointer from '../types/blockPointer';
import BlockType from '../types/BlockType';
import Alert from './Alert';
import { PageView } from '../enums/pageView';
import { View, Dimensions, Vibration, PanResponder, PanResponderGestureState, Animated } from 'react-native';
import BoardStyles from '../../styles/boardStyles';
import BlockPosition from '../types/blockPosition';

export default class Board extends React.Component<BoardInterface, BoardState> {
        private mines: number[][];
        private isAnyBlockClicked = false;
        private shouldCheckIfLevelIsSolved = false;
        private isMineClicked: boolean = false;
        private puzzleRef: any;
        private panResponder: any;
        private lastPinchDistance: number;
        private puzzlePositionOffset:BlockPosition = new BlockPosition();
        private initialPuzzleTopOffset:number;

        constructor(props: any) {
                super(props);

                var blocks = this.loadLevel();

                this.puzzleRef = React.createRef();

                this.updateDimensions = this.updateDimensions.bind(this);

                
                this.state = new BoardState(blocks);
        }

        loadLevel(): BlockType[][] {
                this.isMineClicked = false;
                this.isAnyBlockClicked = false;
                this.initializeMines();
                // Mark mines
                this.AddMines(this.props.smallMinesCount, MineType.Small);
                this.AddMines(this.props.mediumMinesCount, MineType.Medium);
                this.AddMines(this.props.bigMinesCount, MineType.Large);
                return this.initializeValues();
        }

        calculateBlockSize(zoomFactor: number): number {
                return Dimensions.get('window').width / this.props.levelWidth * zoomFactor;
        }

        initializeValues(): BlockType[][] {
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
                return blockStates;
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
                let boardState = this.state;
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
                if (!this.state.blocks[left][top].IsClicked) {
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
                        let blocksStates = this.state.blocks;
                        if (blocksStates[left][top].MarkedState === MineType.Large) {
                                blocksStates[left][top].MarkedState = 0;
                        } else {
                                blocksStates[left][top].MarkedState++;
                        }
                        this.setState(Object.assign(this.state, { blocks: blocksStates }));
                        this.shouldCheckIfLevelIsSolved = true;
                }
        }

        checkIfLevelIsSolved(): boolean {
                let mismatch = false;
                for (let row of this.state.blocks) {
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
                for (let row of this.state.blocks) {
                        for (let block of row) {
                                puzzle.push(<Block key={block.Left + 'ID' + block.Top}
                                        Left={block.Left}
                                        Top={block.Top}
                                        BlockSize={this.state.blockSize}
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
                                this.state.alertState.showAlert = true;
                                this.state.alertState.alertTitle = 'Congrats!';
                                this.state.alertState.alertMessage = 'You did it! Play again?';
                                this.setState(newState);
                        }

                        this.shouldCheckIfLevelIsSolved = false;
                }

                if (this.isMineClicked) {
                        let newState = Object.assign(this.state, { alertState: { showAlert: true } });
                        this.state.alertState.showAlert = true;
                        this.state.alertState.alertTitle = 'Game Over';
                        this.state.alertState.alertMessage = 'You clicked on a mine. Play again?';
                        this.setState(newState);
                        this.isMineClicked = false;
                }
        }

        componentDidMount() {
                this.updateDimensions();
        }

        componentWillMount() {
                this.panResponder = PanResponder.create({
                        onMoveShouldSetPanResponderCapture: (e, gestureState) => {
                                

                                if (e.nativeEvent.touches.length > 1) {
                                        return true;
                                } else {
                                        if (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy)> 10) {
                                                return true;
                                        } else {
                                                return false;
                                        }
                                }
                              
                        },

                        // Initially, set the value of x and y to 0 (the center of the screen)
                        onPanResponderGrant: () => {

                        },

                        // When we drag/pan the object, set the delate to the states pan position
                        onPanResponderMove: (e, gestureState) => {
                                let touches = e.nativeEvent.touches;
                                if (touches.length == 2) {

                                        this.processPinch(touches[0].pageX, touches[0].pageY,
                                                touches[1].pageX, touches[1].pageY);
                                } else {

                                        this.processDrag(gestureState);
                                }

                                // let trace= 'dx: ' + Math.round(gestureState.dx )+' dy: ' +Math.round( gestureState.dy) +' vx: ' + Math.round(gestureState.vx)+' vy: ' + Math.round(gestureState.vy);
                                // this.setState(Object.assign(this.state, { panTrace: trace }));

                        },

                        onPanResponderRelease: () => {
                                this.lastPinchDistance = undefined;
                        }
                });
        }

        processDrag(gesture: PanResponderGestureState) {
                this.puzzlePositionOffset.X += gesture.dx *.2;
                this.puzzlePositionOffset.Y += gesture.dy *.2;

                let maxXDisplacement = this.state.blockSize * this.props.levelWidth * (1/this.state.zoomFactor - 1);
                let maxYDisplacement = Math.max(this.initialPuzzleTopOffset, this.state.blockSize * this.props.levelHeight - Dimensions.get('window').height);

                this.puzzlePositionOffset.X = Math.min(0, Math.max(this.puzzlePositionOffset.X, maxXDisplacement));
                this.puzzlePositionOffset.Y = Math.sign(this.puzzlePositionOffset.Y) * Math.min(Math.abs(this.puzzlePositionOffset.Y), maxYDisplacement);
                
                Animated.spring(this.state.puzzlePositionOffset,{toValue: {x:this.puzzlePositionOffset.X,y:this.puzzlePositionOffset.Y} }).start();
        }

        processPinch(x1: number, y1: number, x2: number, y2: number) {
                let pinchDistance = this.calcDistance(x1, y1, x2, y2);

                if (this.lastPinchDistance) {
                        let zoomFactor = this.state.zoomFactor;
                        let zoomDifferential = Math.abs(pinchDistance - this.lastPinchDistance) / this.lastPinchDistance;
                        if (pinchDistance < this.lastPinchDistance) {
                                zoomFactor -= zoomDifferential;
                                if (zoomFactor < 1) { zoomFactor = 1; }
                        } else {
                                zoomFactor += zoomDifferential;
                        }

                        let blockSize = this.calculateBlockSize(zoomFactor);

                        //centralize puzzle position
                        let offsetX= - ( blockSize * this.props.levelWidth - Dimensions.get('window').width)/2;
                        let offsetY= - ( blockSize * this.props.levelHeight - Dimensions.get('window').height)/2;

                        this.state.puzzlePositionOffset.setValue({x:offsetX,y:offsetY});

                        this.setState(Object.assign(this.state, { blockSize: blockSize, zoomFactor: zoomFactor }));
                }
                this.lastPinchDistance = pinchDistance;

        }

        calcDistance(x1: number, y1: number, x2: number, y2: number) {
                let dx = Math.abs(x1 - x2)
                let dy = Math.abs(y1 - y2)
                return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        }

        updateDimensions() {
                // Set block size
                let blockSize = this.calculateBlockSize(this.state.zoomFactor);

                this.initialPuzzleTopOffset = (Dimensions.get('window').height - this.props.levelHeight * blockSize) / 2;
                Animated.spring(this.state.puzzlePositionOffset,{toValue:{x:0, y: this.initialPuzzleTopOffset},mass:5}).start();

                // Assign new state
                let newState = Object.assign(this.state, { blockSize: blockSize });
                this.setState(newState);
        }

        onAlertOkClick() {
                var blocks = this.loadLevel();
                let newState = Object.assign(this.state, { blocks: blocks, alertState: { showAlert: false } });
                this.setState(newState);
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
                        top: this.state.puzzlePositionOffset.y,
                        left: this.state.puzzlePositionOffset.x
                };
                return (
                        <View style={BoardStyles.board} {...this.panResponder.panHandlers}>
                                <View style={BoardStyles.frame} >
                                        <Animated.View ref={this.puzzleRef} style={[BoardStyles.puzzle, puzzlePosition]}>
                                                {puzzle}
                                        </Animated.View>
                                </View>

                                <Alert title={this.state.alertState.alertTitle}
                                        showPopup={this.state.alertState.showAlert}
                                        message={this.state.alertState.alertMessage}
                                        onOkClick={() => this.onAlertOkClick()}
                                        onCancelClick={() => this.onAlertCancel()}
                                        onCloseClick={() => this.onAlertClose()}
                                ></Alert>
                        </View>
                );
        }

}