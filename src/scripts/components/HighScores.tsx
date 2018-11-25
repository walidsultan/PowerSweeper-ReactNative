// import '../../css/levelDifficulty.less';
import * as React from 'react';
import { View } from 'react-native';
import HighScoresInterface from '../interfaces/HighScoresInterface';
import { TabView, SceneMap } from 'react-native-tab-view';
import HighScoresState from '../states/HighScoresState';

const easyRoute = () => (
    <View style={[{ flex: 1, backgroundColor: '#ff4081' }]} />
);
const mediumRoute = () => (
    <View style={[{ flex: 1, backgroundColor: '#673ab7' }]} />
);
const hardRoute = () => (
    <View style={[{ flex: 1, backgroundColor: '#456548' }]} />
);



export default class HighScores extends React.Component<HighScoresInterface, HighScoresState> {

    constructor(props: any) {
        super(props);

        this.state = new HighScoresState();
    }
    render() {

        return (
            <TabView
                navigationState={this.state}
                onIndexChange={(i) => this.setState({ index: i })}
                renderScene={SceneMap({
                    Easy: easyRoute,
                    Medium: mediumRoute,
                    Hard: hardRoute,
                })}
            />
        );
    }


}
