import React, { Component } from "react";
import "./Monitoring.scss";
import { Tabs, Tab, Tile } from "carbon-components-react";
import { Content } from "carbon-components-react/lib/components/UIShell";
import SideMenu from "../SideMenu/SideMenu";
import PatientList from "../PatientList/PatientList";

class Monitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabType: 'All',
      sosCount: 0,
      possibleCount: 0
    }
    this.handleSosCount = this.handleSosCount.bind(this);
  }

  tabClk(type) {
    const tabChange = type === this.state.tabType ? false : true;
      if(tabChange) {
        this.setState({ tabType: type });
      }
  }

  handleSosCount(data) {
    this.setState({sosCount: data.sosCount, possibleCount: data.possibleCount});
  }

  render() {
    const {tabType, sosCount, possibleCount} = this.state;
    return (
      <React.Fragment>
        <SideMenu history={this.props.history} />
        <Content className="content-block">
          <Tile className="tile-block">
            <p className="tabs-header">Patients Dashboard</p>
            <div className="alert_container">
              <span className="alert_label">{sosCount} Morbidity</span>
            </div>
            <div className="possible_pat">
              <span className="possible_pat_label">{possibleCount}</span>
            </div>
            <Tabs className="tabs-style">
              <Tab id="tab-1" label="All Patients" className="tab-list" onClick={() => { this.tabClk('All') }}>
                {tabType === 'All' ? <div className="some-content"><PatientList {...this.props} userStatus={tabType} getSosCount={this.handleSosCount} /></div> : null }
              </Tab>
              <Tab id="tab-2" label="High Risk" className="tab-list" onClick={() => { this.tabClk('Positive') }}>
                {tabType === 'Positive' ? <div className="some-content"><PatientList {...this.props} userStatus={tabType} getSosCount={this.handleSosCount} /></div> : null }
              </Tab>
              <Tab id="tab-3" label="Medium Risk" className="tab-list" onClick={() => { this.tabClk('Possible') }}>
                {tabType === 'Possible' ? <div className="some-content"><PatientList {...this.props} userStatus={tabType} getSosCount={this.handleSosCount} /></div> : null }
              </Tab>
            </Tabs>
          </Tile>
        </Content>
      </React.Fragment>
    );
  }
}

export default Monitoring;
