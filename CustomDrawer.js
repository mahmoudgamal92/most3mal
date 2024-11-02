import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import { StatusBar } from 'native-base';

const CustomDrawer = (props, { navigation }) => {

  const _removeSession = async () => {
    try {
      AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => props.navigation.replace("SignIn"));
    } catch (error) {
      console.log("Erorr : " + error);
    }
  };


  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigation.toggleDrawer();
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      paddingTop: Constants.statusBarHeight,
      backgroundColor: "#FFF",
      fontFamily: "Bold",
    }}>
      <StatusBar style="auto" backgroundColor="#34ACE0" />
      <View style={{
        backgroundColor: "#34ACE0",
        height: 200,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Image
          source={require("./assets/white_logo.png")}
          style={styles.sideMenuProfileIcon}
        />
        <Text style={{ color: "#FFF", fontFamily: "Bold", marginTop: 10 }}>
          أهلا بكم في مستعمل.كوم
        </Text>

        <TouchableOpacity
          onPress={() => _removeSession()}
          style={{
            backgroundColor: "#FFF",
            borderRadius: 20,
            padding: 5,
            marginTop: 10,
            paddingHorizontal: 20,
          }}>
          <Text style={{ color: "#0f95b3", fontSize: 12, fontFamily: "Bold", color: "#34ACE0" }}>
            تسجيل الخروج
          </Text>
        </TouchableOpacity>

      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />


      </DrawerContentScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'stretch',
    width: "90%",
    height: 85,
    alignSelf: 'center',
  },
  logout: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 5,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
});

export default CustomDrawer;