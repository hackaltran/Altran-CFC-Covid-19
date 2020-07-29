import React, { Component } from 'react';
import { View, Text, TextInput ,ScrollView, StyleSheet, Modal,Alert ,TouchableOpacity,ToastAndroid, Platform,ActivityIndicator} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { updateSymptom } from '../redux/ActionCreators';
import { Loading } from './LoadingComponent';
import { Logs } from 'expo';
import NetInfo from '@react-native-community/netinfo';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    updateSymptom: (userObj) => dispatch(updateSymptom(userObj)),
})

class AddTemperatorComponent extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            id: '',
            screenNames: '',  
            isVisible : false,
            connection_Status: true
        }
    }

    componentDidMount() {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state1 => {
    console.log("Is internet connected", state1.isConnected);
    this.setState({connection_Status : state1.isConnected})
        if(this.state.isVisible){
            this.checkProgress(state1.isConnected);
        }
        });
      }

 handelButtonClick() {

    var value = this.state.id;

    if(value <1 && this.state.screenNames==="Enter Heart Rate"){
        ToastAndroid.show("Heart rate should be greater then 0", ToastAndroid.SHORT)
        return ;
    }
    else if(value < 1 && this.state.screenNames==="Enter Body Temperature"){
        ToastAndroid.show("Body temperature should be greater then 0", ToastAndroid.SHORT)
        return ;
    }

    const userObj = {
        user_id: this.props.user.user.mobileno,
        bodyTemp: value.toString(),
        isAddBodyTemp: true
    }

    const userObj1 = {
        user_id: this.props.user.user.mobileno,
        bodyTemp: value.toString(),
        isAddBodyTemp: false
    }
    if(!this.state.connection_Status){
        ToastAndroid.show("Please check internet connection !", ToastAndroid.SHORT);
        return;
    }
    this.setState({isVisible : true});
   
    if(this.state.screenNames==="Enter Heart Rate"){
        this.getResponse(userObj1);
    }else{
        this.getResponse(userObj);
    }
    
}

checkProgress(checkStatus){
    this.setState({isVisible : checkStatus});
}

getResponse = (userObj) => {
    this.props.updateSymptom(userObj).then((response) => {
        //console.log("trilok check fun "+response.success)

        this.setState({isVisible : true});

        var lastRecord = JSON.stringify(response);
        var lastTime = JSON.parse(lastRecord.toString()).status;

        if(lastTime == 200){
            console.log("after response "+lastTime)
            if (Platform.OS === 'android') {
                this.setState({ id: ''})
               this.props.onPress();              
              } 
        }
    
    });
  };

showAlert() {  

    if (this.state.id === ''){
        return;
    }

    Alert.alert(  
        'Press ok button to continue',   
        '',
        [  
            {  
                text: 'Cancel',  
                onPress: () => console.log('cancel button click'),  
                style: 'cancel',  
            },  
            {text: 'OK', onPress: () => this.handelButtonClick()},  
        ]  
    ); }  


    render() { 
      var screens = this.props.sendData.SCREEN_NAME;
        var screenTitle = "Enter Body Temperature";
        var heading = "Add Body Temperature";
        var unit = "(°F)";

        if (screens === "HEART_RATE") {
            screenTitle = "Enter Heart Rate";
            heading = "Add Heart Rate";
            unit = "(Bpm)";
        } 
       // console.log("trilok data "+screens)
        this.state.screenNames = screenTitle;
        
        if (this.props.user.isLoading) {
            return(
                <Loading />
            )        
        } else {
            return(
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}> 

                <View style={{flex: 1 , backgroundColor:  '#ffffff'}} >

                <Modal            
                animationType = {"fade"}  
                transparent = {true}  
                visible = {this.state.isVisible}  
                onBackdropPress = {()=>this.setState({isVisible : false})}
                onRequestClose = {() =>{ this.setState({isVisible : false}) } }>  
                {/*All views of Modal*/}  
                <View style={{flex : 1,justifyContent :"center",  flexDirection : "row"}}>

                <View style = {{width : 100, height : 100, alignSelf:"center"}}>
                 <ActivityIndicator size="large" alignSelf="center" color="#512DA8" />
                
                </View>
                </View>
                
                </Modal>  

                        <View style={{ flex: 1, paddingTop: 30,paddingBottom :30 ,paddingEnd :10 }}>

                        {/* <TouchableOpacity  onPress={() => { this.props.sendData.isVisible =false}}> 

                            <Image source={require('../assets/images/cancel_icon.png')} 

                                style={{width: 15, height: 15, marginEnd:10, alignSelf: "flex-end",alignItems: "flex-end" }} />

                                </TouchableOpacity> */}

                            <View style={{ flex: 1 ,lignItems: "flex-end" }}>

                            <Text style={{ fontWeight: 'Normal', fontSize: 18, alignSelf: 'flex-start', color: '#393939' , paddingTop: 10 }}>
                                {heading}
                            </Text>
                            </View>
        
                        </View>


                        <View style={{ flex: 1,  alignSelf: 'center' }}>
                            
                        <View style={styles.formRowCustom}>  
                                <Text style={styles.formLabel}>{screenTitle+unit}</Text>
                                <TextInput 
                                    keyboardType={'number-pad'} 
                                    style={{ height: 40,fontSize: 17, width:325, borderColor: '#e2e1e1', borderWidth: 1,paddingLeft: 10 }}
                                    onChangeText={(id) => { this.setState({ id: id}) }}
                                    value={this.state.id}
                                    placeholder={screenTitle}
                                    placeholderTextColor="#a8a8a8"
                                    maxLength = {10}
                                />  
                            </View> 

                            <View style={styles.buttonCustom} > 
                                <Button
                                    buttonStyle={styles.buttonColor} 
                                  //  onPress={() => this.props.onPress("check")}
                                   onPress={() => this.handelButtonClick()}
                                    title='Save' 
                                    style={{ paddingTop: 10 }}  
                                     disabled={!this.state.id }
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
       marginTop: 80
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
export default connect(mapStateToProps,mapDispatchToProps)(AddTemperatorComponent);