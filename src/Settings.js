import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet
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
export default function ProfilePage({ route, navigation }) {

    // const [user_name, setUserName] = useState(null);
    // const [user_type, setUserType] = useState(null);
    // //   useEffect(() => {
    // //     _retriveData();
    // //   }, []);
    // //   const _retriveData = async () => {
    // //     try {
    // //       const user_name = await AsyncStorage.getItem("user_name");
    // //       const user_type = await AsyncStorage.getItem("user_type");
    // //       if (user_name !== null && user_type !== null) {
    // //         setUserName(user_name);
    // //         setUserType(user_type);
    // //       }
    // //     }
    // //     catch (error) {
    // //     }
    // //   };



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
            <StatusBar  backgroundColor="#34ace0" translucent />
            <View style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#34ace0"
            }}>

                <View style={{
                    flexDirection: "row",
                    width: "100%",
                    paddingHorizontal: 20,
                    alignItems: "center"

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

                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 16, marginLeft: 20 }}>
                      الإعدادات  
                    </Text>
                </View>


                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right: 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>
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
                   //onPress={() => switchLang()}
                    style={{
                        width: "90%",
                        padding: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <View style={{ flexDirection: "row-reverse" }}>
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

                    <View>
                        <MaterialIcons name="arrow-back-ios" size={24} color="black" />
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
                    <View style={{ flexDirection: "row-reverse" }}>
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

                    <View>
                        <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                    </View>
                </TouchableOpacity>
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
                    مستعمل جميع الحقوق محفوظه 2022
                </Text>
            </View>
        </View>
    );
}
