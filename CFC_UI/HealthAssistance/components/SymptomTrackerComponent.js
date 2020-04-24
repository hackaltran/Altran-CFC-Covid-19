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
            return(
                <View style={{ flex: 1 }}>
                    <WebView 
                    style={{flex: 1}}
                    source={require("./index.html")}
                    />
                    <Button title='Complete Tracking' onPress={ () => { 
                        this.props.user.user && this.props.user.user.symptomDataLen && this.props.user.user.symptomDataLen >= 1 ? navigate('Home') :  navigate('DashboardPossible')} }/>
                </View>  
            )
        } else {
            return(
                    <View style={{ flex: 1 }}>
                        <WebView 
                        source={{ uri: 'https://chatbot-project-274815.df.r.appspot.com/index.html' }}
                        />
                        <Button title='Complete Tracking' onPress={ () => { 
                            this.props.user.user && this.props.user.user.symptomDataLen && this.props.user.user.symptomDataLen >= 1 ? navigate('Home') :  navigate('DashboardPossible')} }/>
                    </View>
            )
        }
    }

}

export default connect(mapStateToProps, null)(SymptomTracker);
