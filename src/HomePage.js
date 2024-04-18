import {
  Image,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  Ionicons,
  Feather,
  Entypo,
  AntDesign,
  SimpleLineIcons,
  FontAwesome
} from "@expo/vector-icons";
import * as Location from "expo-location";

import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "react-native-reanimated-carousel";
import api from "./../constants/constants";

export default function HomePage({ route, navigation }) {
  const width = Dimensions.get("window").width;
  const [departs, setDeparts] = useState([]);
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search_text, setSearchText] = useState("");
  const scrollViewRef = useRef(null);

  useEffect(() => {
    getLocation();
    _retrieveData();
    _fetchBanners();
  }, []);

  const getLocation = async () => {
    const location_coordinates = await AsyncStorage.getItem("current_location");

    if (location_coordinates !== null) {

    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        //  alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      AsyncStorage.setItem("current_location", JSON.stringify(location.coords));
    }
  };

  const _retrieveData = async () => {
    setLoading(true);
    let url = api.dynamic_url + "departments";
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        }
      })
        .then(response => response.json())
        .then(json => {
          setDeparts(json.records);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  _fetchBanners = () => {
    let url = api.dynamic_url + "banners";
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",

          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        }
      })
        .then(response => response.json())
        .then(json => {
          setBanner(json.records);
          setLoading(false);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <View
          style={{
            width: "100%",
            flexDirection: "row-reverse",
            justifyContent: "space-between"
          }}
        >
          <TouchableOpacity
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >

            <Ionicons name="notifications" size={40} color="#FFF" />
          </TouchableOpacity>

          <View style={{ width: "60%" }}>
            <Image
              source={require("./../assets/white_logo.png")}
              style={{
                width: "100%",
                height: 60,
                alignSelf: "center",
                borderRadius: 10,
                resizeMode: "contain"
              }}
            />
          </View>
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
        </View>
      </View>

      <ScrollView>
        <View
          style={{
            width: "100%",
            marginTop: 20,
            marginBottom: 10,
            paddingHorizontal: 20
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: "#FFF",
              borderRadius: 5,
              paddingHorizontal: 15,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,
              elevation: 13
            }}
          >
            <View style={{ width: "20%", alignItems: "flex-start" }}>
              <AntDesign name="search1" size={30} color="grey" />
            </View>

            <View
              style={{
                width: "80%"
              }}
            >
              <TextInput
                style={{
                  width: "100%",
                  fontFamily: "Regular",
                  height: 60,
                  textAlign: "right"
                }}
                onChangeText={param => setSearchText(param)}
                onSubmitEditing={() =>
                  navigation.navigate("SearchResult", {
                    search_param: search_text
                  })}
                returnKeyType="search"
                placeholder="ابحث في مستعمل . كوم"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 200, marginTop: 10 }}>
          <Carousel
            loop
            width={width}
            height={200}
            autoPlay={true}
            data={banner}
            scrollAnimationDuration={2000}
            renderItem={({ item }) =>
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: 10
                }}
              >
                <Image
                  source={{ uri: api.media_url + item.image }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                    resizeMode: "stretch"
                  }}
                />
              </View>}
          />
        </View>

        <ScrollView
          style={{ flex: 1, width: "100%", marginTop: 20, marginBottom: 80 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginTop: 10,
              flexWrap: "wrap"
            }}
          >
            {departs.map((item, index) =>
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("Adds", {
                    depart_id: item.id,
                    depart_name: item.name_ar
                  })}
                style={styles.cat}
              >
                {item.image == null
                  ? <View
                    style={{
                      borderColor: "grey",
                      borderWidth: 2,
                      borderRadius: 20,
                      width: 40,
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Feather name="image" size={25} color="grey" />
                  </View>
                  : <Image
                    source={{
                      uri: api.media_url + item.image
                    }}
                    style={styles.catItem}
                  />}
                <Text style={styles.catText}>
                  {item.name_ar}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DepartSelect");
        }}
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
          right: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6
          },
          shadowOpacity: 0.39,
          shadowRadius: 8.3,

          elevation: 13
        }}
      >
        <Entypo name="plus" size={24} color="#FFF" />
        <Text
          style={{ fontFamily: "Bold", color: "#FFF", marginHorizontal: 5 }}
        >
          إضافة إعلان
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddAuction");
        }}
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
          left: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6
          },
          shadowOpacity: 0.39,
          shadowRadius: 8.3,
          elevation: 13
        }}
      >
        <FontAwesome name="filter" size={24} color="#FFF" />
        <Text
          style={{ fontFamily: "Bold", color: "#FFF", marginHorizontal: 5 }}
        >
          إضافة مزاد
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5F7"
  },
  header: {
    paddingTop: Constants.statusBarHeight,
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#34ace0",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5
  },

  itemTitle: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#FFF",
    fontFamily: "Regular",
    fontSize: 16,
    zIndex: 10000
  },
  body: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5
  },
  itemContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 150
  },
  featuredItem: {
    height: 150,
    alignItems: "flex-start",
    padding: 5,
    flexDirection: "row-reverse"
  },
  itemImg: {
    width: "100%",
    resizeMode: "cover",
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10
  },
  imgLayer: {
    position: "absolute",
    margin: 2.5,
    zIndex: 1000,
    width: "100%",
    height: 300,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5
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
    overflow: "hidden",
    width: "50%",
    height: 300,
    padding: 2.5,
    marginVertical: 5
  },
  item: {
    width: "100%"
  },

  cats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    flexWrap: "wrap",
    width: "100%"
  },

  cat: {
    backgroundColor: "#FFF",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    paddingHorizontal: 5,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13
  },

  catItem: {
    borderRadius: 30,
    width: 60,
    height: 60,
    resizeMode: "contain"
  },

  catText: {
    marginVertical: 5,
    fontFamily: "Bold",
    color: "#143656",
    fontSize: 10,
    textAlign: "center"
  }
});
