import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Linking } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import DosDonsComponent from './dosdons/DosDonsComponent';
import HeaderComponent from './header/HeaderComponent';
import RecommendationComponent from './recommendation/RecommendationComponent';
import Comments from './comments/CommentsComponent';
import StayHealthyComponent from './StayHealthyComponent.js';
import { fetchUser,fetchSosStatus,raiseSOSAPI } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import HealthData from './HealthDataComponent';
import RaiseSosComponent from './RaiseSosComponent';
import Icon from 'react-native-vector-icons/Feather';
import { Button,CheckBox } from 'react-native-elements';
import moment from "moment";
import { Notifications } from 'expo';

const whoUrl = "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public";
const cdcUrl = "https://www.cdc.gov/coronavirus/2019-ncov/index.html";
var hourDiffPositive = 4;
var hourDiffPossible = 8;
var hourDiffNone     = 24;
var fireTime = "";
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUser: (userId) => dispatch(fetchUser(userId)),
  fetchSosStatus: (userId) => dispatch(fetchSosStatus(userId)),
  raiseSOSAPI: (userId) => dispatch(raiseSOSAPI(userId)),
})


var radio_props = [
  {label: 'Raised it by mistake.', value: 0 },
  {label: 'I’m feeling better now, no need for assistance.', value: 1 },
  {label: 'Someone from medical assistance reached to me, now I’m feeling better.', value: 2 }
];
class DashboardPossible extends Component {

  callForNotifications(fireTime, timeDiff){
    this.sendNotification(fireTime, timeDiff);
   
  }

  getRegisterNotification=async()=>{
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
}
}
  
  sendNotification(fireTime, timeDiff){
    const notification = {
      title: 'AYWA-Alert',
      icon: "./assets/images/AppIcon.png",
      body: 'Greetings '+this.props.user.user.name+', you haven\'t uploaded your health data since last few hours. Please upload it.',
      android: { sound: true }, 
    };
 
    const options = {
      time: fireTime,
      trigger: {
        seconds: timeDiff,
        repeats: true
      },
    };
    const id = Notifications.scheduleLocalNotificationAsync(notification, options)
    Notifications.addListener(() => {
  
    });
  }


  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      activeIndex: 0,
      carouselItems: [
        {
          image: require('../assets/images/cdc.png'),
          title: "Centers for Disease Control and Prevention",
        },
        {
          image: require('../assets/images/who.png'),
          title: "World Health Organization",
        }
      ],
      isModalVisible: false,
      isModalVisibleRaised: false,
      timeStamp: null,
      reason:'',
      helplineNumber:null,
      isCancelSosModal: false,
      value: null,
      isCancelSosSuccessModal: false,
      isDisabledCancelSos: true
    }

    this.stateImage = {
      activeIndex: 0,
      carouselImageItems: [
        {
          //  image:require('../assets/images/distance.jpg'),  
          image: require('../assets/images/distance.jpg'),
          title: "Maintain Social Distance",
        },
        {
          // image:require('../assets/images/staysafe.jpg'),    
          image: require('../assets/images/stay-home.png'),
          title: "Stay Safe! Stay Home",
        },
        {
          // image:require('../assets/images/wash.jpg'),
          image: require('../assets/images/wash-hands.png'),
          title: "Wash Hands Regularly",
        }
      ]
    }
    
  }

  
  emitterByCheckHealthStatus(){
    if(this.props.user.user.healthstatus)
    {
      var hospitalDetails = JSON.stringify(this.props.user.user.hospital ); 
      var lastRecord = JSON.stringify(this.props.user.user.symptom.pop());
      var lastTime = JSON.parse(lastRecord.toString()).timestamp;
      var date = new Date(lastTime);
      fireTime = date;



      switch(this.props.user.user.healthstatus) {
        case "positive":
            var hourDiff = JSON.parse(hospitalDetails.toString()).positiveStatus;
            fireTime.setHours(fireTime.getHours() + hourDiff); 
            var timeDiff = this.hourToSec(hourDiff);  
            this.callForNotifications(fireTime, timeDiff);
            return ;

        case "possible":
             var hourDiff = JSON.parse(hospitalDetails.toString()).possibleStatus;
             fireTime.setHours( fireTime.getHours() + hourDiff);
             var timeDiff = this.hourToSec(hourDiff);
             this.callForNotifications(fireTime, timeDiff);
            return ;

        case "none" :
          var hourDiff = JSON.parse(hospitalDetails.toString()).noneStatus;   
            fireTime.setHours( fireTime.getHours() + hourDiff); 
             var timeDiff = this.hourToSec(hourDiff);
            this.callForNotifications(fireTime, timeDiff);   
            return ;  
            default:
            return;  
    }


  }
}
 
