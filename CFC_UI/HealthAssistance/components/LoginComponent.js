import React, { Component } from 'react';
import { View, Text, TextInput ,ScrollView, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { loginUser, userLogout } from '../redux/ActionCreators';
import { Loading } from './LoadingComponent';
 
const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    initialLoad: () => dispatch(userLogout()),
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

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
          this.setState({ id: '',  password: '', showModal: false});
          this.props.initialLoad();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
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
        
        if (userObj.id.length !== 10) {
           alert("Please enter a valid 10 digit mobile number.");
           return false; 
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
                                <Text style={styles.formLabel}>Mobile Number</Text>
                                <TextInput 
                                    keyboardType={'number-pad'} 
                                    style={{ height: 40, width:325, borderColor: '#e2e1e1', borderWidth: 1,paddingLeft: 10 }}
                                    onChangeText={(id) => { this.setState({ id: id}) }}
                                    value={this.state.id}
                                    placeholder="Enter Mobile Number" 
                                    placeholderTextColor="#a8a8a8"
                                    maxLength = {10}
                                /> 
                            </View> 
                            <View style={styles.formRowCustom}> 
                                <Text style={styles.formLabel}>Password</Text>
                                    <TextInput 
                                        style={{ height: 40, width: 325, borderColor: '#e2e1e1', borderWidth: 1,paddingLeft: 10 }}
                                        onChangeText={(password) => { this.setState({ password: password}) }}
                                        value={this.state.password}
                                        placeholder="Enter Password"
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
                                    disabled={!this.state.id || !this.state.password }
                                />
                            </View>
                            <View style={{flexDirection: 'row', paddingTop:20, justifyContent: 'space-between', alignItems: 'center'}} > 
                                <Text style={styles.formLabel}>Don't have an account?</Text>
                                <Button 
                                    title="Register Here" 
                                    type="clear" 
                                    onPress={ () => { navigate('Register') }}   
                                /> 
                            </View>
                        </View>
                    </View> 
                </ScrollView>
            )
        }

    }
}

const styles = StyleSheet.create({
	
    formRowCustom: {
        marginBottom: 20 
    }, 
    buttonCustom: {
       marginTop: 120
    },
    formLabel: {
        fontSize: 12,
		marginBottom:5,
		color: '#393939'

    },
	buttonColor: { 
      backgroundColor: '#007d79',
	  borderColor: '#007d79',
      borderWidth: 2,
      borderRadius: 2
   }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);