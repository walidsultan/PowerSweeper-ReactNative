// import '../../css/alert.less';
import * as React from 'react';
import Popup from './popup';
import AlertInterface from '../interfaces/AlertInterface';

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
                <div className='alert'>
                    <div className='message'>{this.props.message}</div>
                    <div className='buttons'>
                        <button onClick={() => this.props.onOkClick()}>Ok</button>
                        <button onClick={() => this.props.onCancelClick()}>Cancel</button>
                    </div>
                </div>

            </Popup>
        );
    }

}