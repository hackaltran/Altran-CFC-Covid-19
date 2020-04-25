import * as React from 'react';
import { Button, Image, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class CameraController extends React.Component {
    state = {
        imageUrl: null,
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
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ imageUrl: result.uri });
            }
        } catch (E) {
            // console.log(E);
        }
    };
    renderImage = () => {
        if (this.state.imageUrl) {

            return <Image source={{ uri: this.state.imageUrl }} style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
        }
        if (this.props.healthStatus == 'possible') {
            return <Image source={require('../assets/images/avatar-possible.png')} style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
        } else if (this.props.healthstatus == 'positive') {
            return <Image source={require('../assets/images/avatar-positive.png')} style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
        } else {
            return <Image source={require('../assets/images/avatar-safe.png')} style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
        }


    }
    render() {
        return (
            <View style={{ flex: 1, marginTop: 20, marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
                {this.renderImage()}
                <View style={{ flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginTop: 10 }}>
                    <Image onPress={() => this.chooseImage()} source={require('../assets/images/edit.png')} style={{ width: 16, height: 16 }} />
                    <Text onPress={() => this.chooseImage()} style={{ alignItems: "stretch", justifyContent: 'flex-start', color: "#007d79", textDecorationLine: 'underline', fontSize: 14 }}   > Change Profile Pic</Text>
                </View>
            </View>
        );
    }
}