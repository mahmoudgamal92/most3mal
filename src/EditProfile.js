import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5, Feather, Entypo, FontAwesome,MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../constants/style";
import Constants from "expo-constants";
import * as ImagePicker from 'expo-image-picker';
import api from "./../constants/constants";

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";
import { ActivityIndicator } from "react-native";
export default function EditProfile({ route, navigation }) {

    const { item } = route.params;
    const [name, setUserName] = useState(item.name);
    const [email, setEmail] = useState(item.email);
    const [phone, setPhone] = useState(item.phone);
    const [image, setImage] = useState("");
    const [imageURI, setImageURI] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item.image !== null) {
            setImageURI("https://mestamal.com/uploads/" + item.image);
        }
        else {
            setImageURI(null);
        }
    }, []);


    const registerUser = async () => {
        const user_id = await AsyncStorage.getItem("user_id");
        let formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("user_name", name);
        formData.append("user_phone", phone);
        formData.append("user_email", email);

        if (image !== "") {
            formData.append("image", image);
        }

        setLoading(true);
            fetch(api.custom_url+"user/update.php", {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-type": "multipart/form-data;",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
            },
            body: formData
        })
            .then(response => response.json())
            .then(responseJson => {
                //alert(JSON.stringify(responseJson));

                if (responseJson.success == true) {
                    alert(JSON.stringify(responseJson));
                    setLoading(false);
                    alert("تم تعديل الحساب بنجاح");
                   // navigation.goBack();
                } else {
                    alert("حدث خطأ ما");
                    setLoading(false);
                }
            });
    };




    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 3],
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
                setImageURI(localUri);
            }
        } catch (E) {
            console.log(E);
        }
    };


    return (
        <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
            <StatusBar style="auto" />
            <View
                style={{
                    width: "100%",
                    height: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#34ace0",
                    paddingTop: Constants.statusBarHeight,
                }}
            >


                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                    تعديل بيانات الحساب
                </Text>


                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right: 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>


            <View style={styles.loginBox}>
                <TouchableOpacity onPress={() => pickImage()}
                    style={styles.profileImgContainer}>

                    {imageURI !== null ?
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image style={{
                                width: 150,
                                height: 150,
                                resizeMode: "contain",
                                borderRadius: 75,
                                borderWidth: 2,
                                borderColor: "#0393ce"

                            }}
                                source={{ uri: imageURI }} />
                        </View>
                        :
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Feather name="user" size={70} color="#FFF" />
                            <Text style={{ fontFamily: "Bold", fontSize: 10, color: "#FFF" }}>
                                تعديل صورة الحساب
                            </Text>
                        </View>
                    }
                </TouchableOpacity>

                <View style={{
                    paddingHorizontal: 10,
                    marginTop: 20,
                    width: "100%"
                }}>
                    <Text style={{ fontFamily: "Bold", fontSize: 12, color: "#000" }}>
                        أسم المستخدم
                    </Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={{ width: "10%" }}>
                        <FontAwesome5 name="user-circle" size={24} color="grey" />
                    </View>

                    <TextInput style={styles.input}
                        onChangeText={text => setUserName(text)}
                        defaultValue={item.name}
                        placeholder="أسم المستخدم" />
                </View>



                <View style={{
                    paddingHorizontal: 10,
                    marginTop: 20,
                    width: "100%"
                }}>
                    <Text style={{ fontFamily: "Bold", fontSize: 12, color: "#000" }}>
                        رقم الجوال
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{ width: "10%" }}>
                        <Feather name="phone-call" size={24} color="grey" />
                    </View>
                    <TextInput style={styles.input}
                        onChangeText={text => setPhone(text)}
                        defaultValue={item.phone}
                        keyboardType="numeric"
                        placeholder="رقم الجوال" />
                </View>


                {/* 
                <View style={styles.inputContainer}>
                    <View style={{ width: "10%" }}>
                        <FontAwesome name="whatsapp" size={24} color="grey" />
                    </View>
                    <TextInput style={styles.input}
                        onChangeText={text => setWhatsapp(text)}
                        defaultValue={item.whats_app}
                        placeholder="رقم الواتساب"
                    />
                </View> */}

                <View style={{
                    paddingHorizontal: 10,
                    marginTop: 20,
                    width: "100%"
                }}>
                    <Text style={{ fontFamily: "Bold", fontSize: 12, color: "#000" }}>
                      البريد الالكتروني
                    </Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={{ width: "10%" }}>
                        <FontAwesome name="user" size={24} color="grey" />
                    </View>
                    <TextInput style={styles.input}
                        onChangeText={text => setEmail(text)}
                        defaultValue={item.email}
                        placeholder="البريد الالكتروني"
                        keyboardType="email-address"
                    />
                </View>


    
                <TouchableOpacity style={styles.primaryBtn}
                    onPress={() => registerUser()}>
                    {loading == true ?
                        <ActivityIndicator size={40} color="#FFF" />
                        :
                        <Text style={styles.btnText}>
                            تعديل البيانات
                        </Text>
                    }
                </TouchableOpacity>
            </View>
            <Toast config={toastConfig} />
        </ScrollView>
    );
}