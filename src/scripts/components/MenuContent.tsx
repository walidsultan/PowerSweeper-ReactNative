// import '../../css/menuContent.less';
import * as React from 'react';
import Popup from './popup';
import MenuContentInterface from '../interfaces/MenuContentInterface';
import { View } from 'react-native';

export default class MenuContent extends React.Component<MenuContentInterface, {}> {

    constructor(props: any) {
        super(props);

    }
    render() {
        return (
            <Popup showPopup={this.props.showPopup}
                title={this.props.title}
                onCloseClick={() => this.props.onCloseClick()}>
                <View>
                    {this.props.children}
                </View>
            </Popup>
        );
    }

}