import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect  } from "react-router-dom";
import "./index.scss";
import Monitoring from "./components/Monitoring/Monitoring";
import Login from "./components/Login/Login";
import HelpCenter from "./components/HelpCenter/HelpCenter";
import Settings from "./components/Settings/Settings";
import SendEmailScreen from "./components/ResetPassword/SendEmailScreen";
import SendEmailNext from "./components/ResetPassword/SendEmailNext";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import ContinueLogin from "./components/ResetPassword/ContinueLogin";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem('user_details') === null
      ? <Redirect to='/login' />
      : <Component {...props} />
  )} />
)

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path={["/", "/login"]} component={Login} />
          <PrivateRoute path='/dashboard' component={Monitoring} />
          <Route exact path={["/", "/ResetPassword"]} component={ResetPassword} />
          <Route exact path={["/", "/SendEmailScreen"]} component={SendEmailScreen} />
          <Route exact path={["/", "/SendEmailNext"]} component={SendEmailNext} />
          <Route exact path={["/", "/ContinueLogin"]} component={ContinueLogin} />
          <PrivateRoute
            exact
            path="/patientdetail/:patientid"
            component={Monitoring}
          />
          <PrivateRoute exact path="/help" component={HelpCenter} />
          <PrivateRoute exact path="/settings" component={Settings} />
        </Switch>
      </Router>
    );
  }
}

export default App;

