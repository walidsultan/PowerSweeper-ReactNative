import * as React from 'react';
import MenuInterface from '../interfaces/MenuInterface';
import MenuState from '../states/MenuState';
import { Text, View, TouchableHighlight, FlatList, Image, StyleProp, ImageStyle, TextInput, ActivityIndicator } from 'react-native';
import MenuStyles from '../../styles/menuStyles';
import { Font } from 'expo';
import MenuContent from './MenuContent';
import LevelDifficulty from './LevelDifficulty';
import { Difficulty } from '../enums/difficulty';

export default class Menu extends React.Component<MenuInterface, MenuState> {

    private menuRef: any;
    private popupWidthRatio: number = 0.6;
    private feedbackText: string;
    constructor(props: any) {
        super(props);
        this.state = new MenuState();
        this.menuRef = React.createRef();

        this.updateDimensions = this.updateDimensions.bind(this);

    }
    render() {

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

        return <View ref={this.menuRef} style={this.state.fontLoaded ? MenuStyles.container : undefined}>
            <Image source={require('../../../assets/images/menu_bg.png')} style={background} ></Image>
            <View style={MenuStyles.titleContainer}>
                <Text style={this.state.fontLoaded ? MenuStyles.title : undefined}>Mine Rage</Text>
            </View>
            <View style={MenuStyles.itemsContainer}>
                <View style={MenuStyles.buttonContainer}>
                    <TouchableHighlight onPress={() => { this.OnNewClick(); }} style={MenuStyles.buttonHighlight} underlayColor="#ddd">
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>New Game</Text>
                    </TouchableHighlight>
                </View>
                <View style={MenuStyles.buttonContainer}>
                    <TouchableHighlight onPress={() => { this.OnNewClick(); }} disabled={true} style={MenuStyles.buttonHighlight} underlayColor="#ddd">
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>High Scores</Text>
                    </TouchableHighlight>
                </View>
                <View style={MenuStyles.buttonContainer}>
                    <TouchableHighlight onPress={() => { this.OnInstructionsClick(); }} style={MenuStyles.buttonHighlight} underlayColor="#ddd">
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>Instructions</Text>
                    </TouchableHighlight>
                </View>
                <View style={MenuStyles.buttonContainer}>
                    <TouchableHighlight onPress={() => { this.OnFeedbackClick(); }} style={MenuStyles.buttonHighlight} underlayColor="#ddd">
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>Feedback</Text>
                    </TouchableHighlight>
                </View>
            </View>
            <LevelDifficulty showPopup={this.state.showNewLevelPopup}
                onCloseClick={() => this.OnLevelDifficultyCloseClick()}
                onEasyLevelClick={() => this.props.onNewLevel(Difficulty.Easy)}
                onMediumLevelClick={() => this.props.onNewLevel(Difficulty.Medium)}
                onHardLevelClick={() => this.props.onNewLevel(Difficulty.Hard)}
                title='Difficulty'
            ></LevelDifficulty>
            <MenuContent
                onCloseClick={() => this.onMenuContentCloseClick()}
                title='Instructions'
                showPopup={this.state.showInstructionsPopup}
            >
                <View >
                    <FlatList
                        data={[
                            { key: '\u2022 Tap and hold on any block to mark a mine.' },
                            { key: '\u2022 There are three types of mines, each type has a different power.' },
                            { key: '\u2022 To switch to a different mine, tab and hold on the same block multiple times.' },
                            { key: '\u2022 The goal is to locate all the mines.' },
                            { key: '\u2022 Small=1 Medium=2 Large=3' },
                        ]}
                        renderItem={({ item }) => <Text style={MenuStyles.instructions}>{item.key}</Text>}
                    />
                </View>

            </MenuContent>

            <MenuContent
                onCloseClick={() => this.onMenuContentCloseClick()}
                title='Feedback'
                showPopup={this.state.showFeedbackPopup}
            >
                {!this.state.isFeedbackSent ?
                    <View style={MenuStyles.feedbackontainer}>
                        {this.showActivity()}
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(text) => { this.feedbackText = text; }}
                            style={MenuStyles.feedbackText} autoCorrect={true} autoFocus={true}
                            autoCapitalize={'sentences'}
                            placeholder={'Please type in any suggestions to improve this game.'}
                            editable={!this.state.isSendingFeedback}
                        />
                        <TouchableHighlight onPress={() => { this.OnSendFeedbackClick(); }} style={this.getFeedbackButtonStyles()} underlayColor="#ddd" disabled={this.state.isSendingFeedback}>
                            <Text>Send</Text>
                        </TouchableHighlight>
                    </View>
                    :
                    <View><Text>Thanks for your feedback!</Text></View>
                }
            </MenuContent>

        </View >;
    }

    showActivity() {
        if (this.state.isSendingFeedback) {
            return <View style={MenuStyles.activityIndicator}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>;
        } else {
            return null;
        }
    }

    onMenuContentCloseClick() {
        this.setState({ showFeedbackPopup: false, showInstructionsPopup: false });
    }

    OnInstructionsClick() {
        this.setState({ showInstructionsPopup: true });
    }

    OnFeedbackClick() {
        this.setState({ showFeedbackPopup: true, isFeedbackSent:false });
    }

    getFeedbackButtonStyles(): any[] {
        let styles = new Array();
        styles.push(MenuStyles.sendFeedback);
        if (this.state.isSendingFeedback) {
            styles.push(MenuStyles.sendFeedbackDisabled);
        }
        return styles;
    }

    OnSendFeedbackClick() {
        this.setState({ isSendingFeedback: true });

        return fetch('http://walidsultan.net/MineRageApi/api/Feedback/save', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'Text': this.feedbackText
            })
        }).then(() => this.setState({ isSendingFeedback: false,isFeedbackSent:true }))
            .catch((error) => {
                console.error(error);
            });
    }

    async componentDidMount() {
        await Font.loadAsync({
            'funkyFont': require('../../../assets/fonts/KBZipaDeeDooDah.ttf')
        });

        this.setState({ fontLoaded: true });
        this.updateDimensions();
    }

    updateDimensions() {
        if (this.menuRef != undefined && this.menuRef.current != undefined) {
            let scaleFactor = 0.4618;
            let fontRatio = 0.2;
            if (window.innerWidth > 640 && window.innerHeight > 700) {
                fontRatio = 0.025;
                scaleFactor = 16 / 9;
            }

            let menuHeight = window.innerHeight;
            let menuWidth = menuHeight * scaleFactor;

            if (menuWidth > window.innerWidth) {
                menuWidth = window.innerWidth;
                menuHeight = menuWidth / scaleFactor;
            }

            let fontSize = menuWidth * fontRatio;
            let popupWidth = menuWidth * this.popupWidthRatio;

            let newState = Object.assign(this.state, { menuWidth: menuWidth, fontSize: fontSize, popupWidth: popupWidth, menuHeight: menuHeight });
            this.setState(newState);
        }
    }

    OnNewClick() {
        this.setState({ showNewLevelPopup: true });
    }

    OnLevelDifficultyCloseClick() {
        this.setState({ showNewLevelPopup: false });
    }
}