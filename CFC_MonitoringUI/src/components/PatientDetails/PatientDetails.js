import React from "react";
import moment from "moment";
import "./PatientDetails.scss";
import { configSetting } from '../../AppConfiguration.js';
import socketIOClient from "socket.io-client";


import {
  ChevronLeft20,
  TemperatureHot20,
  Favorite20,
  Information20,
  CircleFilled20,
  ArrowRight20,
  NotebookReference20,
  PillsSubtract20,
  Calendar20,
  User20
} from "@carbon/icons-react";
import {
  TextArea,
  Loading,
  Modal,
  Dropdown,
  Button,
  InlineNotification,
  Tile,
  RadioButtonGroup,
  RadioButton,
  Toggle,
  Tabs,
  Tab
} from "carbon-components-react";
import { LineChart } from "@carbon/charts-react";
import { getapi, postapi, putapi } from "../../services/webservices";
import { Link } from "react-router-dom";
import "@carbon/charts/styles.css";
import { placeholder } from "@babel/types";
import Messages from "./../Messages";
import Input from "./../Input";
 const socket = socketIOClient(configSetting.BASE_URL);

class PatientDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 1,
      userDetail: {},
      disableRiskContainer: false,
      disableQuarantine: false,
      modal: false,
      sosModel: false,
      patient: {},
      sosReason: '',
      assigned: false,
      isNotificationOpen: false,
      isSOSNotificationOpen: false,
      dataLoader: true,
      sosComments: '',
      comment: "",
      notificationText: '',
      doctorList: [],
      commentsList: [],
      chatMessages: [],
      isChecked: false,
      emergencyTextValue: 'Show Emergency Contact',
      isMarkAsAttended: false,
      temperatureData: [],
      heartRateData: [],
      messages: [],
      member: {
      },
      data: [
        {
          group: "Dataset 1",
          date: "2020-04-01T18:30:00.000Z",
          value: 96
        },
        {
          group: "Dataset 1",
          date: "2020-04-02T18:30:00.000Z",
          value: 95
        },
        {
          group: "Dataset 1",
          date: "2020-04-03T18:30:00.000Z",
          value: 98
        },
        {
          group: "Dataset 1",
          date: "2020-04-04T18:30:00.000Z",
          value: 99
        },
        {
          group: "Dataset 1",
          date: "2020-04-05T18:30:00.000Z",
          value: 100
        },
        {
          group: "Dataset 1",
          date: "2020-04-06T18:30:00.000Z",
          value: 102
        },
        {
          group: "Dataset 1",
          date: "2020-04-07T18:30:00.000Z",
          value: 105
        }
      ],
      options: {
        title: "",
        axes: {
          bottom: {
            title: "",
            mapsTo: "date",
            scaleType: "time"
          },
          left: {
            mapsTo: "value",
            title: "",
            scaleType: "linear"
          }
        },
        curve: "curveMonotoneX",
        height: "177px"
      }
    };
    this.handleChange = this.handleChange.bind(this);
    socket.on("chat message", function (object) {
      const messages = this.state.chatMessages;
      messages.push(object);
      this.setState({ messages });

    }.bind(this));
  }
  
  //Life Cycle
  componentDidMount() {
    this.getDoctors();
    if (localStorage.getItem("user_details")) {
      const user_details = JSON.parse(localStorage.getItem("user_details"));
      this.setState({ userDetail: user_details, userType: user_details.usertype === "doctor" ? 1 : 2 });
    }

    const endpoint = `patients/${this.props.id}`;
    return getapi(endpoint).then(responseJson => {
      if (responseJson.docs) {
        this.setState({ patient: responseJson.docs[0] });
        this.getCommentList(responseJson.docs[0].history, false);
        if (this.state.userType === 1 && this.state.patient.assignedByOperator.isnewPatient === true) {
          this.updateNewStatus();
        }
        this.setState({
          member: {
            id: this.state.patient.doctorId,
            patientName: this.state.patient.name,
          }
        });
        this.getAllChat();
      }
      this.setState({ dataLoader: false });
      this.getSymptonData();
    });
  }

  onSendMessage = (message) => {
    const object = {
      text: message,
      timestamp: new Date().getTime(),
      doctorId: this.state.userDetail.id,
      patientId:this.state.patient._id,
    };
    socket.emit('chat message', object);
  }

  getSymptonData() {
    var heartRateGraphData = [];
    var bodyTempGraphData = [];
    var symptomArray = this.state.patient.symptom;
    if (symptomArray == null) {
      return;
    }
    if (symptomArray.length) {
      symptomArray.forEach((item, i) => {
        var a = moment(item.timestamp, 'x')
        var timeLabel = a.format("YYYY-MM-DDThh:mm:ss.000Z")
        let temp = this.getTemperature(item.temperature);
        if (temp < 95) temp = 95;
        if (temp > 105) temp = 105;

        let heartRate = this.getHeartRate(item.heart_rate);
        if (heartRate < 60) heartRate = 60;
        if (heartRate > 114) heartRate = 114;

        var bodyData = {
          "group": "Dataset 1",
          "date": item.timestamp,
          "value": temp
        }

        var heartData = {
          "group": "Dataset 1",
          "date": item.timestamp,
          "value": heartRate
        }
        heartRateGraphData.push(heartData);
        bodyTempGraphData.push(bodyData);
      })

      this.setState({ heartRateData: heartRateGraphData });
      this.setState({ temperatureData: bodyTempGraphData });
    }
  }

  getTemperature = (string) => {
    if(!string){
      return string;
    }
    let value;
    switch (string.toLowerCase(string)) {
      case 'normal':
      case 'fine':
      case 'correct':
      case 'no fever':
      case 'normal':
        value = 97.3;
        break;
      case 'medium':
      case 'mediumsized':
        value = 99.1;
        break;
      case 'high':
      case 'high fever':
      case 'feeling low':
      case 'little bit':
      case 'a little':
      case 'yeah':
        value = 100.8;
        break;
      case 'very high':
      case 'very high fever':
      case 'too much':
      case 'feeling sick':
        value = 103.55;
        break;
      default:
        value = parseFloat(string);
    }
    return value;
  }

  getHeartRate = (string) => {
    if(!string){
      return string;
    }
    let value;
    switch (string.toLowerCase(string)) {
      case 'low':
        value = 64.5;
        break;
      case 'normal':
        value = 74.5;
        break;
      case 'medium':
        value = 82.5;
        break;
      case 'high':
        value = 74.5;
        break;
      case 'very high':
        value = 106;
        break;
      default:
        value = parseFloat(string);
    }
    return value;
  }

  /**
   * @method getDoctors
   * @description API implementation to get the doctors list
   */
  getDoctors() {
    const endpoint = `doctors`;
    return getapi(endpoint).then(responseJson => {
      if (responseJson.responseCode !== "ERROR") {
        this.setState({ doctorList: responseJson.docs });
      }
    });
  }

   updateNewStatus() {
    const endpoint = `patients/updateNewStatus/${this.props.id}`;
    const reqObj = {
      status: false
    };
    return putapi(endpoint, reqObj).then(responseJson => {
      if (responseJson.responseCode !== "ERROR") {
        let endpoint = '';
        if (localStorage.getItem('user_details')) {
          const user_details = JSON.parse(localStorage.getItem('user_details'));
          if (user_details.usertype === 'doctor') {
            endpoint = 'doctors/103/' + user_details.id;
            socket.emit('register', endpoint);
          }
        }
      }
    });
  }

  /**
   * @method getCommentList
   * @description Get comments list of particular patient
   */
  getCommentList(list, isFetch) {
    if (isFetch == true) {
      const endpoint = `patients/comment/${this.props.id}`;
      return getapi(endpoint).then(responseJson => {
        if (responseJson.responseCode !== "ERROR") {
          this.setState({ commentsList: responseJson.docs[0].history });
          this.getPatientReason();
        }
      });
    } else {
      this.setState({ commentsList: list });
      this.getPatientReason();
    }
  }

  /**
   * @method commentClk
   * @description Functionality when doctor comments
   */
  commentClk(isTapped, reqObject) {
    const endpoint = `patients/comment/${this.props.id}`;
    const reqObj = reqObject;
    return postapi(endpoint, reqObj).then(responseJson => {
      if (responseJson.responseCode !== "ERROR") {
        this.setState({ comment: "" });
        this.getCommentList(null, true);
        if (reqObj.subComment !== null) {
          if (isTapped == false) {
            this.props.setSOSAlertCallBackValue(true)
            this.setState({ isMarkAsAttended: true })
            try {
              setInterval(async () => {
                window.location.reload(true);
              }, configSetting.notificationDismissTimer);
            } catch (e) {
              console.log(e);
            }

            //APi to update SOS Status
          }
        }
      }
    });
  }

  /**
   * @method handleChange
   * @description Set values when text value changes
   */
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value, sosComments: event.target.value });
  }

  /**
   * @method generateTimeFormat
   * @param timestamp 
   * @description Function to generate time format from milliseconds
   */
  generateTimeFormat(timestamp) {
    return moment(Number(timestamp)).format("h:mm a, DD MMM YYYY");
  }

  /**
   * @method assign
   * @param val 
   * @param event 
   * @description Function to assign doctor to particular patient
   */
  assign(val, event) {
    var name = val.name;
    const endpoint = `patients/assign-doctor/${this.props.id}`;
    const reqObj = {
      doctorId: val._id,
      operatorId: this.state.userDetail.id,
      timestamp: new Date().getTime(),
      operatorName: this.state.userDetail.name,
      isnewPatient: true,
    };
    return putapi(endpoint, reqObj).then(responseJson => {
      if (responseJson.responseCode !== "ERROR") {
        const reqObject = {
          comment: 'Assigned to ' + name + ' for more actions',
          subComment: "",
          timestamp: new Date().getTime(),
          doctor: this.state.userDetail.name
        };
        this.commentClk(true, reqObject);
        const { patient } = this.state;
        patient.doctorId = val._id;
        this.setState({
          assigned: true, isNotificationOpen: true, patient: patient,
          notificationText: `Dr. ${val.name} is assigned to ${patient.name}.`
        });
        if (this.state.userType === 2) {
          let endpoint = '';
          if (localStorage.getItem('user_details')) {
            const user_details = JSON.parse(localStorage.getItem('user_details'));
              endpoint = 'doctors/103/' + user_details.id;
              socket.emit('register', endpoint);
          
          }
        }
      }
    });
  }

   getAllChat() {
    const endpoint = `patients/chat/${this.props.id}`;
    return getapi(endpoint).then(responseJson => {
      if (responseJson.responseCode !== "ERROR") {
        const array = responseJson.docs[0].doctorscreening;
        console.log(array);
        this.setState({ chatMessages: responseJson.docs[0].doctorscreening });
      }
    });
  }

  /* SOS Alert Box Submit Button Action*/
  sosSubmit(event) {
    const reqObject = {
      comment: 'SOS Attented',
      subComment: this.state.sosComments,
      timestamp: new Date().getTime(),
      doctor: this.state.userDetail.name
    };
    this.commentClk(false, reqObject);
    this.sosClose();
  }

  /*SOS Box Cancel Action */
  sosCancel(val, event) {
    this.setState({ sosModal: false });
  }

  /**
   * @method selection
   * @description Open modal on specific value when selected doctor
   */
  selection(event) {
    if (event.selectedItem.text === "Doctor") {
      this.setState({ modal: true, assigned: false });
    }
  }

  selection1(event) {
    this.setState({ sosModal: true, assigned: false });
  }

  /*Pop Alert Cancel Button Action*/
  close() {
    this.setState({ modal: false });
  }
  /*SOS Alert Dismiss Button Action*/
  dismisBtnTapped(e, event) {
    window.location.reload(true);
  }

  /*SoS View Close Button*/
  sosClose() {
    this.setState({ sosModal: false });
  }

  /**
   * @method notificationClose
   * @description Handle to close notification alert
   */
  notificationClose() {
    this.setState({ isNotificationOpen: false });
  }

  /**
   * @method getPatientSymptoms
   * @param value 
   * @description Get patient symptoms from details
   */
  getPatientSymptoms(value) {
    let symptoms = [];
    if (value.symptom) {
      value.symptom.forEach((obj) => {
        if (obj.family && obj.family.toLowerCase() === 'myself') {
          symptoms.push({ name: obj.experience });
        }
      })
    }
    return symptoms;
  }

  /**
   * @method checkQuarantineDays
   * @param value 
   * @description Function to get days from 2 timestamps
   */
  checkQuarantineDays(value) {
    let currentDate = moment(new Date().getTime());
    let start = moment(value.qurantine.start);
    let end = moment(value.qurantine.end);
    return {
      completed: currentDate.diff(start, 'days'),
      remaining: end.diff(currentDate, 'days')
    };
  }

  /**
   * @method changeRisk
   * @param event 
   * @description API implementation when risk change of particular patient
   */
  changeRisk(event) {
    this.setState({ disableRiskContainer: true });
    const endpoint = `patients/assign-risk/${this.props.id}`;
    const reqObj = {
      "risk": event === 'high' ? 101 : (event === 'medium' ? 102 : 103)
    };

    return putapi(endpoint, reqObj).then(responseJson => {
      this.setState({ disableRiskContainer: false });
      if (responseJson.responseCode !== "ERROR") {
        if (responseJson.ok) {
          let { patient } = this.state;
          patient.healthstatus = event === 'high' ? 'positive' : (event === 'medium' ? 'possible' : 'none');
          this.setState({ patient });
        }
      }
    });
  }

  /**
   * @method changeQuarantine
   * @param event 
   * @description API implementation when quarantine status changed of patient
   */
  changeQuarantine(event) {
    this.setState({ disableQuarantine: true });
    const endpoint = `patients/assign-quarantine/${this.props.id}`;
    const reqObj = { "isQuarantine": event };

    return putapi(endpoint, reqObj).then(responseJson => {
      this.setState({ disableQuarantine: false });
      if (responseJson.responseCode !== "ERROR") {
        if (responseJson.ok) {
          let { patient } = this.state;
          if (patient.qurantine) {
            patient.qurantine.isQurantine = event;
          } else {
            patient.qurantine = { isQurantine: event };
          }
          this.setState({ patient });
        }
      }
    });
  }
  /**
   * @method Emergency Button Action
   * @param event 
   * @description Action To Show Contact Number
   */
  emergencyBtnClick = (e, event) => {
    e.target.className = "emergency-value-contact-style"
    if (event.emergencyContactNumber.length > 0) {
      this.setState({ emergencyTextValue: event.emergencyContactNumber });
    } else {
      this.setState({ emergencyTextValue: '' });
    }
  };
  /*Get Patient SOS Reason*/
  getPatientReason() {
    this.state.commentsList.forEach(element => {
      if (element.patientId == this.state.patient._id) {
        this.setState({ sosReason: element.subComment })
      }
    });

  }
  /*Back Button Action*/
  backButtonTapped(event) {
    this.props.setSOSAlertCallBackValue(false)
  }
  render() {
    socket.on("new user", msg => {
    });
   
    if (!this.state.temperatureData.length)
      return null;

    const { userType, doctorList, modal, sosModel, isNotificationOpen, disableRiskContainer, disableQuarantine } = this.state;
    const items = userType === 1 ? [
      {
        id: "option-2",
        text: "Hospital Emergency"
      },
      {
        id: "option-3",
        text: "Hospital Admission"
      },
      {
        id: "option-4",
        text: "Psychologist (Counseling)"
      }
    ] : [
        {
          id: "option-1",
          text: "Doctor"
        },
        {
          id: "option-2",
          text: "Hospital Emergency"
        },
        {
          id: "option-4",
          text: "Psychologist (Counseling)"
        }
      ]
    const sosListItems = [
      {
        id: "option-1",
        text: "Mark as SOS attended"
      }
    ]
    const props = () => ({
      active: true,
      withOverlay: false,
      small: false
    });
    const { patient, dataLoader, comment, commentsList, notificationText } = this.state;
    const modalprops = () => ({
      className: "some-class",
      open: true,
      passiveModal: true,
      modalHeading: (isNotificationOpen ? <InlineNotification {...notificationProps()} /> : '' + "Select Doctor"),
      onRequestClose: this.close.bind(this)
    });
    const sosModalprops = () => ({
      className: "sos-alert-class",
      open: true,
      passiveModal: true,
      modalHeading: ("Mark as SOS attented"),
      onRequestClose: this.sosClose.bind(this)
    });

    const notificationProps = () => ({
      kind: 'success',
      lowContrast: false,
      title: `${notificationText}`,
      hideCloseButton: false,
      onCloseButtonClick: this.notificationClose.bind(this)
    });
    const toggleProps = () => ({
      labelA: 'Off',
      labelB: 'On',
      onToggle: this.changeQuarantine.bind(this),
    });

    return (
      <React.Fragment>
        {modal ?
          <Modal {...modalprops()}>
            <div className="datatable">
              <div className="header">
                <div className="unit">Doctor ID</div>
                <div className="unit">Doctor name</div>
                <div className="unit">Action</div>
                <div className="clearfix"></div>
              </div>
              <div className="datarow">
                {doctorList.length > 0 &&
                  doctorList.map((val, key) => {
                    return (
                      <div key={key} className="row">
                        <div className="unit">{val._id}</div>
                        <div className="unit">{val.name}</div>
                        <div className="unit">
                          {(patient.doctorId && patient.doctorId === val._id) ? (
                            <Button className="assignbtn disable" disabled>
                              Assign
                            </Button>
                          ) : (
                              <Button
                                onClick={this.assign.bind(this, val)}
                                className="assignbtn"
                              >
                                Assign
                              </Button>
                            )}
                        </div>
                        <div className="clearfix"></div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Modal> : null
        }
        {this.state.sosModal ?
          <Modal {...sosModalprops()}>
            <div className="datatable1">
              <div className="header1">
                <div className="entry1">
                  <div className="entrybox1">
                    <TextArea
                      className="textarea1"
                      labelText=""
                      id="comment"
                      placeholder="Add Comment"
                      value={comment}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="datarow1">
                <div className="row1">
                  <div className="unit1">
                    <Button
                      onClick={this.sosCancel.bind(this)}
                      className="cancelbtn" >
                      Cancel
                              </Button>
                  </div>
                  <div className="unit1">
                    <Button
                      onClick={this.sosSubmit.bind(this)}
                      className="submitbtn"
                    >
                      Submit
                              </Button>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </Modal> : null
        }
        {dataLoader ? (
          <div className="loader-style">
            <Loading {...props()} />
          </div>
        ) : (
            <div className="some-content">
              <div className="mainbox">
                <div className="navigation">
                  <Link to="/dashboard">
                    <ChevronLeft20 /> <span onClick={this.backButtonTapped.bind(this)}>Back</span>
                  </Link>
                  <div className="refer">
                    <NotebookReference20 /> <span>Refer to another Hospital</span>
                    <div className="selection">
                      <Dropdown
                        items={items}
                        id="dropdown-assign"
                        name="dropdown"
                        label="Assign to"
                        onChange={this.selection.bind(this)}
                        className="dropdown-assign"
                        itemToString={item => (item ? item.text : "")}
                      />
                    </div>
                  </div>
                </div>

                {patient.isSosRaised == true ?
                  <div className="sos-alert-view">
                    <div className="sos-left-border"></div>
                    <div className="sos-alert-label">SOS Alert:</div>
                    <div className="sos-alert-label-value"><p className="sos-alert-label-value-1">{this.state.sosReason}</p></div>
                    {this.state.isMarkAsAttended === true ? <div className="dismiss" onClick={(e) => { this.dismisBtnTapped(e, patient) }} style={{ cursor: 'pointer' }}><u>Dismiss</u></div>
                      : null}
                    {this.state.isMarkAsAttended === false ? <div className="selection1">
                      <Dropdown
                        items={sosListItems}
                        id="dropdown-sos"
                        name="dropdown"
                        label="Take Action"
                        selectedItem=""
                        onChange={this.selection1.bind(this)}
                        className="dropdown-assign-sos"
                        itemToString={item => (item ? item.text : "")}
                      />
                    </div> : null
                    }
                    {this.state.isMarkAsAttended === true ? <div className="selection1">
                      <Dropdown
                        items={sosListItems}
                        id="dropdown-sos"
                        name="dropdown"
                        label="Mark as Attented"
                        onChange={this.selection1.bind(this)}
                        className="dropdown-assign-sos-selected"
                        itemToString={item => (item ? item.text : "")}
                      />
                    </div> : null}
                  </div> : null
                }
                <div className="maincover">
                  {patient.qurantine && patient.qurantine.isQurantine ? (
                    <div className="homeqstatus">Home Quarantine</div>
                  ) : null}
                  <div className="header">
                    <div className="namenid">
                      <div
                        className={`name ${
                          patient.healthstatus === "positive"
                            ? "red-color"
                            : patient.healthstatus === "possible"
                              ? "yellow-color"
                              : "green-color"
                          }`}
                      >
                        {patient.name}
                      </div>
                      <div className="id">{patient._id}</div>
                      <div className="id">Contact No. <span className="phn">{patient.mobileno}</span></div>
                      {/* /* Add Emergency Contact Numher */}
                      <div className="emergency-contact-style" onClick={(e) => { this.emergencyBtnClick(e, patient) }} style={{ cursor: 'pointer' }}>{patient.emergencyContactNumber.length > 0 ? this.state.emergencyTextValue : ''}</div>
                    </div>
                    <div className="tabdesc">
                      <div className="desc">
                        <div className="desctitle">Gender</div>
                        <div className="descdetail">{patient.gender}</div>
                      </div>
                      <div className="desc">
                        <div className="desctitle">Age</div>
                        <div className="descdetail">{patient.age} years</div>
                      </div>
                      <div className="desc travel">
                        <div className="desctitle">Travel History</div>
                        <div className="descdetail">Italy</div>
                      </div>
                      <div className="desc test">
                        <div className="desctitle">COVID-19 Status</div>
                        <div className="descdetail text-transform">{patient.healthstatus}, on 10 Apr 2020</div>
                      </div>
                      <div className="desc travel">
                        <div className="desctitle">Other Disease</div>
                        <div className="descdetail text-transform">{patient.morbidity}</div>
                      </div>
                      <div className="desc">
                        <div className="desctitle">Location</div>
                        <div className="descdetail">Roseville, CA</div>
                      </div>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div className="detail">
                    <div className="charts">
                      <div className="head">Health Status</div>
                      <Tile className="symptom-card">
                        {userType === 1 ?
                          <div>
                            <div className="bx--row row-padding head-margin">
                              <User20 />
                              <span className="icon-label">Risk</span>
                            </div>
                            <div className="bx--row row-padding">
                              <RadioButtonGroup
                                legend="Group Legend"
                                name='Risk levels'
                                className={`risk-group ${disableRiskContainer ? 'button-disabled' : ''}`}
                                valueSelected={patient.healthstatus === "positive"
                                  ? "high"
                                  : patient.healthstatus === "possible"
                                    ? "medium"
                                    : "low"}
                                onChange={this.changeRisk.bind(this)} >
                                <RadioButton value="high" id="high"
                                  labelText="High" />
                                <RadioButton
                                  value="medium"
                                  id="medium"
                                  labelText="Medium"
                                />
                                <RadioButton value="low" id="low"
                                  labelText="Low" />
                              </RadioButtonGroup>
                            </div>
                          </div>
                          : null
                        }
                        <div className="bx--row row-padding head-margin">
                          <PillsSubtract20 />
                          <span className="icon-label">Symptoms</span>
                        </div>
                        <div className="bx--row row-padding medicine-containers">
                          {this.getPatientSymptoms(patient).length ?
                            this.getPatientSymptoms(patient).map((val, indx) => {
                              return (<div className="text-container" key={indx}>
                                <span className="text-label">{val.name}</span>
                              </div>)
                            }) : <span className="icon-label">None</span>
                          }
                        </div>

                        <div className="bx--row row-padding head-margin">
                          <Calendar20 />
                          <span className="icon-label">
                            Islolation/Quarantine Days
                          </span>
                          {userType === 1 ?
                            <Toggle
                              className={`quarantine-toggle ${disableQuarantine ? 'button-disabled' : ''}`}
                              defaultToggled={(patient.qurantine && patient.qurantine.isQurantine) ? patient.qurantine.isQurantine : false}
                              {...toggleProps()}
                              id="quarantine-toggle"
                            /> : null
                          }
                        </div>
                        <div className="bx--row row-padding">
                          {(patient.qurantine && patient.qurantine.isQurantine) ?
                            <div>
                              <span className="icon-label web-color">{this.checkQuarantineDays(patient).completed} days Completed</span>
                              <span className="icon-label">({this.checkQuarantineDays(patient).remaining} days remaining)</span>
                            </div> :
                            <span className="icon-label">None</span>
                          }
                        </div>
                      </Tile>
                      <div className="chart">
                        <div className="title">
                          <TemperatureHot20 />
                          <span>
                            Body Temprature in{" "}
                            <span className="txtdegree">o</span>F
                        </span>
                        </div>
                        <LineChart
                          data={this.state.temperatureData}
                          options={this.state.options}
                        ></LineChart>
                        <div className="bottom">
                          <Information20 />
                          <span>
                            98<span className="txtdegree">o</span>F is normal
                          temprature
                        </span>
                        </div>
                      </div>
                      <div className="chart">
                        <div className="title">
                          <Favorite20 /> <span>Heart Rate</span>
                        </div>
                        <LineChart
                          data={this.state.heartRateData}
                          options={this.state.options}
                        ></LineChart>
                        <div className="bottom">
                          <Information20 />
                          <span>Normal heart rate is between 70 and 100 Bpm</span>
                        </div>
                      </div>
                    </div>
                    { userType === 1 ?
                    <div className="timeline">
                      
                      
                      <Tabs className="tabs-style">
                        <Tab id="tab-1" label="Patient History" className="tab-list" >
                          {<div className="some-content">                     <div className="timebox">
                            {commentsList.map((value, index) => {
                              return (
                                <div
                                  key={index}
                                  className={`timeboxdetail ${
                                    index !== commentsList.length - 1 ? "bdrl" : ""
                                    }`}
                                >
                                  <div className="timedetail">
                                    <div className="timeicon">
                                      <CircleFilled20 />
                                    </div>
                                    <div className="detail">
                                      {value.comment}
                                      {value.subComment !== null ?
                                        <p className="subcomment">{value.subComment}</p> : null
                                      }
                                      <p className="time">
                                        By {value.doctor} {this.generateTimeFormat(value.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {userType === 1 ? (
                              <div className="entry">
                                <div className="entrybox">
                                  <ArrowRight20
                                    onClick={() => {
                                      const reqObject = {
                                        comment: comment,
                                        subComment: "",
                                        timestamp: new Date().getTime(),
                                        doctor: this.state.userDetail.name
                                      };

                                      this.commentClk(true, reqObject);
                                    }}
                                  />
                                  <TextArea
                                    className="textarea"
                                    labelText=""
                                    id="comment"
                                    value={comment}
                                    onChange={this.handleChange}
                                  />
                                </div>
                              </div>
                            ) : null}
                          </div></div>}
                        </Tab>
                        <Tab id="tab-2" label="Advice to Patient" className="tab-list">
                          {<div className="some-content">

                            {/* My codeeeee goess */}
                            <div className="App">
                              <div className="App-header">
                                <div>This advice will send directly to {patient.name}</div>
                              </div>
                              <Messages
                                messages={this.state.chatMessages}
                                currentMember={this.state.member}
                              />
                              <Input
                                onSendMessage={this.onSendMessage}
                              />
                            </div>
                          </div>}
                        </Tab>
                      </Tabs>
        </div>: null }
                 { userType === 2 ? 
                  <div className="timeline">
                   <div className="head">Patient History</div>
                   <div className="timebox">
                     {commentsList.map((value, index) => {
                       return (
                         <div
                           key={index}
                           className={`timeboxdetail ${
                             index !== commentsList.length - 1 ? "bdrl" : ""
                             }`}
                         >
                           <div className="timedetail">
                             <div className="timeicon">
                               <CircleFilled20 />
                             </div>
                             <div className="detail">
                               {value.comment}
                               {value.subComment !== null ?
                                 <p className="subcomment">{value.subComment}</p> : null
                               }
                               <p className="time">
                                 By {value.doctor} {this.generateTimeFormat(value.timestamp)}
                               </p>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div></div>
            
:null
                 }               
                    <div className="clearfix"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </React.Fragment>
    );
  }
}

export default PatientDetails;