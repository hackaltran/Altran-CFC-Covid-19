import React, { Component } from 'react';
import './SendEmail.scss';
import {
  Form,
  TextInput,
  Button,
  Tile,
  SwitcherDivider,
  InlineNotification,
  Loading
} from "carbon-components-react";
import health_logo from '../../assets/images/health.svg';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { ArrowRight16 } from '@carbon/icons-react';
import { putapi } from '../../services/webservices';
import error_logo from '../../assets/images/error_icon.png';

class SendEmailScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      focusTextField: '',
      dataLoader: false,
      emailServerError: '',
      isEmailError: false,
      isNotificationShow: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendEmailLink = this.sendEmailLink.bind(this);

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
  sendEmailLink = (event) => {
    event.preventDefault();
    const { email } = this.state;

    if (!new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email)) {
      this.setState({ isEmailError: true });
      return;
    }

    this.setState({ dataLoader: true });

    var currentUrl = window.location.href;
    var redirectUrl = currentUrl.substr(0, currentUrl.length - 15) + 'ResetPassword';

    const reqObj = {
      "email": email,
      "url": redirectUrl
    };

    return putapi('doctors/verifyEmail', reqObj)
      .then(responseJson => {

        this.setState({ dataLoader: false });
        if (responseJson.responseCode !== 'ERROR') {
          const userData = JSON.stringify({
            "email": reqObj.email,
            "url": redirectUrl,
          });
          localStorage.setItem('email', userData);
          this.props.history.push('/SendEmailNext');
        } else {

          this.setState({ isNotificationShow: true, emailServerError: 'Error : record not found.' });
        }
      })
  }

  render() {

    const { email, dataLoader, focusTextField } = this.state;

    const props = () => ({
      active: true,
      withOverlay: true,
      small: false
    });

    var serverErrorMessage = 'No account associated with this email id “' + this.state.email + '”. Please check the email id and try again.'

    return (
      <React.Fragment>
        <Content className="sendEmail-container">
          {dataLoader ? <Loading {...props()} className='loader-login' /> : null}
          <Tile className="form-container">
            <div className="header-div">
              <img src={health_logo} className="login-logo" alt="logo" />
              <p className="header1">COVID-19 Health Assistance</p>
              <div>

                {this.state.isNotificationShow ?
                  <InlineNotification
                    hideCloseButton={false}
                    iconDescription="describes the close button"
                    kind="error"
                    notificationType="inline"
                    onCloseButtonClick={function noRefCheck() { }}
                    role="alert"
                    statusIconDescription="Error"
                    subtitle={serverErrorMessage}
                    title="Error"
                  /> : ''
                }
              </div>

              <p className="header">Forgot your password?</p>
              <span className="sub-header">Tell us your registered email id to reset you password.</span>
            </div>
            <Form className="form-style">
              <SwitcherDivider className="text-divider"/>
              
            <div style={{paddingTop : 10}}>             
              <div className={this.state.isEmailError ? 'form-div-invalid' : 'form-div'} >
                <TextInput
                  className='text-field-style'
                  id='email'
                  labelText='Email ID'
                  style={{ marginBottom: 0 }}
                  value={email}
                  onFocus={this.handleFocusBlur.bind(this, 'focus')}
                  onBlur={this.handleFocusBlur.bind(this, 'blur')}
                  onChange={this.handleChange} />
                <SwitcherDivider
                  className={`text-divider ${focusTextField === 'email' ? 'text-divider-color' : ''}`} />

              </div>
            </div>

              {this.state.isEmailError ?
                <div style={{ marginBottom: 10 }}>
                  <div className="pwd-style-error" >
                    <span className = 'error-text' style={{ color: "#da1e28", marginRight: 30 }}>Please enter valid email id. </span>
                    <div className="error_icon_right_div">
                      <img src={error_logo} className="error_icon" alt="logo" />
                    </div>
                  </div>
                </div>
                : ''}

              <div className="button-div">
                <div className="header-div-sub">

                  <Button kind="primary" className="primary-div" type="submit" disabled={email === ''} onClick={this.sendEmailLink}>
                    Send Link
                      <ArrowRight16 className="login-arrow" />
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

export default SendEmailScreen;