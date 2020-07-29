import React, { Component } from 'react';
import './SendEmail.scss';
import {
  Form,
  Button,
  Tile,
  Loading
} from "carbon-components-react";
import health_logo from '../../assets/images/health.svg';
import { Content } from 'carbon-components-react/lib/components/UIShell';

class ContinueLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focusTextField: '',
      dataLoader: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);

  }

  /**
   * @method handleChange
   * @description Set variable when text field value changes
   */
  handleChange(event) {
    this.setState({ emailServerError: '' });
    this.setState({ isEmailError: false, isNotificationShow: false });
    this.setState({ [event.target.id]: event.target.value });
  }

  /**
   * @method handleFocusBlur
   * @param type 
   * @description Handle focus and blur on text field
   */
  handleFocusBlur(type, event) {
    if (type === 'focus') {
      this.setState({ focusTextField: event.target.id });
    } else if (type === 'blur') {
      this.setState({ focusTextField: '' });
    }

  }


  /**
   * @method sendEmailLink
   * @description Functionality when clicked send link button
   */
  login = (event) => {
    event.preventDefault();
    this.props.history.push('/login');
  }

  render() {

    const {  dataLoader } = this.state;

    const props = () => ({
      active: true,
      withOverlay: true,
      small: false
    });

    return (
      <React.Fragment>
        <Content className="sendEmail-container">
          {dataLoader ? <Loading {...props()} className='loader-login' /> : null}
          <Tile className="form-container">
            <div className="header-div">
              <img src={health_logo} className="login-logo" alt="logo" />
              <p className="header1">COVID-19 Health Assistance</p>
              <p className="header">Your new password has been activated</p>
              <span className="sub-header">Please click on Continue to Login button.</span>
            </div>
            <Form className="form-style" style={{marginTop : 0}}>              
              <div className="button-div">
                <div className="header-div-sub">

                  <Button kind="primary" className="primary-div" type="submit"  onClick={this.login}>
                    Continue to Login                    
                  </Button>
                </div>
              </div>
            </Form>
          </Tile>
        </Content>
      </React.Fragment>
    );
  }

}

export default ContinueLogin;