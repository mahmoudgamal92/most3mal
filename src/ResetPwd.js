import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Feather, SimpleLineIcons } from "@expo/vector-icons";
import styles from "../constants/style";
import api from "./../constants/constants";
import Constants from "expo-constants";
import Toast from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";
export default function ResetPwd({ route, navigation }) {
  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const ResetPwd = async () => {
    if (password == "" || new_password == "" || confirm_password == "") {
      Toast.show({
        type: "erorrToast",
        text1: "من فضلك ادخل كلمة المرور القديمة وكلمة المرور الجديدة وتأكيد كلمة المرور",
        bottomOffset: 80,
        visibilityTime: 2000
      });
      return;
    } else {
      const user_id = await AsyncStorage.getItem("user_id");
      setLoading(true);
      let formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("current_password", password);
      formData.append("new_password", new_password);
      fetch(api.custom_url + "user/reset_pwd.php", {
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
        .then(json => {
          setLoading(false);
          if (json.success == true) {
            Toast.show({
              type: "successToast",
              text1: "تم تغيير كلمة المرور بنجاح",
              bottomOffset: 80,
              visibilityTime: 2000
            });
            setTimeout(() => {
              navigation.goBack();
            }, 2000);
          } else {
            console.log(JSON.stringify(json));
          }
        })
        .catch(error => {
          setLoading(false);
          console.error(error);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        width: "100%",
        backgroundColor: "#FFF"
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <StatusBar barStyle="default" backgroundColor="#34ace0" />


      <View
        style={{
          width: "100%",
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#34ace0",
        }}
      >


        <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
          تغيير كلمة المرور
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", right: 20 }}
        >
          <MaterialIcons name="arrow-forward-ios" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          marginTop: 50,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,

            elevation: 10
          }}
        >
          <View style={styles.inputLabelContainer}>
            <Text
              style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}
            >
              أدخل كلمة المرور الحالية
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setPassword(text)}
              placeholder="كلمة المرور الحالية"
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text
              style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}
            >
              أدخل كلمة المرور الجديدة
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setNewPassword(text)}
              placeholder="أدخل كلمة المرور الجديدة"
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text
              style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}
            >
              أدخل تأكيد كلمة المرور
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setConfirmPassword(text)}
              placeholder="تأكيد كلمة المرور"
            />
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => ResetPwd()}
          >
            {loading == true
              ? <ActivityIndicator size={40} color="#FFF" />
              : <Text style={styles.btnText}>حفظ</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </KeyboardAvoidingView>
  );
}