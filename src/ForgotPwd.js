import {
    Image,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
} from "react-native";
import React, { useState } from "react";
import {Feather,MaterialIcons} from '@expo/vector-icons';
import styles from "../constants/style";
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
            fetch("https://mestamal.com/api/user/forget-password", {
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
                    if (json.status == true) {
                        alert("تم ارسال رابط اعادة تعيين كلمة المرور الى بريدك الالكتروني");
                    }
                    else {
                       alert("حدث خطأ ما , يرجى المحاولة مرة اخرى");
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
        <View style={{ flex: 1, alignItems: "center" }}>
            <StatusBar barStyle="default" backgroundColor="#34ace0" />
            <View
                style={{

                    width: "100%",
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#34ace0",
                }}
            >


                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                    اعادة تعيين كلمة المرور
                </Text>


                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right : 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>


            </View>


            <View>
                <Image source={require("../assets/lock.png")}
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
                <View style={styles.inputLabelContainer}>
                    <Text style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}>
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
                            ارسال رابط تغيير كلمة المرور
                        </Text>
                    }

                </TouchableOpacity>
            </View>
        </View>
    );
}