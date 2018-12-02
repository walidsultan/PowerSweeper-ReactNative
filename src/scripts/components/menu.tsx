import * as React from 'react';
import MenuInterface from '../interfaces/MenuInterface';
import MenuState from '../states/MenuState';
import { Text, View, TouchableHighlight, FlatList, Image, StyleProp, ImageStyle, TextInput, ActivityIndicator, Animated, AsyncStorage, Switch } from 'react-native';
import MenuStyles from '../../styles/menuStyles';
import { Font } from 'expo';
import MenuContent from './MenuContent';
import LevelDifficulty from './LevelDifficulty';
import { Difficulty } from '../enums/difficulty';
import HighScores from './HighScores';
import * as Expo from "expo";

export default class Menu extends React.Component<MenuInterface, MenuState> {

    private menuRef: any;
    private popupWidthRatio: number = 0.6;
    private feedbackText: string;

    constructor(props: any) {
        super(props);
        this.state = new MenuState();
        this.menuRef = React.createRef();

        this.updateDimensions = this.updateDimensions.bind(this);

        // AsyncStorage.multiRemove(['name', 'photoUrl']);

        AsyncStorage.multiGet(['name', 'photoUrl'], (err, stores) => {
            if (err) {
                console.log(err);
            }
            let isSignedIn = false;
            stores.map((result, i, store) => {
                console.log(result);
                let key = store[i][0];
                let value = store[i][1];
                if (key == "name" && value) {
                    isSignedIn = true;
                }
            });
            if (!isSignedIn) {
                Animated.timing(this.state.signInButtonOpacity, { toValue: 1, duration: 700, delay: 1000 }).start();
            }
            this.setState({ isSignedIn: isSignedIn });
        });
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

        let signInImageStyle: StyleProp<ImageStyle> = {
            width: 150,
            height: 36
        }

        let settingsImageStyle: StyleProp<ImageStyle> = {
            width: 50,
            height: 50,
            tintColor: '#fff'
        }

        return <View ref={this.menuRef} style={this.state.fontLoaded ? MenuStyles.container : undefined}>
            <Image source={require('../../../assets/images/c9c685ba.png')} style={background} ></Image>
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
                    <TouchableHighlight onPress={() => { this.OnHighScoresClick(); }} style={MenuStyles.buttonHighlight} underlayColor="#ddd">
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>Leaderboards</Text>
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
            {!this.state.isSignedIn && <Animated.View style={[MenuStyles.signInImageContainer, { opacity: this.state.signInButtonOpacity }]}>
                <TouchableHighlight onPress={async () => { await this.signIn(); }} underlayColor="#ddd">
                    <Image source={require('../../../assets/images/google_signin_light.png')} style={signInImageStyle}></Image>
                </TouchableHighlight>
            </Animated.View>}

            <View style={MenuStyles.settingsContainer}>
                <TouchableHighlight onPress={() => { this.onSettingsClick(); }} underlayColor="#ddd">
                    <Image source={require('../../../assets/images/settings.png')} style={settingsImageStyle}></Image>
                </TouchableHighlight>
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

            <MenuContent
                onCloseClick={() => this.onMenuContentCloseClick()}
                title='Leaderboards'
                showPopup={this.state.showHighScoresPopup}
            >
                <View style={MenuStyles.highScoreContainer}>
                    <HighScores></HighScores>
                </View>
            </MenuContent>


            <MenuContent
                onCloseClick={() => this.onMenuContentCloseClick()}
                title='Settings'
                showPopup={this.state.showSettingsPopup}
            >
                <View style={MenuStyles.settingsPopupContainer}>
                    <View style={MenuStyles.settingsItem}>
                        <Text>Music</Text>
                        <Switch value={this.state.isMusicEnabled} onValueChange={ this.onMusicToggle} style={MenuStyles.settingsSwitch}></Switch>
                    </View>
                    <View style={MenuStyles.settingsItem}>
                        <Text>Sounds</Text>
                        <Switch value={this.state.areSoundsEnabled} onValueChange={ this.onSoundsToggle} style={MenuStyles.settingsSwitch}></Switch>
                    </View>
                    <View style={MenuStyles.settingsItem}>
                        <Text>Vibration</Text>
                        <Switch value={this.state.isVibrationEnabled} onValueChange={ this.onVibrationToggle} style={MenuStyles.settingsSwitch}></Switch>
                    </View>
                </View>
            </MenuContent>
        </View >;
    }

    onMusicToggle = (value:any) => {
        this.setState({ isMusicEnabled: value});
        AsyncStorage.setItem('isMusicEnabled',value.toString());
        if(value){
            this.props.musicReference.playAsync();
        }else{
            this.props.musicReference.stopAsync();
        }
     }

     onSoundsToggle = (value:any) => {
        this.setState({ areSoundsEnabled: value});
        AsyncStorage.setItem('areSoundsEnabled',value.toString());
     }

     onVibrationToggle = (value:any) => {
        this.setState({ isVibrationEnabled: value});
        AsyncStorage.setItem('isVibrationEnabled',value.toString());
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

    onSettingsClick() {
        AsyncStorage.multiGet(['isVibrationEnabled', 'isMusicEnabled', 'areSoundsEnabled'], (err, stores) => {
            if (err) {
                console.log(err);
            }
            stores.map((result, i, store) => {
                console.log(result);
                let key = store[i][0];
                let value = store[i][1];
                if (key == "isVibrationEnabled" && value) {
                      this.setState({ isVibrationEnabled: (value === 'true') });
                }

                if (key == "isMusicEnabled" && value) {
                    this.setState({ isMusicEnabled: (value === 'true') });
                }

                if (key == "areSoundsEnabled" && value) {
                    this.setState({ areSoundsEnabled: (value === 'true') });
                }
            });
        });

        this.setState({ showSettingsPopup: true });
    }

    onMenuContentCloseClick() {
        this.setState({
            showFeedbackPopup: false, showInstructionsPopup: false, showHighScoresPopup: false,
            showSettingsPopup: false
        });
    }

    OnInstructionsClick() {
        this.setState({ showInstructionsPopup: true });
    }

    OnFeedbackClick() {
        this.setState({ showFeedbackPopup: true, isFeedbackSent: false });
    }

    OnHighScoresClick() {
        this.setState({ showHighScoresPopup: true });
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
        }).then(() => this.setState({ isSendingFeedback: false, isFeedbackSent: true }))
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

    async signIn() {
        try {
            const result = await Expo.Google.logInAsync({
                androidClientId: "568265247315-koa51h0vjmqphbbq1rj9h61kaf3psid5.apps.googleusercontent.com",
                //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
                scopes: ["profile", "email"]
            });
            if (result.type === "success") {
                AsyncStorage.multiSet([['name', result.user.name],
                ['photoUrl', result.user.photoUrl]]);
                this.setState({ isSignedIn: true });
            } else {
                console.log("cancelled")
            }

        } catch (e) {
            console.log("error", e)
        }
    }
}