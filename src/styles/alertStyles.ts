import { StyleSheet } from 'react-native';

const AlertStyles = StyleSheet.create({
    buttonsContainer:{
        flex:1,
        justifyContent:'flex-start',
        marginTop:20
    },
    alertContainer:{
        flex:1
    },
    button:{
        marginTop:15,
        height:40,
        backgroundColor: 'rgb(0, 153, 255)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    cancel:{
        backgroundColor:'#999'
    },
    buttonText:{
        
    }
   
});

export default AlertStyles;