import React, { Component } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { Button } from 'react-native-elements';
import { fetchUser } from '../../redux/ActionCreators';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchUser: (userId) => dispatch(fetchUser(userId)),
})

function RenderHealthSatus(props) {
    
    if (props.healthstatus == 'none') {
        return(
            <View>
                <Text style={{ color: '#24a148' }}>No Symptoms Observed</Text>
                <Text style={{ color: '#24a148' }}>You Are Safe</Text>
                <Text style={{ color: '#24a148' }}>{props.currentAssign === 'doctor' ? 'Doctor Assigned To You' : ''}</Text>
            </View>
        );
    } else if (props.healthstatus == 'possible') {
        return(
            <View>
                <Text style={{ color: '#ff832b' }}>You might be infected.</Text>
                <Text style={{ color: '#ff832b' }}>Get tested for COVID19.</Text>
                <Text style={{ color: '#ff832b' }}>{props.currentAssign === 'doctor' ? 'Doctor Assigned To You' : ''}</Text>
            </View>
        );
    } else if (props.healthstatus == 'positive') {
        return(
            <View>
                <Text style={{ color: '#da1e28' }}>You're at Risk.</Text>
                <Text style={{ color: '#da1e28' }}>Stay at Home</Text>
                <Text style={{ color: '#da1e28' }}>{props.currentAssign === 'doctor' ? 'Doctor Assigned To You' : ''}</Text>
            </View>
        );
    } else {
        return(
            <View>
                <Text style={{ color: '#24a148' }}>You're safe & Healthy.</Text>
            </View>
        );
    }
    

}

function ProfileIconRender (props) {

    if (props.healthstatus == 'none') {
        return(
            <View style={{ marginRight: 10}}>
                    <Image style={styles.imageStyle}
                        source={require('../../assets/images/avatar-safe.png')} />
                </View>
        );
    } else if (props.healthstatus == 'possible') {
        return(
            <View style={{ marginRight: 10}}>
                    <Image style={styles.imageStyle}
                        source={require('../../assets/images/avatar-possible.png')} />
                </View>
        );
    } else if (props.healthstatus == 'positive') {
        return(
            <View style={{ marginRight: 10}}>
                    <Image style={styles.imageStyle}
                        source={require('../../assets/images/avatar-positive.png')} />
                </View>
        );
    } else {
        return(
            <View>
                <Text style={{ color: '#24a148' }}>You're safe & Healthy.</Text>
            </View>
        );
    }

}

class HeaderComponent extends Component {

    render() {
        return (
            <View style={styles.profile}>
                <ProfileIconRender healthstatus={this.props.user.user.healthstatus} />
                <View style={{ marginRight: 10 }}>
                    <Text style={{ color: "#333333", fontSize: 16, fontWeight: "bold" }}>{this.props.user.user.name}</Text>
                    <Text>ID: {this.props.user.user.userId}</Text>
                    <RenderHealthSatus healthstatus={this.props.user.user.healthstatus} currentAssign={this.props.user.user.currentAssign} />
                </View>
                <View>
                    <Button
                        buttonStyle={{ borderStyle: 'solid', borderWidth: 1, borderColor:"#0198a2", backgroundColor: '#ffffff', width: 100, height: 30, marginBottom: 5 }}
                        title="Test Again"
                        titleStyle={{color: "#0198a2", fontSize: 14}}
                        onPress={() => {this.props.navigation('watson')} }
                    />
                    <Button
                        buttonStyle={{ borderStyle: 'solid', borderWidth: 1, borderColor:"#0198a2", backgroundColor: '#ffffff', width: 100, height: 30 }}
                        title="Refresh"
                        titleStyle={{color: "#0198a2", fontSize: 14}}
                        onPress={() => { this.props.fetchUser(this.props.user.user.userId); }}
                    />
                </View>

            </View>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

const styles = StyleSheet.create({
    profile: {
        position: 'relative',
        top: 0,
        flexDirection: 'row',
        alignItems: "center",
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderColor: '#D3D3D3',
        backgroundColor: "#ffffff",
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
        height: 150,
        paddingTop: 20
    },
    imageStyle: {
        width: 54,
        height: 54
    }
})