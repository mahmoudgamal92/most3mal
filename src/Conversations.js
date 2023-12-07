import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Feather, Entypo } from "@expo/vector-icons";
import styles from "../constants/style";
import { useFocusEffect } from "@react-navigation/native";
export default function Conversations({ route, navigation }) {
  const [data, setData] = useState([]);
  const [user_id, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      _retrieveData();
    }, [])
  );

  const _retrieveData = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    setUserID(user_id);
    setLoading(true);
    let url =
      "https://www.mestamal.com/mahmoud/messaging/conversations.php?user_id=" +
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
        .then(json => {
          setData(json.data);
          setLoading(false);
          //alert(JSON.stringify(json));
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

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
          backgroundColor: "#34ace0",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,

          elevation: 11
        }}
      >
        <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
          المحادثات
        </Text>
      </View>

      <FlatList
        style={{ width: "100%", marginTop: 20, paddingHorizontal: 10, flex: 1 }}
        data={data}
        keyExtractor={item => item.conv_num}
        renderItem={({ item }) =>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChatScreen", {
                chat_id: item.conv_num
              })}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginBottom: 10,
              width: "100%",
              paddingHorizontal: 15,
              borderBottomColor: "#b5bcc4",
              borderBottomWidth: 1,
              paddingBottom: 10
            }}
          >
            <View
              style={{
                width: "25%",
                alignItems: "flex-start"
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 70,
                  width: 70,
                  borderRadius: 35,
                  borderColor: "#34ace0",
                  borderWidth: 2,
                  backgroundColor: "#051A3A"
                }}
              >
                <Feather name="user" size={40} color="#FFF" style={{}} />
              </View>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                width: "55%",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 18,
                  textAlign: "left"
                }}
              >
                {user_id == item.sender_id
                  ? item.reciver_name
                  : item.sender_name}
              </Text>
              {parseInt(item.unseen_msg) > 0
                ? <Text
                    style={{
                      fontFamily: "Bold",
                      fontSize: 18,
                      textAlign: "center",
                      backgroundColor: "red",
                      borderRadius: 15,
                      width: 30,
                      height: 30,
                      color: "#FFF"
                    }}
                  >
                    {item.unseen_msg}
                  </Text>
                : null}
            </View>

            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
                width: "10%"
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Entypo name="dots-three-vertical" size={24} color="black" />
              </View>
            </View>
          </TouchableOpacity>}
      />
    </View>
  );
}