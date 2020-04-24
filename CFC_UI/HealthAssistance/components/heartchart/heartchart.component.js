import React, {Component} from 'react';
import { LineChart, YAxis, XAxis, Grid } from 'react-native-svg-charts';
import { View } from 'react-native';

class HeartchartComponent extends Component {
    
    render() {
        
          const  data1 = [70,80,90,100,110,120,130,140,150,160];
          const graphVvalue = [99,120,110,99,94,97];

        const contentInset = { top: 20, bottom: 20 }
 
        return (
            <View style={{ height: 200, flexDirection: 'row',marginLeft:20, marginRight: 20}}>
                <YAxis
                    data={data1}
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
                    data={graphVvalue}
                    svg={{ stroke: 'green' }}
                    contentInset={contentInset}
                >
                    <Grid />
                </LineChart>
            </View>
        )
    }

}

export default HeartchartComponent;
