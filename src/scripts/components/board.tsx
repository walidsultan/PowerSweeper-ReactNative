import * as React from 'react';
import Block from './block';
import BoardInterface from '../interfaces/BoardInterface';
import { MineType } from '../enums/mineType';
import BoardState from '../states/BoardState';
import BlockPointer from '../types/blockPointer';
import BlockType from '../types/BlockType';
import Alert from './Alert';
import { PageView } from '../enums/pageView';
import { View, Dimensions, Vibration, PanResponder, PanResponderGestureState, Animated, BackHandler, Image, StyleProp, ImageStyle, AsyncStorage } from 'react-native';
import BoardStyles from '../../styles/boardStyles';
import BlockPosition from '../types/blockPosition';
import * as Expo from "expo";

const stretchSound = new Expo.Audio.Sound();
const explodeSound = new Expo.Audio.Sound();
const succeedSound = new Expo.Audio.Sound();

export default class Board extends React.Component<BoardInterface, BoardState> {
        private mines: number[][];
        private isAnyBlockClicked = false;
        private isMineClicked: boolean = false;
        private puzzleRef: any;
        private panResponder: any;
        private lastPinchDistance: number;
        private puzzlePositionOffset: BlockPosition = new BlockPosition();
        private initialPuzzleTopOffset: number;
        private centerPosition: BlockPosition;
        private isInPinchMode: boolean = false;
        private defaultBlockSize: number = 75;
        private blockSizeValue: number;
        private startTime: Date;
        private currentUsername: string;
        private currentUserPhoto: string;
        private isSignedIn: boolean = false;

        private isVibrationEnabled: boolean = true;
        private areSoundsEnabled: boolean = true;


        constructor(props: any) {
                super(props);
                this.startTime = new Date();

                var blocks = this.loadLevel();

                this.puzzleRef = React.createRef();

                this.updateDimensions = this.updateDimensions.bind(this);
                this.handleBackPress = this.handleBackPress.bind(this);


                this.state = new BoardState(blocks);
                this.state.blockSize.addListener(({ value }) => this.blockSizeValue = value);

                this.setUsername();

                this.loadSounds();
                this.loadSettings();
        }

        loadSettings() {
                AsyncStorage.multiGet(['areSoundsEnabled', 'isVibrationEnabled'], (err, stores) => {
                        if (err) {
                                console.log(err);
                        }
                        stores.map((result, i, store) => {
                                console.log(result);
                                let key = store[i][0];
                                let value = store[i][1];
                                if (key == "areSoundsEnabled" && value) {
                                        this.areSoundsEnabled = (value === 'true');
                                }
                                if (key == "isVibrationEnabled" && value) {
                                        this.isVibrationEnabled = (value === 'true');
                                }
                        });
                });

        }

        async loadSounds() {
                await stretchSound.loadAsync(require('../../../assets/audio/sucked.wav'));
                await explodeSound.loadAsync(require('../../../assets/audio/explode.wav'));
                await succeedSound.loadAsync(require('../../../assets/audio/succeed.wav'));
        }

