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

export default function AddBank({ route, navigation }) {
    const [account_holder, setAccountHolder] = useState("");
    const [iban_number, setIbanNumber] = useState("");
    const [account_number, setAccountNumber] = useState("");
    const [swift_code, setSwiftCode] = useState("");
    const [bank_branch, setBankBranch] = useState("");
    const [loading, setLoading] = useState("");

    const CreateAccount = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        setLoading(true);
        let formData = new FormData();
        formData.append("account_holder", account_holder);
        formData.append("iban_number", iban_number);
        formData.append("account_number", account_number);
        formData.append("bank_swift", swift_code);
        formData.append("postal_code", "748748");
        formData.append("bank_city", bank_branch);
        formData.append("user_token", user_token);

        fetch(api.custom_url + "payment/create_bank.php", {
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
                    alert("تم إضافة المزاد بنجاح ");
                    navigation.goBack();
                    console.log(json);
                } else {
                    alert("هناك خطأ في البيانات المدخلة");
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
                        إضافة حساب بنكي
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ position: "absolute", right: 20 }}
                    >
                        <Feather name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={{ width: "100%" }}
                    contentContainerStyle={{ alignItems: "center" }}
                >
                    <View style={styles.loginBox}>


                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                إسم المستفيد
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddinput}
                                onChangeText={text => setAccountHolder(text)}
                                placeholder="أدخل إسم المستفيد"
                            />
                        </View>



                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                رقم ال IBAN
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddinput}
                                onChangeText={text => setIbanNumber(text)}
                                placeholder="أدخل  رقم ال IBAN"
                            />
                        </View>


                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                رقم الحساب
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddinput}
                                onChangeText={text => setAccountNumber(text)}
                                placeholder="أدخل رقم الحساب"
                            />
                        </View>

                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                كود سويفت (SWIFT CODE)
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddinput}
                                onChangeText={text => setSwiftCode(text)}
                                placeholder="أدخل كود سويف الخاص بالبنك"
                            />
                        </View>




                        <View style={styles.inputLabelContainer}>
                            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                فرع البنك
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.newAddinput}
                                onChangeText={text => setBankBranch(text)}
                                placeholder="أدخل فرع البنك"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => CreateAccount()}
                        >

                            {loading ?
                                <ActivityIndicator color={"#FFF"} size={40} />
                                :
                                <Text style={styles.btnText}>
                                    إضافة الحساب
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
