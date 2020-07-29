import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Picker,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { logout, generateOTP,fetchUser } from "../redux/ActionCreators";
import { updatePatientDetails, loginUser } from "../redux/ActionCreators";
import Camera from "./CameraComponent";
import { EventRegister } from "react-native-event-listeners";
import Icon from "react-native-vector-icons/FontAwesome";
import PhoneInput from "react-native-phone-input";
import Modal from "react-native-modal";
import ResetNumberComponents from "./ResetNumberComponent";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  loginUser: (userObj) => dispatch(loginUser(userObj)),
  updatePatientDetails: (userId, image, userObj) =>
    dispatch(updatePatientDetails(userId, image, userObj)),
  generateOTP: (mobilenum, userObj) =>
    dispatch(generateOTP(mobilenum, userObj)),
    fetchUser: (userId) => dispatch(fetchUser(userId)),
});
var isLogout = false;
class PersonalInformation extends Component {
  callBackPhoto = (imageUrl) => {
    this.setState({
      imageSteam: imageUrl,
      enabled: true,
    });
  };

  logout() {
    this.setState.flag = true;
    this.props.logout();
  }

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      name: "",
      age: "",
      mobile: "",
      city: "",
      emergencyContactNumber: "",
      imageSteam: "",
      enabled: false,
      pickerData: null,
      isModalVisible: false,
      isVisible: false,
      isLoading: false,
      RequestId: "",
      userId: "",
    };
    this.setState({
      showModal: false,
    });
  }

  updateDetails = async () => {
    var image = this.state.imageSteam;

    var userObj = {
      name: this.state.name,
      age: this.state.age,
      mobileno: this.state.mobileOld,
      location: this.state.city,
      emergencyContactNumber: this.state.emergencyContactNumber,
    };

    // if (this.phone.isValidNumber(this.state.mobile)) {
    //   alert("Please enter valid Mobile contact number.");
    //   return false;
    // }
   
    if (
      userObj.emergencyContactNumber &&
      !this.phone.isValidNumber(userObj.emergencyContactNumber)
    ) {
      alert("Please enter valid emergency contact number.");
      return false;
    }
    if (!(this.state.mobile === this.state.mobileOld)) {
    
      isLogout = true;
      await this.generateOTPFun(this.state.mobile, this.props.user.user.userId);
     
      return false;
    }
   

    this.setState({
      isLoading: true,
    });
    console.log("userObj", image, userObj);
    this.props.updatePatientDetails(
      this.props.user.user.userId,
      image,
      userObj
    );
  };

  async generateOTPFun(mobile, userId) {
    if(this.props.user.user.isAppLock){
      this.setState({
        isLoading:false,
              isModalVisible: true,
            });
    }
    else{
    var timeOtp = new Date();
    var otpGenObj = {
      userId: userId,
      timestampOtp: timeOtp,
    };
     await this.props.generateOTP(mobile, otpGenObj).then((response) => {
      
      if (response.payload.ok) {
        this.setState({
    isLoading:false,
    RequestId: response.payload.request_id,
          isModalVisible: true,
        });

        
        //alert("Otp has been sent ");
      } else {
        this.setState({ isModalVisible: true });
        alert(response.payload.msg.error_text);
      }
    });
  }
  }

  async updateUserProfile() {
    var image = this.state.imageSteam;
    var userObj = {
      name: this.state.name,
      age: this.state.age,
      mobileno: this.state.mobile,
      location: this.state.city,
      emergencyContactNumber: this.state.emergencyContactNumber,
    };

    await this.props.updatePatientDetails(
      this.props.user.user.userId,
      image,
      userObj
    );
  }

  componentWillMount() {
    this.listener = EventRegister.addEventListener("UPDATE_USER", (data) => {
      if (isLogout === false) {
        this.setState({
          isLoading: false,
        });
        const { navigate } = this.props.navigation;
        navigate("Home");
      }
    });

    this.listener = EventRegister.addEventListener("VALIDATE_OTP", (data) => {
      if (data.success === true) {
        this.setState({ isModalVisible: false });
        this.updateUserProfile();
        this.logout();

        // alert("Mobile number update sucessfully, Please login again");
      }
    });
  }

  resetForm() {
    this.state = {
      imageUrl: "",
      name: "",
      age: "",
      mobile: "",
      city: "",
      emergencyContactNumber: "",
      enabled: false,
      isVisible: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      pickerData: this.phone.getPickerData(),
    });
    this.focusListener = navigation.addListener("didFocus", () => {
      const { user } = this.props.user;
      this.mobileOld = user.mobileno;
      this.cameraCallback = true;
      this.setState({
        imageUrl: user.imageUrl,
        name: user.name,
        age: user.age,
        city: user.location,
        mobile: user.mobileno,
        mobileOld: user.mobileno,
        emergencyContactNumber: user.emergencyContactNumber,
        enabled: false,
      });
      this.focusNumber = Math.random();
    });
  }

  selectPhone(phone) {
    this.setState({
      emergencyContactNumber: this.phone.getValue(),
    });
  }

  selectMobileNum(phone) {
    this.setState({ mobileno: this.phone.getValue(), enabled: true });
  }

  toggleModal = () => {
    this.setState({ mobileno: this.state.mobileOld });
    this.setState({ isModalVisible: false });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { user } = this.props.user;
    var options =[];
     for(let i = 0; i < 121; i++){
      options.push(i.toString());
     }

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
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
                    this.setState({
                      isModalVisible: !this.state.isModalVisible,
                    });
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
               // mobile={this.state.mobile}
                mobile={user.mobileno}
                flag={true}
                RequestId={this.state.RequestId}
              />
            </View>
          </Modal>

          <View
            style={{
              flex: 1,
              paddingTop: 10,
              flexDirection: "row",
              textAlign: "left",
              marginTop: 10,
              marginStart: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigate("Home");
              }}
              style={{ marginLeft: 15, width: 25, height: 20, marginTop: 0 }}
            >
              <Icon
                name="angle-left"
                size={35}
                color="#000"
                type="font-awesome"
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 25,
                height: 35,
                marginLeft: 5,
                color: "#161616",
                fontWeight: "bold",
                textAlignVertical: "center",
                textAlign: "center",
              }}
              adjustsFontSizeToFit={true}
            >
              Profile
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.formRowCustomCamera}>
              <Camera

                healthStatus={user.healthstatus}
                userImage={this.state.imageUrl}
                key={this.focusNumber}
                callbackFromCamera={this.callBackPhoto}
                cameraCallback={this.cameraCallback}
              />
            </View>
            <View style={styles.formRowCustom}>
              <Text style={{ fontSize: 18, marginBottom: 5, marginTop: 0 }}>
                Full Name
              </Text>
              <TextInput
                value={this.state.name}
                style={{
                  height: 40,
                  borderColor: "#e2e1e1",
                  fontSize: 18,
                  borderWidth: 1,
                  marginTop: 1,
                  paddingLeft: 10,
                  backgroundColor: "#FFFFFF",
                }}
                onChangeText={(text) => {
                  this.setState({ name: text, enabled: true });
                }}
                placeholder="Enter Full Name"
              />
            </View>
            <View style={styles.formRowCustom}>
              <Text style={styles.formLabel}>Your Age </Text>
              <View
                style={{
                  height: 40,
                  borderColor: "#e2e1e1",
                  borderWidth: 1,
                  backgroundColor: "white",
                }}
              >


