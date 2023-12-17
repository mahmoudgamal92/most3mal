import { Text, View, StatusBar, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import api from "./../constants/constants";
import {
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
  SimpleLineIcons
} from "@expo/vector-icons";
import styles from "../constants/style";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfilePage({ route }) {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
    }, [])
  );


  const getProfile = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    fetch(api.custom_url + "user/info.php?user_id=" + user_id, {
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
        setLoading(false);
        setData(json.data[0]);
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  };

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
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 20,
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            <SimpleLineIcons name="menu" size={40} color="#FFF" />
          </TouchableOpacity>

          <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
            الملف الشخصي
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", right: 20 }}
        >
          <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.loginBox}>
        <TouchableOpacity style={styles.profileImgContainer}>
          {data.image !== null
            ? <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  style={{
                    width: 150,
                    height: 150,
                    resizeMode: "contain",
                    borderRadius: 75,
                    borderWidth: 2,
                    borderColor: "#0393ce"
                  }}
                  source={{ uri: "https://mestamal.com/uploads/" + data.image }}
                />
              </View>
            : <Feather name="user" size={70} color="#FFF" />}
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            marginVertical: 10,
            marginTop: 100
          }}
        >
          <View style={{ marginRight: 30 }}>
            <FontAwesome name="user-circle" size={40} color="grey" />
          </View>

          <View>
            <Text
              style={{
                fontFamily: "Regular",
                textAlign: "left",
                fontSize: 12,
                color: "grey"
              }}
            >
              أسم المستخدم
            </Text>

            <Text
              style={{ fontFamily: "Bold", textAlign: "left", fontSize: 20 }}
            >
              {data.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            marginVertical: 10
          }}
        >
          <View style={{ marginRight: 20 }}>
            <MaterialCommunityIcons
              name="email-outline"
              size={40}
              color="grey"
            />
          </View>

          <View>
            <Text
              style={{
                fontFamily: "Regular",
                textAlign: "left",
                fontSize: 12,
                color: "grey"
              }}
            >
              البريد الإلكتروني
            </Text>

            <Text
              style={{ fontFamily: "Bold", textAlign: "left", fontSize: 18 }}
            >
              {data.email}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            marginVertical: 10
          }}
        >
          <View style={{ marginRight: 30 }}>
            <Feather name="smartphone" size={40} color="grey" />
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Regular",
                textAlign: "left",
                fontSize: 12,
                color: "grey"
              }}
            >
              رقم الهاتف
            </Text>

            <Text
              style={{ fontFamily: "Bold", textAlign: "left", fontSize: 18 }}
            >
              {data.phone}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            marginVertical: 10
          }}
        >
          <View style={{ marginRight: 30 }}>
            <AntDesign name="calendar" size={40} color="grey" />
          </View>

          <View>
            <Text
              style={{
                fontFamily: "Regular",
                textAlign: "left",
                fontSize: 12,
                color: "grey"
              }}
            >
              تاريخ تسجيل المستخدم
            </Text>

            <Text
              style={{ fontFamily: "Bold", textAlign: "left", fontSize: 18 }}
            >
              {data.created_at}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          position: "absolute",
          bottom: 20
        }}
      >
        <View style={{ width: "75%" }}>
          <TouchableOpacity
            onPress={() => _removeSession()}
            style={{
              backgroundColor: "red",
              width: "100%",
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              marginTop: 20,
              paddingHorizontal: 20
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#FFF",
                fontFamily: "Bold"
              }}
            >
              تسجيل الخروج
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "20%"
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditProfile", {
                item: data
              })}
            style={{
              backgroundColor: "#34ace0",
              width: "100%",
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              marginTop: 20,
              paddingHorizontal: 20
            }}
          >
            <MaterialIcons name="mode-edit" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
