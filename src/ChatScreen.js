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
import Constants from "expo-constants";

export default function ChatScreen({ navigation, route }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conv, setConversation] = useState([]);
  const [user_id, setUserID] = useState("");
  const [message, setMessage] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const { chat_id } = route.params;

  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    setUserID(user_id);
    let url =
      "https://mestamal.com/mahmoud/messaging/chat.php?conv_id=" + chat_id;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        }
      })
        .then(response => response.json())
        .then(json => {
          setData(json.messages);
          setConversation(json.conversation);
          setLoading(false);
          _updateSeen();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const _updateSeen = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    let url = "https://mestamal.com/mahmoud/messaging/seen.php?conv_id=" + chat_id+"&user_id="+user_id;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        }
      })
        .then(response => response.json())
        .then(json => {
        //   setData(json.messages);
        //   setConversation(json.conversation);
        //   setLoading(false);
        //   _updateSeen();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    Keyboard.dismiss();
    setBtnLoading(true);
    const user_id = await AsyncStorage.getItem("user_id");
    let url = "https://mestamal.com/mahmoud/api/api.php/records/message";
    const body = JSON.stringify({
      sender_id: user_id,
      conv_id: chat_id,
      message: message,
      attatchments: "",
      seen: "0"
    });
    try {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        },
        body: body
      })
        .then(response => response.json())
        .then(json => {
          setBtnLoading(false);
          setMessage("");
          _retrieveData();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      style={{
        width: "100%"
      }}
    >
      <View
        style={{
          width: "100%",
          marginTop: Constants.statusBarHeight,
          height: Dimensions.get("window").height
        }}
      >
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
            {conv.sender_id == user_id ? conv.reciver_name : conv.sender_name}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", right: 20 }}
          >
            <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>

        {loading == true
          ? null
          : <View style={{ width: "100%", paddingHorizontal: 20 }}>
              <FlatList
                data={data}
                keyExtractor={item => item.adv_id}
                renderItem={({ item }) =>
                  <View>
                    {item.sender_id == user_id
                      ? <View style={styles.leftMessageContainer}>
                          <View
                            style={{
                              ...styles.messageTileleft,
                              backgroundColor: "#DDDDDD"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                color: "#000",
                                fontFamily: "Regular"
                              }}
                            >
                              {item.message}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Regular",
                                color: "#000",
                                fontSize: 10
                              }}
                            >
                              12:00:00
                            </Text>
                          </View>
                        </View>
                      : <View style={styles.rightMessageContainer}>
                          <View
                            style={{
                              ...styles.messageTileright,
                              backgroundColor: "#34ace0"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                color: "#FFF",
                                fontFamily: "Regular"
                              }}
                            >
                              {item.message}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Regular",
                                color: "#FFF",
                                fontSize: 10
                              }}
                            >
                              12:00:00
                            </Text>
                          </View>
                        </View>}
                  </View>}
              />
            </View>}
        <View
          style={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            alignItems: "center"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "90%",

              backgroundColor: "#fff",
              elevation: 8,
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              paddingHorizontal: 10
            }}
          >
            <TextInput
              placeholder="أكتب رسالتك....."
              returnKeyType="send"
              onSubmitEditing={message => sendMessage(message)}
              placeholderTextColor="#666"
              value={message}
              onChangeText={message => setMessage(message)}
              style={{
                padding: 15,
                fontSize: 15,
                fontFamily: "Regular",
                textAlign: "right",
                width: "90%"
              }}
              placeholderStyle={{
                fontFamily: "Regular"
              }}
            />

            <TouchableOpacity
              style={{ width: "10%" }}
              onPress={() => sendMessage()}
            >
              {btnLoading == true
                ? <ActivityIndicator size="small" color="#0000ff" />
                : <FontAwesome name="send" size={26} color="#666" />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}