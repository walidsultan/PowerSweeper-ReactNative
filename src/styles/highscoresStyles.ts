import { StyleSheet } from 'react-native';

const HighscoresStyles = StyleSheet.create({
    grid:{
        padding:10,
        flexDirection:'row'
    },
    name:{
        fontSize:25,
        color:'#000',
    },
    time:{
        fontSize:15,
        color:'#009900',
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
         backgroundColor:'#FFF'
     },
     order:{

     }
});

export default HighscoresStyles;