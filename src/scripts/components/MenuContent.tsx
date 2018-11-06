// import '../../css/menuContent.less';
import * as React from 'react';
import Popup from './popup';
import MenuContentInterface from '../interfaces/MenuContentInterface';

export default class MenuContent extends React.Component<MenuContentInterface, {}> {

    constructor(props: any) {
        super(props);

    }
    render() {
        return (
            <Popup showPopup={this.props.showPopup}
                popupWidth={this.props.popupWidth}
                title={this.props.title}
                onCloseClick={() => this.props.onCloseClick()}
            >
                <div className='menuContent'>
                    {this.props.children}
                </div>
            </Popup>
        );
    }

}