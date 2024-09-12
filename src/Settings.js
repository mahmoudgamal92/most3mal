import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    Linking
} from "react-native";
import {
    SimpleLineIcons,
    MaterialCommunityIcons,
    AntDesign,
    FontAwesome,
    MaterialIcons,
    FontAwesome5,
    Entypo,
    Feather,
    Octicons,
    Ionicons
} from "@expo/vector-icons";
import styles from "../constants/style";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerScreenHeader from "./../components/DrawerScreenHeader";
import api from "./../constants/constants";
export default function Settings({ route, navigation }) {
    const [values, setValues] = useState([]);
    useEffect(() => {
        _retriveData();
    }, []);
    const _retriveData = async () => {
        fetch(api.custom_url + "settings/index.php?keys=facebook,instagram,youtube,snapchat", {
            method: "GET",
            headers: {
                Accept: "*/*",
                "Content-type": "multipart/form-data;",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
            },
        })
            .then(response => response.json())
            .then(json => {
                //console.log(json.data);
                setValues(json.data);

                //facebook.forEach(item => console.log(item.val));
            }
            )
            .catch(error => {
                console.error(error);
            }
            );
    };


    const getKeyVal = (param) => {
        const item = values?.filter(item => item.ob_key === param) || [];
        return item[0].val;
    }


    // LogOut Function
    const _removeSession = async () => {
        try {
            AsyncStorage.getAllKeys()
                .then(keys => AsyncStorage.multiRemove(keys))
                .then(() => navigation.replace("Splash"));
        } catch (error) {
            console.log(error);
            alert("Erorr : " + error);
        }
    };


    //   const switchLang = async () => {
    //     if (translate.locale == 'ar') {
    //       translate.locale = 'en';
    //       await AsyncStorage.setItem("lang", "en");
    //     }
    //     else {
    //       translate.locale = 'ar';
    //       await AsyncStorage.setItem("lang", "ar");
    //     }
    //     navigation.replace("Splash");
    //   }


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#34ace0" translucent />
            <DrawerScreenHeader screenTitle={"الإعدادات"} />
            <View
                style={{
                    width: "85%",
                    backgroundColor: "#FFF",
                    marginVertical: 20,
                    paddingVertical: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    borderColor: "#4D5DFA",

                    // Shadow
                    shadowColor: "#4D5DFA",
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.3,
                    elevation: 6
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('ResetPwd')}
                    style={{
                        width: "90%",
                        padding: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <View>
                        <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                color: "#143656",
                                marginHorizontal: 10
                            }}>

                            تغيير كلمه المرور
                        </Text>

                        <Entypo
                            name="lock"
                            size={24}
                            color="#616161"
                            style={{ marginLeft: 10 }}
                        />
                    </View>
                </TouchableOpacity>








                <TouchableOpacity
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                    style={{
                        width: "90%",
                        padding: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <View>
                        <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                color: "#143656",
                                marginHorizontal: 10
                            }}>

                            سياسة الخصوصية

                        </Text>


                        <MaterialIcons
                            name="privacy-tip"
                            size={24}
                            color="#616161"
                            style={{ marginLeft: 10 }}
                        />


                    </View>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => navigation.navigate('TermsAndConditions')}
                    style={{
                        width: "90%",
                        padding: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <View>
                        <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                color: "#143656",
                                marginHorizontal: 10
                            }}>

                            الشروط و الأحكام

                        </Text>




                        <FontAwesome5 name="clipboard-list" size={24}
                            color="#616161"
                            style={{ marginLeft: 10 }} />

                    </View>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => navigation.navigate('HowWorks')}
                    style={{
                        width: "90%",
                        padding: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <View>
                        <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                color: "#143656",
                                marginHorizontal: 10
                            }}>

                            كيف يعمل التطبيق

                        </Text>

                        <AntDesign
                            name="infocirlceo"
                            size={24}
                            color="#616161"
                            style={{ marginLeft: 10 }}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    //onPress={() => switchLang()}
                    style={{
                        width: "90%",
                        padding: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <View>
                        <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                color: "#143656",
                                marginHorizontal: 10
                            }}>

                            تغيير اللغة

                        </Text>
                        <FontAwesome name="language" size={24} color="#616161" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => _removeSession()}
                    style={{
                        width: "90%",
                        padding: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <View>
                        <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                color: "#143656",
                                marginHorizontal: 10
                            }}
                        >
                            تسجيل الخروج
                        </Text>
                        <AntDesign name="closecircle" size={24} color="#616161" />
                    </View>

                </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center", marginTop: 50, marginBottom: 20 }}>
                <Text style={{ fontFamily: "Bold" }}>
                    وسائل التواصل الاجتماعي
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center" }}>

                    <TouchableOpacity
                        onPress={() => Linking.openURL(getKeyVal('facebook'))}
                        style={{ margin: 10 }}>
                        <Entypo name="facebook" size={35} color="grey" />

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Linking.openURL(getKeyVal('facebook'))}
                        style={{ margin: 10 }}>
                        <FontAwesome5 name="twitter-square" size={35} color="grey" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Linking.openURL(getKeyVal('snapchat'))}
                        style={{ margin: 10 }}>
                        <FontAwesome name="snapchat-square" size={35} color="grey" />
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => Linking.openURL(getKeyVal('youtube'))}
                        style={{ margin: 10 }}>
                        <FontAwesome name="youtube-square" size={35} color="grey" />
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => Linking.openURL(getKeyVal('instagram'))}
                        style={{ margin: 10 }}>
                        <FontAwesome5 name="instagram-square" size={35} color="grey" />
                    </TouchableOpacity>



                </View>

            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <Text
                    style={{
                        fontFamily: "Bold",
                        textAlign: "center",
                        color: "grey",
                        marginHorizontal: 30,
                    }}
                >
                    مستعمل.كوم 2024
                </Text>
            </View>
        </View>
    );
}
