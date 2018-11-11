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
                    <TouchableHighlight onPress={() => { this.props.onEasyLevelClick(); }} style={LevelDifficultyStyles.button} underlayColor='#eee'>
                        <Text style={LevelDifficultyStyles.buttonText}>Easy</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => { this.props.onMediumLevelClick(); }} style={LevelDifficultyStyles.button} underlayColor='#eee'>
                        <Text style={LevelDifficultyStyles.buttonText}>Meduim</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => { this.props.onHardLevelClick(); }} style={LevelDifficultyStyles.button} underlayColor='#eee'>
                        <Text style={LevelDifficultyStyles.buttonText}>Hard</Text>
                    </TouchableHighlight>
                </View>
            </Popup>
        );
    }

}