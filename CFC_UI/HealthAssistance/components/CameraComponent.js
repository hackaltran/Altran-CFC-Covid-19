import * as React from 'react';
import { Button, Image, View, Text,TouchableOpacity,ImageBackground  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';


export default class CameraController extends React.Component {
    
    state = {
        isVisible:false,
        imageUrl: '',
    };

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permission!');
            }
        }
    };

    chooseImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                base64: true,
               aspect: [4, 3],
                quality: 1,
            });
            

            if (!result.cancelled) {

                 this.setState({ imageUrl: result.uri });  
                 this.props.callbackFromCamera(result.uri);
                
                 
            }
            
        } catch (E) {
        
        }
    };


    renderManupulator =(visble, uri)=>{
        return(
        <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <ImageManipulator
            photo={{ uri }}
            isVisible={true}
            onPictureChoosed={({ uri: uri }) => this.setState({ uri: uri })}
            onToggleModal={this.onToggleModal}
        />
        </View>
        )

    }

    renderImage = () => {
    if (this.props.healthStatus == 'possible'){
        var borderColor= "#ff832b";
    }else if (this.props.healthStatus == 'positive'){
        var borderColor = "#da1e28"; 
    } else {
        var borderColor = "#24a148";   
    }

    if (this.state.imageUrl) {
        return <Image source={{ uri: this.state.imageUrl }} style={{ width: 100, height: 100, borderRadius: 100 / 2 , borderColor: borderColor, borderWidth: 3}} />
    }
    if(this.props.userImage)
    {     
        return <Image source={{ uri: this.props.userImage }} style={{ width: 100, height: 100, borderRadius: 100 / 2 ,borderColor:borderColor, borderWidth: 3}} />   
    }
    if (this.props.healthStatus == 'possible') {
        return <Image style={{ width: 100, height: 100, borderRadius: 100 / 2, borderColor:"#ff832b" ,borderWidth: 3}} />
    } else if (this.props.healthStatus == 'positive') {
        return <Image style={{ width: 100, height: 100, borderRadius: 100 / 2, borderColor:"#da1e28",borderWidth: 3}} />
    } else {
        return <Image style={{ width: 100, height: 100, borderRadius: 100 / 2 , borderColor:"#24a148",borderWidth: 3}} />
    }


    }
    render() {
        const { uri, isVisible } = this.state
        return (

            <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
          
                  {this.renderImage()} 
                <View style={{ flex:1, flexDirection: 'row',alignItems: 'center', justifyContent: 'center',backgroundColor:'', textAlign: 'left' , marginTop:3,height:20}}>
                <TouchableOpacity onPress={() => this.chooseImage()} style={{alignItems: 'center',alignSelf: "center"}}>
                        <Image source={require('../assets/images/edit.png')} style={{flex:1}} />
                </TouchableOpacity>  
                <Text onPress={() => this.chooseImage()} style={{  borderColor: "#007d79",borderTopWidth:0,borderLeftWidth:0, borderRightWidth:0,
                  borderWidth: 1, alignItems: "stretch", justifyContent: 'flex-start',color: "#007d79",height:19, textDecorationLine: "",marginStart:4, fontSize: 16, borderWidth:1, paddingBottom:1}}  > Change Profile Pic</Text> 
                </View>
            </View> 
        );
    }
}