import { StyleSheet } from 'react-native';

const LevelDifficultyStyles = StyleSheet.create({
    container: {
        justifyContent:'center',
        flexDirection: 'column',
        alignItems: 'center',
        flex:1
    },
    button:{
        justifyContent: 'center',
        marginBottom:20
    },
    buttonHighlight:{
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: '#222',
        padding: 20
    },
    buttonText:{
        fontFamily: 'funkyFont',
        fontWeight: '400',
        fontSize: 45
    },
    levelAssist:{
        alignSelf:'flex-start',
        flexDirection:'row',
        alignItems:'center'
    },
    assistSwitch:{
    },
    assistText:{
        //alignSelf:'center'
    }
});

export default LevelDifficultyStyles;