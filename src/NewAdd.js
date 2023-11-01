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
    ScrollView
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from "../constants/style";

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";

export default function NewAdd({ navigation }) {
    const [image, setImage] = useState(null);
    const [imageURI, setImageURI] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const NewAdd = async () => {
        const user_token = await AsyncStorage.getItem("user_token");

        setLoading(true);
        let formData = new FormData();
        formData.append("title", title);
        formData.append("details", description);
        formData.append("price", price);
        formData.append("Category", "");
        formData.append("subcat", 4);
        formData.append("address", address);
        formData.append("country_id", 2);
        formData.append("city_id", 1);
        formData.append("images[]", image);
        fetch("https://mestamal.com/api/ad/create", {
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
                if (json.status == true) 
                {
                    Toast.show({
                        type: 'successToast',
                        position: 'bottom',
                        text1: json.msg,
                        bottomOffset: 80,
                        visibilityTime: 2000,
                    });
                    navigation.goBack();
                } 
                else {
                    Toast.show({
                        type: 'erorrToast',
                        position: 'bottom',
                        text1: "هناك خطأ ما في البيانات المدخلة",
                        bottomOffset: 80,
                        visibilityTime: 2000,
                    });
                }
            }
            )
            .catch(error => {
                setLoading(false);
                console.error(error);
            }
            ).finally(() => setLoading(false));
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
                console.log(
                    {
                        uri: localUri,
                        name: filename,
                        type: img_type
                    }
                );
            }
        } catch (E) {
            console.log(E);
        }
    };

    return (
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
                    إضافة إعلان
                </Text>


                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right : 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>

            </View>

            <ScrollView style={{ width: "100%", }}
                contentContainerStyle={{ alignItems: "center", }}
            >



                <View style={styles.loginBox}>
                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}>
                            تحميل صورة الإعلان
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
                        <Text style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}>
                            عنوان الإعلان
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.newAddinput}
                            onChangeText={text => setTitle(text)}
                            placeholder="أدخل عنوان الإعلان" />
                    </View>





                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}>
                            وصف الإعلان
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
                        <Text style={{ fontFamily: "Bold", textAlign: "right" }}>
                        سعر الإعلان  (بالريال السعودي)
                        </Text>
                    </View>


                    <View style={styles.inputContainer}>

                        <TextInput style={styles.newAddinput}
                            onChangeText={text => setPrice(text)}
                            placeholder="أدخل سعر الإعلان"
                            keyboardType="numeric"
                        />
                    </View>



                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "right" }}>
                            عنوان الإعلان
                        </Text>
                    </View>


                    <View style={styles.inputContainer}>

                        <TextInput style={styles.newAddinput}
                            onChangeText={text => setAddress(text)}
                            placeholder="أدخل العنوان" />
                    </View>

                    <TouchableOpacity style={styles.primaryBtn}
                        onPress={() => NewAdd()}>

                        {loading == true ?
                            <ActivityIndicator size={40} color="#FFF" />
                            :
                            <Text style={styles.btnText}>إنشاء الإعلان</Text>
                        }

                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast config={toastConfig} />
        </View>
    );
}