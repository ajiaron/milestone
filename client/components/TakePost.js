import React, {useState, useEffect, useContext, useRef} from "react";
import { Text, StyleSheet, View, Image, Pressable, SafeAreaView, Dimensions, TouchableOpacity } from "react-native"
import * as Device from 'expo-device'
import { Icon } from 'react-native-elements'
import AppLoading from 'expo-app-loading'
import { useNavigation } from "@react-navigation/native"
import Footer from './Footer'
import { Camera, CameraType } from 'expo-camera'
import { Video } from 'expo-av'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker'
import userContext from '../contexts/userContext'


const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

const TakePost = ({route}) => {
    const navigation = useNavigation()
    const prevroute = route.params.previous_screen.name?route.params.previous_screen.name:"Feed"
    const [type, setType] = useState(CameraType.back);
    const [photoUri, setPhotoUri] = useState()
    const [videoUri, setVideoUri] = useState()
    let cameraRef = useRef()
    const [cameraPermission, setCameraPermission] = useState()
    const [microphonePermission, setMicrophonePermission] = useState()
    const [mediaPermission, setMediaPermission] = useState()
    const [photo, setPhoto] = useState()
    const [video, setVideo] = useState() 
    const [ready, setReady] = useState(false);
    const [image, setImage] = useState(null);
    const [isActive, setIsActive] = useState(false)
    const [isRecording, setIsRecording] = useState()

    useEffect(()=> {
        if (Device.isDevice) {
        (async () => {
            const cameraPermissions = await Camera.requestCameraPermissionsAsync();
            const microphonePermissions = await Camera.requestMicrophonePermissionsAsync();
            const mediaPermissions = await MediaLibrary.requestPermissionsAsync();
            setCameraPermission(cameraPermissions.status === "granted")
            setMicrophonePermission(microphonePermissions.status === "granted")
            setMediaPermission(mediaPermissions.status === "granted")
        })() } 
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            quality:1,
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
            setPhotoUri(result.assets[0].uri)
            setVideo(result.assets[0].uri) // check for asset type
            setVideoUri(result.assets[0].uri)   // check for asset type
            setType(current => (current === CameraType.front ? CameraType.back : CameraType.back));
        }
    }
    let recordVideo = async () => {
        setIsRecording(true)
        let options = {
            quality: "1080p",
            maxDuration: 60,
            mute: false,
        }
        cameraRef.current.recordAsync(options).then((recording)=> {
            setVideo(recording)
            setVideoUri(recording.uri)
            setIsRecording(false)
        })
    }
    let stopRecording = () => {
        setIsRecording(false)
        cameraRef.current.stopRecording()
    }
    function handleSelection() {
        setIsActive(true)
        pickImage()
    }
    function backPress() {
        console.log(prevroute)
        if (prevroute === "CreatePost") {
            navigation.navigate("Feed")
        }
        navigation.navigate(prevroute=="Post"||prevroute=="CreatePost"?"Feed":prevroute)
    }
    function handlePress() {
        console.log("Device: ", Device.isDevice ? Device.modelName:"Simulator")
        takePicture()
    }
    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
        console.log(type)
    }

    if (cameraPermission === undefined || microphonePermission === undefined) {
        // Camera permissions are still loading
        return (
        <View style={[styles.takePostPage]}>
            {image && 
            <View style={{borderRadius:336}}>
                <Image source={{ uri: image }} 
                       resizeMode="cover"
                       style={{ width: windowW*(336/windowW), height: windowH*(336/windowH), 
                       borderRadius:16, marginBottom:windowH*(16/windowH)}} />
            </View>
            }
            {(image)?null:
            <Text style={{zIndex:1,color:"white", fontFamily:"Inter", fontSize:20, alignSelf:"center", textAlign:"center"}}>
                Can't take photos on a simulator,{'\n'} Use your phone!
            </Text>}
            
            <Pressable style={(image)?styles.selectPhotoButtonContainer:styles.confirmPhotoButtonContainer} onPress={handleSelection}>
                <Text style={styles.selectPhotoButtonText}>
                    {(image)?`Choose Different Photo`:`Choose From Photos`}
                </Text>
            </Pressable>
            {(image)? <Pressable style={styles.confirmPhotoButtonContainer} onPress={()=>navigation.navigate("CreatePost", {uri: photoUri, type:type})}>
                <Text style={styles.selectPhotoButtonText}>
                    Confirm Selection
                </Text>
            </Pressable>:null
            }
            <View style={{position:"absolute", bottom:0}}>
                <Footer/>
            </View>
        </View>)
      } 
    let takePicture = async () => {
        let options = {
            quality:1,
            isImageMirror:true,
            exif:false,
        }
        let newPhoto = await cameraRef.current.takePictureAsync(options)
        setPhotoUri(newPhoto.uri)
        setPhoto(newPhoto)
     };
    if (photo || image || video) {
        let sharePhoto = () => {
            if (video) {
                shareAsync(video.uri)
            } else {
                shareAsync(photo.uri)
            }
        }
        let savePhoto = () => {
            if (video) {
                MediaLibrary.saveToLibraryAsync(video.uri)
            } else {
                MediaLibrary.saveToLibraryAsync(photo.uri)
            }
        }
        let postPhoto = () => {
            if (video) {
                var fileExt = video.uri.split('.').pop();
                console.log(fileExt)
                navigation.navigate("CreatePost", {uri: video.uri, type:type})
            }
            else {
                var fileExt = photo.uri.split('.').pop();
                console.log(fileExt)
                navigation.navigate("CreatePost", {uri: photoUri, type:type})
            }
        }
        let deletePhoto = () => {
            setPhoto(undefined)
            setImage(undefined)
            setVideo(undefined)
        }
        return (
            <View style={styles.takePostPage}>
                {(video)? <Video 
                style={styles.videoPreview} videoStyle={{minHeight:windowH}} source={{uri:video.uri}} resizeMode="cover" isLooping
                shouldPlay
                /> 
                : <Image style={(type==="front")?
                [styles.preview, {transform:[{rotateY:'180deg'}]}]:styles.preview} source={{uri: photoUri}} resizeMode="cover"/>}
              
                <View style={styles.mediaContainer}>
                    <View>
                        <Pressable onPress={postPhoto}>
                            <Icon 
                                style={styles.saveButton}
                                name='add'
                                color='white'
                                size={37}
                            />
                        </Pressable>
                    </View>
                    <View>
                        {mediaPermission?
                        <Pressable onPress={sharePhoto}>
                            <Icon 
                                style={styles.shareButton}
                                name='send'
                                color='white'
                                size={29}
                            />
                        </Pressable>:null}
                    </View>
                    <View>
                        <Pressable onPress={deletePhoto}>
                            <Icon 
                                style={styles.discardButton}
                                name='clear'
                                color='white'
                                size={36}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.takePostPage}>
              <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.switchContainer}>
                    <Pressable onPress={backPress}>
                        <Icon 
                            style={styles.backButton}
                            name='arrow-back-ios'
                            color='white'
                            size={26}
                        />
                    </Pressable>
                </View>
                { (isRecording)?null:
                <Pressable onPress={handleSelection} style={{bottom:windowH*(80/windowH), position:"absolute", left:windowW*(60/windowW)}}>
                    <Icon 
                        style={styles.galleryButton}
                        name='photo-library'
                        color='white'
                        size={32}
                    />
                </Pressable>}
                <View style={styles.cameraButtonContainer}>
                    <Pressable onPress={handlePress} onLongPress={recordVideo} delayLongPress={150} onPressOut={stopRecording}>
                        <Icon 
                            style={styles.cameraButton}
                            name='circle'
                            color='white'
                            size={64}
                        />
                    </Pressable>
                </View>
                <Pressable onPress={toggleCameraType} style={{bottom:windowH*(77/windowH), position:"absolute", right:windowW*(56/windowW)}}>
                    <Icon 
                        style={styles.switchButton}
                        name='refresh'
                        color='white'
                        size={40}
                    />
                </Pressable>
              </Camera>


        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    takePostPage: {
        backgroundColor: "rgba(28, 28, 28, 1)",
        minWidth:windowW,
        minHeight:windowH,
        overflow:"scroll",
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    camera: {
        minWidth:"100%",
        minHeight:windowH,
        alignSelf:"center",
    },
    cameraButtonContainer: {
        alignItems:"center",
        alignSelf:"center",
        position:"absolute",
        bottom:66,
        borderRadius:52,
        borderWidth:2,
        borderColor:"white",
    },
    mediaContainer: {
        width:windowW,
        bottom:windowH*0.07,
        position:"absolute",
        alignItems:"center",
        justifyContent:"space-around",
        flexDirection:"row"
    },
    switchContainer: {
        alignItems:"center",
        justifyContent:"space-between",
        width:windowW,
        flexDirection:"row",
        top:windowH*0.08,
        paddingLeft: windowW*0.064,
        paddingRight: windowW*0.064,
    },
    saveButton: {
        top:0
    },
    shareButton: {
        left:4
    },
    discardButton: {
        top:-0.5
    },
    switchButton: {
        zIndex:999,
    },
    photoButton: {
        zIndex:999,
    },
    backButton: {
        zIndex:999,
        top:2,
        left:4,
    },
    cameraButton: {
        zIndex:999,
        borderRadius:52,
    },
    selectPhotoButtonContainer: {
        minWidth:windowW * 0.725,
        minHeight: windowH * 0.035,
        backgroundColor:"rgba(10, 10, 10, 1)",
        borderRadius:5,
        justifyContent:"center",
        marginTop:windowH*(20/windowH),
        borderWidth:1,
        borderColor:"rgba(220, 220, 220, 1)",
        borderStyle:"solid"
    },
    confirmPhotoButtonContainer: {
        minWidth:windowW * 0.725,
        minHeight: windowH * 0.035,
        backgroundColor:"rgba(0, 82, 63, 1)",
        borderRadius:5,
        justifyContent:"center",
        marginTop:windowH*(20/windowH)
    },
    selectPhotoButtonText: {
        fontFamily:"InterBold",
        fontSize:14,
        color:"white",
        alignSelf:"center"
    },
    preview: {
        alignSelf:"stretch",
        height:windowH*0.0885,
        flex:1,
    },
    videoPreview: {
        flex: 1,
        minHeight:windowH,
        alignSelf:"stretch"
    }
})
export default TakePost