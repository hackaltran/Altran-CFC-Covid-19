import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const mapStateToProps = state => {
  return { 
      user: state.user
  }
}

function RenderComments({comments}) {
    console.log(comments, 'all comments');
    if (comments != null)
        return(
            <View style={{ flex: 6, marginTop: 20 }}>
                {comments.map((comment) => {
                    return(
                        <View style={styles.messageContainer}>
                            <Text style={styles.textPrimary}>
                                {comment.comment}
                            </Text>
                            <Text style={styles.textSecondary}>
                                { moment(comment.timestamp).format("MMMM Do YYYY, HH:MM a") }
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    else
        return(
            <View></View>
        );
}

class CommentsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    render() {
        console.log(this.props.user.user.doctorscreening, 'user');
        if (this.props.user.user.doctorscreening && this.props.user.user.doctorscreening.length > 0) {

            return(
                <ScrollView style={{ height: 200 }}>
                    <View style={styles.container}>
                        <Text style={{ marginBottom: 5, fontSize: 14, color: 'black', fontWeight: 'bold', }}>
                            Doctor's Advice
                        </Text>
                        <Text style={{ marginBottom: 15, justifyContent: 'center', alignItems: 'center' }}>
                            { this.props.user.user.doctorscreening[0].comment }
                        </Text>
                        <Text style={{ marginBottom: 15, justifyContent: 'center', alignItems: 'center', color: 'gray' }}>
                            { moment(this.props.user.user.doctorscreening[0].timestamp).format("MMMM Do YYYY, HH:MM a") }
                        </Text>
                        <Button
                            buttonStyle={styles.buttonHealth}
                            title='View All'
                            titleStyle={{ color: "#0198a2", fontSize: 14 }}
                            onPress={() => { this.toggleModal() } }
                        />
                    </View>
                    <Modal 
                        animationType={'slide'}
                        transparent={false}
                        visible={this.state.showModal}
                        style={{ flex: 1, margin: 20 }}
                        >
                        <ScrollView style={{ flex: 1, margin: 20 }}>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Button
                                    type='clear'
                                    icon={
                                        <Icon
                                            name="close"
                                            size={24}
                                            type="outline"
                                            style={{ alignItems: 'flex-end' }}
                                        />
                                    }
                                    iconRight
                                    onPress={ () => this.toggleModal() }
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 10}}>Doctors Advice</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Maria Jones, MD. JJH Hospital</Text>
                                <Text style={{ fontSize: 18, color: 'gray' }}>Assigned on, 16th April 2020</Text>
                            </View>
                            <RenderComments comments={ this.props.user.user.doctorscreening } />
                        </ScrollView>        
                    </Modal>
                </ScrollView>       
            );

        } else {

            return(
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
        height: 118,
        width: 319,
        marginBottom: 5,
        backgroundColor: '#f2f2f2'
    },
    textPrimary: {
        margin: 10,
        alignItems: 'flex-start'
    },
    textSecondary: {
        color: '#707070',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        margin: 10
    }
})