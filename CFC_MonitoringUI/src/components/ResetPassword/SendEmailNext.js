import React, { Component } from 'react';
import './SendEmail.scss';
import {
  Tile,
  Loading,
  InlineNotification,

} from "carbon-components-react";

import health_logo from '../../assets/images/health.svg';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { putapi } from '../../services/webservices';

class SendEmailNext extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      dataLoader: false,
      serverError: 'internal server error, please try again later. ',
      isNotificationShow: false,
      type: 'error',// error
      title: ' Error :'
    };

  }

  /**
   * @method sendEmailLink
   * @description Functionality when clickd on resend
   */
  sendEmailLink = (event) => {
    event.preventDefault();
    this.setState({ dataLoader: true });
    const user_details = JSON.parse(localStorage.getItem("email"));
    const reqObj = {
      "email": user_details.email,
      "url": user_details.url
    };

    return putapi('doctors/verifyEmail', reqObj)
      .then(responseJson => {
        this.setState({ dataLoader: false });

        if (responseJson.responseCode !== 'ERROR') {
          this.setState({ serverError: 'email has been sent to ' + user_details.email + '. ', type: 'success', title: ' Success  : ' })
        } else {
          this.setState({ serverError: 'internal server error, please try again later. ', type: 'error', title: 'Error : ' })
        }
        this.setState({ isNotificationShow: true });
      })
  }

  render() {

    const { dataLoader } = this.state;
    const props = () => ({
      active: true,
      withOverlay: true,
      small: false
    });
    const user_details = JSON.parse(localStorage.getItem("email"));
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
                    kind={this.state.type}
                    notificationType="inline"
                    onCloseButtonClick={function noRefCheck() { }}
                    role="alert"
                    statusIconDescription="Error"
                    subtitle={this.state.serverError}
                    title={this.state.title}
                  /> : ''
                }
              </div>

              <p className="header">Forgot your password?</p>
              <div>
                <span className="sub-header">We have sent a reset password email to {user_details.email} Please click the reset password link to set a new password</span>
              </div>
              <div className="sub-div">
                <span className="sub-header"> Did not received the email? Check your spam folder. Or <a href='#' onClick={this.sendEmailLink}>resend</a> the email. </span>
              </div>

            </div>

          </Tile>
        </Content>
      </React.Fragment>
    );
  }

}

export default SendEmailNext;