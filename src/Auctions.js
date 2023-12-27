import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import {
  Entypo,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import api from "./../constants/constants";

export default function HomePage({ route, navigation }) {
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
    setLoading(true);
    let url = api.custom_url + "auctions/list.php";
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
          console.log(JSON.stringify(json));
          setData(json.data);
          setLoading(false);
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
          لا توجد لديك أي مزادات نشطة
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
          المزادات
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <FlatList
          data={data}
          ListEmptyComponent={handleEmptyProp()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AuctionDetails", {
                  item: item
                })}
              style={{
                flexDirection: "row-reverse",
                borderColor: "#DDDDDD",
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                backgroundColor: "#FFF",
                justifyContent: "flex-end",
                marginVertical: 5
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: "Bold",
                    color: "#2196f3",
                    fontSize: 15,
                    marginHorizontal: 10,
                    textAlign: "left"
                  }}
                >
                  {item.auction_number}#
                </Text>
                <Text
                  style={{
                    fontFamily: "Bold",
                    fontSize: 15,
                    marginHorizontal: 10
                  }}
                >
                  {item.title}
                </Text>

                <View
                  style={{
                    marginHorizontal: 10,
                    flexDirection: "row"
                  }}
                >
                  <AntDesign name="calendar" size={24} color="grey" />
                  <Text style={{ fontFamily: "Regular", color: "grey" }}>
                    {moment(item.end_date).format("MMM Do YY")} تاريخ الانتهاء :
                  </Text>
                </View>
              </View>

              <View style={{}}>
                <Image
                  source={{ uri: api.media_url + item.images.split(",")[0] }}
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: "cover",
                    borderRadius: 10
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

      <TouchableOpacity
        onPress={() => navigation.navigate("MyBids")}
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
          left: 20
        }}
      >
        <MaterialCommunityIcons
          name="clipboard-list-outline"
          size={24}
          color="#FFF"
        />
        <Text
          style={{ fontFamily: "Bold", color: "#FFF", marginHorizontal: 5 }}
        >
          مناقصاتي
        </Text>
      </TouchableOpacity>
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
