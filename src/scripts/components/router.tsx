import * as React from 'react';
// import '../../css/router.less';
import RouterInterface from '../interfaces/RouterInterface';
import RouterState from '../states/RouterState';
import { PageView } from '../enums/pageView';
import Menu from './menu';
import { Difficulty } from '../enums/difficulty';
import Board from './board';
import { View, StyleProp, ViewStyle, StatusBar } from 'react-native';

export default class Router extends React.Component<RouterInterface, RouterState> {
    constructor(props: any) {
        super(props);
        this.state = new RouterState();
    }
    render() {
        let routerStyle: StyleProp<ViewStyle> = {
             flex: 1
        };
        return (
            <View style= {routerStyle}>
                <StatusBar hidden />
                {this.getCurrentView()}
            </View>
        );
    }

    getCurrentView() {
        switch (this.state.pageView) {
            case PageView.Menu:
                return <Menu onNewLevel={(e) => this.onNewLevel(e)}></Menu>;
            case PageView.Puzzle:
                return this.getPuzzleByDifficulty();
            default:
                return <Menu onNewLevel={(e) => this.onNewLevel(e)}></Menu>;
        }
    }

    onNewLevel(difficulty: Difficulty) {
        this.setLevelDifficulty(difficulty);
        this.setView(PageView.Puzzle);
    }

    getPuzzleByDifficulty() {
        switch (this.state.levelDifficulty) {
            case Difficulty.Easy:
                return <Board bigMinesCount={1} mediumMinesCount={2} smallMinesCount={3} levelHeight={7} levelWidth={7} onRedirect={(pv: any) => this.onRedirect(pv)} />;
            case Difficulty.Medium:
                return <Board bigMinesCount={3} mediumMinesCount={5} smallMinesCount={7} levelHeight={10} levelWidth={10} onRedirect={(pv: any) => this.onRedirect(pv)} />;
            case Difficulty.Hard:
                return <Board bigMinesCount={6} mediumMinesCount={10} smallMinesCount={14} levelHeight={15} levelWidth={15} onRedirect={(pv: any) => this.onRedirect(pv)} />;
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