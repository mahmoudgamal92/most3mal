import React, { Component, useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    KeyboardAvoidingView,
    Keyboard,
    Dimensions
} from "react-native";
import {
    FontAwesome,
    MaterialIcons,
    Feather,
    Entypo
} from "@expo/vector-icons";
import styles from "../constants/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';

export default function ChatScreen({ navigation, route }) {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const { chat_id, user_name } = route.params;
    useEffect(() => {
        _retrieveData();
    }, []);

    const _retrieveData = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        let url = "https://www.mestamal.com/api/chatprivate/" + chat_id;
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
                    setData(json.messages);
                    //setLoading(false);
                    // alert(JSON.stringify(json));
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };



    const sendMessage = async () => {
        Keyboard.dismiss();
        setBtnLoading(true);
        let formData = new FormData();
        formData.append("receiver_id", chat_id);
        formData.append("message", message);
        if (message == "") {
            setBtnLoading(false);
            alert("لا يمكن ارسال لاسالة فارغه");
            return;
        }
        else {
            const user_token = await AsyncStorage.getItem("user_token");
            let url = "https://www.mestamal.com/api/send-message";
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
                            setBtnLoading(false);
                            setMessage("");
                            _retrieveData();
                        }
                        else {
                            setBtnLoading(false);
                            alert(JSON.stringify(json));
                        }
                    })
                    .catch(error => console.error(error));
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior='position'
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            style={{
                width: "100%",
            }}>
            <View style={{
                width: "100%",
                marginTop: Constants.statusBarHeight,
                height: Dimensions.get("window").height
            }}>
                <StatusBar backgroundColor="#34ace0" />
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


                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 14 }}>
                        {user_name}
                    </Text>


                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ position: "absolute", right: 20 }}>
                        <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={{ width: "100%", paddingHorizontal: 20 }}>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.adv_id}
                        renderItem={({ item }) => (

                            <View>
                                {item.user_id == chat_id ?
                                    <View style={styles.leftMessageContainer}>
                                        <View
                                            style={{
                                                ...styles.messageTileleft,
                                                backgroundColor: "#DDDDDD"
                                            }}
                                        >
                                            <Text
                                                style={{ fontSize: 15, color: "#000", fontFamily: "Regular" }}
                                            >
                                                {item.message}
                                            </Text>
                                            <Text style={{ fontFamily: "Regular", color: "#000", fontSize: 10 }}>
                                                12:00:00
                                            </Text>
                                        </View>
                                    </View>

                                    :

                                    <View style={styles.rightMessageContainer}>
                                        <View
                                            style={{
                                                ...styles.messageTileright,
                                                backgroundColor: "#34ace0"
                                            }}
                                        >
                                            <Text
                                                style={{ fontSize: 15, color: "#FFF", fontFamily: "Regular" }}
                                            >
                                                {item.message}
                                            </Text>
                                            <Text style={{ fontFamily: "Regular", color: "#FFF", fontSize: 10 }}>
                                                12:00:00
                                            </Text>
                                        </View>
                                    </View>
                                }
                            </View>

                        )}
                    />

                </View>
                <View style={{
                    position: "absolute",
                    bottom: 10,
                    width:"100%",
                    alignItems:"center"
                }}>

                    <View style={{
                        flexDirection: "row",
                        width: "90%",

                        backgroundColor: "#fff",
                        elevation: 8,
                        marginBottom: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                        paddingHorizontal: 10
                    }}>


                        <TextInput
                            placeholder="أكتب رسالتك....."
                            returnKeyType="send"
                            onSubmitEditing={(message) => sendMessage(message)}
                            placeholderTextColor="#666"
                            value={message}
                            onChangeText={message => setMessage(message)}
                            style={{
                                padding: 15,
                                fontSize: 15,
                                fontFamily: "Regular",
                                textAlign: "right",
                                width: "90%",
                            }}
                            placeholderStyle={{
                                fontFamily: "Regular"
                            }}
                        />


                        <TouchableOpacity style={{ width: "10%", }}
                            onPress={() => sendMessage()} >
                            {btnLoading == true ?
                                <ActivityIndicator size="small" color="#0000ff" />
                                :
                                <FontAwesome name="send" size={26} color="#666" />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </KeyboardAvoidingView>
    );
}
