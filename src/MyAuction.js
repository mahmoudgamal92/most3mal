import React, { Component, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Linking,
    TextInput,
    ActivityIndicator,
    StatusBar,
    SafeAreaView,
    Modal,
    Platform,
    KeyboardAvoidingView,
    ImageBackground
} from "react-native";
//import { SliderBox } from "react-native-image-slider-box";
import {
    FontAwesome,
    MaterialIcons,
    EvilIcons,
    Ionicons,
    FontAwesome5,
    Feather,
    AntDesign,
    Entypo,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import {
    Actionsheet,
    useDisclose,
    NativeBaseProvider,
    Box,
    Select,
    CheckIcon
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import constants from "../constants/constants";
import Constants from "expo-constants";

const AddDetail = ({ route, navigation }) => {
    const [input_modal, setInputModal] = React.useState(false);
    const [amount, setAmount] = useState("");
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const { item } = route.params;


    const sendOffer = async () => {
        let formData = new FormData();
        formData.append("amount", amount);
        const user_token = await AsyncStorage.getItem("user_token");
        let url = "https://www.mestamal.com/api/user/auctions/4/add_offer";
        try {
            fetch(url, {
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Content-type": "multipart/form-data;",
                    "cache-control": "no-cache",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive",
                    "Authorization": "Bearer " + user_token
                },
                body: formData
            })
                .then(response => response.json())
                .then(json => {
                    if (json.status == true) {
                        alert(json.msg);
                    }
                    else {
                        // setBtnLoading(false);
                        alert(JSON.stringify(json));
                    }
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
            <StatusBar backgroundColor="#34ace0" />

            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#34ace0",
                    paddingHorizontal: 20,
                }}
             >

                <View style={{ width: "20%",alignItems:"flex-start" }}>
                    <AntDesign
                        name="arrowleft"
                        size={24}
                        color="white"
                        onPress={() => navigation.goBack()} />
                </View>

                <View style={{ width: "60%", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{
                        color: "#FFF",
                        fontFamily: "Regular",
                        textAlign: "center",
                        fontSize: 18,
                    }}>
                        {item.title}
                    </Text>
                </View>


                <View style={{ width: "20%",alignItems:"flex-end"  }}>
                    <MaterialIcons
                        name="favorite-border"
                        size={24}
                        color="#FFF" />
                </View>
            </View>

            <View>
                <ImageBackground source={{ uri: "https://mestamal.com/uploads/" + item.main_image }}
                    style={{ width: "100%", height: 280,resizeMode:"contain" }} >
                    <View style={{
                        paddingTop: Constants.statusBarHeight * 1.2,
                        flexDirection: "row",
                        width: "100%",
                        paddingHorizontal: 20
                    }}>

                    </View>

                </ImageBackground>
            </View>



            <View style={{
                flex: 1,
                backgroundColor: "#FFF",
                marginTop: -20,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,

            }}>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                        marginVertical: 20,
                        alignItems: "center",
                        width: "100%"
                    }}>


                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "50%",
                        alignItems: "flex-end",
                    }}>

                        <View style={{ alignItems: "center" }}>
                            <View style={{
                                backgroundColor: "#4EAE54",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                marginHorizontal: 5,
                                borderRadius: 10
                            }}>
                                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                                    00
                                </Text>
                            </View>

                            <Text style={{ fontFamily: "Regular", color: "grey" }}>
                                Days
                            </Text>
                        </View>


                        <View style={{ alignItems: "center" }}>
                            <View style={{
                                backgroundColor: "#4EAE54",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                marginHorizontal: 5,
                                borderRadius: 10
                            }}>
                                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                                    00
                                </Text>
                            </View>

                            <Text style={{ fontFamily: "Regular", color: "grey" }}>
                                Days
                            </Text>
                        </View>




                        <View style={{ alignItems: "center" }}>
                            <View style={{
                                backgroundColor: "#4EAE54",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                marginHorizontal: 5,
                                borderRadius: 10
                            }}>
                                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                                    00
                                </Text>
                            </View>

                            <Text style={{ fontFamily: "Regular", color: "grey" }}>
                                Days
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView style={{ width: "100%", marginBottom: 90 }}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text 
                        style={{ 
                            fontFamily: "Bold", 
                            fontSize: 25, 
                            color: "#34ace0",
                            textAlign:"right"
                            }}>
                        {item.title}
                    </Text>
                    </View>
                  
                    <View>

                        <Text style={{ 
                            color: "grey", 
                            fontFamily: "Regular", 
                            paddingHorizontal: 20, 
                            marginTop: 20,
                            textAlign:"right"
                            }}>
                            {item.details}
                        </Text>

                    </View>




                    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                        <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#000" }}>
                            معلومات الناشر
                        </Text>

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 10
                        }}>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('./../assets/user.jpg')} style={{ width: 50, height: 50, borderRadius: 50, marginHorizontal: 5 }} />


                                <Text style={{ color: "grey", fontFamily: "Bold", fontSize: 18 }}>
                                    Mahmoud Gamal
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <AntDesign name="star" size={20} color="#F7D000" />
                                <AntDesign name="star" size={20} color="#F7D000" />
                                <AntDesign name="star" size={20} color="#F7D000" />
                                <AntDesign name="star" size={20} color="#F7D000" />
                                <AntDesign name="star" size={20} color="#F7D000" />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    position: "absolute",
                    bottom: 10,
                    width: "100%",
                    paddingHorizontal: 10
                }}>

                    {/* <View style={{ width: "20%", }}>
                        <TouchableOpacity style={{ width: 60, height: 60, backgroundColor: "#4BAE52", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                            <Feather name="phone" size={24} color="#EFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "60%" }}>
                        <TouchableOpacity style={{ width: "100%", height: 60, backgroundColor: "#FE5722", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                            <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 18 }}>
                                الإبلاغ عن مشكلة
                            </Text>

                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "20%", alignItems: "flex-end" }}>
                        <TouchableOpacity style={{ width: 60, height: 60, backgroundColor: "#000", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                            <Ionicons name="chatbubbles-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        marginBottom: 50,
        width: "80%",
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "red",
        marginVertical: 20,
        width: "80%",
        marginBottom: 40
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },

    textStyle: {
        color: "white",
        textAlign: "center",
        fontFamily: "Bold"
    },
    modalText: {
        marginBottom: 10,
        textAlign: "center",
        fontSize: 20,
        marginTop: 20,
        fontFamily: "Bold",
        marginHorizontal: 10
    },
    modalBody: {
        textAlign: "center",
        marginTop: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontFamily: "Regular"
    },
});
export default AddDetail;