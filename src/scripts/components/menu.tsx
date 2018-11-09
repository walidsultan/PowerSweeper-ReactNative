import * as React from 'react';
import MenuInterface from '../interfaces/MenuInterface';
import MenuState from '../states/MenuState';
import { Text, View, TouchableHighlight, FlatList } from 'react-native';
import MenuStyles from '../../styles/menuStyles';
import { Font } from 'expo';
import MenuContent from './MenuContent';
import LevelDifficulty from './LevelDifficulty';
import { Difficulty } from '../enums/difficulty';

export default class Menu extends React.Component<MenuInterface, MenuState> {

    private menuRef: any;
    private popupWidthRatio: number = 0.6;

    constructor(props: any) {
        super(props);
        this.state = new MenuState();
        this.menuRef = React.createRef();

        this.updateDimensions = this.updateDimensions.bind(this);

    }
    render() {

        return <View ref={this.menuRef} style={this.state.fontLoaded ? MenuStyles.container : undefined}>
            <View style={MenuStyles.itemsContainer}>
                <View style={MenuStyles.buttonContainer}>
                    <TouchableHighlight onPress={() => { this.OnNewClick(); }} >
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>New Game</Text>
                    </TouchableHighlight>
                </View>
                <View style={MenuStyles.buttonContainer}>
                    <TouchableHighlight onPress={() => { this.OnNewClick(); }}  disabled={true}>
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>High Scores</Text>
                    </TouchableHighlight>
                </View>
                <View style={MenuStyles.buttonContainer}>
                    <TouchableHighlight onPress={() => { this.OnInstructionsClick(); }} >
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>Instructions</Text>
                    </TouchableHighlight>
                </View>
                <View style={MenuStyles.buttonContainer}>
                    <TouchableHighlight onPress={() => { this.OnCreditsClick(); }} >
                        <Text style={this.state.fontLoaded ? MenuStyles.button : undefined}>Credits</Text>
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
                title='Credits'
                showPopup={this.state.showCreditsPopup}
            >
            <View style={MenuStyles.creditsContainer}>
                <Text style={MenuStyles.creditsTitle}>
                    Programming
                     </Text>
                <Text  style={MenuStyles.creditsText}>
                    Walid Sultan
                    </Text>
                <Text style={MenuStyles.creditsTitle}>
                    Graphic Design
                </Text>
                <Text  style={MenuStyles.creditsText}>
                    Shady Sultan
                  </Text>
            </View>
            </MenuContent>

        </View >;
    }

    onMenuContentCloseClick() {
        this.setState({ showCreditsPopup: false, showInstructionsPopup: false });
    }

    OnInstructionsClick() {
        this.setState({ showInstructionsPopup: true });
    }

    OnCreditsClick() {
        this.setState({ showCreditsPopup: true });
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