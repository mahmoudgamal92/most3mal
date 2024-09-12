import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
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
      setTimeout(() => {
        navigation.replace('DrawerStack');
      }, 2000);

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
  }

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
          12 - 09 - 2024
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