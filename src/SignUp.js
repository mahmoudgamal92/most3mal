import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  FontAwesome5,
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../constants/style";
import Checkbox from "expo-checkbox";
import api from "./../constants/constants";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
export default function SignUp({ route, navigation }) {
  const [name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfitmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const registerUser = () => {
    if (
      name == "" ||
      phone == "" ||
      email == "" ||
      password == "" ||
      confirm_password == "" ||
      isChecked == false
    ) {
      Toast.show({
        type: "erorrToast",
        text1: "الرجاء تعبئة جميع الحقول",
        bottomOffset: 80,
        visibilityTime: 2000
      });
      return;
    }
    if (password !== confirm_password) {
      Toast.show({
        type: "erorrToast",
        text1: "كلمة المرور غير متطابقة",
        bottomOffset: 80,
        visibilityTime: 2000
      });
      return;
    } else {
      let formData = new FormData();
      formData.append("username", name);
      formData.append("userphone", phone);
      formData.append("useremail", email);
      formData.append("password", password);
      setLoading(true);
      fetch(api.custom_url + "auth/signup.php", {
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
          if (responseJson.success == true) {
            setLoading(false);
            saveCredintials(responseJson.data);
          }
          else {
            Toast.show({
              type: "erorrToast",
              text1: responseJson.message,
              bottomOffset: 80,
              visibilityTime: 3000
            });
            setLoading(false);
          }
        });
    }
  };


  const saveCredintials = (object) => {
    AsyncStorage.setItem("user_token", object.token);
    AsyncStorage.setItem('user_id', object.id.toString());
    AsyncStorage.setItem('user_name', object.name);
    Toast.show({
      type: "successToast",
      text1: "تم إنشاء الحساب بنجاح",
      bottomOffset: 80,
      visibilityTime: 2000
    });

    setTimeout(() => {
      navigation.navigate("DrawerStack");
    }, 1000);
  }

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      <StatusBar style="auto" />
      <View style={styles.loginBox}>
        <Image source={require("./../assets/logo.png")} style={styles.logo} />
        <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 20 }}>
          انشاء حساب
        </Text>

        <View style={styles.inputContainer}>
          <View style={{ width: "10%" }}>
            <FontAwesome5 name="user-circle" size={24} color="grey" />
          </View>

          <TextInput
            style={styles.input}
            onChangeText={text => setUserName(text)}
            placeholder="أسم المستخدم"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={{ width: "10%" }}>
            <Feather name="phone-call" size={24} color="grey" />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={text => setPhone(text)}
            keyboardType="numeric"
            placeholder="رقم الجوال"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={{ width: "10%" }}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="grey"
            />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
            placeholder="البريد الإلكتروني"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={{ width: "10%" }}>
            <Feather name="lock" size={24} color="grey" />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
            placeholder="كلمة المرور"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={{ width: "10%" }}>
            <Feather name="lock" size={24} color="grey" />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={text => setConfitmPassword(text)}
            secureTextEntry={true}
            placeholder="تأكيد كلمة المرور"
          />
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            style={{
              padding: 10,
              margin: 10
            }}
          />

          <Text
            style={{
              fontFamily: "Bold",
              color: "grey"
            }}
          >
            الموافقة علي الشروط و الأحكام
          </Text>
        </View>

        {loading == true
          ? <TouchableOpacity style={styles.primaryBtn}>
            <ActivityIndicator size={40} color={"#FFF"} />
          </TouchableOpacity>
          : <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => registerUser()}
          >
            <Text style={styles.btnText}>إنشاء حساب</Text>
          </TouchableOpacity>}
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={{ fontFamily: "Bold" }}>
            لديك حساب بالفعل ؟ تسجيل الدخول
          </Text>
        </TouchableOpacity>
      </View>
      <Toast config={toastConfig} />
    </ScrollView>
  );
}