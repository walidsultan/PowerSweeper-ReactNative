// import '../../css/levelDifficulty.less';
import * as React from 'react';
import LevelDifficultyInterface from '../interfaces/LevelDifficultyInterface';
import Popup from './popup';
import { View, TouchableHighlight, Text, Animated, Switch } from 'react-native';
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
        let insaneButtonStyle={
            opacity: this.state.InsaneButtonOpacity
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
                            <Text style={LevelDifficultyStyles.buttonText}>Medium</Text>
                        </TouchableHighlight>
                    </Animated.View>
                    <Animated.View style={[LevelDifficultyStyles.button, hardButtonStyle]}>
                        <TouchableHighlight onPress={() => this.buttonPress(this.state.HardButtonOpacity, this.props.onHardLevelClick)} style={LevelDifficultyStyles.buttonHighlight} underlayColor='#eee'>
                            <Text style={LevelDifficultyStyles.buttonText}>Hard</Text>
                        </TouchableHighlight>
                    </Animated.View>
                    <Animated.View style={[LevelDifficultyStyles.button, insaneButtonStyle]}>
                        <TouchableHighlight onPress={() => this.buttonPress(this.state.InsaneButtonOpacity, this.props.onInsaneLevelClick)} style={LevelDifficultyStyles.buttonHighlight} underlayColor='#eee'>
                            <Text style={LevelDifficultyStyles.buttonText}>Insane</Text>
                        </TouchableHighlight>
                    </Animated.View>
                    <View style={LevelDifficultyStyles.levelAssist}>
                        <Text style={LevelDifficultyStyles.assistText}>Assist</Text>
                        <Switch value={this.props.isAssistEnabled} onValueChange={this.props.onAssistChange} style={LevelDifficultyStyles.assistSwitch}></Switch>
                    </View>
                </View>
            </Popup>
        );
    }

 

    buttonPress(animatedValue: Animated.Value, callback: any) {
        Animated.timing(animatedValue, { toValue: 0.1, duration: 500,useNativeDriver:false }).start(() => {
            callback();
        });
    }

}