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
function getUniqueArray(arr, index) {
    const uniqueArray = arr
         .map(e => e[index])
         .map((e, i, final) => final.indexOf(e) === i && i)
        .filter(e => arr[e]).map(e => arr[e]);      
     return uniqueArray;
  }

function RenderSymptoms(props) {
    if (props.user.symptom) {
        var uniqueArray = getUniqueArray( props.user.symptom, 'experience' );
        return (
            <View>
                {uniqueArray.map((item, index) => {
                    return (
                        
                            <Text key={index} style={[props.user.healthstatus == 'positive' ? styles.symptomPositive : styles.symptomPosible]}>{'\u2B24'} 
                              <Text style={{color: "#393939"}}>
                                  &nbsp;{item.experience}
                              </Text>
                            </Text>
                        
                    )
                })}
            </View>
        )
    } else {
        return (
            <View></View>
        )
    }

}

class RecommendationComponent extends Component {

    render() {

        if (this.props.user.user.healthstatus == 'none') {
            return (
                <View></View>
            )
        } else {
            return (
                <View style={{ height: 'auto' }}>
                    <Text style={{ marginBottom: 10, fontWeight: 'bold', marginRight: 160, marginTop: 10, fontSize: 14, color: '#393939' }}>
                          Recommendations
                    </Text>
                    <View style={[this.props.user.user.healthstatus == 'positive' ? styles.postContentPositive : styles.postContentPossible]}>
                        <Text style={{ marginBottom: 5, fontSize: 14, color: 'black', fontWeight: 'bold', }}>
                            Avoid all contact.
                        </Text>
                        <Text style={{ marginBottom: 15, justifyContent: 'center', alignItems: 'center' }}>
                            Your symptoms are very serious and you may have COVID-19.
                        </Text>
                        <Text style={styles.postTitle}>Alarming symptoms: </Text>
                        <RenderSymptoms user={this.props.user.user} />
                        <Text style={styles.isolateYourself}>Isolate yourself for 14 days.</Text>
                        <Button
                            buttonStyle={styles.buttonHealth}
                            onPress={() => {this.props.navigation('HealthData')} }
                            icon={
                                <Icon
                                    name="plus"
                                    size={15}
                                    color="#0198a2"
                                    type="outline"
                                    style={{ alignItems: 'flex-end', marginLeft: 20 }}
                                />
                            }
                            title='Add Health Data'
                            titleStyle={{ color: "#0198a2", fontSize: 14 }}
                            iconRight
                        />
                    </View>
                </View>
            )
        }
    }

}

export default connect(mapStateToProps)(RecommendationComponent);

const styles = StyleSheet.create({
    postContentPossible: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        borderLeftWidth: 3,
        borderLeftColor: '#ff832b'

    },
    postContentPositive: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        borderLeftWidth: 3,
        borderLeftColor: '#da1e28'

    },
    postTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 7
    },
    isolateYourself: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 18
    },
    buttonIsolate: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 218,
        height: 34,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: "#0198a2",
        backgroundColor: '#ffffff',
        marginBottom: 10
    },
    buttonHealth: {
        flexDirection: 'row',
        width: 160,
        height: 34,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: "#0198a2",
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    symptomPositive: {
        marginBottom: 10, color: '#da1e28'
    },
    symptomPosible: {
        marginBottom: 10, color: '#ff832b'
    }
})