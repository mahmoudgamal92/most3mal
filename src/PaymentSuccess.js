import { Animated, Image, SafeAreaView, Text, View, StyleSheet, isLoading, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentSuccess = ({ route, navigation }) => {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor="#34ace0" barStyle="light-content" />
      <Image style={styles.icon}
        source={require("./../assets/checked.png")} />
      <Text style={styles.title}>
        تمت عملية الشحن بنجاح
      </Text>

      <TouchableOpacity
        onPress={() => navigation.replace("MyWallet")}
        style={styles.nextButton}
      >
        <Text style={styles.nextButtonText}>متابعة</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  codeFiledRoot: {
    height: 55,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  resend_code: {
    color: "#1A1D3D",
    fontFamily: "Regular"
  },
  cell: {
    marginHorizontal: 8,
    height: 40,
    width: 40,
    lineHeight: 40,
    fontSize: 30,
    textAlign: 'center',
    borderRadius: 8,
    color: '#3759b8',
    backgroundColor: '#fff',

    // IOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },

  // =======================

  root: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  title: {
    paddingTop: 50,
    color: '#000',
    fontSize: 25,
    fontFamily: 'Regular',
    textAlign: 'center',
    paddingBottom: 40,
  },
  icon: {
    width: 200,
    height: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subTitle: {
    paddingTop: 10,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Light',
    marginBottom: 30

  },
  nextButton: {
    marginTop: 30,
    borderRadius: 60,
    height: 60,
    backgroundColor: '#34ace0',
    justifyContent: 'center',
    minWidth: 300,
    marginBottom: 100,
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontFamily: "Regular"
  },
});

export default PaymentSuccess;