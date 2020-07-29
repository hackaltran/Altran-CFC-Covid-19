import React, { Component } from "react";
import moment from 'moment';
import "./PatientList.scss";
import  {configSetting } from '../../AppConfiguration.js';
import notification_logo from '../../assets/images/notification.png';
import socketIOClient from "socket.io-client";


import {
  Tile,
  Dropdown,
  Search,
  Loading
} from "carbon-components-react";
import { Location16, WarningFilled20, Search24, Information16, Warning16,WarningAlt16,WarningAltFilled16,WarningAltInvertedFilled24} from '@carbon/icons-react';
import { getapi } from '../../services/webservices';
import { Link } from "react-router-dom";
import PatientDetails from "../PatientDetails/PatientDetails";

const socket = socketIOClient(configSetting.BASE_URL);


class PatientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 1,
      isSearchBoxOpen: false,
      patientsCount: 0,
      patientsList: [],
      dataLoader: true,
      patientdetail: false,
      filterDropdownValue: 'all',
      filterTextValue: '',
      sosCount:0,
      counter:0
    }
    this.setSOSAlertCallBackValue = this.setSOSAlertCallBackValue.bind(this)
    const socket = socketIOClient(configSetting.BASE_URL);
    socket.on("get_all_patients", data => {
     if(this.state.userType === 1){
     this.getRefreshDataFromServer();
     }
     });
  }

 async componentDidMount() {
  this.getRefreshDataFromServer() 
  try {
    setInterval(async () => {
      if(this.state.counter === 0){
        this.setState({counter:1})
      } else {
        this.setState({counter:0})
      }
    }, configSetting.animationTimer);
  } catch(e) {
    console.log(e);
  }
  }
  componentWillMount(){
    window.location.reload(true);
  }
 
  getRefreshDataFromServer() {
    let endpoint = '';
    if(localStorage.getItem('user_details')) {
      const user_details = JSON.parse(localStorage.getItem('user_details'));
      this.setState({userType: user_details.usertype === 'doctor' ? 1 : 2});
      if(user_details.usertype === 'doctor') {
        endpoint = this.props.userStatus === 'All' ? 'doctors/103/'+user_details.id : (this.props.userStatus === 'Positive' ? 'doctors/101/'+user_details.id : 'doctors/102/'+user_details.id);
      } else {
        endpoint = this.props.userStatus === 'All' ? 'patients/status/103' : (this.props.userStatus === 'Positive' ? 'patients/status/101' : 'patients/status/102');
      }
    }
    return getapi(endpoint)
    .then(responseJson => {
        this.setState({dataLoader: false});
        if(responseJson.docs) {
          const possibleCount = responseJson.docs.filter(value => value.healthstatus === 'possible').length;
          const positiveCount = responseJson.docs.filter(value => value.healthstatus === 'positive').length;

          this.setState({ patientsList: responseJson.docs, patientsCount: responseJson.docs.length  });
          if(this.props.userStatus === 'All'){
          this.checkSOS(possibleCount,positiveCount);
          }
        }
    })
  }

  searchBtnClick = () => {
    this.setState({ isSearchBoxOpen: true });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      patientdetail:
        nextProps.match &&
        nextProps.match.params &&
        nextProps.match.params.patientid
    };
  }

  /**
   * @method checkSOS
   * @description Props to send to parent for sos count
   */
  checkSOS = (possibleCount,positiveCount) => {
    const highRiskSOSCount = this.state.patientsList.filter(value => (value.isSosRaised === true) && (value.healthstatus === 'positive')).length;
    const mediumRiskSOSCount = this.state.patientsList.filter(value => (value.isSosRaised === true) && (value.healthstatus ==='possible')).length;
    const normalSOSCount = this.state.patientsList.filter(value => (value.isSosRaised === true) && (value.healthstatus ==='none')).length;
    const allPatientsRiskSOSCount = normalSOSCount + highRiskSOSCount + mediumRiskSOSCount;
    const totalSOSCount = this.state.patientsList.filter(value => (value.isSosRaised === true)).length;
    this.setState({ sosCount: totalSOSCount });
    this.props.getSosCount({highRiskSOSCount,mediumRiskSOSCount,possibleCount,positiveCount,allPatientsRiskSOSCount});
  }


  /**
   * @method getLastUpdatedInfo
   * @param value 
   * @description Function to get last updated info from patient detail 
   */
  getLastUpdatedInfo(value) {
    if(value.currentAssign.toLowerCase() === 'operator') {
      if(value.assignedByDoctor && value.assignedByDoctor.hasOwnProperty('name')) {
        return (value.assignedByDoctor.name+', '+this.generateTimeFormat(value.assignedByDoctor.timestamp));
      } else {
        return (value.name+', '+this.generateTimeFormat(value.timestamp))
      }
    } else if(value.currentAssign.toLowerCase() === 'doctor') {
      if(value.assignedByOperator && value.assignedByOperator.hasOwnProperty('name')) {
        return (value.assignedByOperator.name+', '+this.generateTimeFormat(value.assignedByOperator.timestamp));
      } else {
        return (value.name+', '+this.generateTimeFormat(value.timestamp))
      }
    } else {
      return (value.name+', '+this.generateTimeFormat(value.timestamp))
    }
  }

  /**
   * 
   * @param timestamp 
   * @description Function to generate time format from timestamp
   */
  generateTimeFormat(timestamp) {
    return moment(Number(timestamp)).format('h:mm a, DD MMM');
  }

  /**
   * @method getTravelHistory
   * @param value 
   * @description Function to get travel history from patient detail
   */
  getTravelHistory(value) {
    if (value.symptom && value.symptom.length) {
      return value.symptom[value.symptom.length-1].travelled;
    } else return 'None';
  }

  /**
   * @method filterText
   * @description Set variable when search text field value changes
   */
  filterText(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  /**
   * @method filterSelect
   * @description Set variable when dropdown value changes
   */
  filterSelect(event) {
    this.setState({ filterDropdownValue: event.selectedItem.id });
  }

  /**
   * @method filterPatientList
   * @description Filter patient list on text field change
   */
  filterPatientList() {
    const { patientsList, userType, filterTextValue } = this.state;
    let filteredPatientsList = patientsList;
    if(filterTextValue !== '') {
      const filterkey = userType === 1 ? 'name' : '_id';
      filteredPatientsList = patientsList.filter(x => x[filterkey].toLowerCase().includes(filterTextValue.toLowerCase()));
    }     
    return this.filterByDropdown(filteredPatientsList);
  }

  /**
   * @method filterByDropdown
   * @param list 
   * @description Filter patient list on selected dropdown value
   */
  filterByDropdown(list) {
    const { filterDropdownValue } = this.state;
    if(filterDropdownValue === 'morbidity') {
      return list.filter(x => x.morbidity !== 'none');
    } else if(filterDropdownValue === 'quarantine') {
      return list.filter(x => (x.qurantine && x.qurantine.isQurantine));
    } else if(filterDropdownValue === 'all') {
      return list; 
    }
  }

  /*Set the SOS Alert Notificaition*/
  setSOSAlertCallBackValue(value){
   this.props.sosAlertCallBack(value)
  }

  render() {

    const { userType, isSearchBoxOpen, patientsCount, patientsList, dataLoader, filterTextValue } = this.state;
    const { userStatus } = this.props;

    const filterItems = [
      {
        id: 'morbidity',
        text: 'Morbidity',
      },
      {
        id: 'quarantine',
        text: 'Quarantine',
      },
      {
        id: 'all',
        text: 'All',
      }
    ];

    const loadingProps = () => ({
      active: true,
      withOverlay: false,
      small: false
    });

    return (
      <React.Fragment>
        {dataLoader ? <div className='loader-style'><Loading {...loadingProps()} /></div> :
        !this.state.patientdetail ? (<div>
          <div className="bx--row row-margin">
            <div className="col-lg-6 patient-count">
              {userStatus === 'All' ? 
                <p className="header-title">Showing All {patientsCount} Patients</p> : userStatus === 'Possible' ?
                <p className="header-title">Showing {patientsCount} Medium Risk Patients</p> : userStatus === 'Positive'?  <p className="header-title">Showing {patientsCount} High Risk Patients</p> :null
              }
            </div>
            <div className={`col-lg-6 ${isSearchBoxOpen ? 'search-filter-content' : 'search-filter-flex'}`}>
              { isSearchBoxOpen ? 
                <Search id="filterTextValue" value={filterTextValue} labelText="Search Patients" placeHolderText="What are you looking for today?" className="search_box"
                onChange={this.filterText.bind(this)} /> : 
                <Search24 className="search_icon" onClick={() => { this.searchBtnClick() }} />
              }
              <Dropdown
                items={filterItems}
                id="dropdown-search"
                label= "Filter"
                className="dropdown-search"
                itemToString={item => (item ? item.text : '')}
                onChange={this.filterSelect.bind(this)}
              />
            </div>
          </div>      
          {userType === 2 ? 
            <div className="bx--row">
              <div className="box-container">
                <div className="green-bg-color identity-cont"></div>
                <span>Normal</span>
              </div>
              <div className="box-container">
                <div className="yellow-bg-color identity-cont"></div>
                <span>Medium Risk</span>
              </div>
              <div className="box-container">
                <div className="red-bg-color identity-cont"></div>
                <span>High Risk</span>
              </div>
            </div> : null 
          }
          <div className="patients_card_view_container">    
            {userType === 1 ? 
              this.filterPatientList().map((value, index) => {
                return(
                  <Link to={`/patientdetail/${value._id}`} key={index}>
                    <Tile className="doctor-card-view">
                      {value.isSosRaised === true && value.assignedByOperator.isnewPatient === false ?  
                        <div className="alert_style">
                          <span className="alert_label">1 SOS</span>
                        </div> : null 
                      }
                      { value.doctorId.length > 0 && value.assignedByOperator.isnewPatient === true?
                       <div className="new_alert_style">
                       <span className="new_alert_label">New</span>
                      </div> : null
                      }
                      {value.isSosRaised === true && value.assignedByOperator.isnewPatient === true ?  
                        <div className="alert_style_new_sos">
                          <span className="alert_label">1 SOS</span>
                        </div> : null 
                      }
                      <div className="name_risk_style">
                        <span className={`name_title ${value.healthstatus === 'positive' ? 'red-color' : (value.healthstatus === 'possible' ? 'yellow-color' : 'green-color')}`}>{value.name}</span>
                      </div>
                      <div>
                        <span className="patient-id">{value._id}</span>
                        {value.qurantine && value.qurantine.isQurantine ? 
                          <div className="title_strip">Home Quarantine</div> : null
                        }
                      </div>
                      <div className="patient_box">
                        <p className="label_title">Gender</p>
                        <p className="label_value">{value.gender}</p>
                      </div>
                      <div className="patient_box">
                        <p className="label_title">Age</p>
                        <p className="label_value">{value.age} years</p>
                      </div>
                      <div className="patient_box">
                        <p className="label_title">Travel History</p>
                      <p className="label_value">{this.getTravelHistory(value)}</p>
                      </div>
                      <div className="patient_box">
                        <p className="label_title">COVID-19 Status</p>
                        <p className="label_value">{value.healthstatus}</p>
                      </div>
                      <p><Location16 /> <span className="location-style">497 Evergreen Rd, Roseville, CA 95673</span></p>
                      <p className="time-updated"><Information16 /> Last updated by {this.getLastUpdatedInfo(value)}</p>
                    </Tile>
                  </Link>
                )
              }) : 
              this.filterPatientList().map((value, index) => {
                return(
                  <Link to={`/patientdetail/${value._id}`} key={index}>
                    <div 
                    className={`operator-card-view ${value.healthstatus === 'positive' ? 'red-bg-color' : (value.healthstatus === 'possible' ? 'yellow-bg-color' : 'green-bg-color')}`}
                    >

                      
                      {value.isSosRaised == true && this.state.counter === 1?
                       <div className="sos-alert-notify"><img className="notify-img"  src= {notification_logo} alt="pic" /></div>:null
                      }

{value.isSosRaised == true  && this.state.counter === 0 ? 
                        <div className="sos-alert">
                          <WarningFilled20 className="sos-icon" />
                        </div> : null 
                      }
                  
                      <span className="id-style">#{value._id}</span>
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>) : <PatientDetails {...this.props} setSOSAlertCallBackValue={ this.setSOSAlertCallBackValue} id={this.state.patientdetail} />
        }
      </React.Fragment>
    );
  }
}

export default PatientList;
