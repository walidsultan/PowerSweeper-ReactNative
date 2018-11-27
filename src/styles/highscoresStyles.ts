import { StyleSheet } from 'react-native';

const HighscoresStyles = StyleSheet.create({
    grid:{
        padding:10,
    },
    name:{
        fontSize:25,
        color:'#fff'
    },
    time:{
        marginTop:5,
        fontSize:25,
        color:'#fff'
    },
    activityIndicator:{
        position: 'absolute',
         left: 0,
         right: 0,
         top: 0,
         bottom: 0,
         alignItems: 'center',
         justifyContent: 'center',
         zIndex:10
     },
     tabContainer:{
         flex:1,
         backgroundColor:'#4d94ff'
     }
});

export default HighscoresStyles;