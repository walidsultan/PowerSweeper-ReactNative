import { StyleSheet } from 'react-native';

const MenuStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#333',
        fontFamily: 'funkyFont'
    },

    buttonContainer: {
        margin: 20
    },

    itemsContainer: {
        justifyContent: 'center'
    },
    button: { color: '#FFF',
     fontFamily: 'funkyFont',
     fontWeight: '400',
     borderRadius: 4,
     borderWidth: 0.5,
     borderColor: '#d6d7da',
     fontSize: 25,
     padding: 10,
     justifyContent: 'center',
     backgroundColor: '#777'
    },
    instructions:{
        fontSize: 20
    },
    creditsContainer:{
        justifyContent:'center',
        flexDirection: 'column',
        alignItems:'center',
    },
    creditsTitle:{
        fontWeight:'bold',
        fontSize:20
    },
    creditsText:{
        fontSize:20
    }
});

export default MenuStyles;