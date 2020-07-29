import React, { Component } from 'react';
import './ResetPass.scss';

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
import { ArrowRight16, View16, ViewOff16 } from '@carbon/icons-react';
import { putapi } from '../../services/webservices';
import { encodePassword } from '../../util/utils';
import error_logo from '../../assets/images/error_icon.png';

class ResetPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmpassword: '',
      pwdType: 'password',
      pwdConfirmType: 'password',
      focusTextField: '',
      dataLoader: false,
      id: '',
      isNotificationShow: false,
      passowrdError: false,
      errorMessage : 'Internal server error, Please try again later.',
      confirmPassowrdError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.resetPassowrdBtn = this.resetPassowrdBtn.bind(this);
  }

  /**
   * @method handleChange
   * @description Set variable when text field value changes
   */
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
    this.setState({ passowrdError: false, confirmPassowrdError: false })
  }

  /**
   * @method handleFocusBlur
   * @param type 
   * @description Handle focus and blur on text field
   */
  handleFocusBlur(type, event) {
    if (type === 'focus') {
      this.setState({ focusTextField: event.target.id });
      this.setState({ passowrdError: false, confirmPassowrdError: false })
    } else if (type === 'blur') {
      this.setState({ focusTextField: '' });
    }

  }

  isValidPass(inputValue) {
    var isPass = false;

    if (new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/g).test(inputValue)) {
      isPass = true;
    }
    if (!new RegExp(/[A-Z]/g).test(inputValue)) {
      isPass = false;
    }
    return isPass;
  }

  /**
   * @method resetPassowrdBtn
   * @description Functionality when clickd on sign in button
   */
  resetPassowrdBtn = (event) => {
    event.preventDefault();
    const { confirmpassword, password } = this.state;
    if (!this.isValidPass(password)) {
      this.setState({ passowrdError: true })
      return;
    } else if (confirmpassword != password) {
      this.setState({ confirmPassowrdError: true })
      return;
    }
    const search = window.location.search;
    const params = new URLSearchParams(search);
    var token = params.get('id');
    const reqObj = {
      "id": token,
      "password": encodePassword(password)
    };
    this.setState({ dataLoader: true });
    return putapi('doctors/resetPassword', reqObj)
      .then(responseJson => {
        this.setState({ dataLoader: false });
        if (responseJson.responseCode !== 'ERROR') {
         this.props.history.push('/ContinueLogin');
        }else{
          if(responseJson.isOldPassword){
            this.setState({errorMessage : 'New password can\'t be same as old password'});
          }
          this.setState({isNotificationShow : true});
        }
      })
  }


  /**
   * @method pwdView
   * @description Password view function
   */
  pwdView() {
    this.setState({
      pwdType: this.state.pwdType === 'password' ? 'text' : 'password'
    })

  }

  /**
  * @method pwdView
  * @description Password view function
  */
  pwdConfirmView() {
    this.setState({
      pwdConfirmType: this.state.pwdConfirmType === 'password' ? 'text' : 'password'
    })

  }

  render() {
    const { confirmpassword, password, dataLoader, pwdType, pwdConfirmType, focusTextField,errorMessage } = this.state;

    const InvalidPasswordProps = {
      className: 'text-field-style',
      id: 'password',
      labelText: 'New Password',
    };

    const InvalidConfirmPasswordProps = {
      className: 'text-field-style',
      id: 'confirmpassword',
      labelText: 'Confirm New Password',
    };

    const checkboxEvents = {
      labelText: 'Remember me',
    };

    const props = () => ({
      active: true,
      withOverlay: true,
      small: false
    });

    return (
      <React.Fragment>
        <Content className="resetpass-container">
          {dataLoader ? <Loading {...props()} className='loader-login' /> : null}
          <Tile className="form-container">
            <div className="header-div">
              <img src={health_logo} className="login-logo" alt="logo" />
              <p className="header">COVID-19 Health Assistance</p>
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
                    subtitle={errorMessage}
                    title="Error"
                  /> : ''
                }
              </div>
              <p className="header1">Create your new password</p>
            </div>
            <Form className="form-style">
              <SwitcherDivider className="text-divider" />

              <div className={this.state.passowrdError ? 'form-div-invalid' : 'form-div'} >
                <div className="pwd-style" >
                  <TextInput
                    type={pwdType}
                    {...InvalidPasswordProps}
                    value={password}
                    style={{ marginBottom: 0 }}
                    onFocus={this.handleFocusBlur.bind(this, 'focus')}
                    onBlur={this.handleFocusBlur.bind(this, 'blur')}
                    onChange={this.handleChange} />

                  {pwdType === 'password' ?
                    <ViewOff16 className="pwd-view" onClick={this.pwdView.bind(this)} /> :
                    <View16 className="pwd-view" onClick={this.pwdView.bind(this)} />
                  }

                </div>
              </div>

              <SwitcherDivider className={`text-divider ${focusTextField === 'password' ? 'text-divider-color' : ''}`} />

              {this.state.passowrdError ?
                <div style={{ marginBottom: 10 }}>
                  <div className="pwd-style-error" >
                    <span className = 'error-text' style={{ color: "#da1e28", marginRight: 30 }}>password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character. The minimum allowed length is eight characters. </span>
                    <div className="error_icon_right_div">
                      <img src={error_logo} className="error_icon" alt="logo" />
                    </div>
                  </div>
                </div>
                : ''}

              <div className={this.state.confirmPassowrdError ? 'form-div-invalid' : 'form-div'}  >

                <div className="pwd-style">
                  <TextInput
                    type={pwdConfirmType}
                    required
                    {...InvalidConfirmPasswordProps}
                    value={confirmpassword}
                    style={{ marginBottom: 0 }}
                    onChange={this.handleChange}
                    onFocus={this.handleFocusBlur.bind(this, 'focus')}
                    onBlur={this.handleFocusBlur.bind(this, 'blur')}
                  />
                  {pwdConfirmType === 'password' ?
                    <ViewOff16 className="pwd-view" onClick={this.pwdConfirmView.bind(this)} /> :
                    <View16 className="pwd-view" onClick={this.pwdConfirmView.bind(this)} />
                  }
                </div>
              </div>
              <SwitcherDivider
                className={`text-divider ${focusTextField === 'confirmpassword' ? 'text-divider-color' : ''}`} />


              {this.state.confirmPassowrdError ?
                <div style={{ marginBottom: 10 }}>
                  <div className="pwd-style-error" >
                    <span className = 'error-text' style={{ color: "#da1e28", marginRight: 30 }}>New password and confirm new password doesn't match. </span>
                    <div className="error_icon_right_div"  >
                      <img src={error_logo} className="error_icon" alt="logo" />
                    </div>
                  </div>
                </div>
                : ''}


              <div className="button-div">
                <div className="header-div-sub">
                  <Button kind="primary" className="primary-div" type="submit" disabled={password === '' || confirmpassword === ''} onClick={this.resetPassowrdBtn}>
                    Change Password
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

export default ResetPassword;