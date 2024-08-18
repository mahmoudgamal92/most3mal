import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions
} from "react-native";
import moment from "moment";
import { Entypo, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { TabView, SceneMap } from 'react-native-tab-view';

import { Auctions, Bids, EmptyComponent } from './Components';


export default function AuctionsScreen({ route, navigation }) {
  const [selectedIndex, setSelectedIndex] = useState('auctions');

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

      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <View style={{
          flexDirection: 'row-reverse',
          marginBottom: 10,
          backgroundColor: '#FFF'
        }}>
          <TouchableOpacity
            onPress={() => setSelectedIndex('auctions')}
            style={{
              width: '50%',
              borderBottomWidth: selectedIndex == 'auctions' ? 2 : 0,
              borderBottomColor: "#34ace0",
            }}>

            <View style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              width: '100%'
            }}>

              <Image source={require('./../assets/auction.png')} style={{
                width: 30,
                height: 30,
                marginHorizontal: 10
              }} />
              <Text style={{
                textAlign: 'center',
                fontSize: 15,
                paddingVertical: 10,
                fontFamily: 'Bold',
                color: "grey"
              }}>
                المزادات
              </Text>
            </View>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedIndex('bids')}
            style={{
              width: '50%',
              borderBottomWidth: selectedIndex == 'bids' ? 2 : 0,
              borderBottomColor: "#34ace0"
            }}>
            <View style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              width: '100%'
            }}>

              <Image source={require('./../assets/bid.png')} style={{
                width: 30,
                height: 30,
                marginHorizontal: 10
              }} />
              <Text style={{
                textAlign: 'center',
                fontSize: 15,
                paddingVertical: 10,
                fontFamily: 'Bold',
                color: "grey"

              }}>
                مزايداتي الخاصه
              </Text>

            </View>
          </TouchableOpacity>
        </View>
        <View style={{
          paddingHorizontal: 10
        }}>
          {selectedIndex == 'auctions' ? <Auctions /> : <Bids />}

        </View>

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
          مزايداتي
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