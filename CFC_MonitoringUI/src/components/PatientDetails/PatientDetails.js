import React from "react";
import moment from "moment";
import "./PatientDetails.scss";
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
  Toggle
} from "carbon-components-react";
import { LineChart } from "@carbon/charts-react";
import { getapi, postapi, putapi } from "../../services/webservices";
import { Link } from "react-router-dom";
import "@carbon/charts/styles.css";

class PatientDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 1,
      userDetail: {},
      disableRiskContainer: false,
      disableQuarantine: false,
      modal: false,
      patient: {},
      assigned: false,
      isNotificationOpen: false,
      dataLoader: true,
      comment: "",
      notificationText: '',
      doctorList: [],
      commentsList: [],
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
  }

  componentDidMount() {
    this.getCommentList();
    this.getDoctors();
    if (localStorage.getItem("user_details")) {
      const user_details = JSON.parse(localStorage.getItem("user_details"));
      this.setState({ userDetail: user_details, userType: user_details.usertype === "doctor" ? 1 : 2 });
    }

    const endpoint = `patients/${this.props.id}`;
    return getapi(endpoint).then(responseJson => {
      if (responseJson.docs) {
        this.setState({ patient: responseJson.docs[0] });
      }
      this.setState({ dataLoader: false });
    });
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

  /**
   * @method getCommentList
   * @description Get comments list of particular patient
   */
  getCommentList() {
    const endpoint = `patients/comment/${this.props.id}`;
    return getapi(endpoint).then(responseJson => {
      if (responseJson.responseCode !== "ERROR") {
        this.setState({ commentsList: responseJson.docs[0].doctorscreening });
      }
    });
  }

  /**
   * @method commentClk
   * @description Functionality when doctor comments
   */
  commentClk() {
    const endpoint = `patients/comment/${this.props.id}`;
    const reqObj = {
      comment: this.state.comment,
      timestamp: new Date().getTime(),
      doctor: this.state.userDetail.name
    };
    return postapi(endpoint, reqObj).then(responseJson => {
      if (responseJson.responseCode !== "ERROR") {
        this.setState({ comment: "" });
        this.getCommentList();
      }
    });
  }

  /**
   * @method handleChange
   * @description Set values when text value changes
   */
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
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
    const endpoint = `patients/assign-doctor/${this.props.id}`;
    const reqObj = {
      doctorId: val._id,
      operatorId: this.state.userDetail.id,
      timestamp: new Date().getTime(),
      operatorName: this.state.userDetail.name
    };

    return putapi(endpoint, reqObj).then(responseJson => {
      if (responseJson.responseCode !== "ERROR") {
        const { patient } = this.state;
        patient.doctorId = val._id;
        this.setState({
          assigned: true, isNotificationOpen: true, patient: patient,
          notificationText: `Dr. ${val.name} is assigned to ${patient.name}.`
        });
      }
    });
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

  close() {
    this.setState({ modal: false });
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
        if (obj.family.toLowerCase() === 'myself') {
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
        if(responseJson.ok) {
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
    const reqObj = {"isQuarantine": event};
    
    return putapi(endpoint, reqObj).then(responseJson => {
      this.setState({ disableQuarantine: false });
      if (responseJson.responseCode !== "ERROR") {
        if(responseJson.ok) {
          let { patient } = this.state;
          if(patient.qurantine) {
            patient.qurantine.isQurantine = event;
          } else {
            patient.qurantine = { isQurantine: event };
          }
          this.setState({ patient });
        }
      }
    });
  }

  render() {
    const { userType, doctorList, modal, isNotificationOpen, disableRiskContainer, disableQuarantine } = this.state;
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
        {dataLoader ? (
          <div className="loader-style">
            <Loading {...props()} />
          </div>
        ) : (
            <div className="some-content">
              <div className="mainbox">
                <div className="navigation">
                  <Link to="/dashboard">
                    <ChevronLeft20 /> <span>Back</span>
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
                          { this.getPatientSymptoms(patient).length ? 
                            this.getPatientSymptoms(patient).map((val, indx) => {
                              return(<div className="text-container" key={indx}>
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
                            <span className="txtdegree">o</span>C
                        </span>
                        </div>
                        <LineChart
                          data={this.state.data}
                          options={this.state.options}
                        ></LineChart>
                        <div className="bottom">
                          <Information20 />
                          <span>
                            98<span className="txtdegree">o</span>C is normal
                          temprature
                        </span>
                        </div>
                      </div>
                      <div className="chart">
                        <div className="title">
                          <Favorite20 /> <span>Heart Rate</span>
                        </div>
                        <LineChart
                          data={this.state.data}
                          options={this.state.options}
                        ></LineChart>
                        <div className="bottom">
                          <Information20 />
                          <span>Normal heart rate is between 70 and 100 Bpm</span>
                        </div>
                      </div>
                    </div>
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
                                  this.commentClk();
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
                      </div>
                    </div>
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