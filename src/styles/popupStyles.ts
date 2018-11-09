import { StyleSheet } from 'react-native';

const PopupStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 10,
        margin:10
    },
    title:{
        fontWeight: 'bold',
        fontSize: 30
    },
    header:{
        borderBottomColor: '#222',
        borderBottomWidth: 1,
        marginBottom: 10,
        paddingBottom: 10,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    close:{
        width: 20
    },
    content:{
        flex:1
    }

   
});

export default PopupStyles;