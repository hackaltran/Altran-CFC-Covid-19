import React, { Component } from 'react';
import { View, Platform, StyleSheet  } from 'react-native';
import { Icon } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Constants from 'expo-constants';
import Register from './RegisterComponent';
import RegisterIndividual from './RegisterIndividualComponent';
import RegisterMedical from './RegisterMedicalComponent';
import User from './UserAccountComponent';
import HealthData from './HealthDataComponent';
import { connect } from 'react-redux';
import { registerUser ,fetchUser } from '../redux/ActionCreators';
import DashboardPossible from './DashboardPossibleComponent';  // Dashboard Possible
import Login from './LoginComponent';
import SymptomTracker from './SymptomTrackerComponent';


const mapStateToProps = state => {
    return { 
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    // fetchUser: (userId) => dispatch(fetchUser({ success: true, userId: userId})),
    registerUser: (userObj) => dispatch(registerUser(userObj))
})

// main navigation component
const MenuNavigator = createStackNavigator({
    Login: { screen: Login },
    Register: { screen: Register },
    RegisterIndividual: { screen: RegisterIndividual } ,
    RegisterMedical: { screen: RegisterMedical },   
    SymptomTracker: { screen: SymptomTracker, navigationOptions: {header: null} },   
    DashboardPossible: { screen: DashboardPossible }
}, { 
    initialRouteName: 'Login',
    navigationOptions: { 
        headerMode: false,
        headerShown: false,
        headerTransparent: true
    }
});

// create bottom tab navigation
const BottomTabNavigator = createBottomTabNavigator({
    Home: { 
        screen: DashboardPossible,
        navigationOptions: {
            title: 'Home',
            tabBarVisible: true,
            tabBarOptions: {activeTintColor:'#007d79'},
            tabBarIcon: ({ tintColor }) => <Icon type='font-awesome' name="home" color={tintColor} />
        }
    },
    HealthData: { 
        screen: HealthData,
        navigationOptions: {
            title: 'Health Data',
            tabBarVisible: true,
            tabBarOptions: {activeTintColor:'#007d79'},
            tabBarIcon: ({ tintColor }) => <Icon type='font-awesome' name="heartbeat" color={tintColor} />
        }
    },
    watson: {
        screen: SymptomTracker,
        navigationOptions: {
            title: 'Watson',
            tabBarVisible: true,
            tabBarOptions: { activeTintColor: '#007d79' },
            tabBarIcon: ({ tintColor }) => <Icon type='font-awesome' name="comments" color={tintColor} />
        }
    },
    Account: { 
        screen: User,
        navigationOptions: {
            title: 'Account',
            tabBarVisible: true,
            tabBarOptions: {activeTintColor:'#007d79'},
            tabBarIcon: ({ tintColor }) => <Icon type='font-awesome' name="user" color={tintColor} />
        }
    }
},{
    initialRouteName: 'Home'
});

class Main extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log(this.props.user, 'user asdsa');
        if (this.props.user.user && this.props.user.user.userId != null) {
            //this.props.fetchUser(this.props.user.user.userId);
        }
    }

    render(){
        if (this.props.user.user && this.props.user.user.userId != null &&
            this.props.user.user.symptomDataLen && this.props.user.user.symptomDataLen >= 1) {
                return(
                    <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>
                        <BottomTabNavigator />
                    </View>
                );  
            
        } else {
            return(
                <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>
                    <MenuNavigator />
                </View>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);