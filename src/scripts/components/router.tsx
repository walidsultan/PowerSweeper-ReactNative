import * as React from 'react';
// import '../../css/router.less';
import RouterInterface from '../interfaces/RouterInterface';
import RouterState from '../states/RouterState';
import { PageView } from '../enums/pageView';
import Menu from './menu';
import { Difficulty } from '../enums/difficulty';
import Board from './board';
import { View, StyleProp, ViewStyle, StatusBar, AsyncStorage } from 'react-native';
import * as Expo from "expo";

const soundObject = new Expo.Audio.Sound();

export default class Router extends React.Component<RouterInterface, RouterState> {

    constructor(props: any) {
        super(props);
        this.state = new RouterState();

        this.playBackGroundMusic();

           AsyncStorage.getItem('isAssistEnabled',(error,result)=>{
            if(result==='false'){
                this.setState({ isAssistEnabled: false });
            }else
            {
                this.setState({ isAssistEnabled: true });
            }
            if(error){
                console.log(error);
            }
        })
    }

    async playBackGroundMusic() {
        let isMusicEnabled = await AsyncStorage.getItem('isMusicEnabled');

        try {
            await soundObject.loadAsync(require('../../../assets/audio/background.mp3'));
            await soundObject.setIsLoopingAsync(true);
            if (isMusicEnabled === null || isMusicEnabled !== 'false') {
                await soundObject.playAsync();
            }
            // Your sound is playing!
        } catch (error) {
            // An error occurred!
        }
    }

    render() {
        let routerStyle: StyleProp<ViewStyle> = {
            flex: 1
        };
        return (
            <View style={routerStyle}>
                <StatusBar hidden />
                {this.getCurrentView()}
            </View>
        );
    }

    getCurrentView() {
        switch (this.state.pageView) {
            case PageView.Menu:
                return <Menu onNewLevel={(e) => this.onNewLevel(e)} musicReference={soundObject} onTutorial={() => this.onTutorial()} onAssistChange={this.onAssistToggle} isAssistEnabled={this.state.isAssistEnabled} ></Menu>;
            case PageView.Puzzle:
                return this.getPuzzleByDifficulty(this.state.isAssistEnabled);
            case PageView.Tutorial:
                return this.getPuzzleByDifficulty(true);
            default:
                return <Menu onNewLevel={(e) => this.onNewLevel(e)} musicReference={soundObject} onTutorial={() => this.onTutorial()} onAssistChange={this.onAssistToggle}  isAssistEnabled={this.state.isAssistEnabled}></Menu>;
        }
    }

    onTutorial() {
        this.setLevelDifficulty(Difficulty.Easy);
        this.setView(PageView.Tutorial);
    }

    onNewLevel(difficulty: Difficulty) {
        this.setLevelDifficulty(difficulty);
        this.setView(PageView.Puzzle);
    }

    onAssistToggle = (value: any)=> {
        console.log("Router assist toggle -- " + value );
        let newState = Object.assign(this.state, { isAssistEnabled: value });
        this.setState(newState);
        AsyncStorage.setItem('isAssistEnabled', value.toString());
    }

    getPuzzleByDifficulty(isTutorial: boolean) {
        switch (this.state.levelDifficulty) {
            case Difficulty.Easy:
                return <Board bigMinesCount={1} mediumMinesCount={2} smallMinesCount={3} levelHeight={7} levelWidth={7} difficulty={Difficulty.Easy} onRedirect={(pv: any) => this.onRedirect(pv)} isTutorial={isTutorial} />;
            case Difficulty.Medium:
                return <Board bigMinesCount={3} mediumMinesCount={5} smallMinesCount={7} levelHeight={10} levelWidth={10} difficulty={Difficulty.Medium} onRedirect={(pv: any) => this.onRedirect(pv)} isTutorial={isTutorial} />;
            case Difficulty.Hard:
                return <Board bigMinesCount={6} mediumMinesCount={10} smallMinesCount={14} levelHeight={15} levelWidth={15} difficulty={Difficulty.Hard} onRedirect={(pv: any) => this.onRedirect(pv)} isTutorial={isTutorial} />;
            default:
                return <div></div>;
        }
    }
    onRedirect(pageView: PageView) {
        this.setView(pageView);
    }

    setLevelDifficulty(difficulty: Difficulty) {
        let newState = Object.assign(this.state, { levelDifficulty: difficulty });
        this.setState(newState);
    }

    setView(view: PageView) {
        let newState = Object.assign(this.state, { pageView: view });
        this.setState(newState);
    }

    handleBoardKeyUp(keyCode: number) {
        if (this.state.pageView === PageView.Puzzle && keyCode === 8) {
            this.setView(PageView.Menu);
        }
    }

    componentDidUpdate() {
        // this.routerRef.current.focus();
    }

}