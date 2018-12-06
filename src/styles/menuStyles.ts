import { StyleSheet } from 'react-native';

const MenuStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#333',
        fontFamily: 'funkyFont'
    },

    buttonContainer: {
        margin: 20,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },

    itemsContainer: {
        justifyContent: 'center'
    },
    button: {
        fontFamily: 'funkyFont',
        fontWeight: '400',

        fontSize: 25,

        justifyContent: 'center'
    },
    buttonHighlight: {
        borderRadius: 50,
        borderWidth: 0.5,
        padding: 20,
        backgroundColor: '#fff',
        borderColor: '#222'
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flexDirection: 'row',
        fontFamily: 'bladeFont',
        fontWeight: '400',
        color: '#fff',
        alignItems: 'center',
        fontSize: 40,
        marginBottom: 25

    },
    instructions: {
        fontSize: 20
    },
    feedbackontainer: {
        height: 300
    },
    feedbackText: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#222',
        padding: 10,
        textAlignVertical: 'top'
    },
    sendFeedback: {
        marginTop: 15,
        height: 40,
        backgroundColor: 'rgb(0, 153, 255)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    sendFeedbackDisabled: {
        backgroundColor: 'rgb(153, 153,153)'
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    highScoreContainer: {
        flex: 1,
        backgroundColor: '#444'
    },
    signInImageContainer: {
        position: "absolute",
        top: 10,
        right: 10
    },
    settingsContainer: {
        position: "absolute",
        right: 10,
        alignItems: 'center'
    }
    ,
    settingsPopupContainer: {
        flex:1,
        justifyContent: 'flex-start'
    },
    settingsItem: {
        margin:10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    settingsSwitch: {
        marginLeft: 10
    }
});

export default MenuStyles;