import React, { Component } from 'react';

import { View, Text, StyleSheet, Modal,TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import io from "socket.io-client";

import { monitoringBackendURL } from '../../shared/baseUrl';
const socket = io(monitoringBackendURL);

const dateFormat = "Do MMMM YYYY";
const dateTimeFormat = "HH:mm a, DD MMM YYYY";
const mapStateToProps = state => {
    return {
        user: state.user
    }
}

function RenderComments({ comments }) {

    if (comments != null)
        return (
            <View>
                {comments.map((comment) => {
                    if (comment.doctorId) {
                        return (
                            <View style={{ flex: 3, marginTop: 5, marginRight: 70 }}>
                                <View style={styles.messageContainer}>
                                    <Text style={styles.textPrimary}>
                                        {comment.text}
                                    </Text>
                                    <Text style={styles.textSecondary}>
                                        {moment(Number(comment.timestamp)).format("h:mm a, DD MMM YYYY")}
                                    </Text>
                                </View>
                            </View>
                        );
                    } else {
                        return (
                            <View style={{ flex: 3, marginLeft: 135, marginRight: 5, marginTop: 5 }}>
                                <View style={styles.sendMessageContainer}>
                                    <Text style={styles.textPrimary}>
                                        {comment.text}
                                    </Text>
                                    <Text style={styles.textSecondary}>
                                        {moment(Number(comment.timestamp)).format("h:mm a, DD MMM YYYY")}
                                    </Text>
                                </View>
                            </View>
                        );
                    }
                })}
            </View>
   
        );
    else
        return (
            <View></View>
        );
}

class CommentsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            chatMessage: "",
            chatMessages: [],
            sendDisabled: true
        }
        socket.on("chat message", msg => {

            const messages = this.state.chatMessages;
            messages.push(msg);
            this.setState({ messages });
        });
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        })
    }
    componentDidMount() {

        socket.emit('new user', socket.id);
    }

    submitChatMessage() {
        let timestamp = new Date().getTime();
        let data = {
            text: this.state.chatMessage.trim(),
            timestamp: timestamp,
            patientId: this.props.user.user.userId
        }
        socket.emit('chat message', data);
        this.setState({ chatMessage: '', sendDisabled: true });
    }
    generateTimeFormat(timestamp) {
        return moment(Number(timestamp)).format("h:mm a, DD MMM YYYY");
    }

    render() {

        socket.on("new user", msg => {
            console.log(msg);
        });

        if (this.state.chatMessage.trim().length > 0) {
            this.state.sendDisabled = false;
        }
        if (this.props.user.user.doctorId && this.props.user.user.doctorscreening && this.props.user.user.doctorscreening.length > 0) {

            const lastData = this.props.user.user.doctorscreening[this.props.user.user.doctorscreening.length - 1];
            const hospitalName = this.props.user.user.hospital ? this.props.user.user.hospital.hospitalName : '';
            const doctorName = this.props.user.user.doctor_details ? this.props.user.user.doctor_details.name : '';

            var timestampOperator;
            var timestampDoctor;
            var assignedDate;
            if (this.props.user.user.assignedByOperator && this.props.user.user.assignedByOperator.timestamp) {
                timestampOperator = this.props.user.user.assignedByOperator.timestamp;
                assignedDate = moment(timestampOperator).format(dateFormat);
            }
            if (this.props.user.user.assignedByDoctor && this.props.user.user.assignedByDoctor.timestamp) {
                timestampDoctor = this.props.user.user.assignedByDoctor.timestamp;
                assignedDate = moment(timestampDoctor).format(dateFormat);
            }
            if (timestampOperator && timestampDoctor) {
                var d1 = new Date(timestampOperator);
                var d2 = new Date(timestampDoctor);
                assignedDate = d1 <= d2 ? moment(timestampDoctor).format(dateFormat) : moment(timestampOperator).format(dateFormat);
            }

            return (
                <ScrollView style={{ height: 200 }}>
                    <View style={styles.container}>
                        <Text style={{ marginBottom: 10, fontSize: 14, color: '#393939', fontWeight: 'bold', }}>
                            Doctor's Advice
                        </Text>
                        <Text style={{ marginBottom: 5, justifyContent: 'center', alignItems: 'center', color: '#393939', fontSize: 14 }}>
                            {lastData.text}
                        </Text>
                        <Text style={{ marginBottom: 16, justifyContent: 'center', fontSize: 12, alignItems: 'center', color: '#707070' }}>
                            {moment(Number(lastData.timestamp)).format("h:mm a, DD MMM YYYY")}
                        </Text>
                        <Button
                            buttonStyle={styles.buttonHealth}
                            title='View All'

                            titleStyle={{ color: "#007d79", fontSize: 14 }}
                            onPress={() => { this.toggleModal() }}
                        />
                    </View>
                    <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={this.state.showModal}
                        style={{ flex: 1, margin: 20 }}
                        onRequestClose={() => this.toggleModal()}
                    >
                        <ScrollView style={{ flex: 1, margin: 20 }}

                        ref={ref => { this.scrollView = ref }}
                        onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
                        >
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Button
                                    type='clear'
                                    icon={
                                        <Icon
                                            name="x"
                                            size={24}
                                            type="clear"
                                            style={{ alignItems: 'flex-end' }}
                                        />
                                    }
                                    iconRight
                                    onPress={() => this.toggleModal()}
                                />
                            </View>
                            <View style={{ flex: 1 }}>

                                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#161616', marginBottom: 18 }}>Doctor's Advice</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#161616' }}>{doctorName}, {hospitalName}</Text>
                                <Text style={{ fontSize: 12, color: '#393939' }}>Assigned on, {assignedDate}</Text>
                            </View>
                            <RenderComments comments={this.props.user.user.doctorscreening} />
                            {this.state.chatMessages.map((comment) => {
                                if (comment.doctorId) {
                                    return (
                                        <View style={{ flex: 3, marginTop: 20, marginRight: 70 }}>
                                            <View style={styles.messageContainer}>
                                                <Text style={styles.textPrimary}>
                                                    {comment.text}
                                                </Text>
                                                <Text style={styles.textSecondary}>
                                                    {this.generateTimeFormat(comment.timestamp)}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View style={{ flex: 3, marginLeft: 135, marginRight: 5, marginTop: 5 }}>
                                            <View style={styles.sendMessageContainer}>
                                                <Text style={styles.textPrimary}>
                                                    {comment.text}
                                                </Text>
                                                <Text style={styles.textSecondary}>
                                                    {this.generateTimeFormat(comment.timestamp)}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                }
                            })}
                        </ScrollView>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    style={{ height: 50, borderColor: '#e2e1e1', borderWidth: 1, paddingLeft: 19, paddingTop: 14 }}
                                    placeholder="Enter your Message"
                                    numberOfLines={4}
                                    placeholderStyle={{ margin: 20 }}
                                    textAlignVertical={'top'}
                                    onChangeText={chatMessage => {
                                        this.setState({ chatMessage });
                                    }}
                                    multiline={true}
                                    value={this.state.chatMessage}
                                />
                            </View>
                            <Button
                                disabled={this.state.sendDisabled}
                                icon={
                                    <Icon
                                        name="arrow-right"
                                        size={24}
                                    />
                                }
                                title=""
                                type="clear"
                                onPress={() => this.submitChatMessage()}
                            />
                        </View>
                    </Modal>
                </ScrollView>
            );

        } else {

            return (
                <View></View>
            )

        }
    }
}



export default connect(mapStateToProps)(CommentsComponent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff'
    },
    buttonHealth: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: 68,
        height: 34,
        borderBottomWidth: 2,
        borderBottomColor: '#0198a2',
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    messageContainer: {
        // height: 118,
        // width: 319,
        //padding:10,

        //marginTop: 5,
        marginBottom: 5,
        backgroundColor: '#f2f2f2',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    textPrimary: {
        margin: 10,
        alignItems: 'flex-start'
    },
    textSecondary: {
        color: '#707070',
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        textAlign: 'right',
        margin: 10,
    },
    sendMessageContainer: {
        // height: 118,
        //width: 319,
        marginBottom: 5,
        backgroundColor: '#e0faf9',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
})