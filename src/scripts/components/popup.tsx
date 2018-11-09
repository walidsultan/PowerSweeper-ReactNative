// import '../../css/popup.less';
import * as React from 'react';
import PopupInterface from '../interfaces/PopupInterface';
import { Modal, View, Text, Image, TouchableHighlight } from 'react-native';
import PopupStyles from '../../styles/popupStyles';

export default class Popup extends React.Component<PopupInterface, {}> {

    constructor(props: any) {
        super(props);

    }
    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.props.showPopup}
                onRequestClose={() => this.props.onCloseClick()} >
                <View style={PopupStyles.container}>
                    <View  style={PopupStyles.header}>
                        <Text style={PopupStyles.title}>{this.props.title}</Text>
                        <TouchableHighlight onPress={()=>this.props.onCloseClick()}>
                             <Image source={require('../../../assets/images/x_mark.png')}  style={{width:40, height: 46}}/>
                        </TouchableHighlight>
                    </View>
                    <View style={PopupStyles.content}>
                        {this.props.children}
                    </View>
                </View>
            </Modal>
        );
    }

}