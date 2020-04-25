import React, { Component } from 'react';
import {
    View, Text, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';

const styles = StyleSheet.create({
    fixToText: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
    },
    marginRight: {
        marginRight: 5
    },
    doDons: {
        color: "#393939",
        fontWeight: "bold"
    }

})

const dosContent = <View>
    <View style={{ marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.doDons}>COVID-19 Do's and Don't</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon style={styles.marginRight} name="chevron-left" size={12} color="#393939" />
            <Icon style={styles.marginRight} name="chevron-right" size={12} color="#a8a8a8" />

        </View>
    </View>

    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="check" size={12} color="#24a148" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Do wash your hands for at leasr 20 seconds, several times a day.</Text>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="check" size={12} color="#24a148" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Cover your nose and mouth with disposal tissue or handkerchief.</Text>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="check" size={12} color="#24a148" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Avoid crowded places.</Text>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="check" size={12} color="#32CD32" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Stay more than one arm's length distance from person sick with flu.</Text>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="check" size={12} color="#32CD32" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Drink plenty of water/liquids and eat.</Text>
    </View>
</View>

const donsContent = <View>
    <View style={{ marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.doDons}>COVID-19 Do's and Don't</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon style={styles.marginRight} name="chevron-left" size={12} color="#a8a8a8" />
            <Icon style={styles.marginRight} name="chevron-right" size={12} color="#393939" />

        </View>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="close" size={12} color="#da1e28" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Do not touch your eyes, nose and mouth. If you have somehow come into contact with virus, touching your face can help it enter your body.</Text>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="close" size={12} color="#da1e28" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Do not travel if you have fever.</Text>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="close" size={12} color="#da1e28" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Do not go to crowded places.</Text>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="close" size={12} color="#da1e28" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Do not belive everything on the internet.</Text>
    </View>
    <View style={styles.fixToText}>
        <Icon style={styles.marginRight} name="close" size={12} color="#da1e28" />
        <Text style={{ lineHeight: 18, flex: 1, flexWrap: 'wrap' }}>Do not take antibiotics.</Text>
    </View>
</View>

class DosDonsComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            carouselItems: [
                {

                    title: dosContent,
                },
                {

                    title: donsContent,
                }
            ]
        }
    }

    renderItems({ item, index }) {
        return (
            <View
                key={index}>
                {item.title}
            </View>
        )
    }

    render() {
        return (
            <View style={{ height: 'auto' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.carouselItems}
                        renderItem={this.renderItems}
                        sliderWidth={320}
                        itemWidth={320}
                        layout={"default"}
                        inactiveSlideScale={0.9}
                        inactiveSlideOpacity={0.7}
                        loop={false}
                    >
                    </Carousel>
                </View>
            </View>
        )
    }

}

export default DosDonsComponent;

