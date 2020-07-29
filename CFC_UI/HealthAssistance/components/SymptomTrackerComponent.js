import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
const mapStateToProps = state => {
    return {
        user: state.user
    }
}

class SymptomTracker extends Component {

    render() {

        const { navigate } = this.props.navigation;

        if (Platform.OS === 'ios') {
            return (
                <View style={{ flex: 1 }}>
                    <WebView
                    
                        source={{ uri: 'https://chatbotdev.eu-gb.mybluemix.net/' }}
                    />
                    <View>
                        <Button title='Submit'
                            onPress={() => {
                                this.props.user.user && this.props.user.user.symptomDataLen && this.props.user.user.symptomDataLen >= 1 ? navigate('Home') : navigate('DashboardPossible')
                            }}
                        />
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <WebView

                        source={{ uri: 'https://web-chat.global.assistant.watson.cloud.ibm.com/preview.html?region=eu-gb&integrationID=19a4ccbf-862d-44fc-bf39-0d61fc8b91f2&serviceInstanceID=f1b0e223-2245-4d76-9555-6b7ee9e2a749' }}
                    />
                    <View style={{zIndex: 4, elevation: 3, right:0, top:0, position: "absolute"}}>
                        <Button title='Submit' buttonStyle={{ width: 105, height: 48, borderRadius: 0}}
                            onPress={() => {
                                this.props.user.user && this.props.user.user.symptomDataLen && this.props.user.user.symptomDataLen >= 1 ? navigate('Home') : navigate('DashboardPossible')
                            }}
                        />
                    </View>
                </View>
            )
        }
    }

}

export default connect(mapStateToProps, null)(SymptomTracker);
