import React, { Component } from 'react';
import './Modal.css'
import Backdrop from './Backdrop';

class Modal extends Component {

    // shouldComponentUpdate(nextProps) {
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }

    render() {

        if (!this.props.show)
            return null;

        return (
            <div>
                <Backdrop show={this.props.show} clicked={this.props.onClose} />
                <div className="Modal">
                    {this.props.children}
                </div>
            </div>
        );
    }
}


export default Modal