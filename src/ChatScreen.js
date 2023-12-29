import React, {
  Component,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
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
  Modal
} from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Feather,
  Ionicons,
  Entypo
} from "@expo/vector-icons";
import styles from "../constants/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import BottomSheet from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import moment from "moment";

import api from "./../constants/constants";

export default function ChatScreen({ navigation, route }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conv, setConversation] = useState([]);
  const [img_modal, setImgModal] = useState(false);

  const [user_id, setUserID] = useState("");
  const [message, setMessage] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const { chat_id } = route.params;
  const [bottomSheetState, SetBottomSheetState] = useState(-1);
  const [image, setImage] = useState(null);


  const [imageURI, setImageURI] = useState(null);
  useEffect(() => {
    _retrieveData();
  }, []);

  const bottomSheetRef = useRef();
  const handleSheetChanges = useCallback(index => { }, []);

  const openBottomSheet = () => {
    SetBottomSheetState(0);
    bottomSheetRef.current.expand();
  };

  const closeBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };


  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1
      });

      if (!result.canceled) {
        let localUri = result.assets[0].uri;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let img_type = match ? `image/${match[1]}` : `image`;
        setImageURI(localUri);

        // Read the selected image file and convert it to base64
        const base64String = await FileSystem.readAsStringAsync(localUri, {
          encoding: FileSystem.EncodingType.Base64
        });
        setImageURI(`data:image/png;base64,${base64String}`);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const _retrieveData = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    setUserID(user_id);
    let url = api.custom_url + "messaging/chat.php?conv_id=" + chat_id;
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
          //alert(JSON.stringify(json))
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
    let url =
      api.custom_url +
      "messaging/seen.php?conv_id=" +
      chat_id +
      "&user_id=" +
      user_id;
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
        .then(json => { })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    Keyboard.dismiss();
    closeBottomSheet();
    setImageURI(null);
    setBtnLoading(true);

    const user_id = await AsyncStorage.getItem("user_id");

    let url = api.custom_url + "messaging/msg.php";
    let formData = new FormData();
    formData.append("sender_id", user_id);
    formData.append("conv_id", chat_id);
    formData.append("message", message);
    formData.append("attachments", imageURI);
    formData.append("seen", "0");
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
        body: formData
      })
        .then(response => response.json())
        .then(json => {
          //alert(JSON.stringify(json))
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
      style={{
        width: "100%",
        paddingTop: Constants.statusBarHeight,
        flex: 1
      }}
    >
      <StatusBar backgroundColor="#34ace0" />

      <View
        style={{
          flex: 1
        }}
      >
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

        <View
          style={{
            flex: 1,
            width: "100%",
            paddingHorizontal: 20,
            marginBottom: 100
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            scroallEnabled={true}
            keyExtractor={item => item.adv_id}
            renderItem={({ item }) =>
              <View style={{ width: "100%" }}>
                {item.sender_id == user_id
                  ? <View style={styles.leftMessageContainer}>
                    <View>
                      {item.attachment == null || item.attachment == "" || item.attachment == "null"
                        ? null
                        :
                        <TouchableOpacity
                          onPress={() => {
                            setImage(item.attachment);
                            setImgModal(true);
                          }}>
                          <Image
                            source={{ uri: item.attachment }}
                            style={{
                              width: 120,
                              height: 120,
                              borderRadius: 10,
                              margin: 5
                            }}
                          />
                        </TouchableOpacity>
                      }
                    </View>
                    {item.msg !== "" ?
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
                          {item.msg}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Regular",
                            color: "#000",
                            fontSize: 10
                          }}
                        >
                          {moment(item.created_at).startOf("day").fromNow()}
                        </Text>
                      </View>
                      :
                      null
                    }
                  </View>
                  : <View style={styles.rightMessageContainer}>
                    <View>
                      {item.attachment == null || item.attachment == "" || item.attachment == "null"
                        ? null
                        :
                        <TouchableOpacity
                          onPress={() => {
                            setImage(item.attachment);
                            setImgModal(true);
                          }}>
                          <Image
                            source={{ uri: item.attachment }}
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: 10,
                              margin: 5
                            }}
                          />
                        </TouchableOpacity>
                      }
                    </View>

                    {item.msg !== "" ?
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
                          {item.msg}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Regular",
                            color: "#FFF",
                            fontSize: 10
                          }}
                        >
                          {moment(item.created_at).startOf("day").fromNow()}
                        </Text>
                      </View>
                      :
                      null}
                  </View>}
              </View>}
          />
        </View>

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
              paddingHorizontal: 25,
              backgroundColor: "#fff",
              elevation: 8,
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50
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

            <TouchableOpacity
              style={{ width: "10%" }}
              onPress={() => openBottomSheet()}
            >
              <Entypo name="attachment" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={bottomSheetState}
          enableOverDrag={true}
          snapPoints={["40%"]}
          handleComponent={() => null}
          enableContentPanningGesture={true}
          onChange={handleSheetChanges}
          style={{ backgroundColor: "grey" }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => closeBottomSheet()}
              style={{
                marginTop: 20,
                width: "100%"
              }}
            >
              <Text style={{ fontFamily: "Bold", fontSize: 15 }}>إغلاق</Text>
            </TouchableOpacity>

            <View
              style={{
                height: 120,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row-reverse",
                flexWrap: "wrap"
              }}
            >
              <TouchableOpacity
                onPress={() => pickImage()}
                style={{ margin: 5 }}
              >
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    resizeMode: "contain",
                    margin: 5
                  }}
                  source={require("./../assets/add.png")}
                />
              </TouchableOpacity>

              {imageURI !== null && imageURI !== ""
                ? <Image
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#34ace0",
                    resizeMode: "contain",
                    margin: 5
                  }}
                  source={{ uri: imageURI }}
                />
                : null}
            </View>

            <View
              style={{
                width: "100%"
              }}
            >
              <TextInput
                onChangeText={message => setMessage(message)}
                placeholder="أكتب رسالتك"
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#DDDDDD",
                  width: "100%",
                  padding: 10,
                  fontFamily: "Bold"
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => sendMessage()}
              style={{
                marginTop: 20,
                backgroundColor: "#34ace0",
                width: "100%",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                padding: 10
              }}
            >
              <Text style={{ fontFamily: "Bold", fontSize: 15, color: "#FFF" }}>
                إرسال
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>


      <Modal transparent={true} animationType="slide" visible={img_modal}>
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, { width: "90%", marginVertical: 100 }]}
          >
            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "flex-end",
                paddingHorizontal: 20,
                marginVertical: -25,
                zIndex: 1000
              }}
              onPress={() => setImgModal(!img_modal)}
            >
              <FontAwesome name="close" size={30} color="grey" />
            </TouchableOpacity>
            <View style={{
              height: 400,
              width: "100%"
            }}>
              <Image
                source={{ uri: image }}
                style={{
                  height: 400,
                  width: "100%",
                  resizeMode: "cover"
                }} />
            </View>

          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
} 