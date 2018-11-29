// import '../../css/levelDifficulty.less';
import * as React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import HighScoresInterface from '../interfaces/HighScoresInterface';
import { TabView } from 'react-native-tab-view';
import HighScoresState from '../states/HighScoresState';
import { Difficulty } from '../enums/difficulty';
import HighScoreType from '../types/HighScoreType';
import HighscoresStyles from '../../styles/highscoresStyles';


export default class HighScores extends React.Component<HighScoresInterface, HighScoresState> {

    constructor(props: any) {
        super(props);

        this.state = new HighScoresState();
        this.loadHighscores(1);
    }

    easyRoute() {
        return <View style={HighscoresStyles.tabContainer} >
            <ScrollView style={{ flex: 1 }}>
                {this.getRenderedScores(this.state.easyHighscores)}
            </ScrollView>
        </View>;
    }

    mediumRoute() {
        return <View style={HighscoresStyles.tabContainer} >
            <ScrollView style={{ flex: 1 }}>
                {this.getRenderedScores(this.state.mediumHighscores)}
            </ScrollView>
        </View>;
    }
    hardRoute() {
        return <View style={HighscoresStyles.tabContainer} >
            <ScrollView style={{ flex: 1 }}>
                {this.getRenderedScores(this.state.hardHighscores)}
            </ScrollView>
        </View>;
    }

    showActivity() {
        if (this.state.isSendingFeedback) {
            return <View style={HighscoresStyles.activityIndicator}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>;
        } else {
            return null;
        }
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                {this.showActivity()}
                <TabView
                    navigationState={this.state}
                    onIndexChange={(i) => this.tabViewIndexChange(i)}
                    renderScene={
                        ({ route }) => {
                            switch (route.key) {
                                case 'Easy':
                                    return this.easyRoute();
                                case 'Medium':
                                    return this.mediumRoute();
                                case 'Hard':
                                    return this.hardRoute();
                                default:
                                    return null;
                            }
                        }
                    }
                />
            </View>
        );
    }

    getRenderedScores(scoresData: HighScoreType[]) {
        if (scoresData) {
            let scores = [];
            for (let score of scoresData) {
                scores.push(
                    <View style={HighscoresStyles.grid}>
                        <Text style={HighscoresStyles.name}>{score.Name}</Text>
                        <Text style={HighscoresStyles.time}>{score.Time + ' s'}</Text>
                    </View>
                )
            }
            return scores;
        }
        return null;
    }

    async loadHighscores(difficulty: Difficulty) {
        this.setState({ isSendingFeedback: true });
        try {
            const response = await fetch('http://walidsultan.net/MineRageApi/api/HighScores/GetByDifficulty?difficulty=' + difficulty, {
                method: 'GET'
            });
            const highscores = await response.json();
            let newState = null;
            switch (difficulty) {
                case Difficulty.Easy:
                    newState = Object.assign(this.state, { easyHighscores: highscores });
                    break;
                case Difficulty.Medium:
                    newState = Object.assign(this.state, { mediumHighscores: highscores });
                    break;
                case Difficulty.Hard:
                    newState = Object.assign(this.state, { hardHighscores: highscores });
                    break;
            }
            this.setState(newState);
            this.setState({ isSendingFeedback: false });
        }
        catch (error) {
            console.error(error);
            this.setState({ isSendingFeedback: false });
        }
    }

    tabViewIndexChange(index: number) {
        switch (index + 1) {
            case Difficulty.Medium:
                if (!this.state.mediumHighscores) {
                    this.loadHighscores(index+1);
                }
                break;
            case Difficulty.Hard:
                if (!this.state.hardHighscores) {
                    this.loadHighscores(index+1);
                }
                break;
        }

        this.setState({ index: index });
    }
}
