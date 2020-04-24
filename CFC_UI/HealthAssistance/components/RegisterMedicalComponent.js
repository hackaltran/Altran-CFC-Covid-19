import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements'


class RegisterMedical extends Component {

    render() {
        return(
            <View style={{ flex: 1, flexDirection:'column', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name='user-md' type='font-awesome' size='60' />
                <Text>Coming Soon</Text>
            </View>
        )
    }

}

export default RegisterMedical;