import {Component} from "react";
import React from "react";
import {
  ArrowRight20
} from "@carbon/icons-react";
import {
  TextArea  
} from "carbon-components-react";

class Input extends Component {
  state = {
    text: ""
  }

  onChange(e) {
    this.setState({text: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault(); 
    if(this.state.text.length > 0){
    this.props.onSendMessage(this.state.text);
    }
    console.log(this.state.text);
    this.setState({text: ""});
  }

  render() {
    return (
      <div className="Input">
                            <div className="entry2">
                            <div className="entrybox2">     
                              <ArrowRight20
                                onClick={e => 
                                  this.onSubmit(e)
                                }
                              />
                              <TextArea
                                className="textarea2"
                                labelText=""
                                id="comment"
                                value={this.state.text}
                                onChange={e =>this.onChange(e)}
                              />
                            </div>
                          </div>
      </div>
    );
  }
}

export default Input;
