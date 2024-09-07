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
    Platform
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    FontAwesome5,
    Feather,
    MaterialIcons,
    FontAwesome
} from "@expo/vector-icons";
import styles from "../constants/style";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
import api from "./../constants/constants";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";

export default function EditAuction({ route, navigation }) {
    const { item } = route.params;
    console.log(item);
    const [images, setImages] = useState([]);
    const [imageURI, setImageURI] = useState(null);
    const [title, setTitle] = useState(item.title);
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [latitude, setLatitude] = useState(24.7136);
    const [longitude, setLongitude] = useState(46.6753);

    const mapRef = useRef(null);

    useEffect(() => {
        _retrieveData();
    }, []);

    const _removeImg = (uri) => {
        setImages(images.filter(item => item.uri !== uri));
    };

    const _retrieveData = async () => {
        try {
            const location = await AsyncStorage.getItem("current_location");
            if (location !== null) {
                // We have data!!
                setLatitude(JSON.parse(location).latitude);
                setLongitude(JSON.parse(location).longitude);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                //aspect: [3, 3],
                quality: 1
            });
            if (!result.canceled) {
                let localUri = result.assets[0].uri;
                let filename = localUri.split("/").pop();
                let match = /\.(\w+)$/.exec(filename);
                let img_type = match ? `image/${match[1]}` : `image`;
                setImages([
                    ...images,
                    {
                        uri: localUri,
                        name: filename,
                        type: img_type
                    }
                ]);
            }
        } catch (E) {
            console.log(E);
        }
    };

    const goToMyLocation = async () => {
        mapRef.current.animateCamera({
            center: { latitude: latitude, longitude: longitude }
        });
    };

    const AddAuction = async () => {
        const user_id = await AsyncStorage.getItem("user_id");
        setLoading(true);
        let formData = new FormData();
        formData.append("id", item.id);
        formData.append("title", title);
        formData.append("user_id", user_id);
        formData.append("details", description);
        formData.append("address", state + "," + city);

        images.map((item, index) => {
            formData.append("images[]", {
                uri: item.uri,
                name: item.name,
                type: item.type
            });
        });

        fetch(api.custom_url + "auctions/update.php", {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-type": "multipart/form-data;",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive"
            },
            body: formData
        })
            .then(response => response.json())
            .then(json => {
                setLoading(false);
                if (json.success == true) {

                    Toast.show({
                        type: "successToast",
                        text1: "تم إضافة المزاد بنجاح ",
                        bottomOffset: 80,
                        visibilityTime: 2000
                    });
                    navigation.goBack();
                    console.log(json);
                } else {

                    Toast.show({
                        type: "erorrToast",
                        text1: "هناك خطأ في البيانات المدخلة",
                        bottomOffset: 80,
                        visibilityTime: 2000
                    });
                }
            })
            .catch(error => {
                setLoading(false);
                console.error(error);
            });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
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
                        تعديل مزاد
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ position: "absolute", left: 20 }}
                    >
                        <MaterialIcons name="arrow-back-ios" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={{ width: "100%" }}
                    contentContainerStyle={{ alignItems: "center" }}
                >
                    <View style={styles.loginBox}>

                        <View style={{
                            width: "100%",
                            paddingHorizontal: 10
                        }}>
                            <Text style={{
                                fontFamily: "Bold",
                                marginVertical: 20,
                                textAlign: 'right'
                            }}>
                                الصور الحالية للمنتج
                            </Text>
                            <ScrollView
                                style={{
                                    flexDirection: 'row-reverse'
                                }}
                                horizontal
                            >
                                {item.images?.split(",").map((item, index) => {
                                    return (
                                        <Image
                                            source={{ uri: api.media_url + item }}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 10,
                                                marginHorizontal: 5
                                            }}
                                        />
                                    );
                                })}
                            </ScrollView>
                        </View>





                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15, textAlign: 'right' }}>
                                تحميل صور جديده :
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => pickImage()}
                            style={styles.imgUploadContainer}
                        >
                            <Feather name="camera" size={60} color="#FFF" />
                        </TouchableOpacity>

                        <View
                            style={{
                                width: "100%",
                                marginBottom: 10,
                                flexDirection: "row-reverse",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {images.map((item, index) => {
                                return (
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => _removeImg(item.uri)}
                                            style={{ marginBottom: -20, zIndex: 849849 }}
                                        >
                                            <Image
                                                source={require("./../assets/cross.png")}
                                                style={{ width: 30, height: 30 }}
                                            />
                                        </TouchableOpacity>
                                        <Image
                                            source={{ uri: item.uri }}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 10,
                                                marginHorizontal: 5
                                            }}
                                        />
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15, textAlign: 'right' }}>
                                عنوان المنتج
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddinput}
                                onChangeText={text => setTitle(text)}
                                placeholder="أدخل عنوان المنتج"
                                defaultValue={item.title}
                            />
                        </View>

                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15, textAlign: 'right' }}>
                                وصف المنتج
                            </Text>
                        </View>




                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddTextArea}
                                onChangeText={text => setDescription(text)}
                                placeholder="أدخل وصف الإعلان"
                                multiline={true}
                                defaultValue={item.details}
                            />
                        </View>



                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", textAlign: 'right' }}>
                                المدينة
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddinput}
                                onChangeText={text => setState(text)}
                                placeholder="أدخل المدينة"
                                defaultValue={item?.address.split(",")[0]}

                            />
                        </View>

                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", textAlign: 'right' }}>الحي</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddinput}
                                onChangeText={text => setCity(text)}
                                placeholder="أدخل الحي"
                                defaultValue={item?.address.split(",")[1]}

                            />
                        </View>


                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", marginVertical: 10, textAlign: 'right' }}>
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
                                <Text
                                    style={{
                                        fontFamily: "Regular",
                                        marginVertical: 10,
                                        color: "#FFF",
                                        textAlign: 'right'
                                    }}
                                >
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
                                onRegionChangeComplete={region => {
                                    setAddress(
                                        parseFloat(region.latitude) +
                                        "," +
                                        parseFloat(region.longitude)
                                    );
                                }}
                            />

                            <View
                                style={{
                                    left: "45%",
                                    position: "absolute",
                                    top: "30%"
                                }}
                            >
                                <FontAwesome name="map-marker" size={60} color="#051A3A" />
                            </View>
                        </View>


                        <TouchableOpacity
                            style={[styles.primaryBtn, {
                                marginBottom: 60
                            }]}
                            onPress={() => AddAuction()}
                        >
                            {loading == true
                                ? <ActivityIndicator size={40} color="#FFF" />
                                : <Text style={styles.btnText}>تعديل المزاد</Text>}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </KeyboardAvoidingView>
    );
}
