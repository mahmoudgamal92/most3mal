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
    ImageBackground,
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
    const [isLoading, setLoading] = React.useState(false);
    const { item } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState("");
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const [input_modal, setInputModal] = React.useState(false);

    
        
    const toggleFavorite = async () => {
        try {
            const user_token = await AsyncStorage.getItem("user_token");
                let formData = new FormData();
                formData.append("ad_id", item.id);
                fetch("https://mestamal.com/api/user/add_wishlist", {
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
                    .then(responseJson => {
                        alert(responseJson.msg);
                    });
        } catch (error) {
            console.log(error);
        }
    };
    

    const _openChat = async () => {
        const user_token = await AsyncStorage.getItem("user_token");

        setLoading(true);
        let url = "https://mestamal.com/api/contact/" + item.user_id;
        try {
            fetch(url, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Content-type": "multipart/form-data;",
                    "cache-control": "no-cache",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive",
                    Authorization: "Bearer " + user_token
                }
            })
                .then(response => response.json())
                .then(json => {
                    if (json.status == true) {
                        setLoading(false);
                        navigation.navigate("ChatScreen",
                            {
                                chat_id: item.user_id,
                                user_name: item.user.name,
                            });
                    }
                    else {
                        setLoading(false);
                        alert(json.msg);

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
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#34ace0",
                    paddingHorizontal: 20,
                }}
            >

                <View style={{ width: "20%", alignItems: "flex-end" }}>
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


                <View style={{ width: "20%", alignItems: "flex-start" }}>
                    <MaterialIcons
                        name="favorite-border"
                        size={24}
                        color="#FFF" />
                </View>
            </View>


            <View>
                <ImageBackground
                    source={{ uri: "https://mestamal.com/uploads/" + item.main_image }}
                    style={{ width: "100%", height: 280 }} >
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
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        marginVertical: 20,
                        alignItems: "center"
                    }}>

                    <Text style={{ fontFamily: "Bold", fontSize: 25, color: "#34ace0" }}>
                        {item.price} SAR
                    </Text>

                    <Text style={{ fontFamily: "Regular", color: "grey" }}>
                        10 Month ago
                    </Text>

                </View>

                <View style={{ paddingHorizontal: 20 }}>

                    <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#000" }}>
                        {item.title}
                    </Text>

                    <Text style={{ color: "grey", fontFamily: "Regular", marginTop: 20, }}>
                        {item.details}
                    </Text>
                </View>

                <View style={{ paddingHorizontal: 20, marginVertical: 30 }}>

                    <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#000" }}>
                        العنوان
                    </Text>

                    <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>

                        <Entypo name="location-pin" size={24} color="grey" />
                        <Text style={{ color: "grey", fontFamily: "Regular" }}>
                            {item.address}
                        </Text>

                    </View>


                </View>

                {item.user !== undefined ?

                    <View style={{ paddingHorizontal: 30, marginTop: 20 }}>
                        <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#000" }}>
                            معلومات الناشر
                        </Text>

                        <View style={{
                            flexDirection: "row-reverse",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 10
                        }}>

                            <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
                                <Image source={require('./../assets/user.jpg')} style={{ width: 50, height: 50, borderRadius: 50, marginHorizontal: 5 }} />

                                <Text style={{ color: "grey", fontFamily: "Bold", fontSize: 18 }}>
                                    {
                                        item.user != null ? item.user.name : "لاتوجد معلومات"
                                    }
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
                    :
                    null
                }

                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    position: "absolute",
                    bottom: 20,
                    width: "100%",
                    paddingHorizontal: 10
                }}>

                    <View style={{ width: "20%", }}>
                        <TouchableOpacity
                        onPress={()=> toggleFavorite()}
                            style={{ width: 60, height: 60, backgroundColor: "#4BAE52", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                            <MaterialIcons name="favorite-border" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "60%" }}>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("Contact") }}
                            style={{ width: "100%", height: 60, backgroundColor: "#FE5722", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                            <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}>
                                الإبلاغ عن مشكلة
                            </Text>

                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "20%", alignItems: "flex-end" }}>
                        {item.user !== undefined ?
                            <TouchableOpacity
                                onPress={() => _openChat()}
                                style={{
                                    width: 60,
                                    height: 60,
                                    backgroundColor: "#000",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 10,
                                }}>
                                {isLoading ?
                                    <ActivityIndicator size="small" color="#FFF" /> :
                                    <Ionicons name="chatbubbles-outline" size={24} color="#FFF" />
                                }
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={{
                                    width: 60,
                                    height: 60,
                                    backgroundColor: "red",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 10,
                                }}>
                                {isLoading ?
                                    <ActivityIndicator size="small" color="#FFF" /> :
                                    <AntDesign name="delete" size={24} color="#FFF" />
                                }
                            </TouchableOpacity>
                        }
                    </View>
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