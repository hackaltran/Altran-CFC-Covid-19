import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import {
  registerUser,
  generateOTP,
  logout,
} from "../redux/ActionCreators";
import PhoneInput from "react-native-phone-input";
import { EventRegister } from "react-native-event-listeners";
import ResetNumberComponents from "./ResetNumberComponent";
import Login from "./LoginComponent";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
var mobileNm="";
const mapDispatchToProps = (dispatch) => ({
  registerUser: (userObj) => dispatch(registerUser(userObj)),
  generateOTP: (mobileNum, otpGenObj) =>dispatch(generateOTP(mobileNum, otpGenObj)),
  logout: () => dispatch(logout()),
});
class MobileNumberComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNum: "",
      isModalVisible: false,
      isLoading: false,
    };
  }

  logout() {
    this.props.logout();
  }

  sentOtp = async () => {
    if (!this.phone.isValidNumber(this.state.mobileNum)) {
      alert("Please enter valid Mobile number.");
      return false;
    }
    const { state } = this.props.navigation;
    const userObj = {
      name: state.params.user.name,
      age: state.params.user.age,
      gender: state.params.user.gender,
      mobileno: this.state.mobileNum,

      location: state.params.user.city,
    };

    this.setState({ isLoading: true });
    var response = await this.props.registerUser(userObj);
    var responsePayload = response.payload;
    if (responsePayload.success === true) {
       mobileNm = responsePayload.mobileno;
      var userId = responsePayload.userId;
      await this.generateOTPFun(mobileNm, userId);
    }
  };

  async generateOTPFun(mobile, userId) {
    var timeOtp = new Date();
    var otpGenObj = {
      userId: userId,
      timestampOtp: timeOtp,
    };
   
    //await this.props.generateOTP(mobile, otpGenObj);
    await this.props.generateOTP(mobile, otpGenObj).then((response) => {
     
      if (response.payload.ok) {
        this.setState({
          mobileNum: mobileNm,
    isLoading:false,
    RequestId: response.payload.request_id,
          isModalVisible: true,
        });
      }
      else{
        alert(response.payload.msg.error_text);
        this.setState({
          userId: response.payload.userId,
    isLoading:false,
    RequestId: response.payload.request_id,
          isModalVisible: true,
        });
      }
  });
}
  toggleModal = () => {
    this.setState({ isModalVisible: false });
  };

  selectPhone(phone) {
    this.setState({
      mobileNum: this.phone.getValue(),
    });
  }

  componentDidMount() {
    const { state } = this.props.navigation;
  }
  componentWillMount() {
    this.listener = EventRegister.addEventListener("VALIDATE_OTP", (data) => {
      if (data.success === true) {
        const { navigate } = this.props.navigation;
        navigate("Login");
        this.setState({ isModalVisible: false });
        //alert("Mobile number update sucessfully, Please login again");
      }
    });
  }

  render() {
    return (
      
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f6f6f6",
        }}
      >
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.isLoading}
          onBackdropPress={() => this.setState({ isVisible: false })}
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

        <Modal
          style={{ margin: 0 }}
          coverScreen={true}
          animationType={"fade"}
          onBackButtonPress={() => this.toggleModal()}
          transparent={false}
          visible={this.state.isModalVisible}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#f6f6f6",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                height: 50,
                width: 50,
                marginTop: 20,
                marginStart: 20,
                backgroundColor: "#f6f6f6",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isModalVisible: !this.state.isModalVisible });
                }}
              >
                <Icon
                  name="angle-left"
                  size={35}
                  color="#000000"
                  type="font-awesome"
                />
              </TouchableOpacity>
            </View>
            <ResetNumberComponents
              mobile={this.state.mobileNum}
              name={this.state.name}
              age={this.state.age}
              location={this.state.city}
              RequestId={this.state.RequestId}
              userId ={this.state.userId}
              //sendData = {this.getData()}
            />
          </View>
        </Modal>
        <View>
          <Image
            source={require("../assets/images/icon.png")}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 24,
              color: "#161616",
              margin: 20,
            }}
          >
            Covid-19 Health Assistance
          </Text>
          <Text style={{ fontSize: 16, alignSelf: "center" , color:"#393939"}}>
            Please enter your mobile number to receive
          </Text>
          <Text style={{color:"#393939", fontSize: 14, alignSelf: "center" }}>
            one time password.
          </Text>
        </View>
        <View>
          <View style={styles.formRowCustom}>
            <Text style={styles.formLabel}>Enter Mobile Number</Text>
            <PhoneInput
              style={{
                height: 40,
                borderColor: "#e2e1e1",
                fontSize: 18,
                borderWidth: 1,
                marginTop: 1,
                paddingLeft: 10,
                backgroundColor: "#FFFFFF",
              }}
              initialCountry=" "
              flagStyle={{ fontSize: 18 }}
              textStyle={{ fontSize: 18 }}
              textProps={{ keyboardType: "number-pad", maxLength: 15 }}
              value={this.state.mobileNum}
              key={this.focusNumber}
              ref={(ref) => {
                this.phone = ref;
              }}
              onChangePhoneNumber={(phoneNumber) => {
                this.selectPhone(phoneNumber);
                this.setState({
                  enabled: true,
                });
              }}
            />
          </View>

          <Button
            buttonStyle={styles.Indivisualbutton}
            onPress={() => this.sentOtp()}
            style={{ paddingTop: 5 }}
            title="Send OTP"
            color="white"
          />
        
        </View>
       
      </View>
     
     
    );
  }
}
const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "column",
    margin: 20,
  },
  Indivisualbutton: {
    backgroundColor: "#007d79",
    borderColor: "#007d79",
    borderWidth: 2,
    borderRadius: 2,
    width: 325,
    height: 50,
    marginTop:200
    

  

  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  formRowCustom: {
    // flex: 1,
    // justifyContent: "flex-start",
    // alignItems: "stretch",
    // margin: 15,
    marginTop: 20,
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 5,
    color:"#393939"
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileNumberComponent);
