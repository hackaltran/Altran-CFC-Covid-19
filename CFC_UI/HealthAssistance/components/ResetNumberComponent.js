import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Linking,
} from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import OTPTextView from "react-native-otp-textinput";
import { Dimensions } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import Modal from "react-native-modal";
import CountDown from "react-native-countdown-component";

import {
  logout,
  generateOTP,
  validateOtp,
  getUserDetails,
  updateLockDetails,
} from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (mobileNum) => dispatch(getUserDetails(mobileNum)),
  generateOTP: (mobileNum, otpGenObj) =>
    dispatch(generateOTP(mobileNum, otpGenObj)),
  validateOtp: (userObj) => dispatch(validateOtp(userObj)),
  updateLockDetails: (userObj) => dispatch(updateLockDetails(userObj)),
});

var requestID = "";


const differenceInHours = (a, b) =>
  Math.floor(((a.getTime() - b.getTime()) / (1000 * 60 * 60)) * 60 * 60);

class ResetNumberComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
  
      mobile: "",
      isLoading: false,
      otpInput: "",
      inputText: "",
    // expiry time
      otplockTime: "",
      show: false,
      isSuccess: false,
      isResendVisible: true,
      isEmergencyNum: false,
      isUse: false,
      enabled: false,
      userId: null,
      isAppLock: false,
      count: 0,
      timestampOtp: 0, 

      maxCount:0,
      lockTime:0,
      otpExpiryTime:0,
      helplineNum:"",
      // App lock time
    };
  }

  async resendOTP() {
    var userId = this.state.userId;
    var timeOtp = new Date();
    var otpGenObj = {
      userId: userId,
      timestampOtp: timeOtp,
    };

    await this.props
      .generateOTP(this.props.mobile, otpGenObj)
      .then((response) => {
        if (response.payload.ok) {
          requestID = response.payload.request_id;
        
          this.showCounter(this.state.otpExpiryTime);
        } else {
          alert("Otp already sent.");
        }
      });
  }


  // count down otp expiry time
  checkCountDowntime() {
    this.showCounter(this.state.otpExpiryTime);
  }

  checkMaxAttempts(userOtpAttempts, userTimestampLock) {
    defaultMaxAttempts = this.state.maxCount;
    defaultAppLockTime = this.state.lockTime;

    if (userOtpAttempts >= defaultMaxAttempts) {
      var timeNow = new Date();
      var timeLock = new Date(userTimestampLock);
      var lockTime = differenceInHours(timeNow, timeLock);

      if (lockTime <=defaultAppLockTime) {
        var timeDiff = defaultAppLockTime - lockTime;
        
       
        this.setState({
          isEmergencyNum: true,
          isAppLock: true,
          otphelplineNum: this.state.helplineNum,
          enabled: true,
        });
       
        this.showCounter(timeDiff);
        var userObj = {
          userId:this.state.userId,
          isAppLock: true        }
         
        this.props.updateLockDetails(userObj);
      }
    }
  }

  async componentDidMount() {
 

  await this.props.getUserDetails(this.props.mobile).then((response)=>{
   var UserId = response.userId;
   defaultMaxAttempts = response.otpDetails.maxOtpAttempts;
  
         var defaultAppLockTime = response.otpDetails.otpAppLockTime;
        var helplineNumber = response.otpDetails.otpLockhelplineNum;
         var otpExpiryDefaultTime = response.otpDetails.otpExpiryTime;
         this.setState({userId:UserId, maxCount: defaultMaxAttempts,lockTime:defaultAppLockTime, otpExpiryTime:otpExpiryDefaultTime, helplineNum:helplineNumber });
              requestID = response.otpRequestDetails.request_id;
               var userOtpAttempts = response.otpRequestDetails.count;
               var userTimestampLock = response.otpRequestDetails.timestampAppLock;
               this.checkCountDowntime();
               this.checkMaxAttempts(userOtpAttempts, userTimestampLock);
  });
}

  componentWillMount() {
    this.listener = EventRegister.addEventListener("VALIDATE_OTP", (data) => {
      if ((data.success === false)) {
        alert("verification failed.Please try again");
        
        this.counterFinish();
        this.setState({ isLoading: false, count: data.count });
        this.checkMaxAttempts(data.count, data.timestampAppLock);
        
      }
    });
  }

  dialCall = () => {
    let phoneNumber = "";
    phoneNumber = "tel:+91 7291853456";
    Linking.openURL(phoneNumber);
  };
  toggleModal = () => {
    this.setState({ isModalVisible: true });
  };

  async verifyOtp() {
    const { otpInput } = this.state;
    if (!otpInput) {
      alert("Otp can't be null.please enter Otp");
      return true;
    }

    if (requestID) {
      var count = this.state.count;
      if (this.state.userId) {
        var timestampAppLock = new Date();
        var userObj = {
          request_id: requestID,
          code: this.state.otpInput,
          userId: this.state.userId,
          count: count,
          timestampAppLock: timestampAppLock,
        };

        this.setState({ isLoading: true });
        await this.props.validateOtp(userObj);
      }
    }
  }

  renderCancel() {
    if (this.state.showCancel) {
      return (
        <TouchableHighlight onPress={this.toggleCancel()}>
          <View>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return null;
    }
  }

  showCounter = (otpExpiryTime) => {
    this.setState({
      otpExpiryTime: otpExpiryTime,
      show: true,
      isResendVisible: false,
    });
  };
  counterFinish = () => {
    if (this.state.isAppLock === true) {
      this.setState({
        show: false,
        isResendVisible: true,
        isEmergencyNum: false,
        isAppLock: false,
        enabled:false,
      });
      var userObj = {
        userId:this.state.userId,
        isAppLock: false        }
       
      this.props.updateLockDetails(userObj);
    } else {
      this.setState({ show: false, isResendVisible: true });
    }
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f6f6f6",
          marginTop: 35,
          height: height,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {this.state.isEmergencyNum ? (
          <View>
            <View
              style={{
                backgroundColor: "#007d79",
                justifyContent: "center",
                color: "#000000",
                marginStart: 20,
                marginEnd: 20,
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: "#000000",
                }}
              >
                You have exhausted your maximum attempts{"\n"} please try after
                some time.
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: "#000000",
                }}
              >
                In case of emergency, Please call
              </Text>
              <Text
                onPress={() => this.dialCall()}
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  marginTop: 10,
                  textDecorationLine: "underline",
                  fontSize: 20,
                }}
              >
                {this.state.otphelplineNum}
              </Text>
            </View>
          </View>
        ) : null}

        <Modal
          animationType={"fade"}
          transparent={true}
          onBackButtonPress={() => this.toggleModal()}
          visible={this.state.isLoading}
          onBackdropPress={() => this.setState({ isVisible: true })}
          onRequestClose={() => {
            this.setState({ isLoading: false });
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: "#ffffff",
              opacity: 0.4,
            }}
          >
            <View style={{ flex: 1, alignSelf: "center" }}>
              <ActivityIndicator
                size="large"
                alignSelf="center"
                color="#512DA8"
              />
            </View>
          </View>
        </Modal>

        <View style={{ flex: 0.9 }}>
          <View style={{ padding: 40 }}>
            <Image
              source={require("../assets/images/icon.png")}
              style={{
                width: 40,
                height: 40,
                alignSelf: "center",
                alignItems: "center",
              }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                alignSelf: "center",
                color: "#161616",
                paddingTop: 10,
              }}
            >
              Covid-19 Health Assistance
            </Text>
            <Text
              style={{
                fontSize: 14,
                paddingTop: 13,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              OTP has been sent to your mobile number.
            </Text>
            <Text
              style={{
                fontSize: 14,
                paddingTop: 1,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Please verify
            </Text>
          </View>

          <View style={styles.container}>
            <OTPTextView
              ref={(e) => (this.input1 = e)}
              containerStyle={styles.textInputContainer}
              handleTextChange={(text) => this.setState({ otpInput: text })}
              textInputStyle={styles.roundedTextInput}
              inputCount={4}
              keyboardType="numeric"
            />
            <TextInput
              maxLength={4}
              onChangeText={(e) => this.setState({ inputText: e })}
              style={styles.textInput}
            />
          </View>

          <Button
            buttonStyle={{
              borderColor: "#007d79",
              borderWidth: 2,
              borderBottomWidth: 1,
              borderTopWidth: 0,
              borderRightWidth: 0,
              borderLeftWidth: 0,
              borderBottomWidth: 0,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
            titleStyle={{ color: "#007d79", fontSize: 18, fontWeight: "bold" }}
            type={this.state.isResendVisible ? "outline" : "solid"}
            onPress={() => this.resendOTP()}
            title=" Resend OTP "
            style={{ paddingTop: 20 }}
            disabled={!this.state.isResendVisible}
            activeOpacity={this.state.isResendVisible ? 1 : 1}
          />
          {this.state.show ? (
            <View style={{ marginTop: 10 }} disabled={this.state.disabled}>
              <CountDown
                until={this.state.otpExpiryTime}
                onFinish={() => this.counterFinish()}
                // onPress={() => alert('hello')}
                size={15}
                digitStyle={{ backgroundColor: "#FFF" }}
                digitTxtStyle={{ color: "#007d79" }}
                timeToShow={["M", "S"]}
              />
            </View>
          ) : null}
        </View>

        <Button
          buttonStyle={{
            backgroundColor: "#007d79",
            borderColor: "#ffffff00",
            borderWidth: 2,
          }}
          onPress={() => this.verifyOtp()}
          buttonStyle={styles.buttonColor}
          title="Verify"
          titleStyle={{ color: "#ffffff", fontSize: 18, fontWeight: "bold" }}
          type={this.state.enabled ? "outline" : "solid"}
          disabled={this.state.enabled}
          activeOpacity={this.state.enabled ? 1 : 1}
          style={{ paddingTop: 20 }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginTop: 10,
  },
  roundedTextInput: {
    borderRadius: 2,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e1e1",
    backgroundColor: "#ffffff",
  },
  formRowCustom: {
    //flex:.2,
    justifyContent: "flex-end",
    textAlign: "center",
    marginBottom: 30,
  },
  textInputContainer: {},
  buttonWrapper: {
    backgroundColor: "#e2e1e1",
  },
  buttonColor: {
    backgroundColor: "#007d79",
    borderColor: "#007d79",
    borderWidth: 2,
    borderRadius: 2,
    height: 50,
    marginEnd: 20,
    marginStart: 20,
  },
  customBox: {
    height: 93,
    backgroundColor: "#f8f8f8",
    borderColor: "#f2f2f2",
    borderWidth: 1,
    // marginLeft: 18,
    // marginRight: 17
  },
  checkboxText: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: "#393939",
    flex: 1,
  },
  underlineTextContainer: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#161616",
    marginTop: 10,
  },
  separator: {
    borderBottomColor: "#e2e1e1",
    borderBottomWidth: 1,
    //marginLeft:18,
    marginTop: 7,
    marginBottom: 7,
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetNumberComponents);
