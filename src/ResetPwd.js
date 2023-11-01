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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';
import styles from "../constants/style";
export default function AddAuction({ route, navigation }) {

    const [password, setPassword] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const ResetPwd = async () => {
        if (password == "" || new_password == "" || confirm_password == "") {
            alert("من فضلك ادخل كلمة المرور القديمة وكلمة المرور الجديدة وتأكيد كلمة المرور");
            return;
        }
        else {
            const user_token = await AsyncStorage.getItem("user_token");
            setLoading(true);
            let formData = new FormData();
            formData.append("old_password", password);
            formData.append("password", new_password);
            formData.append("password_confirmation", confirm_password);
            fetch("https://mestamal.com/api/user/reset-password", {
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
                    if (json.status == true) {
                        alert("تم تغيير كلمة المرور بنجاح");

                        navigation.goBack();
                    }
                    else {
                       alert("حدث خطأ اثناء تغيير كلمة المرور");
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
                <View style={{
                    flexDirection:"row",
                    width:"100%",
                    paddingHorizontal:20

                }}>
                    
                <TouchableOpacity
                        onPress={() => navigation.openDrawer()}

                        style={{
                            justifyContent: "center",
                            alignItems: "flex-start"
                        }}
                    >
                           <SimpleLineIcons name="menu" size={40} color="#FFF" />

                    </TouchableOpacity>

                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20,marginLeft:20 }}>
                    تغيير كلمة المرور
                </Text>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right : 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
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
                        <Text style={{ fontFamily: "Bold", textAlign: "left", fontSize: 15 }}>
                            أدخل كلمة المرور الحالية
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.newAddinput}
                            onChangeText={text => setPassword(text)}
                            placeholder="كلمة المرور الحالية" />
                    </View>







                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "left", fontSize: 15 }}>
                            أدخل كلمة المرور الجديدة
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.newAddinput}
                            onChangeText={text => setNewPassword(text)}
                            placeholder="أدخل كلمة المرور الجديدة" />
                    </View>








                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "left", fontSize: 15 }}>
                            أدخل تأكيد كلمة المرور
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.newAddinput}
                            onChangeText={text => setConfirmPassword(text)}
                            placeholder="تأكيد كلمة المرور" />
                    </View>


                    <TouchableOpacity style={styles.primaryBtn}
                        onPress={() => ResetPwd()}>

                        {loading == true ?
                            <ActivityIndicator size={40} color="#FFF" />
                            :
                            <Text style={styles.btnText}>
                                حفظ
                            </Text>
                        }

                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}