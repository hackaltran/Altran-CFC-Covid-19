import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import HeaderComponent from './header/HeaderComponent';
import ProgressComponent from './progress/progress.component';
import LinechartComponent from './linechart/linechart.component';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

class HealthData extends Component {

    constructor(props) {
        super(props)
    }

    getTemperature = (string) => {
        let value;
        switch (string.toLowerCase(string)) {
            case 'normal':
                value = 97.3;
                break;
            case 'medium':
                value = 99.1;
                break;
            case 'high':
                value = 100.8;
                break;
            case 'high fever':
                value = 100.8;
                break;
            case 'very high':
                value = 102;
                break;
            case 'very high fever':
                value = 102;
                break;
            default:
                value = parseFloat(string);
        }
        return value
    }

    getHeartRate = (string) => {
        let value;
        switch (string.toLowerCase(string)) {
            case 'low':
                value = 70;
                break;
            case 'normal':
                value = 90;
                break;
            case 'medium':
                value = 110;
                break;
            case 'high':
                value = 130;
                break;
            case 'very high':
                value = 150;
                break;
            default:
                value = parseFloat(string);
        }
        return value
    }

    render() {

        // this.props.user.user = {
        //     "name": "NewUser", "gender": "Male", "age": 45, "mobileno": "34335343323", "location": { "lat": "71.56374", "lang": "81.938393873" }, "currentAssign": "doctor", "morbidity": "none", "isTestPerformed": true,
        //     "symptom": [
        //         // { "age": 30, "family": "Myself", "gender": "male", "travelled": "No", "experience": "Headache", "heart_rate": "Medium", "temperature": "Normal", "breathing_rate": "High", "timestamp": 1587471581293 },
        //         // { "age": 30, "family": "Myself", "gender": "male", "travelled": "No", "experience": "sore throat", "heart_rate": "High", "temperature": "very high", "breathing_rate": "High", "timestamp": 1587472714459 },
        //         // { "age": 30, "family": "Myself", "gender": "male", "travelled": "No", "experience": "sore throat", "heart_rate": "Normal", "temperature": "medium", "breathing_rate": "Normal", "timestamp": 1587473719459 }
        //         {"age":40,"family":"myself","gender":"male","travelled":"Yes","experience":"dry cough","heart_rate":"Very High","temperature":"Very High Fever","breathing_rate":"High","timestamp":1587550679271},
        //         {"age":40,"family":"myself","gender":"male","travelled":"Yes","experience":"dry cough","heart_rate":"Very High","temperature":"Very High Fever","breathing_rate":"Very High","timestamp":1587550958852}
        //     ], "iscovid": false, "healthstatus": "none", "doctorscreening": [{ "comment": "done", "timestamp": 1587382527370, "doctor": "doctor_1" }, { "comment": "Again test", "timestamp": 1587382541947, "doctor": "doctor_1" }, { "comment": "Updated by doctor", "timestamp": 1587384783672, "doctor": "doctor_1" }, { "comment": "Last comment for testing", "timestamp": 1587387937155, "doctor": "288385614" }, { "comment": "tum covid ho - lag rahe ho", "timestamp": 1587406746040, "doctor": "288385614" }, { "comment": "mast lag rahe ho", "timestamp": 1587406860234, "doctor": "288385614" }], "timestamp": 1587309961479, "doctorId": "480900901", "assignedByOperator": { "id": "480900801", "timestamp": 1587445023578, "name": "operator_1" }, "assignedByDoctor": {}, "usertype": "individual", "qurantine":
        //         { "isQurantine": true, "started": 1587022714459, "end": 1588750584000 }, "currentCovidScore": 10.75, "userId": "288385614"
        // };
        // console.log(this.props.user.user);

        const graphData = this.props.user.user.symptom;
        const isQurantine = this.props.user.user.qurantine.isQurantine;
        const startedQurantine = this.props.user.user.qurantine.started;
        const endQurantine = this.props.user.user.qurantine.end;


        //----- CALCULATE LINE CHART DATA -----//
        let bodyTempGraphData = [];
        let heartRateGraphData = [];

        // let bodyTempData = [95, 100, 105, 108];
        // let heartRateData = [60, 90, 120, 140, 160];
        let bodyTempData = [];
        let heartRateData = [];

        const { navigate } = this.props.navigation;

        if (graphData.length) {
            graphData.forEach((item, i) => {

                let dateString = moment.unix(item.timestamp).format("Do MMM, HH:MM");

                let temp = this.getTemperature(item.temperature);
                if (temp < 95) temp = 95;
                if (temp > 108) temp = 108;

                let heartRate = this.getHeartRate(item.heart_rate);
                if (heartRate < 60) heartRate = 60;
                if (heartRate > 160) heartRate = 160;
                
                bodyTempData.push(temp);
                heartRateData.push(heartRate);
                bodyTempGraphData.push(temp);
                heartRateGraphData.push(heartRate);
            })
        } else {
            // Making yAxis fixed, if no symptoms is available
            bodyTempData = [95, 100, 105, 108];
            heartRateData = [60, 90, 120, 140, 160];
        }

        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        // console.log(bodyTempData);
        // console.log(bodyTempGraphData);

        // console.log(heartRateData);
        // console.log(heartRateGraphData);

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
                            <Text style={{ paddingLeft: 40, fontWeight: "bold" }}>Body Temparature in °C</Text>
                            <View style={{ paddingLeft: 310, position: "absolute" }}>
                                <Image />
                            </View>
                            <View style={{ paddingLeft: 330, marginTop: 6, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/filter_1.png')} />
                            </View>
                            {!graphData.length ? (
                                <Text style={{ marginTop: 100, marginLeft: 30, position: 'absolute', alignSelf: 'center', fontSize: 12, color: '#6f6f6f' }}>
                                    No data available
                                </Text>
                            ) : null}
                            <LinechartComponent data={bodyTempData} graphData={bodyTempGraphData} formatLabel={'ºC'} />
                            <View style={{ paddingLeft: 20, marginTop: 225, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/information.png')} />
                            </View>
                            <Text style={{ paddingLeft: 40, marginBottom: 20, color: '#6f6f6f' }}>98 °C is normal temperature</Text>
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
                            <View style={{ paddingLeft: 330, marginTop: 6, position: "absolute" }}>
                                <Image style={styles.imageStyle} source={require('../assets/images/filter_1.png')} />
                            </View>
                            {!graphData.length ? (
                                <Text style={{ marginTop: 100, marginLeft: 30, position: 'absolute', alignSelf: 'center', fontSize: 12, color: '#6f6f6f' }}>
                                    No data available
                                </Text>
                            ) : null}
                            <LinechartComponent data={heartRateData} graphData={heartRateGraphData} formatLabel={''} />
                            <View style={{ paddingLeft: 20, marginTop: 225, position: "absolute" }}>
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
        width: 10,
        height: 10
    }

});

export default connect(mapStateToProps)(HealthData);