import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Feather, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import styles from "../constants/style";
import Constants from "expo-constants";

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";
import { KeyboardAvoidingView } from "react-native";


export default function SignIn({ route, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  const signUser = async () => {
    let formData = new FormData();
    formData.append("password", password);
    formData.append("email", email);

    setLoading(true);
    const url = await fetch("https://mestamal.com/api/user/login", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-type": "multipart/form-data;",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
      body: formData
    });
    const response = await url.json();
    const status = url.status;

    if (status === 200) {
      if (response.status == true) {
        Toast.show({
          type: 'successToast',
          text1: "تم تسجيل الدخول بنجاح , سيتم توجيهك للصفحة الرئيسية",
          bottomOffset: 80,
          visibilityTime: 2000,
        });

        await AsyncStorage.setItem("user_token", response.token);
        setTimeout(() => {
          navigation.replace("AppHome");
        }, 2000);
      }
      else {
        Toast.show({
          type: 'erorrToast',
          text1: "خطأ في البريد الإلكتروني أو كلمة المرور",
          bottomOffset: 80,
          visibilityTime: 2000,
        });
      }
    }
    else {
      Toast.show({
        type: 'erorrToast',
        text1: "الرجاء إكمال بياناتك بشكل صحيح",
        bottomOffset: 80,
        visibilityTime: 2000,
      });


      console.log(JSON.stringify(response));
    }
    setLoading(false);
  };

  return (

    <ScrollView 
    contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
      <StatusBar backgroundColor="#F3F5F7" barStyle="default" />
      <View style={[styles.loginBox,{marginTop:0}]}>
        <Image source={require("./../assets/logo.png")} style={styles.logo} />
        <Text style={styles.header}>تسجيل الدخول</Text>
        <View style={styles.inputContainer}>
          <View style={{ width: "10%" }}>
            <MaterialCommunityIcons name="email-outline" size={24} color="grey" />
          </View>
          <TextInput style={styles.input}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
            placeholder="البريد الإلكتروني" />
        </View>



        <View style={styles.inputContainer}>
          <View style={{ width: "10%" }}>
            <Feather name="lock" size={24} color="grey" />
          </View>
          <TextInput style={styles.pwdInput}
            onChangeText={text => setPassword(text)}
            secureTextEntry={passwordVisible}
            placeholder="كلمة المرور" />

          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={{ width: "10%" }}>
            {passwordVisible == true ?
              <AntDesign name="eye" size={24} color="grey" />
              :
              <Entypo name="eye-with-line" size={24} color="black" />
            }
          </TouchableOpacity>

        </View>

        <View style={{width:"100%",justifyContent:"flex-start"}}>
          <TouchableOpacity 
          style={{marginVertical: 10 }} 
          onPress={() => navigation.navigate("ForgotPwd")}>

            <Text style={{ fontFamily: "Bold", color: "#000",textAlign:"left" }}>
              نسيت كلمة المرور ؟
            </Text>

          </TouchableOpacity>
        </View>


        <TouchableOpacity style={styles.primaryBtn}
          onPress={() => signUser()}>

          {loading == true ?
            <ActivityIndicator size={40} color="#FFF" />
            :
            <Text style={styles.btnText}>دخول</Text>
          }

        </TouchableOpacity>


        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ fontFamily: "Bold", }}>
            ليس لديك حساب ؟ سجل الأن
          </Text>
        </TouchableOpacity>

        <Text style={{fontFamily:"Regular",color:"grey"}}>
        اصدار رقم : {Constants.manifest.version} 

        </Text>

      </View>
      <Toast config={toastConfig} />
    </ScrollView>
  );
}  