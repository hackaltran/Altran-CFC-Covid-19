import React, { Component } from 'react';
import { View, Text, TextInput ,ScrollView, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { loginUser } from '../redux/ActionCreators';
import { Loading } from './LoadingComponent';
 
const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    loginUser: (userObj) => dispatch(loginUser(userObj)),
})

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            id: '',
            password: '',
            showModal: false
        }
    }

    componentDidUpdate() {
        const { navigate } = this.props.navigation;
        if (this.props.user.user && this.props.user.user.userId != null) {
            if (this.props.user.user.symptomDataLen && this.props.user.user.symptomDataLen >= 1) {
                navigate('Home');
            } else {
                navigate('SymptomTracker');
            }
        }
    }

    static navigationOptions = {
        title: ''
    }

    handelLogin() {
        const userObj = {
            id: this.state.id,
            password: this.state.password
        }
        this.props.loginUser(userObj);
    }

    resetForm() {
        this.state = {
            mobile: '',
            password: ''
        }
    }

    render() {
        
        const { navigate } = this.props.navigation;
        
        if (this.props.user.isLoading) {
            return(
                <Loading />
            )        
        } else {
            return(
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}> 
                    {/* <KeyboardAvoidingView> */}
                    <View style={{flex: 1 , backgroundColor: '#f6f6f6'}} >
                        <View style={{ flex: 1, padding: 40 }}>
                            <Image source={require('../assets/images/icon.png')} 
                                style={{width: 40, height: 40, alignSelf: "center",alignItems: "center" }} />
                            <Text style={{ fontWeight: 'bold', fontSize: 20, alignSelf: 'center', color: '#161616' , paddingTop: 10 }}>
                                Covid-19 Health Assistance
                            </Text>
                            <Text style={{ fontSize: 14, paddingTop: 13 , alignSelf: "center",alignItems: 'center', justifyContent: 'center' }}>
                                Please enter your credentials to login            
                            </Text> 
                        </View>
                        <View style={{ flex: 1, marginBottom:120, alignSelf: 'center' }}>                     
                            <View style={styles.formRowCustom}>  
                                <Text style={styles.formLabel}>Enter Mobile Number</Text>
                                <TextInput 
                                    keyboardType={'number-pad'} 
                                    style={{ height: 40, width:325, borderColor: '#e2e1e1', borderWidth: 1,paddingLeft: 10 }}
                                    onChangeText={(id) => { this.setState({ id: id}) }}
                                    value={this.state.id}
                                    placeholder="Mobile Number" 
                                    placeholderTextColor="#a8a8a8"
                                    maxLength = {10}
                                /> 
                            </View> 
                            <View style={styles.formRowCustom}> 
                                <Text style={styles.formLabel}>Enter Password</Text>
                                    <TextInput 
                                        style={{ height: 40, width: 325, borderColor: '#e2e1e1', borderWidth: 1,paddingLeft: 10 }}
                                        onChangeText={(password) => { this.setState({ password: password}) }}
                                        value={this.state.password}
                                        placeholder="Password"
                                        placeholderTextColor="#a8a8a8"
                                        returnKeyType='go'
                                        autoCorrect={false}
                                        secureTextEntry={true}
                                    /> 
                            </View>
                            <View style={styles.buttonCustom} > 
                                <Button
                                    buttonStyle={styles.buttonColor} 
                                    onPress={() => this.handelLogin()}
                                    title='Login' 
                                    style={{ paddingTop: 20 }}  
                                />
                            </View>
                            <View style={{flexDirection: 'row', paddingTop:20, justifyContent: 'space-between', alignItems: 'center'}} > 
                                <Text style={styles.formLabel}>Dont have an account? </Text>
                                <Button 
                                    title="Register Here" 
                                    type="clear" 
                                    onPress={ () => { navigate('Register') }}
                                /> 
                            </View>
                        </View>
                    </View> 
                    {/* </KeyboardAvoidingView> */}
                </ScrollView>
            )
        }

    }
}

const styles = StyleSheet.create({
	
	container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
	padding: 20
  },
    formRowCustom: {
        marginBottom: 20 
    }, 
    buttonCustom: {
       marginTop: 120
    },
    formRow: {
        margin: 10
    },
    formCol: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
    },
    formLabel: {
        fontSize: 12,
		marginBottom:5,
		color: '#393939'

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
   },
   JustifyButton:{
    justifyContent: 'space-around'
   }

});

export default connect(mapStateToProps, mapDispatchToProps)(Login);