<Picker
   style={{flex:1}}
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
              <Text style={styles.formLabel}>Mobile Number</Text>
             
              <View
                style={{
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginTop: 5,
                  paddingLeft: 10,
                  fontSize: 18,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <PhoneInput
                  style={{
                    fontSize: 20,
                    backgroundColor: "#FFFFFF",
                    flex: 1,
                    marginBottom: 1,
                    borderColor: "gray",
                  }}
                  initialCountry=" "
                  flagStyle={{ fontSize: 18 }}
                  textStyle={{ fontSize: 18 }}
                  textProps={{ keyboardType: "number-pad", maxLength: 15 }}
                  value={this.state.mobile}
                  key={this.focusNumber}
                  ref={(ref) => {
                    this.phone = ref;
                  }}
                  onChangePhoneNumber={(mobile) => {
                    this.setState({
                      mobile: mobile,
                      enabled: true,
                      enableSave: true,
                    });
                  }} ///
                />
              </View>
            </View>
            <View style={styles.formRowCustom}>
              <Text style={styles.formLabel}>City or Zip Code</Text>
              <TextInput
                style={{
                  height: 40,
                  borderColor: "#e2e1e1",
                  borderWidth: 1,
                  marginTop: 5,
                  paddingLeft: 10,
                  fontSize: 18,
                  backgroundColor: "#FFFFFF",
                }}
                onChangeText={(city) => {
                  this.setState({
                    city: city,
                    enabled: true,
                    enableSave: true,
                  });
                }}
                value={this.state.city}
                placeholder="Enter City or Zip Code"
              />
            </View>

            <View style={styles.formRowCustom}>
              <Text style={styles.formLabel}>Emergency Contact Number</Text>

              <View>
                <View
                  style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    marginTop: 5,
                    paddingLeft: 10,
                    fontSize: 18,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <PhoneInput
                    style={{
                      fontSize: 20,
                      backgroundColor: "#FFFFFF",
                      flex: 1,
                      marginBottom: 1,
                      borderColor: "gray",
                    }}
                    initialCountry=" "
                    flagStyle={{ fontSize: 18 }}
                    textStyle={{ fontSize: 18 }}
                    textProps={{ keyboardType: "number-pad", maxLength: 15 }}
                    value={this.state.emergencyContactNumber}
                    key={this.focusNumber}
                    ref={(ref) => {
                      this.phone = ref;
                    }}
                    onChangePhoneNumber={(phoneNumber) => {
                      this.selectPhone(phoneNumber);
                      this.setState({
                        enabled: true,
                      });
                    }} ///
                  />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <View style={styles.formRowCustom}>
                <Button
                  buttonStyle={{
                    backgroundColor: "#FFFFFF",
                    color: "#007d79",
                    borderColor: "#007d79",
                    borderWidth: 2,
                  }}
                  titleStyle={{ color: "#007d79" }}
                  title="Cancel"
                  type="outline"
                  onPress={() => {
                    navigate("Home");
                  }}
                  style={{ paddingTop: 20 }}
                />
              </View>
              <View style={styles.formRowCustom}>
                <Button
                  buttonStyle={{
                    backgroundColor: "#007d79",
                    borderColor: "#ffffff00",
                    borderWidth: 2,
                  }}
                  titleStyle={{ color: "#FFFFFF" }}
                  type={this.state.enabled ? "outline" : "solid"}
                  onPress={() => this.updateDetails()}
                  title="Save"
                  style={{ paddingTop: 20 }}
                  disabled={!this.state.enabled}
                  activeOpacity={this.state.enabled ? 1 : 1}
                />
              </View>
            </View>

            <View style={styles.formRowCustom}>
              <Button
                buttonStyle={{
                  backgroundColor: "#007d79",
                  color: "#FFFFFF",
                  borderColor: "#007d79",
                }}
                onPress={() => this.logout()}
                title="Logout"
                style={{ paddingTop: 20 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 20,
  },
  formRowCustom: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: 15,
    marginTop: 15,
  },
  formRow: {
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 10,
  },
  formCol: {
    alignItems: "stretch",
    flex: 1,
    flexDirection: "column",
  },
  formLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  formItem: {
    flex: 1,
  },
  buttonColor: {
    color: "#007d79",
    borderColor: "#007d79",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#303838",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
  },
  modalLayout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BCD4",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: 80,
    marginLeft: 40,
  },
  PhoneInputInput: {
    height: 40,
  },
  formRowCustomCamera: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: 15,
    marginTop: 10,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalInformation);
