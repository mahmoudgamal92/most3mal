import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import moment from "moment";
import api from "./../constants/constants";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Adds({ route, navigation }) {
  const { depart_id, depart_name } = route.params;
  const [data, setData] = useState([]);
  const [cats, setCats] = useState([]);
  const [current_cat, setCurrentCat] = useState(null);
  const [loading, setLoading] = useState(false);
  // function to create a state object


  useEffect(() => {
    _retrieveCats();
    _retrieveData();
  }, []);

  const _retrieveCats = async () => {
    fetch(api.dynamic_url + "categories", {
      method: "GET",
      headers: {
        Accept: "*/*",
        Connection: "keep-alive"
      }
    })
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        const arr = [];
        for (let i = 0; i < json.records.length; i++) {
          if (json.records[i].depart_id == depart_id) {
            arr.push(json.records[i]);
          }
        }
        setCats(arr);
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  };

  const _retrieveData = async () => {
    setLoading(true);
    url = api.custom_url + "ads/list.php?depart_id=" + depart_id;
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
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };


  const changeCat = async cat_id => {
    setCurrentCat(cat_id);
    let url = "";

    if (cat_id == 0 || cat_id == "0" || cat_id == "" || cat_id == null) {
      url = api.custom_url + "ads/list.php?depart_id=" + depart_id;
    }

    else {
      url = api.custom_url + "ads/list.php?depart_id=" + depart_id + "&cat_id=" + cat_id;
    }

    setLoading(true);
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        }
      })
        .then(response => response.json())
        .then(json => {
          if (json.success == true) {
            setData(json.data);
            setLoading(false);
            console.log(JSON.stringify(json));
          }

          else {
            setData([]);
            setLoading(false);
            console.log(JSON.stringify(json));
          }
        })
        .catch(error => console.error(error));
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
          لا توجد أي إعلانات في هذة الفئة
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
            justifyContent: "center",
            height: 60,
            alignItems: "center",
            backgroundColor: "#34ace0",
            paddingHorizontal: 30
          }}
        >
          <View />
          <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
            {depart_name}
          </Text>

          <TouchableOpacity
            style={{ position: "absolute", right: 20 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 20, paddingHorizontal: 10 }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item.cat_id}
          style={{
            marginTop: 10
          }}
        >
          <TouchableOpacity
            onPress={() => changeCat(0)}
            style={{
              flexDirection: "row-reverse",
              backgroundColor: current_cat == 0 ? "#0393ce" : "#FFF",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderWidth: 1,
              borderColor: "#0393ce",
              marginHorizontal: 5,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "Bold",
                color: current_cat == 0 ? "#FFF" : "#143656",
                margin: 5,
                fontFamily: "Bold"
              }}
            >
              الكل
            </Text>

            <MaterialCommunityIcons
              name="check-decagram"
              size={24}
              color="#143656"
            />
          </TouchableOpacity>

          {cats.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => changeCat(item.id)}
                style={{
                  flexDirection: "row-reverse",
                  backgroundColor: current_cat == item.id ? "#0393ce" : "#FFF",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: "#0393ce",
                  marginHorizontal: 5,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "Bold",
                    color: current_cat == item.id ? "#FFF" : "#143656",
                    margin: 5,
                    fontFamily: "Bold",

                  }}
                >
                  {item.name_ar}
                </Text>

                <MaterialCommunityIcons
                  name="check-decagram"
                  size={24}
                  color="#143656"
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 10,
          width: "100%"
        }}
        numColumns={2}
        data={data}
        ListEmptyComponent={handleEmptyProp()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          item.status == "active"
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
                <View style={styles.itemContent} />
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
              </View>

              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={{
                    fontFamily: "Bold",
                    color: "#34ace0",
                    textAlign: "left",
                    fontSize: 16
                  }}
                >
                  {item.price} SR
                </Text>
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  marginVertical: 10,
                  alignItems: "center"
                }}
              >
                <Text style={{ fontFamily: "Bold", color: "grey" }}>
                  {moment(item.created_at).startOf("day").fromNow()}
                </Text>
                <AntDesign name="shoppingcart" size={24} color="grey" />
              </View>
            </TouchableOpacity>
            : null}
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
    resizeMode: "stretch",
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
    marginHorizontal: 5,
    width: "48%",
    marginVertical: 5,
    backgroundColor: "#FFF",
    elevation: 5
  },
  item: {
    width: "100%"
  }
});
