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
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Feather, SimpleLineIcons } from "@expo/vector-icons";
import styles from "../constants/style";
import api from "./../constants/constants";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
export default function NewPwd({ route, navigation }) {
    const { user } = route.params;
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const ResetPwd = async () => {
        if (new_password == "" || confirm_password == "" || new_password !== confirm_password) {
            alert("من فضلك إدخال  كلمة المرور بشكل صحيح و تأكيدها");
            return;
        } else {
            setLoading(true);
            let formData = new FormData();
            formData.append("user_id", user.id);
            formData.append("new_password", new_password);
            fetch(api.custom_url + "user/new_pwd.php", {
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
                            text1: "تم تغيير كلمة المرور بنجاح , يمكنك تسجيل الدخول الأن",
                            bottomOffset: 80,
                            visibilityTime: 2000
                        });
                        setTimeout(() => {
                            navigation.replace("SignIn")
                        }, 3000);
                    } else {
                        alert(JSON.stringify(json));

                        Toast.show({
                            type: "erorrToast",
                            text1: "هناك خطأ , نعتذر سوف تحل المشكلة قريبا",
                            bottomOffset: 80,
                            visibilityTime: 2000
                        });
                    }
                })
                .catch(error => {
                    setLoading(false);
                    console.error(error);
                });
        }
    };

    return (
        <KeyboardAvoidingView
            style={{
                paddingTop: Constants.statusBarHeight,
                flex: 1,
                width: "100%",
                backgroundColor: "#FFF"
            }}
            behavior={Platform.OS === "ios" ? "padding" : null}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: 50,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >


                <MaterialIcons
                    name="verified-user"
                    size={100}
                    color="#34ace0"
                    style={{
                        marginVertical: 20
                    }}
                />
                <View
                    style={{
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
                        <Text
                            style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}
                        >
                            أدخل كلمة المرور الجديدة
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.newAddinput}
                            onChangeText={text => setNewPassword(text)}
                            placeholder="أدخل كلمة المرور الجديدة"
                        />
                    </View>

                    <View style={styles.inputLabelContainer}>
                        <Text
                            style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}
                        >
                            أدخل تأكيد كلمة المرور
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.newAddinput}
                            onChangeText={text => setConfirmPassword(text)}
                            placeholder="تأكيد كلمة المرور"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.primaryBtn, { marginBottom: 100 }]}
                        onPress={() => ResetPwd()}
                    >
                        {loading == true
                            ? <ActivityIndicator size={40} color="#FFF" />
                            : <Text style={styles.btnText}>حفظ</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast config={toastConfig} />

        </KeyboardAvoidingView>
    );
}