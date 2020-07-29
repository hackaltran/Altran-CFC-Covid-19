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
        //const contentInset = { top: 20, bottom: 20 }
        const formatLabel = this.props.formatLabel;
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

    const size = data.length < 3 ? data.length : 3;  

    const axesSvg = { fontSize: 10, fill: 'grey', rotation: -70 ,originY: 10, y: 10, };
    const yaxesSvg = { fontSize: 10, fill: 'grey'};
    const verticalContentInset = { top: 10, bottom: 10,left : 5,right : 5 }
    const xAxisHeight = 65

    // Layout of an x-axis together with a y-axis is a problem that stems from flexbox.
    // All react-native-svg-charts components support full flexbox and therefore all
    // layout problems should be approached with the mindset "how would I layout regular Views with flex in this way".
    // In order for us to align the axes correctly we must know the height of the x-axis or the width of the x-axis
    // and then displace the other axis with just as many pixels. Simple but manual.

    return (
        <View style={{ height: 250, padding: 20, flexDirection: 'row' }}>
            <YAxis
                data={data}
                style={{ marginBottom: xAxisHeight }}
                contentInset={verticalContentInset}
                svg={yaxesSvg}
                numberOfTicks={3}
                formatLabel={(value) => `${value} ${formatLabel}`}
            />
            <View style={{ flex: 1, marginLeft: 10}}>
                <LineChart
                    style={{ flex: 1 }}
                    data={data}
                    contentInset={verticalContentInset}
                    svg={{ stroke: stroke }}
                >
                    <Grid />
                    <Decorator />
                </LineChart>
                <XAxis
                    style={{ marginHorizontal: -10, marginLeft: -5,  height: xAxisHeight ,justifyContent :"center"}}
                    data={data}
                    //formatLabel={(value, index) => index}
                    formatLabel={(value, index) => this.props.label[index]}
                    contentInset={{ left: 20, right: 10}}
                    svg={axesSvg}
                    numberOfTicks={this.size}
                />
            </View>
        </View>
    )
}

}

export default LinechartComponent;
