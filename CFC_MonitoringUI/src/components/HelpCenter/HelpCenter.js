import React, { Component } from 'react';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import {
  Tile
} from 'carbon-components-react';
import './HelpCenter.scss';
import SideMenu from '../SideMenu/SideMenu';
import help_logo from '../../assets/images/datatable.png';

class HelpCenter extends Component {
  render() {
    return (
      <React.Fragment>
        <SideMenu history={this.props.history} />
        <Content className="content-block">
          <Tile className="tile-block">
            <img src={help_logo} className="help-logo" alt="logo" />
          </Tile>
        </Content>
      </React.Fragment>
    );
  }
}

export default HelpCenter;