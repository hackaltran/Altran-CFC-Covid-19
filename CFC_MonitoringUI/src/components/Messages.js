import {Component} from "react";
import React from "react";
import moment from "moment";


class Messages extends Component {
  /**
   * @method generateTimeFormat
   * @param timestamp 
   * @description Function to generate time format from milliseconds
   */
  generateTimeFormat(timestamp) {
    return moment(Number(timestamp)).format("h:mm a, DD MMM YYYY");
  }

  render() {
    const {messages} = this.props;
    return (
      <ul className="Messages-list">
        {messages.map(m => this.renderMessage(m))}
      </ul>
    );
  }

  renderMessage(message) {
    const {doctorId, text,timestamp} = message;
    const {id,patientName} = this.props.currentMember;
    const messageFromMe = doctorId === id;
    const className = messageFromMe ?
      "Messages-message currentMember" : "Messages-message";
    return (
      <li className={className}>
        <div className="Message-content">
        <div className="text">{  className === "Messages-message currentMember" ? <div className="inner-text">{text }</div>:<div className="inner-text">{ text }</div>}
        { className === "Messages-message currentMember" ? <p className="time">
           {this.generateTimeFormat(timestamp)}
        </p>:<p className="time">
           {"sent by "+patientName+" "+this.generateTimeFormat(timestamp)}
        </p>}</div>
        </div>
      </li>
    );
  }
}

export default Messages;