        setUsername() {

                AsyncStorage.multiGet(['name', 'photoUrl'], (err, stores) => {
                        if (err) {
                                console.log(err);
                        }
                        stores.map((result, i, store) => {
                                console.log(result);
                                let key = store[i][0];
                                let value = store[i][1];
                                if (key == "name" && value) {
                                        this.isSignedIn = true;
                                        this.currentUsername = value;
                                } else if (key == "photoUrl" && value) {
                                        this.currentUserPhoto = value;
                                }
                        });
                        if (!this.isSignedIn) {
                                this.currentUsername = 'Anonymous';
                        }
                });
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
                                if (this.areSoundsEnabled) {
                                        explodeSound.setPositionAsync(0);
                                        explodeSound.playAsync();
                                }
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
                                if (this.isVibrationEnabled) {
                                        Vibration.vibrate([30, 50, 100, 60, 40, 140], false);
                                }

                        } else {
                                // make sure the first click is not a mine
                                let newBlocks: BlockType[][] = null;
                                do {
                                        newBlocks = this.loadLevel();
                                } while (newBlocks[left][top].HasMine);
                                this.setState(Object.assign(this.state, { blocks: newBlocks }), () => this.handleBlockClick(left, top));
                        }
                } else {
                        this.isAnyBlockClicked = true;
                        boardState.blocks[left][top].MarkedState = 0;
                        this.setBlockValues(left, top, boardState.blocks);
                }
                this.setState({ blocks: boardState.blocks },()=>this.onMineStateChanged());

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
                        if (!this.isMineClicked && this.areSoundsEnabled) {
                                stretchSound.setPositionAsync(0);
                                stretchSound.playAsync();
                        }
                        for (let block of surroundingBlocks) {
                                this.setBlockValues(block.Position.X, block.Position.Y, blocksStates);
                        }
                } else {
                        blocksStates[left][top].MarkedState = 0;
                }
        }

        handleRightClick(left: number, top: number) {
                if (this.isVibrationEnabled) {
                        Vibration.vibrate(100, false);
                }
                if (!this.isMineClicked) {
                        let blocksStates = this.state.blocks;
                        if (blocksStates[left][top].MarkedState === MineType.Large) {
                                blocksStates[left][top].MarkedState = 0;
                        } else {
                                blocksStates[left][top].MarkedState++;
                        }
                        this.setState(Object.assign(this.state, { blocks: blocksStates }),()=>this.onMineStateChanged());
                }
        }

        checkIfLevelIsSolved(): boolean {
                let mismatch = false;
                for (let row of this.state.blocks) {
                        for (let block of row) {
                                if ((block.HasMine && block.MarkedState !== block.Mine) || (!block.HasMine && block.MarkedState > 0)) {
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

        onMineStateChanged() {
                if (!this.state.alertState.showAlert) {
                        if (!this.isMineClicked) {
                                if (this.checkIfLevelIsSolved()) {
                                        //play sound
                                        if (this.areSoundsEnabled) {
                                                succeedSound.setPositionAsync(0);
                                                succeedSound.playAsync();
                                        }

                                        let newState = Object.assign(this.state, { alertState: { showAlert: true, alertTitle: 'Congrats!', alertMessage: 'You did it! Play again?' } });
                                        this.state.alertState.showAlert = true;
                                        //get the time the player took to solve the puzzle
                                        var endDate = new Date();
                                        let puzzleDuration = (endDate.getTime() - this.startTime.getTime()) / 1000;
                                        this.saveHighScore(puzzleDuration);

                                        this.setState(newState);
                                }
                        }
                }
        }


        componentDidUpdate() {

                if (this.isMineClicked) {
                        let newState = Object.assign(this.state, { alertState: { showAlert: true, alertTitle: 'Game Over', alertMessage: 'You clicked on a mine. Play again?' } });
                        this.setState(newState);
                        this.isMineClicked = false;
                }

        }

        componentDidMount() {
                this.updateDimensions();
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        }



        componentWillUnmount() {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        }

        componentWillMount() {
                this.panResponder = PanResponder.create({
                        onMoveShouldSetPanResponderCapture: (e, gestureState) => {
                                if (this.state.alertState.showAlert) return false;

                                if (this.isMineClicked) return false;

                                if (e.nativeEvent.touches.length > 1) {
                                        return true;
                                } else {
                                        if (Math.abs(gestureState.dx) > 30 || Math.abs(gestureState.dy) > 30) {
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
                                        this.isInPinchMode = true;
                                        this.processPinch(touches[0].pageX, touches[0].pageY,
                                                touches[1].pageX, touches[1].pageY);
                                } else {
                                        if (!this.isInPinchMode) {
                                                this.processDrag(gestureState);
                                        }
                                }

                                // let trace= 'dx: ' + Math.round(gestureState.dx )+' dy: ' +Math.round( gestureState.dy) +' vx: ' + Math.round(gestureState.vx)+' vy: ' + Math.round(gestureState.vy);
                                // this.setState(Object.assign(this.state, { panTrace: trace }));

                        },

                        onPanResponderRelease: () => {
                                this.isInPinchMode = false;
                                this.centerPosition = undefined;
                                this.lastPinchDistance = undefined;
                        }
                });
        }

        handleBackPress() {
                this.props.onRedirect(PageView.Menu);
                return true;
        }

        processDrag(gesture: PanResponderGestureState) {
                this.puzzlePositionOffset.X += gesture.dx * .2;
                this.puzzlePositionOffset.Y += gesture.dy * .2;

                let maxXDisplacement = this.blockSizeValue * this.props.levelWidth * (1 / this.state.zoomFactor - 1);
                let maxYDisplacement = this.blockSizeValue * this.props.levelHeight * (1 / this.state.zoomFactor - 1);

                this.puzzlePositionOffset.X = Math.min(0, Math.max(this.puzzlePositionOffset.X, maxXDisplacement));
                this.puzzlePositionOffset.Y = Math.min(2 * this.initialPuzzleTopOffset, Math.max(this.puzzlePositionOffset.Y, maxYDisplacement));

                Animated.spring(this.state.puzzlePositionOffset, { toValue: { x: this.puzzlePositionOffset.X, y: this.puzzlePositionOffset.Y } }).start();
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
                        if (this.centerPosition == undefined) {
                                this.centerPosition = new BlockPosition();
                                this.centerPosition.X = (x1 + x2) / 2;
                                //this.centerPosition.Y =   (y1 + y2) / 2;
                        }
                        let screenWidth = Dimensions.get('window').width;
                        // let screenHeight = Dimensions.get('window').height;
                        let puzzleWidth = blockSize * this.props.levelWidth;
                        let puzzleHeight = blockSize * this.props.levelHeight;

                        this.puzzlePositionOffset.X = -this.centerPosition.X * ((puzzleWidth / screenWidth) - 1);
                        // this.puzzlePositionOffset.Y =  this.centerPosition.Y * (screenHeight - puzzleHeight) / (screenHeight + 2 * this.centerPosition.Y);

                        this.state.puzzlePositionOffset.setValue({ x: this.puzzlePositionOffset.X, y: this.puzzlePositionOffset.Y });

                        this.state.blockSize.setValue(blockSize);
                        this.setState(Object.assign(this.state, { zoomFactor: zoomFactor, puzzleWidth: puzzleWidth, puzzleHeight: puzzleHeight }));
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
                let zoomFactor = this.state.zoomFactor;
                let blockSize = this.calculateBlockSize(zoomFactor);
                this.state.blockSize.setValue(blockSize);

                this.initialPuzzleTopOffset = (Dimensions.get('window').height - this.props.levelHeight * blockSize) / 2;


                if (blockSize < this.defaultBlockSize) {
                        blockSize = this.defaultBlockSize;
                        zoomFactor = (this.props.levelWidth * blockSize) / Dimensions.get('window').width;
                }

                let puzzleWidth = blockSize * this.props.levelWidth;
                let puzzleHeight = blockSize * this.props.levelHeight;

                Animated.timing(this.state.puzzlePositionOffset, { toValue: { x: 0, y: this.initialPuzzleTopOffset }, duration: 700 }).start(() => {

                        if (puzzleWidth > Dimensions.get('window').width) {
                                this.puzzlePositionOffset.X = -(puzzleWidth - Dimensions.get('window').width) / 2;
                        }
                        this.puzzlePositionOffset.Y = -(puzzleHeight - Dimensions.get('window').height) / 2;

                        Animated.spring(this.state.puzzlePositionOffset, { toValue: { x: this.puzzlePositionOffset.X, y: this.puzzlePositionOffset.Y }, bounciness: 10 }).start();
                });

                this.state.blockSize.setValue(blockSize);
                // Assign new state
                let newState = Object.assign(this.state, { zoomFactor: zoomFactor, puzzleWidth: puzzleWidth, puzzleHeight: puzzleHeight });
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

        saveHighScore(time: number) {
                return fetch('http://walidsultan.net/MineRageApi/api/HighScores/SaveHighscore', {
                        method: 'POST',
                        headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                                "Name": this.currentUsername,
                                "Time": time,
                                "Difficulty": this.props.difficulty,
                                "PhotoUrl": this.currentUserPhoto,
                                "isSignedIn": this.isSignedIn
                        })
                });
        }

        render() {
                let puzzle = this.generatePuzzle(this.props.levelWidth, this.props.levelHeight);

                let puzzlePosition = {
                        top: this.state.puzzlePositionOffset.y,
                        left: this.state.puzzlePositionOffset.x,
                        width: this.state.puzzleWidth,
                        height: this.state.puzzleHeight
                };
                let background: StyleProp<ImageStyle> = {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: undefined,
                        height: undefined
                }

                return (
                        <View style={BoardStyles.board} {...this.panResponder.panHandlers}>
                                <Image source={require('../../../assets/images/c9c685ba.png')} style={background} ></Image>
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
