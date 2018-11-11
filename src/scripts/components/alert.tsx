import * as React from 'react';
import Popup from './popup';
import AlertInterface from '../interfaces/AlertInterface';
import { View, Button, Text, TouchableHighlight } from 'react-native';
import AlertStyles from '../../styles/alertStyles';

export default class Alert extends React.Component<AlertInterface, {}> {
    constructor(props: any) {
        super(props);

    }
    render() {
        return (
            <Popup showPopup={this.props.showPopup}
                title={this.props.title}
                onCloseClick={() => this.props.onCloseClick()}
            >
                <View style={AlertStyles.alertContainer}>
                    <View ><Text>{this.props.message}</Text></View>
                    <View style={AlertStyles.buttonsContainer}>
                        <TouchableHighlight onPress={() => this.props.onOkClick()} style={AlertStyles.button}>
                            <Text style={AlertStyles.buttonText}>OK</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.props.onCancelClick()} style={[AlertStyles.button,AlertStyles.cancel]}>
                            <Text style={AlertStyles.buttonText}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Popup>
        );
    }

}