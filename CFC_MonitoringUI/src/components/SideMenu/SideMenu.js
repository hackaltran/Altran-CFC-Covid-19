import React, { Component } from 'react';
import { View, Text, FlatList,ScrollView } from "react-native";

import Popup from "reactjs-popup";
import './SideMenu.scss';
import notification_icon from '../../assets/images/notification_bell.png';
import setting_icon from '../../assets/images/setting.png';
import {scroll,ToastNotification, Tile, Dropdown } from "carbon-components-react";
import { getapi } from '../../services/webservices';
import { Link } from "react-router-dom";
import {
    Header,
    HeaderName,
    SideNav,
    SideNavItems,
    SideNavLink,
    HeaderGlobalBar,
    HeaderGlobalAction,
    HeaderPanel,
    Switcher,
    SwitcherItem
} from 'carbon-components-react/lib/components/UIShell';
import { Events32, HelpFilled32, Settings32, Menu16, UserAvatar16, ChevronDown16 } from '@carbon/icons-react';
import PatientList from '../PatientList/PatientList';
import socketIOClient from "socket.io-client";
import { thresholdScott } from 'd3';
import { configSetting } from '../../AppConfiguration.js';

const socket = socketIOClient(configSetting.BASE_URL);


class SideMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sideTabType: this.props.history.location.pathname.split('/')[1],
            isPanelOpen: false,
            isSideNavOpen: true,
            userDetail: {},
            patientList:[],
            newPatientList:[],
            currentTime:'',
            subTitle:'',
            isOpenDetailNotification:false,
            isUpdate:false,
        }
        this.logoutClk = this.logoutClk.bind(this);
        this.menuClk = this.menuClk.bind(this); 
        this.crossBtnTapped = this.crossBtnTapped.bind(this); 
        socket.on("get_all_patients", data => {
          if(data === null){
            return;
          }
          const patientArray = data;
          patientArray.sort(function(a, b) {
            a = new Date(a.assignedByOperator.timestamp);
            b = new Date(b.assignedByOperator.timestamp);
            return a>b ? -1 : a<b ? 1 : 0;
        });
          this.state.patientList.slice(0,this.state.patientList.length);
          this.setState({patientList:patientArray});
          const newPatientArray = patientArray;
          this.setState({subTitle:this.getAlertSubtitleText()});
      });      
    }
    componentDidMount() {
        this.getRefreshDataFromServer();
        if (localStorage.getItem("user_details")) {
            const user_details = JSON.parse(localStorage.getItem("user_details"));
            this.setState({ userDetail: user_details });
        }
        if(localStorage.getItem("filteredPatientList")){
            const list = JSON.parse(localStorage.getItem("filteredPatientList"));
            this.setState({patientList:list,subTitle:this.getAlertSubtitleText()});
    
        }
    }
    
    getRefreshDataFromServer() {
        let endpoint = '';
        if(localStorage.getItem('user_details')) {
          const user_details = JSON.parse(localStorage.getItem('user_details'));
          if(user_details.usertype === 'doctor') {
            endpoint =  'doctors/103/'+user_details.id ;
            socket.emit('register',endpoint);
          } 
        }
      }
      
    /**
     * @method switchSideTab
     * @param type
     * @description Page navigation when switching between options in side menu
     */
    switchSideTab = (type) => {
        const sideTabChange = type === this.state.sideTabType ? false : true;
        if(sideTabChange) {
            this.setState({ sideTabType: type });
            this.props.history.push('/'+type);
        }
    }

    /**
     * @method rightPanelClk
     * @description Function to handle top right panel in header
     */
    rightPanelClk = () => {
        this.setState({ isPanelOpen: !this.state.isPanelOpen });
    }

    /**
     * @method logoutClk
     * @description Handle logout functionality
     */
    logoutClk(event) {
        event.preventDefault();
        localStorage.removeItem('user_details');
        this.props.history.push('/login');
    }

    /**
     * @method menuClk
     * @description Open and cluse side menu
     */
    menuClk(event) {
        event.preventDefault();
        this.setState({ isSideNavOpen: !this.state.isSideNavOpen });
    }

    crossBtnTapped(event){
        this.setState({isOpenDetailNotification:false});
    }

    /*Get Alert Subtitle Text*/
    getAlertSubtitleText(){
    if(this.state.patientList.length == 0){
        return;
    }
       var nameArray = new Array
        this.state.patientList.forEach(element => {
           nameArray.push(element.name)
       });
       var suttitleString = "";
      const reducedString = nameArray.reduce((result,item) => `${result},${item}`)
      nameArray.length > 2 ? suttitleString = nameArray[0] + "," +nameArray[1] +  "..." + (nameArray.length - 2) +"more are assigned to you":nameArray.length == 1 ?  suttitleString = reducedString + " is assigned to you": suttitleString = reducedString + " are assigned to you";
      return suttitleString;
    }

    /*Notification Alert ViewAll Tapped*/
    viewAllButtonTapped(event){
      this.setState({isOpenDetailNotification:true});
    }
    
    convertTimeStampToDate(timeStamp){
        if (timeStamp !== null) {
        var now = new Date(),
        secondsPast = (now.getTime() - timeStamp) / 1000;
      if (secondsPast < 60) {
        return parseInt(secondsPast) + 's' + ' ago';
      }
      if (secondsPast < 3600) {
        return parseInt(secondsPast / 60) + 'm' + ' ago';
      }
      if (secondsPast <= 86400) {
        return parseInt(secondsPast / 3600) + 'h' + ' ago';
      }
      if (secondsPast > 86400) {
        var d = new Date(timeStamp);
        
       const  difference = now.getDate() - d.getDate();
       var Difference_In_Time = now.getTime() - d.getTime(); 
  
       // To calculate the no. of days between two dates 
       var differenceDays = Math.trunc(Difference_In_Time / (1000 * 3600 * 24));
       
        if (differenceDays == '1') {
        return differenceDays + "day ago" ;
        } else {
            return differenceDays + "days ago" ;
        }
      }
        }
        return '';
    }
    ;  

    render() {
        const { sideTabType, isPanelOpen, isSideNavOpen, userDetail,patientList,response } = this.state;
        const notificationProps = () => ({
            kind: 'success',
            lowContrast: false,
            title: this.state.patientList.length+' New Patient Assigned',
            subtitle:this.state.subTitle,
            hideCloseButton: false,
            caption:false,
            timeout:6000,
          });
        const PopupDropDown = () => (
            <Popup  trigger={<div className="notify-img1"><img className="notify-img"  src= {notification_icon} alt="pic"
            /></div>} open={this.isOpenDetailNotification} position="bottom right" arrow={false} contentStyle={{ width: "287px", border: "none" }}
>  
              {close => (
                <div className="modal">
                <div className="header"><span className="notification">Notifications</span></div>
               { patientList.length > 0 ?
               patientList.map((value,index) => {
                     return (
                       <div className="patient-data-read"><span className="timestamp">{this.convertTimeStampToDate(value.assignedByOperator.timestamp)}</span><div className="notification-text" >New Patient, <Link className="link-style" to={`/patientdetail/${value._id}`} key={index}>
                       {value.name}</Link> assigned to you by {value.assignedByOperator.name}</div></div>
                       )  
                                 
} ):null
    }
            <div className="bottom-view"> <Popup
      trigger={<span className="view-text" style={{cursor:'pointer'}}>View All</span>}
      position="right top"
      modal
      mouseEnterDelay={3}
      hideCloseButton = {true}
      contentStyle={{width:"465px", padding: "0px", border: "none"}}
      arrow={false}
      open={this.state.isOpenDetailNotification}
    >
      <div className="menu">
      <div className="header"><span className="notification">Notifications</span><div className="cross" style={{cursor:'pointer'}} onClick={this.crossBtnTapped} >X</div></div>
               { patientList.length > 0 ?
               patientList.map((value,index) => {
               return (
               <div className="patient-data-read"><span className="timestamp">{this.convertTimeStampToDate(value.assignedByOperator.timestamp)}</span><div className="notification-text" >New Patient, <Link className="link-style" to={`/patientdetail/${value._id}`} key={index}>
               {value.name}</Link> assigned to you by {value.assignedByOperator.name}</div></div>
               ) 
                            
} ):null
    }
      </div>
    </Popup><div className="setting" ><img className="setting-img"  src= {setting_icon} alt="pic"
            /></div></div>

                </div>
              )}
            </Popup>
          );
          const PopupDropDown1 = () => (
            <Popup  trigger={<div className="notify-img2"><img className="notify-img"  src= {notification_icon} alt="pic"
            /></div>} open={this.isOpenDetailNotification} position="bottom right" arrow={false} contentStyle={{ width: "287px", border: "none" }}
>  
              {close => (
                <div className="modal">
                <div className="header"><span className="notification">Notifications</span></div>
               { patientList.length > 0 ?
               patientList.map((value,index) => {
                     return (
                       <div className="patient-data-read"><span className="timestamp">{this.convertTimeStampToDate(value.assignedByOperator.timestamp)}</span><div className="notification-text" >New Patient, <Link className="link-style" to={`/patientdetail/${value._id}`} key={index}>
                       {value.name}</Link> assigned to you by {value.assignedByOperator.name}</div></div>
                       )  
      
} ):null
    }
            <div className="bottom-view"> <Popup
      trigger={<span className="view-text" style={{cursor:'pointer'}}>View All</span>}
      position="right top"
      modal
      mouseEnterDelay={3}
      hideCloseButton = {true}
      contentStyle={{width:"465px", padding: "0px", border: "none"}}
      arrow={false}
      open={this.state.isOpenDetailNotification}
    >
      <div className="menu">
      <div className="header"><span className="notification">Notifications</span><div className="cross" style={{cursor:'pointer'}} onClick={this.crossBtnTapped} >X</div></div><div className="main-view">
               { patientList.length > 0 ?
               patientList.map((value,index) => {
              
                return (
                <div className="patient-data-read"><span className="timestamp">{this.convertTimeStampToDate(value.assignedByOperator.timestamp)}</span><span className="notification-text" >New Patient, <Link className="link-style" to={`/patientdetail/${value._id}`} key={index}>
                {value.name}</Link> assigned to you by {value.assignedByOperator.name}</span></div>
                 )
                
                        
} ):null
    }</div>
      </div>
    
    </Popup><div className="setting" ><img className="setting-img"  src= {setting_icon} alt="pic"
            /></div></div>

                </div>
              )}
            </Popup>
          );
        return (
            <React.Fragment>
                <Header aria-label="IBM Platform Name" className="header-style">
                    <Menu16 className="menu-icon" onClick={ this.menuClk } />
                    <HeaderName href="#" prefix="" className="header-text">
                        IBM COVID-19 Health Assistance
                    </HeaderName>
                    <HeaderGlobalBar>
                   
        { ((userDetail.usertype === 'doctor')) && this.state.patientList.length == 0 ?
                        <div className="notify-img1"><img className="notify-img"  src= {notification_icon} alt="pic"
                        /></div>:this.state.patientList.length > 0 && userDetail.usertype === 'doctor'? <PopupDropDown1/>:null
        }
                     { userDetail.usertype === 'doctor' && this.state.patientList.length > 0 ?
                        <div className="alert-icon-1">{this.state.patientList.length}</div>:this.state.patientList.length > 0 && userDetail.usertype === 'doctor'? <PopupDropDown/>:null
                    }

                  
{ userDetail.usertype === 'doctor' && patientList.length > 0 ?
                    <div className="notify"><ToastNotification className="notify1" {...notificationProps()} /></div>:null
                    } 
                   
                        <HeaderGlobalAction className="header-right-user"
                            aria-label="Search" onClick={() => { this.rightPanelClk() }}>
                       

                            <UserAvatar16 />
                            <span className="header-right-text">{userDetail.name}</span>
                             <ChevronDown16 /> 
                        </HeaderGlobalAction>
                    </HeaderGlobalBar>
                    {isPanelOpen ? 
                        <HeaderPanel expanded aria-label="Header Panel" className="header-panel">
                            <Switcher aria-label="Switcher Container" className="menu-list">
                                <SwitcherItem isSelected aria-label="Link 1" href="#" onClick={this.logoutClk}>
                                    Logout
                                </SwitcherItem>
                            </Switcher>
                        </HeaderPanel>
                    : null}
                </Header>
                <SideNav
                    isFixedNav
                    expanded={isSideNavOpen}
                    isChildOfHeader={true}
                    aria-label="Side navigation"
                    className="sidenav-style">
                    <SideNavItems>
                        <SideNavLink renderIcon={Events32} onClick={() => { this.switchSideTab('dashboard') }} className={`list-style ${sideTabType === 'dashboard' || sideTabType === 'patientdetail' ? 'list-style_selected' : ''}`}>
                            <p className="text-color">Patients Dashboard</p>
                        </SideNavLink>
                        <SideNavLink renderIcon={HelpFilled32} onClick={() => { this.switchSideTab('help') }} className={`list-style ${sideTabType === 'help' ? 'list-style_selected' : ''}`}>
                            <p className="text-color">Help Center</p>
                        </SideNavLink>
                        <SideNavLink renderIcon={Settings32} onClick={() => { this.switchSideTab('settings') }} className={`list-style ${sideTabType === 'settings' ? 'list-style_selected' : ''}`}>
                            <p className="text-color">Settings</p>
                        </SideNavLink>
                    </SideNavItems>
                </SideNav> 
            </React.Fragment>
        );
    }
}
  
export default SideMenu;

