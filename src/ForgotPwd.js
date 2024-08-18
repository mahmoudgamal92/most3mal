import {
    Image,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import React, { useState } from "react";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import styles from "../constants/style";
import api from "./../constants/constants";

export default function AddAuction({ route, navigation }) {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const forgotPwd = async () => {
        if (email == "") {
            alert("يجب ملئ جميع الحقول");
            return;
        }
        else {
            setLoading(true);
            let formData = new FormData();
            formData.append("email", email);
            fetch(api.custom_url + "auth/otp.php", {
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
                .then(json => {
                    setLoading(false);

                    if (json.success == true) {
                        alert("تم إرسال كود التحقق علي بريد الإلكتروني ");
                        navigation.navigate("OtpScreen", {
                            code: json.code,
                            user: json.data
                        });
                        // alert(JSON.stringify(json));
                    }
                    else {
                        alert(json.messages);
                    }
                }
                )
                .catch(error => {
                    setLoading(false);
                    console.error(error);
                }
                );
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle="default" />
                <ScrollView
                    contentContainerStyle={{
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            height: 60,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 20 }}>
                            اعادة تعيين كلمة المرور
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ position: "absolute", right: 20 }}
                        >
                            <MaterialIcons name="arrow-forward-ios" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Image
                            source={require("../assets/pwd.png")}
                            resizeMode="cover"
                            style={{ width: 200, height: 200, marginTop: 50 }} />
                    </View>


                    <View style={{
                        width: "90%",
                        marginTop: 50,
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

                        <View style={{
                            width: "100%",
                            paddingHorizontal: 10
                        }}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15, textAlign: 'right' }}>
                                أدخل البريد الالكتروني الخاص بك
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.newAddinput}
                                onChangeText={text => setEmail(text)}
                                keyboardType="email-address"
                                placeholder=" أدخل البريد الالكتروني الخاص بك" />
                        </View>

                        <TouchableOpacity style={styles.primaryBtn}
                            onPress={() => forgotPwd()}>

                            {loading == true ?
                                <ActivityIndicator size={40} color="#FFF" />
                                :
                                <Text style={styles.btnText}>
                                    متابعة
                                </Text>
                            }

                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>

    );
}