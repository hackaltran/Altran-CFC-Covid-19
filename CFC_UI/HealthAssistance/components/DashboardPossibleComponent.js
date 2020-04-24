import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Linking } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import DosDonsComponent from './dosdons/DosDonsComponent';
import HeaderComponent from './header/HeaderComponent';
import RecommendationComponent from './recommendation/RecommendationComponent';
import Comments from './comments/CommentsComponent';
import StayHealthyComponent from './StayHealthyComponent.js';
import { fetchUser } from '../redux/ActionCreators';
import { connect } from 'react-redux';

const whoUrl = "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public";
const cdcUrl = "https://www.cdc.gov/coronavirus/2019-ncov/index.html";
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUser: (userId) => dispatch(fetchUser(userId)),
})

class DashboardPossible extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      carouselItems: [
        {
          image: require('../assets/images/cdc.png'),
          title: "Centers for Disease Control and Prevention",
        },
        {
          image: require('../assets/images/who.png'),
          title: "World Health Organization",
        }
      ]
    }

    this.stateImage = {
      activeIndex: 0,
      carouselImageItems: [
        {
          //  image:require('../assets/images/distance.jpg'),  
          image: require('../assets/images/distance.jpg'),
          title: "Maintain Social Distance",
        },
        {
          // image:require('../assets/images/staysafe.jpg'),    
          image: require('../assets/images/stay-home.png'),
          title: "Stay Safe! Stay Home",
        },
        {
          // image:require('../assets/images/wash.jpg'),
          image: require('../assets/images/wash-hands.png'),
          title: "Wash Hands Regularly",
        }
      ]
    }
  }

  componentDidMount() {
    if (this.props.user.user && this.props.user.user.userId != null) {
      this.props.fetchUser(this.props.user.user.userId);
    }
  }

  cardClickEventListener = (item) => {
    Alert.alert(item.name);
  }

  _renderItem({ item, index }) {
    return (
      <View style={{
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 5,
        height: 90,
        padding: 50,
        marginLeft: 12,
        marginRight: 9,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: 'center'
      }}>
        <Text>{item.text}</Text>
      </View>

    )
  }

  renderTags = (item) => {
    return item.tags.map((tag, key) => {
      return (
        <TouchableOpacity key={key} style={styles.btnColor} onPress={() => { this.tagClickEventListener(tag) }}>
          <Text>{tag}</Text>
        </TouchableOpacity>
      );
    })
  }

  renderHealthRecomendation({ item, index }) {
    return (
      <View
        style={{
          backgroundColor: '#ffffff',
        }}
        key={index}>
        <Image
          style={{ width: 130, height: 101, justifyContent: 'center', marginBottom: 10 }}
          source={item.image}
        />
        <Text style={{ marginLeft: 15, marginBottom: 15, color: '#343334', fontSize: 14, justifyContent: 'space-between' }}>{item.title} </Text>

      </View>

    )
  }

  renderOfficials({ item, index }) {
    return (
      <TouchableOpacity onPress={() => item.title === 'World Health Organization' ? this.onHandlePressWho(): this.onHandlePressCdc()}>
        <View

          style={{
            backgroundColor: '#ffffff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 5
          }}
          key={index}>
          <Image
            style={{ width: 80, height: 60 }}
            source={item.image}
          />
          <Text style={{ flex: 1, flexWrap: 'wrap' }}>{item.title}</Text>

        </View>
      </TouchableOpacity>


    )
  }

  onHandlePressWho() {
    Linking.openURL(whoUrl);
  }

  onHandlePressCdc() {
    Linking.openURL(cdcUrl);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
        <HeaderComponent navigation={navigate} />
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
          <Comments />
          <RecommendationComponent />
          <View style={{ height: 180, marginBottom: 40 }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, color: '#393939', marginBottom: 15, marginTop: 20 }}>
              What you should do?
              </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.stateImage.carouselImageItems}
                renderItem={this.renderHealthRecomendation}
                sliderWidth={130}
                itemWidth={130}
                itemHeight={152}
                sliderHeight={152}
                layout={"default"}
                slideStyle={{ marginRight: 15 }}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                loop={false}
              >
              </Carousel>
            </View>
          </View>  
          <StayHealthyComponent />
          <View style={{ height: 150, marginTop: 5 }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, color: '#393939', marginBottom: 15, marginTop: 20 }}>
              Trush Official Source of Information Only
              </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.carouselItems}
                renderItem={this.renderOfficials.bind(this)}
                sliderWidth={270}
                itemWidth={270}
                itemHeight={70}
                sliderHeight={70}
                layout={"default"}
                inactiveSlideScale={0.9}
                inactiveSlideOpacity={0.7}
                loop={false}
              >
              </Carousel>
            </View>
          </View>
          <DosDonsComponent />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
  title: {
    textAlign: 'center',
    marginVertical: 5,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  formContent: {
    flexDirection: 'row',
    marginTop: 30,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconBtnSearch: {
    alignSelf: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: 'center'
  },
  notificationList: {
    marginTop: 20,
    padding: 10,
  },
  card: {
    height: null,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    borderTopWidth: 40,
    marginBottom: 20,
  },
  cardContent: {
    marginLeft: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: '#ecf0f1',
  },
  imageContent: {
    marginTop: -40,
  },
  tagsContent: {
    marginTop: 10,
    flexWrap: 'wrap'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 20,
    marginLeft: 20,
    alignSelf: 'center',
    color: "#00BFFF",
    fontWeight: '100',
  },
  btnColor: {
    padding: 10,
    borderRadius: 40,
    marginHorizontal: 3,
    backgroundColor: "#eee",
    marginTop: 5,
  },

  headerTitle: {
    fontSize: 30,
    color: "#FFFFFF",
    marginTop: 10,
  },
  postContent: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff'

  },

  postDescription: {
    fontSize: 16,
    marginTop: 20,
  },
  tags: {
    color: '#00BFFF',
    marginTop: 10,
  },
  date: {
    color: '#696969',
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#00BFFF",
    flex: 9,
    marginLeft: 1
  },
  profile: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: "center",
    padding: 20,
    height: 145,
    justifyContent: 'space-between'
  },

  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  buttonColor: {
    backgroundColor: '#007d79',
    borderColor: '#007d79',
    borderWidth: 2,
    borderRadius: 2,
    height: 34,
    width: 218,
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 30
  },

  buttonClick: {
    backgroundColor: '#0198a2',
    borderColor: '#007d79',
    borderWidth: 2,
    borderRadius: 2,
    height: 34,
    width: 218,
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 30,
    marginBottom: 10
  },

  JustifyButton: {
    justifyContent: 'space-around'
  },

  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },


});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPossible);
