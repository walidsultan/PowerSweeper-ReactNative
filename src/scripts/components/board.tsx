import * as React from 'react';
import Block from './block';
import BoardInterface from '../interfaces/BoardInterface';
import { MineType } from '../enums/mineType';
import BoardState from '../states/BoardState';
import BlockPointer from '../types/blockPointer';
import BlockType from '../types/BlockType';
import Alert from './Alert';
import { PageView } from '../enums/pageView';
import { View, Dimensions, Vibration, PanResponder, PanResponderGestureState, Animated, BackHandler, Image, StyleProp, ImageStyle, AsyncStorage, Text, TouchableHighlight } from 'react-native';
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

        private puzzleDuration: number;

        private tutorialText: string;
        private isHighlightMineShown: boolean = false;

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
                this.saveLog("Start new game -- Difficulty: " + this.props.difficulty + " -- isTutorial: " + this.props.isTutorial);

                if (this.props.isTutorial) {
                        this.saveLog("User started tutorial");
                        this.tutorialText = "Tap the highlighted button.";
                        console.log(this.mines);
                }
        }

        startupAnimationCompleted() {
                if (this.props.isTutorial) {
                        this.startTutorial();
                }
        }

        startTutorial(){
                console.log("Startup animation -- completed");
                         this.tutorialText='';
                        let boardState = this.state;
                        let isBlockHighlighted = false;
                        for (let xIndex in boardState.blocks) {
                                for (let yIndex in boardState.blocks[xIndex]) {

                                        if (boardState.blocks[xIndex][yIndex].HasMine) continue;

                                        let isVisible = (((this.puzzlePositionOffset.X + boardState.blocks[xIndex][yIndex].Left * this.blockSizeValue) > 0) &&
                                                ((this.puzzlePositionOffset.Y + boardState.blocks[xIndex][yIndex].Top * this.blockSizeValue) > 0));
                                        if (isVisible) {
                                                let blockInfo = this.calculateBlockInfo(parseInt(xIndex), parseInt(yIndex), false);
                                                if (blockInfo.value == 0) {
                                                        console.log("Highlight block -- Left: " + boardState.blocks[xIndex][yIndex].Left + " Top: " + boardState.blocks[xIndex][yIndex].Top);
                                                        boardState.blocks[xIndex][yIndex].HighlightTap = true;
                                                        isBlockHighlighted = true;
                                                        this.tutorialText = "Tap the highlighted button";
                                                        break;
                                                }
                                        }
                                }
                                if (isBlockHighlighted) break;
                        }
                        this.setState(Object.assign(this.state, { blocks: boardState.blocks }));
        }

        showTutorialNextStep() {
                this.tutorialText = '';
                let boardState = this.state;
                let isBlockHighlighted = false;
                //Find mines
                for (let xIndex in boardState.blocks) {
                        for (let yIndex in boardState.blocks[xIndex]) {
                                if (!boardState.blocks[xIndex][yIndex].IsClicked || boardState.blocks[xIndex][yIndex].HasMine) continue;

                                if (boardState.blocks[xIndex][yIndex].Value > 0) {
                                        //console.log("Mines step: left:" + xIndex + ", top: " + yIndex);
                                        let blockInfo = this.calculateBlockInfo(parseInt(xIndex), parseInt(yIndex), false);
                                        let surroundingNonClickedBlocks = blockInfo.surroundingBlocks.filter(x => boardState.blocks[x.Position.X][x.Position.Y].IsClicked == false &&
                                                boardState.blocks[x.Position.X][x.Position.Y].MarkedState == 0);
                                        if (surroundingNonClickedBlocks.length == 1) {
                                                let targetMine = surroundingNonClickedBlocks[0];
                                                let surroundingMarkedMines = blockInfo.surroundingBlocks.filter(x => boardState.blocks[x.Position.X][x.Position.Y].HasMine && boardState.blocks[x.Position.X][x.Position.Y].MarkedState > 0);
                                                let markedMinesValue = 0;
                                                if (surroundingMarkedMines.length > 0) {
                                                        markedMinesValue = surroundingMarkedMines.map(x => boardState.blocks[x.Position.X][x.Position.Y].Mine).reduce((x, y) => x + y);
                                                }
                                                let targetMineValue = blockInfo.value - markedMinesValue;
                                                //  console.log("Mines step: mark mine, left: " + targetMine.Position.X + " top: " + targetMine.Position.Y + " mine value: " + targetMineValue);
                                                isBlockHighlighted = true;

                                                if (targetMineValue > 0) {
                                                        this.tutorialText = 'Hold the highlighted block until you feel the vibration ' + targetMineValue + ' time(s)';
                                                        this.isHighlightMineShown = true;
                                                        boardState.blocks[targetMine.Position.X][targetMine.Position.Y].HighlightMine = true;
                                                } else {
                                                        this.tutorialText = "Tap the highlighted block.";
                                                        boardState.blocks[targetMine.Position.X][targetMine.Position.Y].HighlightTap = true;
                                                }

                                                break;
                                        }
                                }
                        }
                        if (isBlockHighlighted) break;
                }

                if (!isBlockHighlighted) {
                        console.log("Tutorial Matching Blocks -- start");
                        //Find common blocks
                        for (let xIndex in boardState.blocks) {
                                for (let yIndex in boardState.blocks[xIndex]) {
                                        if (!(boardState.blocks[xIndex][yIndex].IsClicked && boardState.blocks[xIndex][yIndex].Value > 0)) continue;

                                        let blockInfo = this.calculateBlockInfo(parseInt(xIndex), parseInt(yIndex), true);
                                        console.log("Tutorial Matching Blocks -- main block -- left:" + xIndex + " top: " + yIndex + " value: " + boardState.blocks[xIndex][yIndex].Value);
                                        let surroundingNonClickedBlocks = blockInfo.surroundingBlocks.filter(x => boardState.blocks[x.Position.X][x.Position.Y].IsClicked == false &&
                                                boardState.blocks[x.Position.X][x.Position.Y].MarkedState == 0);

                                        if (surroundingNonClickedBlocks.length == 0) continue;

                                        console.log("Tutorial Matching surroundingNonClickedBlocks count -- " + surroundingNonClickedBlocks.length);
                                        //Surrounding clicked blocks of the same value
                                        let surroundingClickedBlocks = blockInfo.surroundingBlocks.filter(x => boardState.blocks[x.Position.X][x.Position.Y].IsClicked == true && boardState.blocks[x.Position.X][x.Position.Y].Value > 0);

                                        let mainMarkedBlocks = blockInfo.surroundingBlocks.filter(x => boardState.blocks[x.Position.X][x.Position.Y].MarkedState > 0);
                                        let mainMarkedValue = 0
                                        if (mainMarkedBlocks.length > 0) {
                                                mainMarkedValue = mainMarkedBlocks.map(x => boardState.blocks[x.Position.X][x.Position.Y].MarkedState).reduce((x, y) => x + y);
                                        }

                                        console.log("Tutorial Matching surroundingClickedBlocks count -- " + surroundingClickedBlocks.length);
                                        for (let clickedBlock of surroundingClickedBlocks) {
                                                let clickedBlockInfo = this.calculateBlockInfo(clickedBlock.Position.X, clickedBlock.Position.Y, true);
                                                let hasCommonBlocks = true;
                                                for (let nonClickedBlock of surroundingNonClickedBlocks) {
                                                        let isMatching = clickedBlockInfo.surroundingBlocks.filter(x => x.Position.X == nonClickedBlock.Position.X && x.Position.Y == nonClickedBlock.Position.Y).length > 0;
                                                        if (!isMatching) {
                                                                hasCommonBlocks = false;
                                                                break;
                                                        }
                                                }
                                                if (hasCommonBlocks) {
                                                        console.log("Tutorial Matching, found common blocks for clicked block Left: " + clickedBlock.Position.X + " Top: " + clickedBlock.Position.Y + " Value: " + clickedBlockInfo.value);
                                                        //any non matching block should be zero
                                                        let clickedBlockNeighbors = clickedBlockInfo.surroundingBlocks.filter(x => boardState.blocks[x.Position.X][x.Position.Y].IsClicked == false &&
                                                                boardState.blocks[x.Position.X][x.Position.Y].MarkedState == 0);
                                                        console.log("clickedBlockNeighbors count -- " + clickedBlockNeighbors.length);
                                                        if (clickedBlockInfo.value == blockInfo.value || (clickedBlockNeighbors.length - surroundingNonClickedBlocks.length == 1)) {
                                                                console.log("common blocks condition met");

                                                                let clickedMarkedBlocks = clickedBlockInfo.surroundingBlocks.filter(x => boardState.blocks[x.Position.X][x.Position.Y].MarkedState > 0);
                                                                let clickedMarkedValue = 0;
                                                                if (clickedMarkedBlocks.length > 0) {
                                                                        clickedMarkedValue = clickedMarkedBlocks.map(x => boardState.blocks[x.Position.X][x.Position.Y].MarkedState).reduce((x, y) => x + y);
                                                                }
                                                                let targetMineValue = clickedBlockInfo.value - blockInfo.value - clickedMarkedValue + mainMarkedValue;
                                                                for (let clickedBlockNeighbor of clickedBlockNeighbors) {
                                                                        let isNotMatching = surroundingNonClickedBlocks.filter(x => x.Position.X == clickedBlockNeighbor.Position.X && x.Position.Y == clickedBlockNeighbor.Position.Y).length == 0;
                                                                        if (isNotMatching) {
                                                                                console.log("Tutorial Matching Blocks --  Highlight -- Left: " + clickedBlockNeighbor.Position.X + " top:" + clickedBlockNeighbor.Position.Y + " target mine value: " + targetMineValue);
                                                                                isBlockHighlighted = true;

                                                                                if (targetMineValue > 0) {
                                                                                        this.tutorialText = 'Hold the highlighted block until you feel the vibration ' + targetMineValue + ' times.';
                                                                                        this.isHighlightMineShown = true;
                                                                                        boardState.blocks[clickedBlockNeighbor.Position.X][clickedBlockNeighbor.Position.Y].HighlightMine = true;
                                                                                } else {
                                                                                        this.tutorialText = "Tap the highlighted block.";
                                                                                        boardState.blocks[clickedBlockNeighbor.Position.X][clickedBlockNeighbor.Position.Y].HighlightTap = true;
                                                                                }

                                                                                break;
                                                                        }
                                                                }


                                                        }

                                                }

                                                if (isBlockHighlighted) break;
                                        }
                                        if (isBlockHighlighted) break;
                                }
                                if (isBlockHighlighted) break;
                        }
                }


                if (!isBlockHighlighted) {
                        //console.log("Tutorial Matching marked state -- start");
                        //Find marked state
                        for (let xIndex in boardState.blocks) {
                                for (let yIndex in boardState.blocks[xIndex]) {
                                        if (!(boardState.blocks[xIndex][yIndex].IsClicked && boardState.blocks[xIndex][yIndex].Value > 0)) continue;

                                        let blockInfo = this.calculateBlockInfo(parseInt(xIndex), parseInt(yIndex), true);

                                        let markedValue = 0;

                                        for (let block of blockInfo.surroundingBlocks) {
                                                let neighborBlock = boardState.blocks[block.Position.X][block.Position.Y];
                                                if (neighborBlock.MarkedState > 0) {
                                                        markedValue += neighborBlock.MarkedState;
                                                }
                                        }
                                        if (blockInfo.value == markedValue) {
                                                for (let block of blockInfo.surroundingBlocks) {
                                                        let neighborBlock = boardState.blocks[block.Position.X][block.Position.Y];
                                                        if (!neighborBlock.IsClicked && neighborBlock.MarkedState == 0) {
                                                                //  console.log("Tutorial Matching marked state  --  Highlight -- Left: " + block.Position.X + " top:" + block.Position.Y);
                                                                isBlockHighlighted = true;
                                                                neighborBlock.HighlightTap = true;

                                                                this.tutorialText = "Tap the highlighted block.";

                                                                break;
                                                        }
                                                }
                                        }
                                        if (isBlockHighlighted) break;
                                }
                                if (isBlockHighlighted) break;
                        }
                }

                if (!isBlockHighlighted) {
                        this.tutorialText = "Out of clues. Choose a random block.";
                }

                this.setState(Object.assign(this.state, { blocks: boardState.blocks }));

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
                                blockStates[i][j].HighlightTap = false;
                                blockStates[i][j].HighlightMine = false;
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
                                this.saveLog("User clicked mine -- Difficulty: " + this.props.difficulty);
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
                        console.log("block clicked: left: " + left + ", top: " + top)
                        this.setBlockValues(left, top, boardState.blocks);
                }
                this.setState({ blocks: boardState.blocks }, () => this.onMineStateChanged());


        }

        pushBlock(blocks: BlockPointer[], left: number, top: number, getAllBlocks: boolean) {
                if (!this.state.blocks[left][top].IsClicked || getAllBlocks) {
                        blocks.push({ Position: { X: left, Y: top }, Value: this.mines[left][top] });
                }
        }

        setBlockValues(left: number, top: number, blocksStates: BlockType[][]) {
                let { value, surroundingBlocks } = this.calculateBlockInfo(left, top, false);

                blocksStates[left][top].IsClicked = true;
                blocksStates[left][top].Value = value;
                blocksStates[left][top].MarkedState = 0;
                blocksStates[left][top].HighlightTap = false;
                blocksStates[left][top].HighlightMine = false;
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

        private calculateBlockInfo(left: number, top: number, getAllBlocks: boolean) {
                let surroundingBlocks: BlockPointer[] = new Array();
                if (left > 0) {
                        this.pushBlock(surroundingBlocks, left - 1, top, getAllBlocks);
                        if (top > 0) {
                                this.pushBlock(surroundingBlocks, left - 1, top - 1, getAllBlocks);
                        }
                        if (top < this.props.levelHeight - 1) {
                                this.pushBlock(surroundingBlocks, left - 1, top + 1, getAllBlocks);
                        }
                }
                if (left < this.props.levelWidth - 1) {
                        this.pushBlock(surroundingBlocks, left + 1, top, getAllBlocks);
                        if (top > 0) {
                                this.pushBlock(surroundingBlocks, left + 1, top - 1, getAllBlocks);
                        }
                        if (top < this.props.levelHeight - 1) {
                                this.pushBlock(surroundingBlocks, left + 1, top + 1, getAllBlocks);
                        }
                }
                if (top > 0) {
                        this.pushBlock(surroundingBlocks, left, top - 1, getAllBlocks);
                }
                if (top < this.props.levelHeight - 1) {
                        this.pushBlock(surroundingBlocks, left, top + 1, getAllBlocks);
                }
                let value: number = 0;
                for (let block of surroundingBlocks) {
                        value += block.Value;
                }
                return { value, surroundingBlocks };
        }

        handleRightClick(left: number, top: number) {
                if (this.isVibrationEnabled) {
                        Vibration.vibrate(100, false);
                }

                if(this.props.isTutorial && !this.isHighlightMineShown){
                        return;
                }

                if (!this.isMineClicked) {
                        let blocksStates = this.state.blocks;
                        if (blocksStates[left][top].MarkedState === MineType.Large) {
                                blocksStates[left][top].MarkedState = 0;
                        } else {
                                blocksStates[left][top].MarkedState++;
                        }

                        if (this.props.isTutorial && blocksStates[left][top].MarkedState == blocksStates[left][top].Mine) {
                                blocksStates[left][top].HighlightMine = false;
                                this.isHighlightMineShown = false;
                                this.showTutorialNextStep();
                        }

                        this.setState(Object.assign(this.state, { blocks: blocksStates }), () => this.onMineStateChanged());
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
                                        MarkedState={block.MarkedState}
                                        IsTutorial={this.props.isTutorial} HighlightTap={block.HighlightTap} HighlightMine={block.HighlightMine} />);
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
                                        let newState = null;
                                        if (this.props.isTutorial) {
                                                newState = Object.assign(this.state, { alertState: { showAlert: true, alertTitle: 'Congrats!', alertMessage: 'You passed the tutorial! Repeat?' } });
                                        } else {
                                                newState = Object.assign(this.state, { alertState: { showAlert: true, alertTitle: 'Congrats!', alertMessage: 'You did it! Play again?' } });
                                        }
                                        this.state.alertState.showAlert = true;
                                        //get the time the player took to solve the puzzle
                                        var endDate = new Date();
                                        this.puzzleDuration = (endDate.getTime() - this.startTime.getTime()) / 1000;
                                        this.saveHighScore(this.puzzleDuration, this.currentUsername, this.currentUserPhoto);

                                        this.setState(newState);

                                        this.saveLog("User solved level -- Difficulty: " + this.props.difficulty);
                                }
                        }
                }

                if (this.isMineClicked) {
                        let newState = Object.assign(this.state, { alertState: { showAlert: true, alertTitle: 'Game Over', alertMessage: 'You clicked on a mine. Play again?' } });
                        this.setState(newState);
                }

                if (this.props.isTutorial && !this.isHighlightMineShown) {
                        this.showTutorialNextStep();
                }
        }


        componentDidUpdate() {

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

                        Animated.spring(this.state.puzzlePositionOffset, { toValue: { x: this.puzzlePositionOffset.X, y: this.puzzlePositionOffset.Y }, bounciness: 10 }).start(() => this.startupAnimationCompleted());
                });

                this.state.blockSize.setValue(blockSize);
                // Assign new state
                let newState = Object.assign(this.state, { zoomFactor: zoomFactor, puzzleWidth: puzzleWidth, puzzleHeight: puzzleHeight });
                this.setState(newState);
        }

        onAlertOkClick() {
                var blocks = this.loadLevel();
               
                let newState = Object.assign(this.state, { blocks: blocks, alertState: { showAlert: false } });
                this.setState(newState,()=>{
                        console.log("Alert ok isTutorial: "+this.props.isTutorial );
                        if(this.props.isTutorial){
                                this.startTutorial();
                        }
                });
        }

        onAlertClose() {
                this.props.onRedirect(PageView.Menu);
        }

        onAlertCancel() {
                this.props.onRedirect(PageView.Menu);
        }

        saveLog(text: string) {
                return fetch('http://walidsultan.net/MineRageApi/api/Logs/SaveLog', {
                        method: 'POST',
                        headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                                'Text': text
                        })
                })
                        .catch((error) => {
                                console.error(error);
                        });
        }

        saveHighScore(time: number, username: string, photoUrl: string) {
                return fetch('http://walidsultan.net/MineRageApi/api/HighScores/SaveHighscore', {
                        method: 'POST',
                        headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                                "Name": username,
                                "Time": time,
                                "Difficulty": this.props.difficulty,
                                "PhotoUrl": photoUrl,
                                "isSignedIn": this.isSignedIn
                        })
                });
        }

        async signIn() {
                try {
                        const result = await Expo.Google.logInAsync({
                                androidStandaloneAppClientId: "568265247315-koa51h0vjmqphbbq1rj9h61kaf3psid5.apps.googleusercontent.com",
                                //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
                                scopes: ["profile", "email"]
                        });
                        if (result.type === "success") {
                                AsyncStorage.multiSet([['name', result.user.name],
                                ['photoUrl', result.user.photoUrl]]);
                                this.isSignedIn = true;
                                this.saveHighScore(this.puzzleDuration, result.user.name, result.user.photoUrl);
                                this.saveLog("User: " + result.user.name + " logged in successfully.");
                        } else {
                                this.saveLog("error: " + result.type)
                        }

                } catch (e) {
                        this.saveLog("error: " + e)
                        console.log("error", e)
                }
                this.props.onRedirect(PageView.Menu);
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
                        height: undefined,
                }

                let signInImageStyle: StyleProp<ImageStyle> = {
                        width: 150,
                        height: 36
                }

                let tutorialBanner = null;
                if (this.props.isTutorial) {
                        console.log("tutorial text -- " + this.tutorialText);
                        tutorialBanner = <View style={{ flex: 1, backgroundColor: '#CCC', borderRadius: 7, margin: 5, padding: 5, position: 'absolute', alignSelf: 'stretch', top: 0, left: 0, right: 0, flexDirection: 'row' }}><Text>{this.tutorialText}</Text></View>;
                }

                return (
                        <View style={BoardStyles.board} {...this.panResponder.panHandlers}>
                                <View style={background}>
                                        <Image source={require('../../../assets/images/c9c685ba.png')} style={background} ></Image>
                                </View>

                                <View style={BoardStyles.frame} >
                                        <Animated.View ref={this.puzzleRef} style={[BoardStyles.puzzle, puzzlePosition]}>
                                                {puzzle}
                                        </Animated.View>
                                </View>

                                {tutorialBanner}

                                <Alert title={this.state.alertState.alertTitle}
                                        showPopup={this.state.alertState.showAlert}
                                        message={this.state.alertState.alertMessage}
                                        onOkClick={() => this.onAlertOkClick()}
                                        onCancelClick={() => this.onAlertCancel()}
                                        onCloseClick={() => this.onAlertClose()}
                                >
                                        {!this.isSignedIn && !this.isMineClicked && <View style={BoardStyles.SignIn}><Text>You can also sign in to add your name to the leaderboard</Text>
                                                <View style={BoardStyles.SignInImage}>
                                                        <TouchableHighlight onPress={async () => { await this.signIn(); }} underlayColor="#ddd"  >
                                                                <Image source={require('../../../assets/images/google_signin_light.png')} style={signInImageStyle}></Image>
                                                        </TouchableHighlight>
                                                </View>
                                        </View>
                                        }
                                </Alert>
                        </View>
                );
        }

}
