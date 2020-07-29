import React, { Component } from 'react';
import './Login.scss';
import {
  Form,
  TextInput,
  Button,
  Checkbox,
  Tile,
  SwitcherDivider,
  InlineNotification,
  Loading
} from "carbon-components-react";
import health_logo from '../../assets/images/health.svg';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { ArrowRight16, View16, ViewOff16, Information16 } from '@carbon/icons-react';
import { postapi } from '../../services/webservices';
import { encodePassword } from '../../util/utils';
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = React.createRef();

let captchaObj;
let isCaptchaEnable = false;
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      pwdType: 'password',
      focusTextField: '',
      dataLoader: false,
      isNotificationShow: false,
      isCaptcha : false,
      isShowCaptch: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.signinBtn = this.signinBtn.bind(this);
  }

  componentDidMount() {
    var data;
    if (localStorage.getItem('capData')) {
      data = JSON.parse(localStorage.getItem('capData'));
    }
    if (data) {
      var msDiff = new Date().getTime() - new Date(data.timeStamp).getTime();
      var timeDiff = Math.floor(msDiff / (1000 * 60 * 30));
      if (timeDiff >= 1 && data.captcha) {
        this.isCaptchaEnable = true;
        this.setState({ isShowCaptch: false, isCaptcha: true })
        return;
      }
      this.isCaptchaEnable = !data.captcha;
      this.setState({ isShowCaptch: data.captcha })
    }
  }
  /**
   * @method handleChange
   * @description Set variable when text field value changes
   */
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  /**
   * @method handleFocusBlur
   * @param type 
   * @description Handle focus and blur on text field
   */
  handleFocusBlur(type, event) {
    if(type === 'focus') {
      this.setState({ focusTextField: event.target.id , isNotificationShow : false});
    } else if(type === 'blur') {
      this.setState({ focusTextField: '' });
    }

  }

  /**
   * @method signinBtn
   * @description Functionality when clickd on sign in button
   */
  signinBtn = (event) => {
    event.preventDefault();
    this.setState({dataLoader: true});
    const { username, password } = this.state;
    const reqObj = {
      "username": username,
      "password": encodePassword(password)
    };
    return postapi('login', reqObj)
      .then(responseJson => {
        this.setState({dataLoader: false});
        if(responseJson.responseCode !== 'ERROR') {
          const userData = JSON.stringify({
            id: responseJson._id,
            name: responseJson.name,
            usertype: responseJson.usertype.toLowerCase()
          });
          if(responseJson.isFirstTimeLogin){
            this.props.history.push('/ResetPassword?id='+responseJson._id)
            return;
          }
          this.setState({ isCaptcha: false, isShowCaptch: false })
          localStorage.setItem('user_details', userData);
          const capData = JSON.stringify({
            "captcha": false,
            "timeStamp": new Date().getTime()
          })
          localStorage.setItem('capData', capData);
          this.props.history.push('/dashboard');
        }else{
          this.isCaptchaEnable = false;
          this.setState({ isNotificationShow: true, isShowCaptch: true, isCaptcha: false })
          const capData = JSON.stringify({
            "captcha": true,
            "timeStamp": new Date().getTime()
          })
          localStorage.setItem('capData', capData);
          if(this.captchaObj){
          this.captchaObj.reset();
          }
        }
      })
  }

  resetPassword = (event) => {
    event.preventDefault();
    this.props.history.push('/SendEmailScreen');
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

  onCaptchaVeryfy = (value) => {
    if (value) {
      this.isCaptchaEnable = true;
      this.setState({isCaptcha : true})
    }else{
      this.isCaptchaEnable = true;
      this.setState({isCaptcha : false})
    }
  }

  render() {
    const { username, password, dataLoader, pwdType, focusTextField, isCaptcha ,isShowCaptch } = this.state;

    const TextInputProps = {
      className: 'text-field-style',
      id: 'username',
      labelText: 'Username'
    };

    const InvalidPasswordProps = {
      className: 'text-field-style',
      id: 'password',
      labelText: 'Password',
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
        <Content className="login-container">
          {dataLoader ? <Loading {...props()} className='loader-login' /> : null}
          <Tile className="form-container">
            <div className="header-div">
              <img src={health_logo} className="login-logo" alt="logo" />
              <p className="header">COVID-19 Health Assistance</p>
              <span className="sub-header">Please enter your details to monitor patient Health data</span>
            </div>

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
                  subtitle='Invalid username or password.'
                  title="Error"
                /> : ''
              }
            </div>

            <Form className="form-style">
              <SwitcherDivider className="text-divider" />
              <TextInput
                {...TextInputProps}
                value={username}
                onFocus={this.handleFocusBlur.bind(this, 'focus')}
                onBlur={this.handleFocusBlur.bind(this, 'blur')}
                onChange={this.handleChange} />
              <SwitcherDivider
                className={`text-divider ${focusTextField === 'username' ? 'text-divider-color' : ''}`} />
              <div className="pwd-style">
                <TextInput
                  type={pwdType}
                  required
                  {...InvalidPasswordProps}
                  value={password}
                  onChange={this.handleChange}
                  onFocus={this.handleFocusBlur.bind(this, 'focus')}
                  onBlur={this.handleFocusBlur.bind(this, 'blur')}
                />
                {pwdType === 'password' ?
                  <ViewOff16 className="pwd-view" onClick={this.pwdView.bind(this)} /> :
                  <View16 className="pwd-view" onClick={this.pwdView.bind(this)} />
                }
              </div>
              <SwitcherDivider
                className={`text-divider ${focusTextField === 'password' ? 'text-divider-color' : ''}`} />

              <div className= "rememberme">
                <Checkbox {...checkboxEvents} id="checkbox-1" />
                <Information16 />
              </div>
              {isShowCaptch ?
              <div>
                <ReCAPTCHA
                  ref={recaptchaRef => (this.captchaObj = recaptchaRef)}
                  sitekey="6LdB7rEZAAAAAKXzuS0uxLKMeHrStmY6iIIEDkI0"
                  onChange={this.onCaptchaVeryfy}
                />
              </div>
              : <div /> }

              <div className="button-div">
                <Button kind="secondary" className="secondary-div" onClick={this.resetPassword}>
                  <span>Forgot username or password?</span>
                </Button>
                <Button kind="primary" className="primary-div" type="submit" disabled={username === '' || password === ''|| this.isCaptchaEnable === false } onClick={this.signinBtn}>
                  Log In
                  <ArrowRight16 className="login-arrow" />
                </Button>
              </div>
            </Form>
          </Tile>
        </Content>
      </React.Fragment>
    );
  }
}

export default Login;