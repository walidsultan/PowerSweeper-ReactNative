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
        justifyContent:'center',
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
    buttonHighlight:{
        color: '#222',
        borderRadius: 50,
        borderWidth: 0.5,
        padding: 20,
         backgroundColor: '#fff',
         borderColor: '#222'
    },
    titleContainer:{
        justifyContent: 'center',
        alignItems:'center',
    },
    title:{
        flexDirection: 'row',
        fontFamily: 'funkyFont',
        fontWeight: '400',
        color: '#fff',
        alignItems:'center',
        fontSize:80,
        marginBottom:10

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