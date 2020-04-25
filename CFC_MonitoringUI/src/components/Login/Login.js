import React, { Component } from 'react';
import './Login.scss';
import {
  Form,
  TextInput,
  Button,
  Checkbox,
  Tile,
  SwitcherDivider,
  Loading
} from "carbon-components-react";
import health_logo from '../../assets/images/health.svg';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { ArrowRight16, View16, ViewOff16, Information16 } from '@carbon/icons-react';
import { postapi } from '../../services/webservices';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      pwdType: 'password',
      focusTextField: '',
      dataLoader: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.signinBtn = this.signinBtn.bind(this);
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
      this.setState({ focusTextField: event.target.id });
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
      "password": password
    };
    return postapi('login', reqObj)
    .then(responseJson => {
      this.setState({dataLoader: false});
      if(responseJson.responseCode !== 'ERROR') {
        const userData = JSON.stringify({
          id: responseJson._id,
          name: responseJson.name, 
          usertype: responseJson.usertype
        });
        localStorage.setItem('user_details', userData);
        this.props.history.push('/dashboard');
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

  render() {
    const { username, password, dataLoader, pwdType, focusTextField } = this.state;

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

              <div className="button-div">
                <Button kind="secondary" className="secondary-div">
                  <span>Forgot username or password?</span>
                </Button>
                <Button kind="primary" className="primary-div" type="submit" disabled={username === '' || password === ''} onClick={this.signinBtn}>
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