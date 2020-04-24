import React, { Component } from 'react';
import { View, Text, TextInput , StyleSheet, Image, ScrollView, Picker, Modal, KeyboardAvoidingView  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import { registerUser } from '../redux/ActionCreators';



const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    registerUser: (userObj) => dispatch(registerUser(userObj))
})

class RegisterIndividual extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            age: '',
            gender: 'Male',
            mobile: '',
            city: '',
            showModal: false
        }
    }

    handelRegister() {
        const userObj = {
            name: this.state.name,
            age: this.state.age,
            gender: this.state.gender,
            mobileno: this.state.mobile,
            location: this.state.city
        }
        this.props.registerUser(userObj);

        this.setState({
            showModal: true
        })

        setTimeout(() => {
            this.setState({
                showModal: false
            })
            const { navigate } = this.props.navigation;
            navigate('Login');
        },2000);    
    }

    resetForm() {
        this.state = {
            name: '',
            age: '',
            gender: 'Male',
            mobile: '',
            city: '',
            showModal: false
        }
    }

    render() {

        return(
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}> 
                {/* <KeyboardAvoidingView behavior="position"> */}
                <View style={{flex: 1 , backgroundColor: '#f6f6f6'}} >
                    <View style={{ flex: 1, padding: 40 }}>
                        <Image source={require('../assets/images/icon.png')} 
                             style={{width: 40, height: 40 , alignSelf: "center",alignItems: "center"}} />
                        <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontSize: 18, marginLeft:33, color: '#161616' , paddingTop: 10 }}>
                            Covid-19 Health Assistance
                        </Text>
                    </View>
                    <View style={{ flex: 9 }}>
                        <View style={styles.formRowCustom}>
                            <Text style={styles.formLabel}>Enter Full Name</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5,paddingLeft: 10}}
                                onChangeText={(text) => { this.setState({ name: text}) }}
                                value={this.state.name}
                                placeholder="Enter Full Name"
                                />
                        </View> 
                        <View style={styles.formRowCustom}>
                            <Text style={styles.formLabel}>Enter Your Age</Text> 
                            <Picker
                                mode="dropdown"
                                style={{backgroundColor: 'white'}}
                                selectedValue={this.state.age}
                                onValueChange={ (itemValue, itemIndex) => this.setState({ age: itemValue}) }                    >
                                <Picker.Item label='1' value='1' />
                                <Picker.Item label='2' value='2' />
                                <Picker.Item label='3' value='3' />
                                <Picker.Item label='4' value='4' />
                                <Picker.Item label='5' value='5' />
                                <Picker.Item label='6' value='6' />
                                <Picker.Item label='7' value='7' />
                                <Picker.Item label='8' value='8' />
                                <Picker.Item label='9' value='9' />
                                <Picker.Item label='10' value='10' />
                                <Picker.Item label='11' value='11' />
                                <Picker.Item label='12' value='12' />
                                <Picker.Item label='13' value='13' />
                                <Picker.Item label='14' value='14' />
                                <Picker.Item label='15' value='15' />
                                <Picker.Item label='16' value='16' />
                                <Picker.Item label='17' value='17' /> 
                                <Picker.Item label='18' value='18' />
                                <Picker.Item label='19' value='19' />
                                <Picker.Item label='20' value='20' />
                                <Picker.Item label='21' value='21' />
                                <Picker.Item label='22' value='22' />
                                <Picker.Item label='23' value='23' />
                                <Picker.Item label='24' value='24' />
                                <Picker.Item label='25' value='25' />
                                <Picker.Item label='26' value='26' />
                                <Picker.Item label='27' value='27' />
                                <Picker.Item label='28' value='28' />
                                <Picker.Item label='29' value='29' />
                                <Picker.Item label='30' value='30' />
                                <Picker.Item label='31' value='31' />
                                <Picker.Item label='32' value='32' />
                                <Picker.Item label='33' value='33' />
                                <Picker.Item label='34' value='34' />
                                <Picker.Item label='35' value='35' />
                                <Picker.Item label='36' value='36' />
                                <Picker.Item label='37' value='37' />
                                <Picker.Item label='38' value='38' />
                                <Picker.Item label='39' value='39' />
                                <Picker.Item label='40' value='40' />
                                <Picker.Item label='41' value='41' />
                                <Picker.Item label='42' value='42' />
                                <Picker.Item label='43' value='43' />
                                <Picker.Item label='44' value='44' />
                                <Picker.Item label='45' value='45' />
                                <Picker.Item label='46' value='46' />
                                <Picker.Item label='47' value='47' />
                                <Picker.Item label='48' value='48' />
                                <Picker.Item label='49' value='49' />
                                <Picker.Item label='50' value='50' />
                                <Picker.Item label='51' value='51' />
                                <Picker.Item label='52' value='52' />
                                <Picker.Item label='53' value='53' />
                                <Picker.Item label='54' value='54' />
                                <Picker.Item label='55' value='55' />
                                <Picker.Item label='56' value='56' />
                                <Picker.Item label='58' value='57' />
                                <Picker.Item label='59' value='59' />
                                <Picker.Item label='60' value='60' />
                                <Picker.Item label='61' value='61' />
                                <Picker.Item label='62' value='62' />
                                <Picker.Item label='63' value='63' />
                                <Picker.Item label='64' value='64' />
                                <Picker.Item label='65' value='65' />
                                <Picker.Item label='66' value='66' />
                                <Picker.Item label='67' value='67' />
                                <Picker.Item label='68' value='68' />
                                <Picker.Item label='69' value='69' />
                                <Picker.Item label='70' value='70' />
                                <Picker.Item label='71' value='71' />
                                <Picker.Item label='72' value='72' />
                                <Picker.Item label='73' value='73' />
                                <Picker.Item label='74' value='74' />
                                <Picker.Item label='75' value='75' />
                                <Picker.Item label='76' value='76' />
                                <Picker.Item label='77' value='77' />
                                <Picker.Item label='78' value='78' />
                                <Picker.Item label='79' value='79' />
                                <Picker.Item label='80' value='80' />
                                <Picker.Item label='81' value='81' />
                                <Picker.Item label='82' value='82' />
                                <Picker.Item label='83' value='83' />
                                <Picker.Item label='84' value='84' />
                                <Picker.Item label='85' value='85' />
                                <Picker.Item label='86' value='86' />
                                <Picker.Item label='87' value='87' />
                                <Picker.Item label='88' value='88' />
                                <Picker.Item label='89' value='89' />
                                <Picker.Item label='90' value='90' />
                                <Picker.Item label='91' value='91' />
                                <Picker.Item label='92' value='92' />
                                <Picker.Item label='93' value='93' />
                                <Picker.Item label='94' value='94' />
                                <Picker.Item label='95' value='95' />
                                <Picker.Item label='96' value='96' />
                                <Picker.Item label='97' value='97' />
                                <Picker.Item label='98' value='98' />
                                <Picker.Item label='99' value='99' />
                                <Picker.Item label='100' value='100' />
                            </Picker>
                        </View>
                        <View style={styles.formRowCustom}>
                            <Text style={styles.formLabel}>Select Gender</Text>  
                            <View style={{ flex: 1, flexDirection: 'row'}}>
                                <CheckBox
                                    title='Male' 
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.gender == 'Male'}
                                    onPress={() => this.setState({gender: 'Male'})}
                                />	
                                <CheckBox
                                    title='Female'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.gender == 'Female'}
                                    onPress={() => this.setState({gender: 'Female'})}
                                />
                                <CheckBox
                                    title='Other'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.gender == 'Other'}
                                    onPress={() => this.setState({gender: 'Other'})}
                                />
                            </View>
                        </View>
                        <View style={styles.formRowCustom}>
                            <Text style={styles.formLabel}>Enter Your Mobile Number</Text>
                                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1,paddingLeft: 10 }}
                                onChangeText={(mobile) => { this.setState({ mobile: mobile}) }}
                                value={this.state.mobile}
                                keyboardType={'number-pad'} 
                                placeholder="1234567890"
                                /> 
                        </View> 
                        <View style={styles.formRowCustom} >
                            <Text style={styles.formLabel}>Enter City or Zip Code</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1,paddingLeft: 10 }}
                                onChangeText={(city) => { this.setState({ city: city}) }} 
                                value={this.state.city}
                                placeholder="Andheri, Sakinaka, Mumbai, 401208"
                                />
                        </View> 
                        <View style={styles.formRowCustom} >
                            <Button
                                buttonStyle={styles.buttonColor} 
                                onPress={() => this.handelRegister()}
                                title='Next' 
                                style={{ paddingTop: 20 }} 
                            />
                        </View>
                    </View>
                </View> 
                <Modal 
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    style={{ flex: 1, margin: 20 }}
                    >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                        <Icon name="check-circle" size={60} color="green" />
                        <Text style={{ fontWeight: 'bold', fontSize: 24, paddingTop: 10 }}>
                            Thanks, {this.state.name}! For sharing your information.
                        </Text>
                        <Text style={{ fontSize: 20, paddingTop: 10 }}>
                            Let us evaluate your health for COVID-19 symptoms.
                        </Text>
                    </View>        
                </Modal>
                {/* </KeyboardAvoidingView>  */}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        padding: 20
    },
    formRowCustom: {
        flex:1, 
        justifyContent: 'flex-start', 
        alignItems: 'stretch', 
        margin: 10,
        marginTop:15
    },
    formRow: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 10
    },
    formCol: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
    },
    formLabel: {
        fontSize: 18,
        marginBottom:5
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    },
	buttonColor: {
        backgroundColor: '#007d79',
	    borderColor: '#007d79',
        borderWidth: 2,
        borderRadius: 2
    }  
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterIndividual);
