import {
    Animated,
    Image,
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import styles from "../constants/style";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";
import api from "./../constants/constants";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";

export default function AddAuction({ route, navigation }) {
    const [image, setImage] = useState(null);
    const [imageURI, setImageURI] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const [latitude, setLatitude] = useState(24.7136);
    const [longitude, setLongitude] = useState(46.6753);

    const mapRef = useRef(null);

    useEffect(() => {
        _retrieveData();
    }, []);

    const _retrieveData = async () => {
        try {
            const location = await AsyncStorage.getItem('current_location');
            if (location !== null) {
                // We have data!!
                setLatitude(JSON.parse(location).latitude);
                setLongitude(JSON.parse(location).longitude);
            }
        }
        catch (error) {
            // Error retrieving data
        }
    };




    const goToMyLocation = async () => {
        mapRef.current.animateCamera({ center: { "latitude": latitude, "longitude": longitude } });
    }


    const AddAuction = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        setLoading(true);
        let formData = new FormData();
        formData.append("auction_number", parseInt(Math.random()*1000000));
        formData.append("title", title);
        formData.append("details", description);
        formData.append("start_date", moment().format());
        formData.append("end_date", moment().add(7, 'days').format());
        formData.append("duration", 7);
        formData.append("images[]", image);

        fetch(api.custom_url+"auctions/create.php", {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-type": "multipart/form-data;",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                Authorization: "Bearer " + user_token
            },
            body: formData
        })
            .then(response => response.json())
            .then(json => {
                setLoading(false);
                if (json.success == true) {
                    alert("تم إضافة المزاد بنجاح ");
                    navigation.goBack();
                    console.log(json);
                }
                else {
                    alert("هناك خطأ في البيانات المدخلة");
                }
            }
            )
            .catch(error => {
                setLoading(false);
                console.error(error);
            }
            );
    }


    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                let localUri = result.assets[0].uri;
                let filename = localUri.split("/").pop();
                let match = /\.(\w+)$/.exec(filename);
                let img_type = match ? `image/${match[1]}` : `image`;
                setImageURI(localUri);
                setImage({
                    uri: localUri,
                    name: filename,
                    type: img_type
                });
            }
        } catch (E) {
            console.log(E);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>

            <View style={styles.container}>
                <StatusBar barStyle="default" backgroundColor="#34ace0" />
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 60,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#34ace0"
                    }}
                >


                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                        إضافة مزاد
                    </Text>


                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ position: "absolute", right: 20 }}
                    >
                        <Feather name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>


                </View>

                <ScrollView style={{ width: "100%", }}
                    contentContainerStyle={{ alignItems: "center", }}
                >

                    <View style={styles.loginBox}>
                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                تحميل صورة المنتج
                            </Text>
                        </View>


                        {imageURI !== null ?

                            <TouchableOpacity
                                onPress={() => pickImage()}
                                style={styles.imgUploadContainer}>
                                <Image style={{ width: "100%", height: "100%", borderRadius: 50, borderWidth: 2, borderColor: "#34ace0", resizeMode: "contain" }}
                                    source={{ uri: imageURI }} />
                            </TouchableOpacity>

                            :

                            <TouchableOpacity
                                onPress={() => pickImage()}
                                style={styles.imgUploadContainer}>
                                <Image style={styles.imgUploadIcon}
                                    source={require("../assets/camera.png")} />
                            </TouchableOpacity>

                        }

                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                عنوان المنتج
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.newAddinput}
                                onChangeText={text => setTitle(text)}
                                placeholder="أدخل عنوان المنتج" />
                        </View>





                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                وصف المنتج
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.newAddTextArea}
                                onChangeText={text => setDescription(text)}
                                placeholder="أدخل وصف الإعلان"
                                multiline={true}
                            />
                        </View>



                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", marginVertical: 10 }}>
                                أختر عنوان الإعلان
                            </Text>
                        </View>

                        <View
                            style={{
                                width: "100%",
                                height: 300,
                                marginTop: 10,
                                borderRadius: 20,
                                overflow: "hidden",
                                borderWidth: 1,
                                borderColor: "#46D0D9"
                            }}
                        >

                            <TouchableOpacity
                                onPress={() => goToMyLocation()}
                                style={{
                                    position: "absolute",
                                    flexDirection: "row-reverse",
                                    alignItems: "center",
                                    top: 10,
                                    right: 10,
                                    backgroundColor: "#34ACE0",
                                    zIndex: 10000,
                                    borderRadius: 10,
                                    paddingVertical: 2,
                                    paddingHorizontal: 5
                                }}
                            >
                                <MaterialIcons name="my-location" size={24} color="#FFF" />
                                <Text style={{ fontFamily: "Regular", marginVertical: 10, color: "#FFF" }}>
                                    الموقع الحالي
                                </Text>

                            </TouchableOpacity>

                            <MapView
                                ref={mapRef}
                                style={{ flex: 1, width: "100%" }}
                                showsUserLocation={true}
                                initialRegion={{
                                    latitude: latitude,
                                    longitude: longitude,
                                    latitudeDelta: 1.0,
                                    longitudeDelta: 1.0
                                }}


                                onRegionChangeComplete={(region) => {
                                    setAddress(parseFloat(region.latitude) + "," + parseFloat(region.longitude));
                                }}
                            />


                            <View style={{
                                left: "45%",
                                position: "absolute",
                                top: "30%"

                            }}>
                                <FontAwesome name="map-marker" size={60} color="#051A3A" />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.primaryBtn}
                            onPress={() => AddAuction()}>

                            {loading == true ?
                                <ActivityIndicator size={40} color="#FFF" />
                                :
                                <Text style={styles.btnText}>
                                    إنشاء المزاد
                                </Text>
                            }

                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </KeyboardAvoidingView>
    );
}