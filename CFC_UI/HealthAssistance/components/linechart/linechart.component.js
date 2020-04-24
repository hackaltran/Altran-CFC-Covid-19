import React, { Component } from 'react';
import { LineChart, YAxis, XAxis, Grid } from 'react-native-svg-charts';
import { View } from 'react-native';
import { Circle } from 'react-native-svg'

class LinechartComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const data = this.props.data;
        const graphValue = this.props.graphData;
        const contentInset = { top: 20, bottom: 20 }
        const stroke = 'green';

        const Decorator = ({ x, y, data }) => {
            return data.map((value, index) => (
                <Circle
                    key={index}
                    cx={x(index)}
                    cy={y(value)}
                    r={4}
                    stroke={stroke}
                    fill={'white'}
                />
            ))
        }

        return (
            <View style={{ height: 200, flexDirection: 'row', marginLeft: 20, marginRight: 20 }}>
                <YAxis
                    data={data}
                    contentInset={contentInset}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    numberOfTicks={8}
                    formatLabel={(value) => `${value}ºC`}
                />

                <LineChart
                    style={{ flex: 1, marginLeft: 16 }}
                    data={graphValue}
                    svg={{ stroke: stroke }}
                    contentInset={contentInset}
                >
                    <Grid />
                    <Decorator />
                </LineChart>
            </View>
        )
    }

}

export default LinechartComponent;
