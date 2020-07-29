import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { logout } from '../redux/ActionCreators';
import HeaderComponent from './header/HeaderComponent'
import Personal from './PersonalInformationComponent';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
})

class UserAccount extends Component {

    logout() {
        this.props.logout();
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                {/* <HeaderComponent navigation={navigate} /> */}
                {/* <Personal /> */}
                {/* <Button
                    onPress={() => this.logout()}
                    title='Logout' 
                    buttonStyle={{height: 50}}
                /> */}
                {/* <View style={{flex:1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    <Text>User account screen coming coon</Text>
                    <Button
                        onPress={() => this.logout()}
                        title='Logout' 
                        buttonStyle={{height: 50}}
                    />
                </View> */}
            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserAccount);