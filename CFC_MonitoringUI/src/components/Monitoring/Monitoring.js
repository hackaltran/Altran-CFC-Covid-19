import React, { Component } from "react";
import "./Monitoring.scss";
import { Tabs, Tab, Tile,ToastNotification } from "carbon-components-react";
import { Content } from "carbon-components-react/lib/components/UIShell";
import SideMenu from "../SideMenu/SideMenu";
import PatientList from "../PatientList/PatientList";


class Monitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabType: 'All',
      sosCount: 0,
      possibleCount: 0,
      isNotificationOpen: false,
      positiveCount:0,
      highRiskSOSCount:0,
      mediumRiskSOSCount:0,
      allPatientsRiskSOSCount:0
    }
    this.handleSosCount = this.handleSosCount.bind(this);
    this.callbackFunction = this.callbackFunction.bind(this);
  }
  /*Update the Notification Alert Variable*/
  callbackFunction = (isOpen) => {
    this.setState({isNotificationOpen: isOpen})
 }
 componentDidMount() {
  this.setState({isNotificationOpen: false})

 }

  /**
   * @method tabClk
   * @param type 
   * @description Handle tab click functionality
   */
  tabClk(type) {
    const tabChange = type === this.state.tabType ? false : true;
      if(tabChange) {
        this.setState({ tabType: type });
      }
  }

 
  /**
   * @method 
   * @param {Data to find sos count from list} data 
   */
  handleSosCount(data) {
    this.setState({highRiskSOSCount: data.highRiskSOSCount, possibleCount: data.possibleCount,mediumRiskSOSCount:data.mediumRiskSOSCount,allPatientsRiskSOSCount:data.allPatientsRiskSOSCount});
  }

   /**
   * @method notificationClose
   * @description Handle to close notification alert
   */
  notificationClose() {
    this.setState({ isNotificationOpen: false });
  }


  render() {
    const {tabType, highRiskSOSCount,mediumRiskSOSCount, possibleCount,positiveCount,isNotificationOpen,allPatientsRiskSOSCount} = this.state;
    const notificationProps = () => ({
      kind: 'success',
      lowContrast: false,
      title: `SOS Status:`,
      subtitle:'SOS Status has changed',
      hideCloseButton: false,
      onCloseButtonClick: this.notificationClose.bind(this),
	    timeout:5000,
    });
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    return (
      <React.Fragment>
        <SideMenu history={this.props.history} />
        <Content className="content-block">
          <Tile className="tile-block">
            <p className="tabs-header">Patients Dashboard</p>
           { user_details.usertype !== 'admin' && user_details.usertype !== 'Admin' ?
            <div>
           { isNotificationOpen? <div className="notify"><ToastNotification className="notify1" {...notificationProps()} /></div>:null}
            {/* All Patient Risk SOS Count */}
           {allPatientsRiskSOSCount>0? <div className="all_sos_alert_container">
             <span className="alert_label_all">{allPatientsRiskSOSCount} SOS</span></div>:null}
            {/* High Risk SOS Count */}
            {highRiskSOSCount>0? <div className="sos_alert_container">
             <span className="alert_label">{highRiskSOSCount} SOS</span></div>:null} 
            {/* Medium Risk SOS Count */}
            {mediumRiskSOSCount>0 ?
            <div className="sos_possible_pat">
             <span className="possible_pat_label">{mediumRiskSOSCount} SOS</span>
            </div>:null}

            <Tabs className="tabs-style">
              <Tab id="tab-1" label="All Patients" className="tab-list" onClick={() => { this.tabClk('All') }}>
                {tabType === 'All' ? <div className="some-content"><PatientList {...this.props} sosAlertCallBack={this.callbackFunction} userStatus={tabType} getSosCount={this.handleSosCount} /></div> : null }
              </Tab>
              <Tab id="tab-2" label="High Risk" className="tab-list" onClick={() => { this.tabClk('Positive') }}>
                {tabType === 'Positive' ? <div className="some-content"><PatientList {...this.props} sosAlertCallBack={this.callbackFunction} userStatus={tabType} getSosCount={this.handleSosCount} /></div> : null }
              </Tab>
              <Tab id="tab-3" label="Medium Risk" className="tab-list" onClick={() => { this.tabClk('Possible') }}>
                {tabType === 'Possible' ? <div className="some-content"><PatientList {...this.props} sosAlertCallBack={this.callbackFunction}   userStatus={tabType} getSosCount={this.handleSosCount} /></div> : null }
              </Tab>
            </Tabs>
            </div> : ''}
          </Tile>
        </Content>
      </React.Fragment>
    );
  }
}

export default Monitoring;
