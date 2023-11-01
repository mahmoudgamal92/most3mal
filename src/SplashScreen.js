import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
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
    if (token !== null)
    {
      setTimeout(() => {
      navigation.replace('AppHome');
      }, 1000);

    }
    else {
      setTimeout(() => {
        navigation.replace('SignIn');
      }, 3000);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor='#FFF' />
      <Image source={require('./../assets/logo.png')} style={styles.logo} />
      <View style={{marginTop:20}}>
      <ActivityIndicator size={50} color="#0f95b3" />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: "80%",
    height: 200,
    marginBottom: 50,
    resizeMode: 'contain',
  },

});