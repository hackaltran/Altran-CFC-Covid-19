import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./AddUser.scss";
import {
    ChevronLeft20,
} from "@carbon/icons-react";
import {
    Dropdown,
    InlineNotification,
    Loading,
    Button,
    TextInput,
    SwitcherDivider
} from "carbon-components-react";
import { encodePassword } from '../../util/utils';
import { postapi } from '../../services/webservices';
import error_logo from '../../assets/images/error_icon.png';

class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataLoader: false,
            userType: 1,
            userType: 'Doctor',
            name: '',
            _ids: '',
            gender: 'Male',
            contactNo: '',
            email: '',
            password: '',
            otherInfo: '',
            focusTextField: '',

            nameError: false,
            idError: false,
            genderError: false,
            ContactError: false,
            emailError: false,
            passError: false,
            isNotificationShow: false,
            errorMessage: 'internal server error, please try again later.'
        }
        this.handleChange = this.handleChange.bind(this);
    }

    validation() {
        const { name, _ids, gender, contactNo, email, password, userType } = this.state;
        var isValid = true;
        console.log("handleChange called ")
        switch (true) {
            case name === '':
                isValid = false;
                this.setState({ nameError: true });
                break;
            case _ids === '':
                this.setState({ idError: true });
                isValid = false;
                break;
            case (!new RegExp(/[0-9]/g).test(_ids)):
                this.setState({ idError: true });
                isValid = false;
                break;
            case gender === '':
                this.setState({ genderError: true });
                isValid = false;
                break;
            case contactNo === '':
                this.setState({ ContactError: true });
                isValid = false;
                break;
            case email === '':
                this.setState({ emailError: true });
                isValid = false;
                break;
            case (!new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email)):
                isValid = false;
                this.setState({ emailError: true });
                break;

            case !(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/g).test(password)):
                this.setState({ passError: true });
                isValid = false;
                break;

            case (!new RegExp(/[A-Z]/g).test(password)):
                this.setState({ passError: true });
                isValid = false;
                break;

            case password === '':
                this.setState({ passError: true });
                isValid = false;
                break;
            case userType === '':
                isValid = false;
                break;
        }
        return isValid;
    }

    /**
   * @method handleChange
   * @description Set variable when text field value changes
   */
    handleChange = (event) => {
        this.setState({
            nameError: false, idError: false, genderError: false, ContactError: false, emailError: false,
            passError: false, isNotificationShow: false
        });
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

    saveUser = (event) => {
        event.preventDefault();
        const { name, _ids, gender, contactNo, email, password, userType, otherInfo, dataLoader } = this.state;
        var isvalid = this.validation();
        console.log("validation result " + isvalid + " usertype " + userType)
        if (!isvalid) {
            return;
        }
        this.setState({ dataLoader: true });
        var isAdmin = false;
        if (userType === 'admin' || userType === 'Admin') {
            isAdmin = true;
        }

        const payload = {
            _id: _ids,
            "name": name,
            "gender": gender,
            mobileno: contactNo,
            location: '',
            usertype: userType,
            "password": encodePassword(password),
            "email": email,
            isFirstTimeLogin: isAdmin,
            otherInformation: otherInfo
        }

        return postapi('doctors/signup', payload)
            .then(responseJson => {
                this.setState({ dataLoader: false });
                console.log("response " + JSON.stringify(responseJson))
                if (responseJson.responseCode !== 'ERROR' && responseJson.success) {
                    this.backButtonTapped();
                } else {

                    if (!responseJson.success) {
                        this.setState({ isNotificationShow: true, errorMessage: "Id " + payload._id + " has already registered. " });
                        return;
                    }

                    this.setState({ isNotificationShow: true, errorMessage: responseJson.errorMessage });
                }
            });
    }

    cancelUser = (event) => {
        event.preventDefault();
        console.log("cancel user button click ");
    }

    /*Back Button Action*/
    backButtonTapped = (event) => {
        this.props.backToUserList()
    }

    /**
  * @method userTypeSelect
  * @description Set variable when dropdown value changes
  */
    userTypeSelect(event) {
        this.setState({ userType: event.selectedItem });
    }

    genderSelect(event) {
        this.setState({ gender: event.selectedItem });
    }

    render() {
        const { name, _ids, gender, contactNo, email, password, userType, otherInfo, dataLoader, focusTextField } = this.state;

        const { nameError, idError, genderError, ContactError, emailError, passError, errorMessage } = this.state;
        const TextInputProps = {
            className: 'text-field-style',
        };
        const options = ['Admin', 'Doctor', 'Operator'];
        const genderOptions = ['Male', 'Female'];

        const props = () => ({
            active: true,
            withOverlay: true,
            small: false
        });

        return (

            <React.Fragment>

                {dataLoader ? <Loading {...props()} className='loader-login' /> : null}
                <div className="some-content">
                    <div className="mainbox">

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

                        <div className="navigation">
                            <Link to="/Settings">
                                <ChevronLeft20 onClick={this.backButtonTapped.bind(this)} /> <span onClick={this.backButtonTapped.bind(this)}>Back</span>
                            </Link>
                            <div style={{ marginTop: 15 }}>
                                <p className="header-adduser" >Add New User</p>
                            </div>
                            <SwitcherDivider className="text-divider" />
                            {/* first row  */}
                            <div style={{ display: 'flex', flex: 1, marginTop: 20 }}>
                                <div style={{ flex: 1 }}>

                                    <div style={{ marginRight: 10 }}>

                                        <div className={nameError ? 'form-div-invalid' : 'form-div'} style={{ flex: 1 }}>
                                            <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>

                                                <TextInput
                                                    {...TextInputProps}
                                                    placeholder='pleaceholder'
                                                    type='text'
                                                    id='name'
                                                    labelText='Name*'
                                                    value={name}
                                                    style={{ marginBottom: 5 }}
                                                    onFocus={this.handleFocusBlur.bind(this, 'focus')}
                                                    onBlur={this.handleFocusBlur.bind(this, 'blur')}
                                                    onChange={this.handleChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                        <SwitcherDivider className={`text-divider-no-margin ${focusTextField === 'name' ? 'text-divider-color' : ''}`} />
                                        {nameError ?
                                            <div style={{ marginBottom: 0 }}>
                                                <div className="pwd-style-error" >
                                                    <span className='error-text' style={{ color: "#da1e28", marginRight: 30 }}>please enter name. </span>
                                                    <div className="error_icon_right_div">
                                                        <img src={error_logo} className="error_icon" alt="logo" />
                                                    </div>
                                                </div>
                                            </div>
                                            : ''}

                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ marginLeft: 10 }}>
                                        <div className={idError ? 'form-div-invalid' : 'form-div'}  >
                                            <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                                                <TextInput
                                                    {...TextInputProps}
                                                    labelText='ID Number*'
                                                    id='_ids'
                                                    style={{ marginBottom: 5 }}
                                                    value={_ids}
                                                    onChange={this.handleChange}
                                                    onFocus={this.handleFocusBlur.bind(this, 'focus')}
                                                    onBlur={this.handleFocusBlur.bind(this, 'blur')}
                                                />
                                            </div>
                                        </div>
                                        <SwitcherDivider className={`text-divider-no-margin ${focusTextField === '_ids' ? 'text-divider-color' : ''}`} />
                                        {idError ?
                                            <div style={{ marginBottom: 0 }}>
                                                <div className="pwd-style-error" >
                                                    <span className='error-text' style={{ color: "#da1e28", marginRight: 30 }}>please enter valid id number. </span>
                                                    <div className="error_icon_right_div">
                                                        <img src={error_logo} className="error_icon" alt="logo" />
                                                    </div>
                                                </div>
                                            </div>
                                            : ''}

                                    </div>
                                </div>

                            </div>
                            {/* second row */}

                            <div style={{ display: 'flex', flex: 1, marginTop: 20 }}>
                                <div style={{ flex: 1, marginRight: 10 }}>
                                    <div className={genderError ? 'form-div-invalid' : 'form-div'} style={{ flex: 1, marginBottom: 2 }}>

                                        <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>

                                            <span className="field-title">Gender*</span>
                                            <div className='selection' style={{ marginLeft: -15 }} >

                                                <Dropdown
                                                    items={genderOptions}
                                                    options={genderOptions}
                                                    value={gender}
                                                    id="gender"
                                                    label="Male"
                                                    lineWidth={0}
                                                    className="dropdown-adduser"
                                                    onChange={this.genderSelect.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <SwitcherDivider className="text-divider-no-margin" />

                                    {genderError ?
                                        <div style={{ marginBottom: 0 }}>
                                            <div className="pwd-style-error" >
                                                <span className='error-text' style={{ color: "#da1e28", marginRight: 30 }}>please select gender. </span>
                                                <div className="error_icon_right_div">
                                                    <img src={error_logo} className="error_icon" alt="logo" />
                                                </div>
                                            </div>
                                        </div>
                                        : ''}

                                </div>
                                <div style={{ flex: 1, marginLeft: 10 }}>
                                    <div className={ContactError ? 'form-div-invalid' : 'form-div'} style={{ flex: 1 }}>
                                        <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                                            <TextInput
                                                {...TextInputProps}
                                                labelText='Telephone Number*'
                                                id='contactNo'
                                                type="text"
                                                pattern="[0-9]*"
                                                style={{ marginBottom: 5 }}
                                                value={contactNo}
                                                onChange={this.handleChange}
                                                onFocus={this.handleFocusBlur.bind(this, 'focus')}
                                                onBlur={this.handleFocusBlur.bind(this, 'blur')}
                                            />
                                        </div>
                                    </div>
                                    <SwitcherDivider className={`text-divider-no-margin ${focusTextField === 'contactNo' ? 'text-divider-color' : ''}`} />

                                    {ContactError ?
                                        <div style={{ marginBottom: 0 }}>
                                            <div className="pwd-style-error" >
                                                <span className='error-text' style={{ color: "#da1e28", marginRight: 30 }}>please enter valid telephone number. </span>
                                                <div className="error_icon_right_div">
                                                    <img src={error_logo} className="error_icon" alt="logo" />
                                                </div>
                                            </div>
                                        </div>
                                        : ''}
                                </div>

                            </div>

                            {/* third row */}
                            <div style={{ display: 'flex', flex: 1, marginTop: 20 }}>
                                <div style={{ flex: 1, marginRight: 10 }}>
                                    <div className={emailError ? 'form-div-invalid' : 'form-div'} style={{ flex: 1 }}>
                                        <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                                            <TextInput
                                                {...TextInputProps}
                                                labelText='Email Id*'
                                                id='email'
                                                value={email}
                                                placeholder='pleaceholder'
                                                style={{ marginBottom: 5 }}
                                                // value={username}
                                                onFocus={this.handleFocusBlur.bind(this, 'focus')}
                                                onBlur={this.handleFocusBlur.bind(this, 'blur')}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <SwitcherDivider className={`text-divider-no-margin ${focusTextField === 'email' ? 'text-divider-color' : ''}`} />
                                    {emailError ?
                                        <div style={{ marginBottom: 0 }}>
                                            <div className="pwd-style-error" >
                                                <span className='error-text' style={{ color: "#da1e28", marginRight: 30 }}>please enter valid email id. </span>
                                                <div className="error_icon_right_div">
                                                    <img src={error_logo} className="error_icon" alt="logo" />
                                                </div>
                                            </div>
                                        </div>
                                        : ''}
                                </div>
                                <div style={{ flex: 1, marginLeft: 10 }}>
                                    <div className={passError ? 'form-div-invalid' : 'form-div'} style={{ flex: 1 }}>
                                        <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                                            <TextInput
                                                {...TextInputProps}
                                                labelText='Password*'
                                                id='password'
                                                type='password'
                                                value={password}
                                                style={{ marginBottom: 5 }}
                                                onChange={this.handleChange}
                                                onFocus={this.handleFocusBlur.bind(this, 'focus')}
                                                onBlur={this.handleFocusBlur.bind(this, 'blur')}
                                            />
                                        </div>
                                    </div>
                                    <SwitcherDivider className={`text-divider-no-margin ${focusTextField === 'password' ? 'text-divider-color' : ''}`} />
                                    {passError ?
                                        <div style={{ marginBottom: 0 }}>
                                            <div className="pwd-style-error" >
                                                <span className='error-text' style={{ color: "#da1e28", marginRight: 30 }}>password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character. The minimum allowed length is eight characters. </span>
                                                <div className="error_icon_right_div">
                                                    <img src={error_logo} className="error_icon" alt="logo" />
                                                </div>
                                            </div>
                                        </div>
                                        : ''}
                                </div>

                            </div>

                            {/* fourth row */}
                            <div style={{ display: 'flex', flex: 1, marginTop: 20 }}>
                                <div style={{ flex: 1, marginRight: 10 }}>
                                    <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10, paddingBottom: 3 }}>

                                        <span className="field-title">Type of User*</span>
                                        <div className='selection' style={{ marginLeft: -15 }} >

                                            <Dropdown
                                                items={options}
                                                options={options}
                                                value={userType}
                                                id="userType"
                                                label="Doctor"
                                                className="dropdown-adduser"
                                                onChange={this.userTypeSelect.bind(this)}
                                            />
                                        </div>
                                    </div>
                                    <SwitcherDivider className="text-divider-no-margin" />
                                </div>
                                <div style={{ flex: 1, marginLeft: 10 }}>

                                    <div style={{ display: 'flex', marginTop: 0, marginRight: 20, justifyContent: 'flex-end' }}>
                                        <span className="field-title"></span>
                                    </div>
                                </div>

                            </div>

                            {/* fifth row */}

                            <div style={{ display: 'flex', flex: 1, marginTop: 20 }}>
                                <div style={{ flex: 1, marginRight: 10 }}>
                                    <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>

                                        <div className="row" style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>

                                            <span className="field-title" style={{ display: 'flex', justifyContent: 'flex-start' }}>Other Information</span>
                                            <div style={{ display: 'flex', height: 20, marginRight: 20, justifyContent: 'flex-end' }}>
                                                <span className="field-title">{otherInfo.length}/400</span>
                                            </div>
                                        </div>

                                        <TextInput
                                            {...TextInputProps}
                                            id='otherInfo'
                                            placeholder='pleaceholder'
                                            value={otherInfo}
                                            labelText=''
                                            maxLength={400}
                                            style={{ marginBottom: 5, marginTop: -5, paddingTop: 0 }}
                                            onFocus={this.handleFocusBlur.bind(this, 'focus')}
                                            onBlur={this.handleFocusBlur.bind(this, 'blur')}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <SwitcherDivider className={`text-divider-no-margin ${focusTextField === 'otherInfo' ? 'text-divider-color' : ''}`} />
                                </div>

                            </div>
                            {/* button tag */}
                            <div className="row" style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                <div className="button1-div">
                                    <Button kind="primary" className="secondary1-div" type="submit" onClick={this.backButtonTapped} >
                                        Cancel
                                    </Button>
                                </div>

                                <div className="button1-div">
                                    <Button kind="primary" className="primary-div" type="submit" onClick={this.saveUser}  >
                                        Submit
                                    </Button>
                                </div>

                            </div>


                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}
export default AddUser;