import React, { Component } from 'react';
import './SideMenu.scss';
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

class SideMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sideTabType: this.props.history.location.pathname.split('/')[1],
            isPanelOpen: false,
            isSideNavOpen: true,
            userDetail: {}
        }
        this.logoutClk = this.logoutClk.bind(this);
        this.menuClk = this.menuClk.bind(this);        
    }

    componentDidMount() {
        if (localStorage.getItem("user_details")) {
            const user_details = JSON.parse(localStorage.getItem("user_details"));
            this.setState({ userDetail: user_details });
        }
    }

    switchSideTab = (type) => {
        const sideTabChange = type === this.state.sideTabType ? false : true;
        if(sideTabChange) {
            this.setState({ sideTabType: type });
            this.props.history.push('/'+type);
        }
    }

    rightPanelClk = () => {
        this.setState({ isPanelOpen: !this.state.isPanelOpen });
    }

    logoutClk(event) {
        event.preventDefault();
        localStorage.removeItem('user_details');
        this.props.history.push('/login');
    }

    menuClk(event) {
        event.preventDefault();
        this.setState({ isSideNavOpen: !this.state.isSideNavOpen });
    }

    render() {
        const { sideTabType, isPanelOpen, isSideNavOpen, userDetail } = this.state;

        return (
            <React.Fragment>
                <Header aria-label="IBM Platform Name" className="header-style">
                    <Menu16 className="menu-icon" onClick={ this.menuClk } />
                    <HeaderName href="#" prefix="" className="header-text">
                        IBM COVID-19 Health Assistance
                    </HeaderName>
                    <HeaderGlobalBar>
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

