import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image,AppState,ToastAndroid,TouchableOpacity,Alert,} from 'react-native';
import HeaderComponent from './header/HeaderComponent';
import ProgressComponent from './progress/progress.component';
import LinechartComponent from './linechart/linechart.component';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import AddTemperatorComponent from './AddTemperatorComponent';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import { fetchUser } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchUser: (userId) => dispatch(fetchUser(userId)),
})

class HealthData extends Component {

    constructor(props) {
        super(props)
        this.state = {  
            isVisible : false,   
            SCREEN_NAME : '',
          }  
    }

    getTemperature = (string) => {
        let value;
        switch (string.toLowerCase(string)) {
            case 'normal':
            case 'fine':
            case 'correct':
            case 'no fever':
            case 'normal':
                value = 97.3;
                break;
            case 'medium':
            case 'mediumsized':
                value = 99.1;
                break;
            case 'high':
            case 'high fever':
            case 'feeling low':
            case 'little bit':
            case 'a little':
            case 'yeah':
                value = 100.8;
                break;
            case 'very high':
            case 'very high fever':
            case 'too much':
            case 'feeling sick':
                value = 103.55;
                break;
            default:
                value = parseFloat(string);
        }
        return value;
    }

    getHeartRate = (string) => {
        let value;
        switch (string.toLowerCase(string)) {
            case 'low':
                value = 64.5;
                break;
            case 'normal':
                value = 74.5;
                break;
            case 'medium':
                value = 82.5;
                break;
            case 'high':
                value = 74.5;
                break;
            case 'very high':
                value = 106;
                break;
            default:
                value = parseFloat(string);
        }
        return value;
    }

    
    remoceModal= () => {
        this.setState({isVisible : false})
        this.props.fetchUser(this.props.user.user.userId);       
    }

    resetModal= () => {
        this.setState({isVisible : false})      
    }

