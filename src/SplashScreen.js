import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

import api from "./../constants/constants";

export default function Splash({ route, navigation }) {
  useEffect(() => {
    _proceedProcess();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      _proceedProcess();
    }, [])
  );

  const _proceedProcess = async () => {
    const token = await AsyncStorage.getItem('user_token');
    if (token !== null) {
      getProfile();
    }
    else {
      const alredyLaunched = await AsyncStorage.getItem('alredyLaunched');
      if (alredyLaunched) {
        setTimeout(() => {
          navigation.replace('SignIn');
        }, 2000);

      }
      else {
        setTimeout(() => {
          navigation.replace('OnBoardingScreen');
        }, 1000);
      }

    }
  };


  const getProfile = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
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
        if (json.data[0].status == 'active') {
          navigation.replace('DrawerStack');
        }
        else {
          _removeSession();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };


  const _removeSession = async () => {
    try {
      AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => navigation.replace("SignIn"));
    } catch (error) {
      console.log("Erorr : " + error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor='#34ace0' />
      <Image source={require('./../assets/white_logo.png')} style={styles.logo} />
      <Text style={{
        fontFamily: "Bold",
        color: "#DDDDDD",
        marginBottom: 25,
        fontSize: 20
      }}>
        لبيع مستعملكم وجديدكم
      </Text>
      <View style={{ marginTop: 100 }}>
        <ActivityIndicator size={50} color="#FFF" />
        <Text style={{ fontFamily: "Bold", color: "#FFF", marginVertical: 20 }}>
          17 - 09 - 2024
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34ace0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: "80%",
    height: 200,
    marginBottom: 30,
    resizeMode: 'contain',
  },

});