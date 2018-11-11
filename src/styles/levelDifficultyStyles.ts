import { StyleSheet } from 'react-native';

const LevelDifficultyStyles = StyleSheet.create({
    container: {
        justifyContent:'center',
        flexDirection: 'column',
        alignItems: 'center',
        flex:1
    },
    button:{
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: '#222',
        padding: 20,
        justifyContent: 'center',
        marginBottom:20
    },
    buttonText:{
        fontFamily: 'funkyFont',
        fontWeight: '400',
        fontSize: 45
    }
});

export default LevelDifficultyStyles;