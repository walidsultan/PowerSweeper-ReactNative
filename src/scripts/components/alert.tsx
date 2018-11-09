import * as React from 'react';
import Popup from './popup';
import AlertInterface from '../interfaces/AlertInterface';
import { View, Button } from 'react-native';

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
            <View>
                <View >{this.props.message}</View>
                <View>
                    <Button onPress={() => this.props.onOkClick()} title="OK"></Button>
                    <Button onPress={() => this.props.onCancelClick()} title="Cancel"></Button>
                </View>
            </View>
            </Popup>
        );
    }

}