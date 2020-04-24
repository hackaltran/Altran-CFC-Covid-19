import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

class selectUserType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    startEvaluatingHealth() {
        this.toggleModal();
    }

    render() {
        return(

            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={{ flex: 1, padding: 20 , backgroundColor: '#f6f6f6'}}>
                <View style={{ flex: 1 , padding: 10}} >
                    <Text style={{ fontWeight: 'bold', fontSize: 24, paddingTop: 10 }}>
                        For whome you are checking these symptoms?
                    </Text>
                </View>
                <View style={{ flex: 3, marginTop:10 , backgroundColor: ''}} >
                    <CheckBox
                        title='Yourself'
                        iconType='font-awesome'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor={"#fff"}
                        
                         // checked={() => { }}
                    />
                    <CheckBox
                        title='Spouce'
                        iconType='font-awesome'
                        checkedIcon='dot-circle-o'
						uncheckedIcon='circle-o'
                        // checked={() => { }}
                    />
                    <CheckBox
                        title='Child'
                        iconType='font-awesome'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        // checked={() => { }}
                    />
                    <CheckBox
                        title='Parent'
                        iconType='font-awesome'
                        checkedIcon='dot-circle-o'
						uncheckedIcon='circle-o'
                        // checked={() => { }}
                    />

                <CheckBox
                    title='Someone Else'
                    iconType='font-awesome'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    // checked={() => { }}
                />



                </View>
                <View style={{ flex: 2 , marginTop:60}} >
                    <Button
                        color='#32a4a8' 
                        title='Evaluate Health' 
                        style={{ paddingTop: 20, fontSize: 24 }}
                        onPress={() => { this.startEvaluatingHealth(); }}
                        buttonStyle={styles.buttonColor} 
                    />
                </View>
                <Modal 
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.toggleModal()} }
                    onRequestClose={() => { this.toggleModal()} }
                    style={{ flex: 1, margin: 20 }}
                    >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 , marginTop:20}}>
                        <Icon name="check-circle" size={60} color="green" />
                        <Text style={{ fontWeight: 'bold', fontSize: 20, paddingTop: 10 }}>
                            Thanks, Chandresh! For sharing your information.
                        </Text>
                        <Text style={{ fontSize: 20, paddingTop: 10 ,marginTop:20}}>
                            Let us evaluate your health for COVID-19 symptoms.
                        </Text>
                    </View>        
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        padding: 20
      },
    buttonColor: {
        backgroundColor: '#007d79',
        borderColor: '#007d79',
        borderWidth: 2,
        borderRadius: 2
     }
  });
  
export default selectUserType;