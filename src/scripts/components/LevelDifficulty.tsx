// import '../../css/levelDifficulty.less';
import * as React from 'react';
import LevelDifficultyInterface from '../interfaces/LevelDiffiCultyInterface';
import Popup from './popup';
import { View, TouchableHighlight, Text, Animated } from 'react-native';
import LevelDifficultyStyles from '../../styles/levelDifficultyStyles';
import LevelDifficultyState from '../states/LevelDifficultyState';

export default class LevelDifficulty extends React.Component<LevelDifficultyInterface, LevelDifficultyState> {

    constructor(props: any) {
        super(props);
        this.state = new LevelDifficultyState();
    }
    render() {

        let easyButtonStyle = {
            opacity: this.state.EasyButtonOpacity
        }

        let mediumButtonStyle = {
            opacity: this.state.MediumButtonOpacity
        }
        let hardButtonStyle = {
            opacity: this.state.HardButtonOpacity
        }
        return (
            <Popup showPopup={this.props.showPopup}
                title={this.props.title}
                onCloseClick={() => this.props.onCloseClick()}
            >
                <View style={LevelDifficultyStyles.container}>
                    <Animated.View style={[LevelDifficultyStyles.button, easyButtonStyle]}>
                        <TouchableHighlight onPress={() => this.buttonPress(this.state.EasyButtonOpacity, this.props.onEasyLevelClick)} style={LevelDifficultyStyles.buttonHighlight} underlayColor='#eee'>
                            <Text style={LevelDifficultyStyles.buttonText}>Easy</Text>
                        </TouchableHighlight>
                    </Animated.View>
                    <Animated.View style={[LevelDifficultyStyles.button, mediumButtonStyle]}>
                        <TouchableHighlight onPress={() => this.buttonPress(this.state.MediumButtonOpacity, this.props.onMediumLevelClick)} style={LevelDifficultyStyles.buttonHighlight} underlayColor='#eee'>
                            <Text style={LevelDifficultyStyles.buttonText}>Meduim</Text>
                        </TouchableHighlight>
                    </Animated.View>
                    <Animated.View style={[LevelDifficultyStyles.button, hardButtonStyle]}>
                        <TouchableHighlight onPress={() => this.buttonPress(this.state.HardButtonOpacity, this.props.onHardLevelClick)} style={LevelDifficultyStyles.buttonHighlight} underlayColor='#eee'>
                            <Text style={LevelDifficultyStyles.buttonText}>Hard</Text>
                        </TouchableHighlight>
                    </Animated.View>
                </View>
            </Popup>
        );
    }

    buttonPress(animatedValue: Animated.Value, callback: any) {
        Animated.timing(animatedValue, { toValue: 0.1, duration: 500 }).start(() => {
            callback();
        });
    }

}