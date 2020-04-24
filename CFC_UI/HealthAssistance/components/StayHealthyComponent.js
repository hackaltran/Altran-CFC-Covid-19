import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';

class StayHealthyComponent extends Component {

    constructor(props) {
        super(props); 

    this.stateImage = {
        activeIndex: 0,
        carouselImageItems: [
          {
             imageurl:require('../assets/images/reader.png'),  
             title: "Read Books",
          },
          {
            imageurl:require('../assets/images/yoga.png'),    
             title: "Meditation", 
          },
          {  
             imageurl:require('../assets/images/yoga_1.png'), 
             title: "Yoga",
          }
        ]
      }

    }
    
  renderStayHealthy({ item, index }) {
    return ( 
      <View
        style={styles.contentView} 
        key={index}> 
        <Image style={styles.imageStyle} 
        source={item.imageurl}   
        />
          <Text style={styles.healthyContent}>{item.title}</Text> 
      </View>

    )
  }

    render() {
        return (
            <View style={{ marginTop: 15, height: 95 }}>

                <Text style={styles.stayTitle}>Stay Healthy at Mind</Text>


                <View style={styles.bottomView}>

                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.stateImage.carouselImageItems}
                    renderItem= {this.renderStayHealthy}
                    sliderWidth={100} 
                    itemWidth={100}
                    layout={"default"}
                    inactiveSlideScale={0.9} 
                    inactiveSlideOpacity={0.9}
                    loop={true}
              >
              </Carousel>

                    {/* <View style={styles.contentView}>
                        <Image style={styles.imageStyle}
                            source={require('../assets/images/reader.png')}
                        />
                        <Text style={styles.healthyContent}>Read Books</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Image style={styles.imageStyle}
                            source={require('../assets/images/yoga.png')}
                        />
                        <Text style={styles.healthyContent}>Meditation</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Image style={styles.imageStyle}
                            source={require('../assets/images/yoga_1.png')}
                        />
                        <Text style={styles.healthyContent}>Yoga</Text>
                    </View> */}
                  
                </View> 
            </View>
        )
    }

}

                {/* <View style={styles.contentView}>
                <Image style={styles.imageStyle}
                source={require('../assets/images/tv.png')}
                />
                <Text style={styles.healthyContent}>Movie</Text>
                </View> */}

export default StayHealthyComponent;

const styles = StyleSheet.create({
    stayTitle: {
        marginBottom: 15,
        color: '#393939',
        fontWeight: 'bold'
    },
    healthyContent: {
        fontSize: 12
    },
    bottomView: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        bottom: 0,
        paddingTop: 10
    },
    contentView: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingTop: 15,
        paddingBottom: 15,
        marginRight: 5,
        width: 85,
        height: 60,
        fontSize: 14
    },
    imageStyle: {
        width: 20,
        height: 20
    }
});