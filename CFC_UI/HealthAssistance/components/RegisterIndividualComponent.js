
/*----------------------------
Register New Patient 
--------------------------------*/

import React, { Component } from 'react';
import { View, Text, TextInput , StyleSheet, Image, ScrollView, Picker,TouchableOpacity, KeyboardAvoidingView ,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';

import { registerUser } from '../redux/ActionCreators';
import MobileNumberComponent from './MobileNumberComponent';
import { MarkerUnits } from 'react-native-svg';


const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    registerUser: (userObj) => dispatch(registerUser(userObj))
})

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

class RegisterIndividual extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            age: '',
            gender: 'Male',
            mobile: '',
            city: '',
            showModal: false,
          
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
    
        this.setState({
            showModal: true
        })

        const { navigate } = this.props.navigation;
        navigate('MobileNumberComponent', { user: userObj })

        // this.props.registerUser(userObj);

        // this.setState({
        //     showModal: true
        // })

        // setTimeout(() => {
        //     this.setState({
        //         showModal: false
        //     })
        //     const { navigate } = this.props.navigation;
        //     navigate('Login');
        // },2000);    
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
        var options =[];
        for(let i = 0; i < 121; i++){
         options.push(i.toString());
        }
        return(
            <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, backgroundColor: "#f6f6f6", height:height}}>
            

                    <View style={{ flex: 0, padding: 40 , marginTop:20}}>
                        <Image source={require('../assets/images/icon.png')} 
                             style={{width: 40, height: 40 , alignSelf: "center",alignItems: "center"}} />
                        <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontSize: 20, color: '#161616' , paddingTop: 10 }}>
                            Covid-19 Health Assistance
                        </Text>
                        <Text style={{color:"#393939",alignSelf: 'center', fontSize: 14,marginTop:10}}>Please fill the below details to get started</Text>
                    </View>
                    <View style={{ flex: 1}}>
                        <View style={styles.formRowCustom}>
                            <Text style={styles.formLabel}>Enter Full Name</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray',backgroundColor:"white", borderWidth: 1, marginTop: 5,paddingLeft: 10}}
                                onChangeText={(text) => { this.setState({ name: text}) }}
                                value={this.state.name}
                                placeholder="Enter Full Name"
                                />
                        </View> 
                        <View style={styles.formRowCustom}>
                            <Text style={styles.formLabel}>Enter Age</Text> 
                            <View style={{height:40,borderColor: 'gray', borderWidth: 1, backgroundColor:'white'}}>
                            <Picker
    style={{height:39}}
    mode="dropdown"
    selectedValue={this.state.age}
    onValueChange={(itemValue, itemIndex) =>
                    this.setState({ age: itemValue, enabled: true })
                  }
                >
    {options.map((item, index) => {
        return (<Picker.Item label={item} value={index} key={index}/>) 
    })}
</Picker>
</View>
                           
                        </View>
                        <View style={styles.formRowCustom}>
                            <Text style={styles.formLabel}>Select Gender</Text>  
                            <View style={{ flex: 0, flexDirection: 'row',}}>
                                <CheckBox
                                    title='Male' 
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.gender == 'Male'}
                                    onPress={() => this.setState({gender: 'Male'})}
                                    checkedColor="#007d79"
                                 />	
                                <CheckBox
                                    title='Female'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.gender == 'Female'}
                                    onPress={() => this.setState({gender: 'Female'})}
                                    checkedColor="#007d79"
                                 />
                                <CheckBox
                                    title='Other'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.gender == 'Other'}
                                    onPress={() => this.setState({gender: 'Other'})}
                                    checkedColor="#007d79"
                                 /> 
                            </View> 
                        </View>
                        <View style={styles.formRowCustom} >
                            <Text style={styles.formLabel}>Enter City or Zip Code</Text>
                            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1,paddingLeft: 10, backgroundColor:"white" }}
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
                                disabled={!this.state.name || !this.state.age || !this.state.city }
                            /> 
                        </View>
                    </View>
                </View> 
                
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
        
        
       
        margin: 10,
      
        
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
        fontSize: 14,
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
    }  
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterIndividual);