hourToSec(hourDiff){
  var timeDiff = hourDiff* 60 *60;
  return timeDiff;
}


 async componentDidMount() {
   this.getRegisterNotification();
    this.emitterByCheckHealthStatus();

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.props.fetchUser(this.props.user.user.userId);
      this.sendNotification(fireTime);
    });
}

  cardClickEventListener = (item) => {
    Alert.alert(item.name);
  }

  _renderItem({ item, index }) {
    return (
      <View style={{
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 5,
        height: 90,
        padding: 50,
        marginLeft: 12,
        marginRight: 9,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: 'center'
      }}>
        <Text>{item.text}</Text>
      </View>

    )
  }

  renderTags = (item) => {
    return item.tags.map((tag, key) => {
      return (
        <TouchableOpacity key={key} style={styles.btnColor} onPress={() => { this.tagClickEventListener(tag) }}>
          <Text>{tag}</Text>
        </TouchableOpacity>
      );
    })
  }

  renderHealthRecomendation({ item, index }) {
    return (
      <View
        style={{
          backgroundColor: '#ffffff',
        }}
        key={index}>
        <Image
          style={{ width: 130, height: 101, justifyContent: 'center', marginBottom: 10 }}
          source={item.image}
        />
        <Text style={{ marginLeft: 15, marginBottom: 15, color: '#343334', fontSize: 14, justifyContent: 'space-between' }}>{item.title} </Text>

      </View>

    )
  }

  renderOfficials({ item, index }) {
    return (
      <TouchableOpacity onPress={() => item.title === 'World Health Organization' ? this.onHandlePressWho(): this.onHandlePressCdc()}>
        <View

          style={{
            backgroundColor: '#ffffff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 5
          }}
          key={index}>
          <Image
            style={{ width: 80, height: 60 }}
            source={item.image}
          />
          <Text style={{ flex: 1, flexWrap: 'wrap' }}>{item.title}</Text>

        </View>
      </TouchableOpacity>


    )
  }

  onHandlePressWho() {
    Linking.openURL(whoUrl);
  }

  onHandlePressCdc() {
    Linking.openURL(cdcUrl);
  }


  onSOSCall = () => {
    this.props.fetchSosStatus(this.props.user.user.userId).then((response) => {
      if(response.res.isSosRaised){
        if(response.res.history.length != 0){
          let sosData = response.res.history.filter(function (e) {
            return e.comment == 'SOS Raised';
          });
          let time = sosData[sosData.length - 1].timestamp;
          let s = new Date(time);
          let timestamp =  moment(Number(s)).format("h:mm a, DD MMM YYYY");
          this.setState({timeStamp:timestamp});
          this.setState({helplineNumber:response.res.helplineNumber});
          this.setState({reason:sosData[sosData.length - 1].subComment});
          this.setState({isModalVisibleRaised: true,isModalVisible: false});
        }
      }else{
        this.setState({helplineNumber:response.res.helplineNumber});
        this.setState({isModalVisible: true,isModalVisibleRaised: false});
      }
    });
  };
  toggleModal = () => {
    this.setState({isModalVisible: false,isModalVisibleRaised:false,isCancelSosModal:false,isCancelSosSuccessModal:false,value:null,isDisabledCancelSos:true});
  }
  getData = (data)=>{
    if(data === false){
      this.setDataForRaisedAPI();
    }
  }
  setDataForRaisedAPI = ()=>{
    this.props.fetchSosStatus(this.props.user.user.userId).then((response) => {
      let resp = response.res.isSosRaised;
      if(resp){
        if(response.res.history.length != 0){
          let sosData = response.res.history.filter(function (e) {
            return e.comment == 'SOS Raised';
          });
          let time = sosData[sosData.length - 1].timestamp;
          let s = new Date(time);
          let timestamp =  moment(Number(s)).format("h:mm a, DD MMM YYYY");
          this.setState({timeStamp:timestamp});
          this.setState({helplineNumber:response.res.helplineNumber});
          this.setState({reason:sosData[sosData.length - 1].subComment});
          this.setState({isModalVisibleRaised: true,isModalVisible: false});
        }
      }
  });
  };
  
  dialCall = () => {
    let phoneNumber = 'tel:${' + this.state.helplineNumber + '}';
    Linking.openURL(phoneNumber);
  };
  cancelSOSFunc = () => {
    this.setState({isCancelSosModal: true,isModalVisibleRaised:false});
  };
  cancelSosApi = () => {
    let Obj = {id:null,reason:'',sosStatus:true};
    Obj.id = this.props.user.user.userId;
    if(this.state.value == 0){
      Obj.reason = radio_props[0].label; 
   }
   if(this.state.value == 1){
    Obj.reason = radio_props[1].label; 
   }
   if(this.state.value == 2){
    Obj.reason = radio_props[2].label; 
   }
    this.props.raiseSOSAPI(Obj).then((response) => {
      if (response.ok === true) {
        this.setState({isCancelSosModal: false,isCancelSosSuccessModal:true});
      }
    });
  };
  cancelSosModal = () => {
    this.setState({isCancelSosModal: false,isModalVisibleRaised:true,value:null,isDisabledCancelSos:true});
  }
  
  render() {
    if(this.state.value != null){
      this.state.isDisabledCancelSos = false;
    }
    const { navigate } = this.props.navigation;
    const { value } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#f6f6f6"}}>
         <TouchableOpacity
          style={styles.sosButton}
          onPress={this.onSOSCall}
        >
        <Image source={require('../assets/images/SOS.png')} />
        </TouchableOpacity>
        <HeaderComponent navigation={navigate} />
        <Modal isVisible={this.state.isModalVisible} onBackButtonPress={() => this.toggleModal()} transparent={false} customBackdrop={<View style={{flex: 1,backgroundColor:'#fff'}} />} coverScreen={true} style={styles.modalLayout}>
            <View style={{ flex: 1 }}>
            <View style={{ alignSelf: 'flex-end'}}>
              <Button
                icon={
                  <Icon
                    name="x"
                    size={24}
                  />
                }
                title=""
                type="clear"
                onPress={this.toggleModal}
              />
              </View>
              <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
              <RaiseSosComponent sendData={this.getData}/>
            <View style={styles.customBox} >
              <View style={{ marginTop: 21, marginLeft: 20, marginRight: 19 }}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>Connect with Medical Assistance or Physician</Text>
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 5 }}>
                <Icon name="phone" size={17} style={{ marginTop: 13, marginRight: 6 }} />
              <Text style={styles.underlineTextContainer} onPress={this.dialCall}>{this.state.helplineNumber}</Text>
              </View>
            </View>
            </ScrollView>
            </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisibleRaised} onBackButtonPress={() => this.toggleModal()} transparent={false} customBackdrop={<View style={{ flex: 1, backgroundColor: '#fff' }} />} coverScreen={true} style={styles.modalLayout}>
          <View style={{ flex: 1 }}>
            <View style={{ alignSelf: 'flex-end'}}>
              <Button
                icon={
                  <Icon
                    name="x"
                    size={24}
                  />
                }
                title=""
                type="clear"
                onPress={this.toggleModal}
              />
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1, backgroundColor: '#ffffff' }} >
                    <View style={{ flex: 1}}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#161616'}}>
                            Raise an SOS
                        </Text>
                    </View>
                    <View style={{ flex: 9 }}>
                      <Text style={{fontSize: 16,marginTop:18}}>Your SOS has been registered and someone will get in touch with you soon !</Text>
                      <Text style={{fontSize: 14,marginTop: 2,color: '#707070'}}>{this.state.timeStamp }</Text>
                    </View>
                    <View>
                        <Text style={{fontWeight: 'bold',fontSize: 16,color: '#da1e28',marginTop:30}}>SOS Reason :</Text>
                        <Text style={{fontSize: 16,color: '#393939'}}>{this.state.reason}</Text>
                        <Text>{"\n"}</Text>
                    </View>
                    <View style={styles.formRowCustom}>
                        <View style={styles.customBox} >
                            <View style={{marginTop:21,marginLeft:20,marginRight:19}}>
                                <Text style={{fontSize: 16,textAlign: 'center'}}>If there is an emergency, you can connect with Medical Assistance or Physician </Text>
                            </View>
                            <View style={{ flexDirection: 'row',alignSelf:'center',marginTop:5 }}>
                                <Icon name="phone" size={17} style={{marginTop:13,marginRight:6}}/>
                                <Text style={styles.underlineTextContainer} onPress={this.dialCall}>{this.state.helplineNumber}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.formRowCustom, { marginTop: 27.4 }} >
                      <Button
                        buttonStyle={styles.buttonColor}
                        onPress={this.cancelSOSFunc}
                        title='Cancel SOS'
                      />
                    </View>
                </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal isVisible={this.state.isCancelSosModal} onBackButtonPress={() => this.toggleModal()} transparent={false} customBackdrop={<View style={{ flex: 1, backgroundColor: '#fff' }} />} coverScreen={true} style={styles.modalLayout}>
          <View style={{ flex: 1 }}>
            <View style={{ alignSelf: 'flex-end'}}>
              <Button
                icon={
                  <Icon
                    name="x"
                    size={24}
                  />
                }
                title=""
                type="clear"
                onPress={this.toggleModal}
              />
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1, backgroundColor: '#ffffff' }} >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#161616' }}>
                    Cancel SOS
                  </Text>
                </View>
                <View style={{ flex: 9 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 18 }}>Are you sure you want to cancel SOS?</Text>
                </View>
                <View style={styles.formRowCustom}>
                  <View style={styles.customBox} >
                    <View style={{ marginTop: 13, marginLeft: 16,marginBottom:13}}>
                      <Text style={{ fontSize: 14, color: '#707070' }}>{this.state.timeStamp}.</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#da1e28', marginTop: 6, marginBottom: 6 }}>SOS Reason :</Text>
                      <Text style={{ fontSize: 16, color: '#393939' }}>{this.state.reason}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 9 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 18 }}>Reason for canceling SOS</Text>
                  <View style={styles.containerRadio}>
                    <View style={{ flexDirection: 'row' }}>
                      <CheckBox
                        checkedIcon={<Image source={require('../assets/images/checked.png')} style={{height:26,width:26}}/>}
                        uncheckedIcon={<Image source={require('../assets/images/unchecked.png')} style={{height:26,width:26}} />}
                        checked={this.state.value == radio_props[0].value}
                        onPress={() => this.setState({ value: radio_props[0].value })}
                        checkedColor="#007d79"
                      /><Text style={styles.checkboxText}>{radio_props[0].label}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={{ flexDirection: 'row' }}>
                      <CheckBox
                        checkedIcon={<Image source={require('../assets/images/checked.png')} style={{height:26,width:26}}/>}
                        uncheckedIcon={<Image source={require('../assets/images/unchecked.png')} style={{height:26,width:26}} />}
                        checked={this.state.value == radio_props[1].value}
                        onPress={() => this.setState({ value: radio_props[1].value })}
                        checkedColor="#007d79"
                      /><Text style={styles.checkboxText}>{radio_props[1].label}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={{ flexDirection: 'row' }}>
                      <CheckBox
                        checkedIcon={<Image source={require('../assets/images/checked.png')} style={{height:26,width:26}}/>}
                        uncheckedIcon={<Image source={require('../assets/images/unchecked.png')} style={{height:26,width:26}} />}
                        checked={this.state.value == radio_props[2].value}
                        onPress={() => this.setState({ value: radio_props[2].value })}
                        checkedColor="#007d79"
                      /><Text style={styles.checkboxText}>{radio_props[2].label}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.formRowCustom, { marginTop: 27.4 }} >
                      <Button
                        buttonStyle={styles.buttonColor}
                        onPress={this.cancelSosApi}
                        title='Cancel SOS'
                        disabled={this.state.isDisabledCancelSos}
                      />
                </View>
                <View style={styles.formRowCustom}>
                <TouchableOpacity onPress={this.cancelSosModal}>
                  <Text style={styles.underLineText}>Don’t want to cancel SOS</Text>
                </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal isVisible={this.state.isCancelSosSuccessModal} onBackButtonPress={() => this.toggleModal()} transparent={false} customBackdrop={<View style={{ flex: 1, backgroundColor: '#ffffff' }} />} coverScreen={true} style={styles.modalLayout}>
          <View style={{ flex: 1 }}>
            <View style={{ alignSelf: 'flex-end'}}>
              <Button
                icon={
                  <Icon
                    name="x"
                    size={24}
                  />
                }
                title=""
                type="clear"
                onPress={this.toggleModal}
              />
            </View>
            <View style={{ flex: 1, backgroundColor: '#ffffff' }} >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#161616' }}>
                  Cancel SOS
                </Text>
                {/* </View> */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ marginBottom: 309, marginTop: 161 }}>
                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 16, color: '#161616', margin: 20 }}>
                      SOS cancelled successfully.
                    </Text>
                    <Button
                      buttonStyle={styles.goHomeButtonStyle}
                      onPress={this.toggleModal}
                      style={{ paddingTop: 5 }}
                      title='Go back to home'
                      color='#ffffff'
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
          {this.props.user.user.doctorId ?<Comments /> : <View/>}
          <RecommendationComponent navigation={navigate} />
          <View style={{ height: 180, marginBottom: 40 }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, color: '#393939', marginBottom: 15, marginTop: 20 }}>
              What you should do?
              </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.stateImage.carouselImageItems}
                renderItem={this.renderHealthRecomendation}
                sliderWidth={130}
                itemWidth={130}
                itemHeight={152}
                sliderHeight={152}
                layout={"default"}
                slideStyle={{ marginRight: 15 }}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                loop={false}
              >
              </Carousel>
            </View>
          </View>  
          <StayHealthyComponent />
          <View style={{ height: 150, marginTop: 5 }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, color: '#393939', marginBottom: 15, marginTop: 20 }}>
              Trush Official Source of Information Only
              </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.carouselItems}
                renderItem={this.renderOfficials.bind(this)}
                sliderWidth={270}
                itemWidth={270}
                itemHeight={70}
                sliderHeight={70}
                layout={"default"}
                inactiveSlideScale={0.9}
                inactiveSlideOpacity={0.7}
                loop={false}
              >
              </Carousel>
            </View>
          </View>
          <DosDonsComponent />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
  title: {
    textAlign: 'center',
    marginVertical: 5,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    borderBottomColor: '#e2e1e1',
    borderBottomWidth: 1,
    marginTop:2,
    marginBottom:2
},
  formContent: {
    flexDirection: 'row',
    marginTop: 30,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconBtnSearch: {
    alignSelf: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: 'center'
  },
  notificationList: {
    marginTop: 20,
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 20,
    marginLeft: 20,
    alignSelf: 'center',
    color: "#00BFFF",
    fontWeight: '100',
  },
  btnColor: {
    padding: 10,
    borderRadius: 40,
    marginHorizontal: 3,
    backgroundColor: "#eee",
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 30,
    color: "#FFFFFF",
    marginTop: 10,
  },
  postContent: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff'
  },

  postDescription: {
    fontSize: 16,
    marginTop: 20,
  },
  tags: {
    color: '#00BFFF',
    marginTop: 10,
  },
  date: {
    color: '#696969',
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#00BFFF",
    flex: 9,
    marginLeft: 1
  },
  profile: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: "center",
    padding: 20,
    height: 145,
    justifyContent: 'space-between'
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  buttonClick: {
    backgroundColor: '#0198a2',
    borderColor: '#007d79',
    borderWidth: 2,
    borderRadius: 2,
    height: 34,
    width: 218,
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 30,
    marginBottom: 10
  },
  sosButton: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:55,
    position: 'absolute',                                          
    bottom: 100,                                                    
    right: 40,
    height:55,
    backgroundColor:'#da1e28',
    borderRadius:100,
    zIndex:1
  },
  modalLayout: {
    backgroundColor: '#ffffff'
  },
  containerRadio: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 12,
    marginLeft:-10
},
formRowCustom: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 15
},
buttonColor: {
    backgroundColor: '#007d79',
    borderColor: '#007d79',
    borderWidth: 2,
    borderRadius: 2,
    height: 50.6
},
customBox:{
    //height:120,
    backgroundColor: '#f8f8f8',
    borderColor: '#f2f2f2',
    borderWidth: 1
},
underlineTextContainer: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
    color:'#161616',
    marginTop:10,
    marginBottom:10
},
underLineText: {
  fontSize: 14,
  textDecorationLine: 'underline',
  color: '#007d79',
  textAlign: 'center',
},
  text: {
    fontSize: 18,
  },
  checkboxText: {
    fontSize:14,
    marginLeft:-10,
    marginTop:15,
    fontSize: 14,
    color: '#393939',
    flex:1
},
goHomeButtonStyle: {
  backgroundColor: '#007d79',
  borderColor: '#007d79',
  borderWidth: 2,
  borderRadius: 2,
  width: 325,
  height: 50
},
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPossible);