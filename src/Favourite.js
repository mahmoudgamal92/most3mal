import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import api from "./../constants/constants";

export default function Favourite({ route, navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      _retrieveData();
    }, [])
  );

  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    let url = api.custom_url + "wishlist/list.php?user_id=" + user_id;
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
          alert(JSON.stringify(json));
          setData(json.data);
          setLoading(false);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = async ad_id => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      let formData = new FormData();
      formData.append("ad_id", ad_id);
      formData.append("user_id", user_id);

      fetch(api.custom_url + "wishlist/toggle.php", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        },
        body: formData
      })
        .then(response => response.json())
        .then(responseJson => {
         // alert(responseJson.message);
          _retrieveData();
        });
    } catch (error) {
      console.log(error);
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
          لا توجد لديك أي إعلانات مفضلة
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#34ace0" />
      <View style={styles.header}>
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
            الإعلانات المفضلة
          </Text>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 10,
          width: "100%"
        }}
        ListEmptyComponent={handleEmptyProp()}
        numColumns={2}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          <View
            style={{
              width: "48%",
              marginHorizontal: 5,
              marginVertical: 5
            }}
          >
            {item.ad !== null
              ? <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AddDetails", {
                      item: item
                    });
                  }}
                  style={styles.itemContainer}
                >
                  <ImageBackground
                    imageStyle={styles.itemImg}
                    source={{ uri: api.media_url + item.images.split(",")[0] }}
                  >
                    <View style={styles.itemContent}>
                      <TouchableOpacity
                        onPress={() => toggleFavorite(item.id)}
                      >
                        <MaterialIcons name="favorite" size={30} color="red" />
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>

                  <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
                    <Text
                      style={{
                        fontFamily: "Bold",
                        color: "#000",
                        textAlign: "left",
                        fontSize: 12
                      }}
                    >
                      {item.title}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginTop: 10,
                        alignItems: "center"
                      }}
                    >
                      <Entypo name="location-pin" size={24} color="grey" />
                      <Text style={{ fontFamily: "Regular", color: "grey" }}>
                        عرض الموقع
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 10,
                      marginVertical: 10
                    }}
                  >
                    <Text style={{ fontFamily: "Bold", color: "#34ace0" }}>
                      {item.price} SR
                    </Text>

                    <AntDesign name="shoppingcart" size={24} color="black" />
                  </View>
                </TouchableOpacity>
              : null}
          </View>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
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
    flexDirection: "row-reverse",
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 160,
    width: "100%"
  },
  featuredItem: {
    height: 160,
    alignItems: "flex-start",
    padding: 5,
    flexDirection: "row-reverse"
  },

  itemImg: {
    width: "100%",
    resizeMode: "cover",
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
    width: "100%",
    backgroundColor: "#FFF",
    elevation: 5
  },
  item: {
    width: "100%"
  }
});