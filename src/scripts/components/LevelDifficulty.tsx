// import '../../css/levelDifficulty.less';
import * as React from 'react';
import LevelDifficultyInterface from '../interfaces/LevelDiffiCultyInterface';
import Popup from './popup';
import { View, TouchableHighlight, Text } from 'react-native';
import LevelDifficultyStyles from '../../styles/levelDifficultyStyles';

export default class LevelDifficulty extends React.Component<LevelDifficultyInterface, {}> {

    constructor(props: any) {
        super(props);

    }
    render() {
        return (
            <Popup showPopup={this.props.showPopup}
                title={this.props.title}
                onCloseClick={() => this.props.onCloseClick()}
            >
                <View style={LevelDifficultyStyles.container}>
                    <TouchableHighlight onPress={() => { this.props.onEasyLevelClick(); }} >
                        <Text style={LevelDifficultyStyles.button}>Easy</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => { this.props.onMediumLevelClick(); }} >
                        <Text style={LevelDifficultyStyles.button}>Meduim</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => { this.props.onHardLevelClick(); }} >
                        <Text style={LevelDifficultyStyles.button}>Hard</Text>
                    </TouchableHighlight>
                </View>
            </Popup>
        );
    }

}