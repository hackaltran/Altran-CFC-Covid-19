import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            date: '',
            gender: 0,
            mobile: '',
            city: '',
            showModal: false
        }
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    handelRegistration() {
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            name: '',
            age: '',
            gender: 0,
            mobile: '',
            city: '',
            showModal: false
        });
    }

    onChangeText(text) {
        this.setState({
            name: text
        });
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#f6f6f6"}}>
                <View>
                    <Image source={require('../assets/images/icon.png')} 
                     style={{width: 40, height: 40}} />
                </View>
                <View style={{marginBottom: 20}}>
                    <Text style={{ alignSelf: 'center' ,fontWeight: 'bold', fontSize: 20, color: '#161616', margin: 30}}>
                        Covid-19 Health Assistance 
                    </Text> 
                    <Text style={{ fontSize: 14, alignSelf: 'center'}}>
                    Please help us understand, if you are
                    </Text>
                </View>
                <View>
                    <Button 
					    buttonStyle={styles.Indivisualbutton}
                        onPress={() => navigate('RegisterIndividual')}  
						style={{paddingTop: 5}}						
                        title='Individual (Patient)' 
						color='white'                        
                     />
                    <Text style={{paddingTop: 3, fontSize: 20, marginTop:20, marginBottom:20, alignSelf: 'center' }}> OR </Text>
                    <Button
						buttonStyle={styles.Healthbutton}
                        borderColor= '#007d79'						
                        title='Health Worker' 
						color='#007d79'
                        type='outline'
                        style={{ paddingTop:10,borderColor: '#007d79'}}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column',
        margin: 20
    },
    Indivisualbutton: {
        backgroundColor: '#007d79',
        borderColor: '#007d79',
        borderWidth: 2,
        borderRadius: 2,
        width: 325,
        height: 50
    },
    Healthbutton: {
        borderColor: '#007d79',
        borderWidth: 2,
        borderRadius: 2,
        width: 325,
        height: 50
    },
});

export default connect(mapStateToProps)(Register);