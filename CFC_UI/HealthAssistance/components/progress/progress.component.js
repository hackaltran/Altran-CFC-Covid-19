import React, { Component } from 'react';
import {
    View, Text, StyleSheet,Image
} from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';

class progressComponent extends Component {

    constructor(props) {
        super(props)
    }
    
    render() {
        return <ProgressCircle style={{ width: 100, height: 130, paddingLeft: 20  }} endAngle={2000} progress={this.props.progress} progressColor={'green'} />
    }

}

export default progressComponent;
