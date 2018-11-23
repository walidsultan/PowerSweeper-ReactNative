import { StyleSheet } from 'react-native';

const BlockStyles = StyleSheet.create({
   block:{
      position: 'absolute',
      backgroundColor:  'rgba(162,162,163,0.9)',
      borderRadius:5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
      justifyContent:'center',
      alignItems: 'center'
   },
   clicked:{
    backgroundColor: '#EBEBEB',
    //color: '#8D8DFF',
    //fontWeight: 'bold',
    elevation: 0,
    shadowOpacity: 0,
    shadowOffset: {
        width: 0,
        height: 0,
      }
   },
   clickedMine:{
    backgroundColor: '#a51212',
   },
   bigMine:{

   },
   mediumMine:{

   },
   smallMine:{

   },
   marked:{
      backgroundColor: '#ddd'
   }
   
});

export default BlockStyles;