    render() {

        const graphData = this.props.user.user.symptom;
        const isQurantine = this.props.user.user.qurantine.isQurantine;
        const startedQurantine = this.props.user.user.qurantine.started;
        const endQurantine = this.props.user.user.qurantine.end;

        //----- CALCULATE LINE CHART DATA -----//
        let bodyTempGraphData = [];
        let heartRateGraphData = [];

        let bodyTempData = [];
        let heartRateData = [];

        let bodyTempLabel = [];
        const { navigate } = this.props.navigation;

        if (graphData.length) {
            graphData.forEach((item, i) => {

                var a = moment(item.timestamp, 'x')
                var timeLabel = a.format("DD MMM, hh:mm               ")
               
                let temp = this.getTemperature(item.temperature);
                if (temp < 95) temp = 95;
                if (temp > 105) temp = 105;

                let heartRate = this.getHeartRate(item.heart_rate);
                if (heartRate < 60) heartRate = 60;
                if (heartRate > 114) heartRate = 114;

                bodyTempLabel.push(timeLabel);
                bodyTempData.push(temp);
                bodyTempGraphData.push(temp);

                heartRateData.push(heartRate);
                heartRateGraphData.push(heartRate);
            })
        } else {
            // Making yAxis fixed, if no symptoms is available
            bodyTempData = [95, 100, 105, 108];
            heartRateData = [60, 90, 120, 140, 160];
        }

        var arraySize = bodyTempData.length;
        if(arraySize>8){
            var lowerRange = arraySize - 8
            bodyTempData = bodyTempData.slice((lowerRange), (arraySize));
            heartRateData = heartRateData.slice((lowerRange), (arraySize));
            bodyTempLabel = bodyTempLabel.slice((lowerRange), (arraySize));
            console.log("sub arrary created ")
        }
        //----- CALCULATE DONUT DATA -----//
        let progress = 0;
        let completedDays = 0;
        let remainingDays = 0;
        let totalDays = 0
        let remainingDaysText = "Quarantine not started";

        if (isQurantine) {
            var now = moment(new Date()); //current todays date
            completedDays = parseInt(moment.duration(now.diff(moment(moment(startedQurantine).format('L')))).asDays());

            totalDays = parseInt(moment.duration(moment(endQurantine).diff(moment(moment(startedQurantine).format('L')))).asDays());
            remainingDays = totalDays - completedDays;
            progress = completedDays / totalDays;

            remainingDaysText = remainingDays + " Days Remaining";
        }

        return (
            <View style={{ flex: 1 }}>
                <Modal            
                animationType = {"fade"}  
                transparent = {false}  
                visible = {this.state.isVisible}  
                onBackdropPress = {()=>this.resetModal()}
                onRequestClose = {() =>this.resetModal()}>  
                {/*All views of Modal*/}  
                 <View style={{ flex: 1 }}>
                    <View style={{ alignSelf: 'flex-end'}}>
                    <Button icon={<Icon name="x" size={18} /> }
                            title=""
                            type="clear"
                            alignSelf ='flex-end'
                            style={{ paddingTop: 20 }}
                            onPress={this.resetModal}
                            />
                    </View>
                     <AddTemperatorComponent sendData = {this.state } onPress = {this.remoceModal}/>
               
                </View>  
            </Modal>  
                <HeaderComponent navigation={navigate} />
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
                    <View>
                        <Text style={{ marginLeft: 20, marginTop: 10, marginBottom: 10, fontWeight: "bold" }}>Isolation/Quarantine Status</Text>
                        <View style={{ margin: 20, backgroundColor: '#ffffff', marginTop: 10 }}>
                            <View style={{ paddingLeft: 20, marginTop: 6, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/calendar_1.png')} />
                            </View>
                            <Text style={{ paddingLeft: 40, fontWeight: "bold" }}>Days Completed</Text>
                            <Text style={{ paddingLeft: 47, marginTop: 60, position: "absolute", fontWeight: "bold" }}>{completedDays} days</Text>
                            <Text style={{ paddingLeft: 35, marginTop: 80, position: "absolute" }}>Completed</Text>
                            <Text style={{ paddingLeft: 160, marginTop: 70, position: "absolute" }}>{remainingDaysText}</Text>
                            <ProgressComponent progress={progress} />
                            <View style={{ paddingLeft: 20, marginTop: 155, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/information.png')} />
                            </View>
                            <Text style={{ paddingLeft: 40, marginBottom: 20, color: '#6f6f6f' }}>Stay at Home and Quarantine</Text>
                        </View>
                    </View>


                    <View>
                        <Text style={{ marginLeft: 20, marginTop: 10, marginBottom: 10, fontWeight: "bold" }}>Health Status</Text>
                        <View style={{ margin: 20, backgroundColor: '#ffffff', marginTop: 10 }}>
                            <View style={{ paddingLeft: 20, marginTop: 6, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/hot.png')} />
                            </View>
                            <Text style={{ paddingLeft: 40, fontWeight: "bold" }}>Body Temparature in °F</Text>
                            <View style={{ paddingLeft: 310, position: "absolute" }}>
                                <Image />
                            </View>
                            <View style={{flex: 1, position: "absolute", alignSelf: 'flex-end',alignItems: "flex-end", marginTop: 6,   flexDirection: 'row' }}>
                            
                            {/* <TouchableOpacity  onPress={() => this.FunctionBodyTemp()}> this.state.isVisible   BODYTEMP */}
                            <TouchableOpacity  onPress={() => {this.setState({ isVisible : true, SCREEN_NAME : "BODYTEMP"})} }>

                                <Image style={styles.imageStyleAddButton} source={require('../assets/images/add_icon.png')} />
                            </TouchableOpacity>

                                <Image style={styles.imageStyle} source={require('../assets/images/filter_1.png')} />
                            </View>
                            {!graphData.length ? (
                                <Text style={{ marginTop: 100, marginLeft: 30, position: 'absolute', alignSelf: 'center', fontSize: 12, color: '#6f6f6f' }}>
                                    No data available
                                </Text>
                            ) : null}
                            <LinechartComponent data={bodyTempData} graphData={bodyTempGraphData} label = {bodyTempLabel} formatLabel={'ºF'} />
                            <View style={{ paddingLeft: 20, marginTop: 273, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/information.png')} />
                            </View>
                            <Text style={{ paddingLeft: 40, marginBottom: 20, color: '#6f6f6f' }}>98 °F is normal temperature</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={{ marginLeft: 20, marginBottom: 10, fontWeight: "bold" }}></Text>
                        <View style={{ margin: 20, backgroundColor: '#ffffff', marginTop: 10 }}>
                            <View style={{ paddingLeft: 20, marginTop: 6, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/heart.png')} />
                            </View>
                            <Text style={{ paddingLeft: 40, fontWeight: "bold" }}>Heart Rate</Text>
                            <View style={{ paddingLeft: 310, position: "absolute" }}>
                                <Image />
                            </View>
                            <View style={{flex: 1, position: "absolute", alignSelf: 'flex-end',alignItems: "flex-end", marginTop: 6,   flexDirection: 'row' }}>
                             {/* <View style={{ alignSelf: 'flex-end', alignItems: "flex-end", flexDirection: 'row',backgroundColor: '#ff0000' }}> */}

                             <TouchableOpacity  onPress={() => {this.setState({ isVisible: true, SCREEN_NAME : "HEART_RATE"})}}> 

                                <Image style={styles.imageStyleAddButton} source={require('../assets/images/add_icon.png')} />
                                </TouchableOpacity>
                                <Image style={styles.imageStyle} source={require('../assets/images/filter_1.png')} />
                               
                                {/* </View> */}
                               
                                
                            </View>
                            {!graphData.length ? (
                                <Text style={{ marginTop: 100, marginLeft: 30, position: 'absolute', alignSelf: 'center', fontSize: 12, color: '#6f6f6f' }}>
                                    No data available
                                </Text>
                            ) : null}
                            <LinechartComponent data={heartRateData} graphData={heartRateGraphData} label = {bodyTempLabel} formatLabel={'Bpm'} />
                            <View style={{ paddingLeft: 20, marginTop: 273, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/information.png')} />
                            </View>
                            <Text style={{ paddingLeft: 40, marginBottom: 20, color: '#6f6f6f' }}>Normal heart rate is between 70 and 100 Bpm</Text>
                        </View>
                    </View>

                    <View style={{ marginBotton: 10 }}>
                        <Text style={{ marginLeft: 20, marginTop: 10, marginBottom: 10, fontWeight: "bold" }}>Add More Health Data</Text>
                        <View style={{}}>
                            <View style={{ paddingLeft: 20, marginTop: 6 }}>
                                <Button
                                    buttonStyle={{ borderStyle: 'solid', borderWidth: 1, borderColor: "#0198a2", backgroundColor: '#ffffff', width: 150, height: 30, marginBottom: 5 }}
                                    title="Oxygen Level"
                                    titleStyle={{ color: "#0198a2", fontSize: 14 }}
                                />
                            </View>
                            <View style={{ paddingLeft: 200, marginTop: 6, position: "absolute" }}>
                                <Button
                                    buttonStyle={{ borderStyle: 'solid', borderWidth: 1, borderColor: "#0198a2", backgroundColor: '#ffffff', width: 150, height: 30 }}
                                    title="Sync Smart Device"
                                    titleStyle={{ color: "#0198a2", fontSize: 14 }}
                                />
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    imageStyle: {
        width: 14,
        height: 14
    },
    imageStyleAddButton: {
        width: 14,
        height: 14,
        marginRight : 8
    }

});

export default connect(mapStateToProps,mapDispatchToProps)(HealthData);