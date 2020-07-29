import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView,Linking,CheckBox,TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { raiseSOSAPI } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    initialLoad: () => dispatch(userLogout()),
    raiseSOSAPI: (Obj) => dispatch(raiseSOSAPI(Obj)),
})

class RaiseSos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:null,
            checkbox1: false,
            checkbox2: false,
            checkbox3: false,
            checkbox4: false,
            isModalVisibleRaise:null,
            isDisabledSos: true,
            text: ''
        };
    }

    dialCall = () => {
        let phoneNumber = '';
        phoneNumber = 'tel:${+91 1114567890}';
        Linking.openURL(phoneNumber);
    };
    raiseSOSFunc = () => {
        let Obj = {id:null,reason:'',sosStatus:null};
        Obj.id = this.props.user.user.userId;
        Obj.sosStatus = false;
        if(this.state.checkbox1 && !this.state.checkbox2 && !this.state.checkbox3 && !this.state.checkbox4){
           Obj.reason = 'I am not able to breathe properly, urgently require assistance.' 
        }
        if(this.state.checkbox1 && this.state.checkbox2 && !this.state.checkbox3 && !this.state.checkbox4){
            Obj.reason = 'I am not able to breathe properly, urgently require assistance.\n\nI have a High Fever too.' 
         }
         if(this.state.checkbox1 && this.state.checkbox2 && this.state.checkbox3 && !this.state.checkbox4){
            Obj.reason = 'I am not able to breathe properly,urgently require assistance.\n\nI have a High Fever.\n\nI have a cold and cough too.' 
         }
         if(this.state.checkbox1 && !this.state.checkbox2 && this.state.checkbox3 && !this.state.checkbox4){
            Obj.reason = 'I am not able to breathe properly, urgently require assistance.\n\nI have a cold and cough too.' 
         }
         if(!this.state.checkbox1 && this.state.checkbox2 && this.state.checkbox3 && !this.state.checkbox4){
            Obj.reason = 'I have a High Fever.\n\nI have a cold and cough too.' 
         }
         if(!this.state.checkbox1 && !this.state.checkbox2 && this.state.checkbox3 && !this.state.checkbox4){
            Obj.reason = 'I have a cold and cough.' 
         }
         if(!this.state.checkbox1 && this.state.checkbox2 && !this.state.checkbox3 && !this.state.checkbox4){
            Obj.reason = 'I have a High Fever.'
         }
         if(!this.state.checkbox1 && !this.state.checkbox2 && !this.state.checkbox3 && this.state.checkbox4){
            Obj.reason = this.state.text;
         }
         if(this.state.checkbox1 && !this.state.checkbox2 && !this.state.checkbox3 && this.state.checkbox4){
            Obj.reason = 'I am not able to breathe properly, urgently require assistance.' + '\n\n' + this.state.text;
         }
         if(!this.state.checkbox1 && this.state.checkbox2 && !this.state.checkbox3 && this.state.checkbox4){
            Obj.reason = 'I have a High Fever.' + '\n\n' + this.state.text;
         }
         if(!this.state.checkbox1 && !this.state.checkbox2 && this.state.checkbox3 && this.state.checkbox4){
            Obj.reason = 'I have a cold and cough.' + '\n\n' + this.state.text;
         }
         if(this.state.checkbox1 && this.state.checkbox2 && this.state.checkbox3 && this.state.checkbox4){
            Obj.reason = 'I am not able to breathe properly, urgently require assistance.\n\nI have a High Fever.\n\nI have a cold and cough.' + '\n\n' + this.state.text;
         }
         if(this.state.checkbox1 && !this.state.checkbox2 && this.state.checkbox3 && this.state.checkbox4){
            Obj.reason = 'I am not able to breathe properly, urgently require assistance.\n\nI have a cold and cough.' + '\n\n' + this.state.text;
         }
         if(!this.state.checkbox1 && this.state.checkbox2 && this.state.checkbox3 && this.state.checkbox4){
            Obj.reason = 'I have a High Fever.\n\nI have a cold and cough.' + '\n\n' + this.state.text;
         }
         if(this.state.checkbox1 && this.state.checkbox2 && !this.state.checkbox3 && this.state.checkbox4){
            Obj.reason = 'I am not able to breathe properly, urgently require assistance.\n\nI have a High Fever.' + '\n\n' + this.state.text;
         }
        console.log('finalOBj-->',Obj);
        this.props.raiseSOSAPI(Obj).then((response) => {
            if(response.ok === true ){
                this.state.isModalVisibleRaise = false;
                this.props.sendData(this.state.isModalVisibleRaise);
            }
        });
    };
    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    };
    render() {
        if(this.state.checkbox1 || this.state.checkbox2 || this.state.checkbox3 || this.state.checkbox4){
            this.state.isDisabledSos = false;
        }else{
            this.state.isDisabledSos = true;
        }
        return (
            <View style={{ flex:1,backgroundColor: '#ffffff' }} >
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#161616'}}>
                        Raise an SOS
                        </Text>
                </View>
                <View style={{ flex: 9 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop:18 }}>Please specify your emergency or call on given number.</Text>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                value={this.state.checkbox1}
                                onChange={() => this.setState({ checkbox1: !this.state.checkbox1 })}
                            /><Text style={styles.checkboxText}>I am not able to breath properly, urgently require assistance.</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                value={this.state.checkbox2}
                                onChange={() => this.setState({ checkbox2: !this.state.checkbox2 })}
                            /><Text style={styles.checkboxText}>I have a High Fever.</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                value={this.state.checkbox3}
                                onChange={() => this.setState({ checkbox3: !this.state.checkbox3 })}
                            /><Text style={styles.checkboxText}>I have a cold and cough.</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                value={this.state.checkbox4}
                                onChange={() => this.setState({ checkbox4: !this.state.checkbox4 })}
                            /><Text style={styles.checkboxText}>Other</Text>
                        </View>
                        {
                            this.state.checkbox4 ? <View style={styles.formRowCustom}>
                                <TextInput
                                style={{height: 75,borderColor: '#e2e1e1',borderWidth: 1,paddingLeft: 19,paddingTop:14}}
                                numberOfLines={4}
                                placeholder="Enter your reason"
                                placeholderStyle={{margin:20}}
                                multiline={true}
                                maxLength = {100}
                                textAlignVertical={'top'}
                                onChangeText={(text) => this.setState({ text })}
                                value={this.state.text} /> 
                                </View> : null
                        }
                    </View>
                </View>
                <View style={styles.formRowCustom,{marginTop:27.4}} >
                    <Button
                        buttonStyle={styles.buttonColor}
                        onPress={this.raiseSOSFunc}
                        title='Raise an SOS'
                        style={{ paddingTop: 20 }}
                        disabled={this.state.isDisabledSos}
                    />
                </View>
                <View style={styles.formRowCustom, { flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', color: '#161616', marginTop: 14, marginBottom: 14 }}>OR</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        //padding: 20,
        marginTop: 17
    },
    formRowCustom: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        //margin: 10,
        marginTop: 15
    },
    buttonColor: {
        backgroundColor: '#007d79',
        borderColor: '#007d79',
        borderWidth: 2,
        borderRadius: 2
    },
    customBox:{
        height:93,
        backgroundColor: '#f8f8f8',
        borderColor: '#f2f2f2',
        borderWidth: 1,
        // marginLeft: 18,
        // marginRight: 17
    },
    checkboxText: {
        fontSize:14,
        marginLeft:10,
        marginTop:5,
        fontSize: 14,
        color: '#393939',
        flex:1
    },
    underlineTextContainer: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        textDecorationLine: 'underline',
        color:'#161616',
        marginTop:10
    },
    separator: {
        borderBottomColor: '#e2e1e1',
        borderBottomWidth: 1,
        //marginLeft:18,
        marginTop:7,
        marginBottom:7
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(RaiseSos);
