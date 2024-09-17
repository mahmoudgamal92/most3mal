import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Entypo,
  AntDesign
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
import api from "../constants/constants";

import DrawerScreenHeader from "./../components/DrawerScreenHeader";

export default function MyAuctions({ route, navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    _retrieveData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      _retrieveData();
    }, [])
  );

  const _retrieveData = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let url = api.custom_url + "user/auctions.php?user_id=" + user_id;
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
          // alert(JSON.stringify(json));
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };


  const updateStatus = async (id, status) => {

    let url = api.dynamic_url + "auctions/" + id;
    const body = JSON.stringify({
      "status": status == "active" ? "inactive" : "active",
    });
    try {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
        body: body
      })
        .then(response => response.json())
        .then(json => {
          alert("تم  تغيير حالة الاعلان بنجاح");
          _retrieveData();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const render_order = (val) => {
    switch (val) {
      case "active":
        return {
          color: "green",
          text: "نـــشـط"
        };

      case "inactive":
        return {
          color: "red",
          text: "غير نشط"
        };


      case "pending":
        return {
          color: "grey",
          text: "قيد الانتظار"
        };
      case "done":
        return {
          color: "green",
          text: "مكتمل"
        };

      default:
        return {
          color: "#119fbf",
          text: "حالة غير معروفة"
        };
    }
  };

  const handleEmptyProp = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 160
        }}
      >
        <Image
          source={require("./../assets/broken-heart.png")}
          style={{ width: 200, height: 200 }}
        />
        <Text
          style={{
            fontFamily: "Regular",
            color: "#c9c9c9",
            fontSize: 18,
            marginTop: 10
          }}
        >
          لم تقم بإضافة أي مزادات حتي الأن
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#34ace0" />
      <DrawerScreenHeader screenTitle={"مزاداتي"} />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>

        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={handleEmptyProp()}
          renderItem={({ item }) =>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AuctionDetails", {
                  item: item
                })}
              style={{
                flexDirection: "row",
                borderColor: "#DDDDDD",
                backgroundColor: '#FFF',
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                justifyContent: "flex-end",
                marginVertical: 5,
                height: 150
              }}
            >

              <View style={{
                position: 'absolute',
                top: 0,
                backgroundColor: render_order(item.status).color,
                width: 80,
                height: 30,
                zIndex: 9999,
                alignItems: 'center'
              }}>
                <Text style={{
                  color: "#FFF",
                  fontFamily: 'Regular'
                }}>
                  {render_order(item.status).text}
                </Text>
              </View>
              <View
                style={{
                  width: "30%",
                  flexDirection: 'row',
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "تأكيد !",
                      'هل أنت متأكد من تغيير حالة هذا المزاد',
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel"
                        },
                        { text: "OK", onPress: () => updateStatus(item.id, item.status) }
                      ]
                    );
                  }}
                >
                  {item.status == "active" ?
                    <Entypo name="eye-with-line" size={30} color="red" />
                    :
                    <AntDesign name="eye" size={30} color="green" />
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('EditAuction', {
                  item: item
                })}>
                  <AntDesign name="edit" size={30} color="grey" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: "40%",
                  marginHorizontal: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{ fontFamily: "Bold", fontSize: 15, textAlign: 'right' }}>
                  {item.title}
                </Text>
                <Text
                  style={{ fontFamily: "Regular", fontSize: 12, color: "grey", textAlign: 'right' }}
                >
                  {item.details}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around"
                  }}
                />
              </View>

              <View style={{ width: "30%" }}>
                <Image
                  source={{ uri: api.media_url + item.images?.split(",")[0] }}
                  style={{
                    width: "100%",
                    height: '100%',
                    resizeMode: "cover",
                  }}
                />
              </View>
            </TouchableOpacity>}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("AddAuction")}
        style={{
          width: 120,
          height: 50,
          borderRadius: 30,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "#34ace0",
          position: "absolute",
          bottom: 20,
          right: 20
        }}
      >
        <Entypo name="plus" size={24} color="#FFF" />
        <Text
          style={{ fontFamily: "Bold", color: "#FFF", marginHorizontal: 5 }}
        >
          إضافة مزاد
        </Text>
      </TouchableOpacity>
      <Toast config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  header: {
    paddingTop: Constants.statusBarHeight,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5
  },
  cats: {
    flexDirection: "row",
    marginVertical: 20
  },
  cat: {
    justifyContent: "center",
    alignItems: "center"
  },
  catItem: {
    borderWidth: 2,
    borderColor: "#FF9000",
    marginHorizontal: 10,
    borderRadius: 30,
    width: 60,
    height: 60,
    resizeMode: "contain",
    borderRadius: 30
  },
  catText: {
    fontFamily: "Bold",
    color: "#143656",
    marginVertical: 5,
    fontFamily: "Bold"
  },

  body: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5
  },
  itemContent: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 160
  },
  featuredItem: {
    height: 160,
    alignItems: "flex-start",
    padding: 5,
    flexDirection: "row-reverse"
  },

  itemImg: {
    width: "100%",
    resizeMode: "contain",
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  logo: {
    width: 50,
    height: 50,
    padding: 5,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#000"
  },
  itemContainer: {
    borderRadius: 15,
    width: "48%",
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: "#828282"
  },
  item: {
    width: "100%"
  }
});