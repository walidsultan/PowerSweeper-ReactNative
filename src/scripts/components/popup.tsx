// import '../../css/popup.less';
import * as React from 'react';
import { CSSProperties } from 'react';
import PopupInterface from '../interfaces/PopupInterface';

export default class Popup extends React.Component<PopupInterface, {}> {

    constructor(props: any) {
        super(props);

    }
    render() {
        let styles: CSSProperties = {
            display: this.props.showPopup ? 'block' : 'none'
        };

        let contentStyle = {
            width: window.innerWidth > 640 && window.innerHeight > 700 ? this.props.popupWidth : (window.innerWidth - 8) * .95,
            left: (window.innerWidth - 8) * 0.025,
            marginTop: this.props.popupWidth * 0.25
        };
        return (
            <div className='popup' style={styles}>
                <div className='popupMain' style={contentStyle}>
                    <div className='title'>
                        <span>{this.props.title}</span>
                        <span className='close' onClick={() => this.props.onCloseClick()}>&times;</span>
                    </div>

                    <div className='content'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}