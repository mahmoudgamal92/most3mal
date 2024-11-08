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
    Linking
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5, MaterialIcons, FontAwesome, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import styles from "../constants/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./../constants/constants";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";
export default function Contact({ route, navigation }) {

    const [body, setBody] = useState("");
    const [contact_email, setContactEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const phoneNumber = "0534691112";
    const whatsapp = "";
    const email = "info@mestamal.com";

    const _contactManagment = async () => {
        if (contact_email == "" || body == "") {
            Toast.show({
                type: "erorrToast",
                text1: "من فضلك قم بإدخال البيانات كاملة",
                bottomOffset: 80,
                visibilityTime: 2000
            });
        }
        else {
            setLoading(true);

            const user_id = await AsyncStorage.getItem("user_id");
            let formData = new FormData();
            formData.append("email", contact_email);
            formData.append("message", body);
            //formData.append("user_id", user_id);

            fetch(api.custom_url + "contact/insert.php", {
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
                            text1: "تم الإرسال للإدارة , سيتم الرد في أقرب وقت",
                            bottomOffset: 80,
                            visibilityTime: 2000
                        });
                        setBody("");
                        setContactEmail("");
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


            setLoading(true);
            const interval = setInterval(() => {
                setLoading(false);
            }, 1000);

        }
    }
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
                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 16 }}>
                    تواصل معنا
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right: 20 }}
                >
                    <MaterialIcons name="arrow-forward-ios" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>


            <ScrollView
                contentContainerStyle={{
                    marginTop: 50,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <View style={{
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,

                    elevation: 10
                }}>
                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}>
                            أدخل بريدك الإلكتروني
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.newAddinput}
                            defaultValue={contact_email}
                            onChangeText={text => setContactEmail(text)}
                            placeholder="أدخل عنوان البريد الإلكتروني" />
                    </View>


                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}>
                            موضوع التواصل
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.newAddTextArea}
                            defaultValue={body}
                            onChangeText={text => setBody(text)}
                            placeholder="أدخل موضوع التواصل"
                            multiline={true}
                        />
                    </View>


                    <TouchableOpacity
                        onPress={() => _contactManagment()}
                        style={styles.primaryBtn}>
                        {loading == true ?
                            <ActivityIndicator size={40} color="#FFF" />
                            :
                            <Text style={styles.btnText}>أرسل الأن</Text>
                        }
                    </TouchableOpacity>


                    <View style={{ alignItems: "center", marginTop: 50, marginBottom: 20 }}>
                        <Text style={{ fontFamily: "Bold" }}>
                            أو عن طريق
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                            <TouchableOpacity
                                onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=9660534691112`)}
                                style={{ margin: 10 }}>
                                <FontAwesome5 name="whatsapp-square" size={40} color="grey" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
                                style={{ margin: 10 }}>
                                <FontAwesome name="phone-square" size={40} color="grey" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Linking.openURL(`mailto:${email}`)}
                                style={{ margin: 10 }}>
                                <MaterialCommunityIcons name="email-newsletter" size={42} color="grey" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Toast config={toastConfig} />
        </View>
    );
}