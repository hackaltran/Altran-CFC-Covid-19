import React, { Component } from 'react';
import { Tabs, Tab } from "carbon-components-react";
import { Content } from 'carbon-components-react/lib/components/UIShell';
import {
  Tile
} from 'carbon-components-react';
import './Settings.scss';
import SideMenu from '../SideMenu/SideMenu';
import UserList from '../UserList/UserList';
import AddUser from "../UserDetails/AddUser";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabType: 'All',
      isOpenAddUser: false,
      userType : '',
      screenTitle : 'No settings available for doctor and operator',
    }
  }

  componentDidMount() {
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    this.setState({userType: user_details.usertype});
    if(user_details.usertype === 'admin' || user_details.usertype === 'Admin'){
      this.setState({screenTitle : 'Settings'});
    } 
  }
  /**
   * @method tabClk
   * @param type 
   * @description Handle tab click functionality
   */
  tabClk(type) {
    const tabChange = type === this.state.tabType ? false : true;
    if (tabChange) {
      this.setState({ tabType: type });
    }
  }

  addUserClick=()=>{
    this.setState({isOpenAddUser : true})
  }

  backToUserList=()=>{
    this.setState({isOpenAddUser : false})
  }

  render() {
  const { tabType, isOpenAddUser,userType,screenTitle } = this.state;
    return (
      <React.Fragment>
        <SideMenu history={this.props.history} />
        <Content className="content-block">
          <Tile className="tile-block">

            {
              isOpenAddUser ? <AddUser {...this.props} backToUserList = {this.backToUserList.bind(this)} /> :
                <div>
                  <p className="tabs-header">{screenTitle}</p>
                  {userType === 'admin' || userType ==='Admin' ? 
                  <Tabs className="tabs-style">
                    <Tab id="tab-1" label="All Users" className="tab-list" onClick={() => { this.tabClk('All') }}>
                      {tabType === 'All' ? <div className="some-content"></div> : null}
                      <UserList {...this.props} addUser = {this.addUserClick.bind(this)} userStatus={tabType} />
                      
                    </Tab>
                    <Tab id="tab-2" label="Chatbot Questions" className="tab-list" onClick={() => { this.tabClk('Positive') }}>
                      {tabType === 'Positive' ? <div className="some-content"></div> : null}
                    </Tab>
                    <Tab id="tab-3" label="Hospital Config" className="tab-list" onClick={() => { this.tabClk('Possible') }}>
                      {tabType === 'Possible' ? <div className="some-content"></div> : null}
                    </Tab>
                  </Tabs>
                  : ''}
                </div>
            } 
          </Tile>
        </Content>
      </React.Fragment>
    );
  }
}

export default Settings;