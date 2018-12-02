import { Animated } from "react-native";

export default class MenuState {
    showNewLevelPopup: boolean = false;
    menuWidth: number;
    menuHeight: number;
    fontSize: number;
    popupWidth: number;
    showInstructionsPopup: boolean = false;
    showFeedbackPopup: boolean = false;
    showHighScoresPopup: boolean = false;
    showSettingsPopup: boolean = false;
    fontLoaded: boolean;
    isSendingFeedback: boolean = false;
    isFeedbackSent: boolean = false;
    isSignedIn: boolean = false;
    signInButtonOpacity: Animated.Value = new Animated.Value(0);

    isVibrationEnabled: boolean = true;
    isMusicEnabled: boolean = true;
    areSoundsEnabled: boolean = true;
}