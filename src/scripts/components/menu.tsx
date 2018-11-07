// import '../../css/menu.less';
import * as React from 'react';
import MenuInterface from '../interfaces/MenuInterface';
// import LevelDifficulty from './LevelDifficulty';
import MenuState from '../states/MenuState';
// import { Difficulty } from '../enums/difficulty';
// import MenuContent from './MenuContent';
import { Text, View, Button, StyleProp, ViewStyle } from 'react-native';

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

        let menuStyle: StyleProp<ViewStyle> = {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#333'
        };

        let buttonContainerStyle: StyleProp<ViewStyle> = {
            margin: 20
        };

        let itemsContainerStyle: StyleProp<ViewStyle> = {
            justifyContent: 'center'
        };

        return <View ref={this.menuRef} style={menuStyle}>


            <View style={itemsContainerStyle}>
                <View style={buttonContainerStyle}>
                    <Button onPress={() => this.OnNewClick()} title='New Game' ></Button>
                </View>
                <View style={buttonContainerStyle}>
                    <Button onPress={() => this.OnNewClick()} title='High Scores'></Button>
                </View>
                <View style={buttonContainerStyle}>
                    <Button onPress={() => this.OnInstructionsClick()} title='Instructions'></Button>
                </View>
                <View style={buttonContainerStyle}>
                    <Button onPress={() => this.OnCreditsClick()} title='Credits'></Button>
                </View>
            </View>
            {/* <View className='backgroundExtender'></View> */}
            {/* <LevelDifficulty showPopup={this.state.showNewLevelPopup}
                onCloseClick={() => this.OnLevelDifficultyCloseClick()}
                onEasyLevelClick={() => this.props.onNewLevel(Difficulty.Easy)}
                onMediumLevelClick={() => this.props.onNewLevel(Difficulty.Medium)}
                onHardLevelClick={() => this.props.onNewLevel(Difficulty.Hard)}
                popupWidth={this.state.popupWidth}
                title='Difficulty'
            ></LevelDifficulty> */}
            {/* <MenuContent
                onCloseClick={() => this.onMenuContentCloseClick()}
                title='Instructions'
                showPopup={this.state.showInstructionsPopup}
                popupWidth={this.state.popupWidth}
            >
                <View className='desktopInstructions'>
                    <ul>
                        <li><Text>Right click on any block to mark a mine.</Text></li>
                        <li><Text>There are three types of mines, each type has a different power.</Text></li>
                        <li><Text>To switch to a different mine, right click on the same block multiple times.</Text></li>
                        <li><Text>The goal is to locate all the mines.</Text></li>
                        <li><Text>Small=1 Medium=2 Large=3</Text></li>
                    </ul>
                </View>
                <View className='phoneInstructions'>
                    <ul>
                        <li><Text>Tap and hold on any block to mark a mine.</Text></li>
                        <li><Text>There are three types of mines, each type has a different power.</Text></li>
                        <li><Text>To switch to a different mine, tab and hold on the same block multiple times.</Text></li>
                        <li><Text>The goal is to locate all the mines.</Text></li>
                        <li><Text>Small=1 Medium=2 Large=3</Text></li>
                    </ul>
                </View>
            </MenuContent>

            <MenuContent
                onCloseClick={() => this.onMenuContentCloseClick()}
                title='Credits'
                showPopup={this.state.showCreditsPopup}
                popupWidth={this.state.popupWidth}
            >
            <View className='creditsContainer'>
                <View className='creditsHeader'>
                Programming
                </View>
                <View className='creditsTitle'>
                    Walid Sultan
                </View>
                <View  className='creditsHeader'>
                Graphic Design
                </View>
                <View className='creditsTitle'>
                    Shady Sultan
                </View>
             </View>
            </MenuContent> */}
        </View>;
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

    componentDidMount() {
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