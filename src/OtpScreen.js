import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  I18nManager
} from "react-native";
import React, { useState } from "react";
import OtpInput from "./../components/otp";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import toastConfig from "./../constants/Toast";
// I18nManager.forceRTL(false);
// I18nManager.allowRTL(false);
const OtpScreen = ({ route, navigation }) => {
  const { code,user } = route.params;
  const [resend_loading, setResendLoading] = useState(false);
  const [resend_status, setResendStatus] = useState(true);

  const resend_code = async () => {
    setResendLoading(true);
    setTimeout(() => {
      setResendLoading(false);
      setResendStatus(false);
    }, 3000);
  };


  const _saveCredintials = async item => {
    AsyncStorage.setItem("user_token", item.token);
    AsyncStorage.setItem("user_id", item.id.toString());
    AsyncStorage.setItem("user_name", item.name);
    alert("تم التأكد من هويتك بنجاح , يمكنك الأن إعادة تعيين كلمة المرور ");
    navigation.replace("ResetPwd");

  };


  const handleOtpComplete = otp => {
    if (otp == code) {
        _saveCredintials(user);
    } else {
      Toast.show({
        type: "erorrToast",
        text1: "هناك خطأ , الرجاء التأكد من كود التفعيل ",
        bottomOffset: 80,
        visibilityTime: 2000
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
      <StatusBar backgroundColor="#FFF" barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", paddingBottom: 400 }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            paddingHorizontal: 40,
            paddingTop: Constants.statusBarHeight
          }}
        >
          <MaterialIcons
            name="verified-user"
            size={100}
            color="#34ace0"
            style={{
              marginVertical: 20
            }}
          />
          <Text
            style={{
              fontFamily: "Bold",
              marginTop: 30,
              fontSize: 20
            }}
          >
            كود التفعيل
          </Text>
          <Text
            style={{
              marginTop: 30,
            }}
          >
            {code}
          </Text>
          <Text
            style={{
              color: "grey",
              fontSize: 20,
              fontFamily: "Regular",
              marginTop: 10
            }}
          >
            تم إرسال رمز التفعيل إلي رقم هاتف
          </Text>

          <Text
            style={{
              color: "grey",
              fontSize: 20,
              fontFamily: "Regular",
              marginTop: 10
            }}
          >
            أدخل رمز التفعيل المكون من 4 أرقام
          </Text>

          <View style={{ marginTop: 10 }}>
            <OtpInput onComplete={handleOtpComplete} />
          </View>
        </View>
        <View
          style={{
            padding: 20,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flexGrow: 1,
            backgroundColor: "#FFF",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => resend_code()}
            style={{
              backgroundColor: "#34ace0",
              paddingVertical: 15,
              borderRadius: 10,
              width: "80%",
              marginBottom: 10
            }}
          >
            <Text
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Regular"
              }}
            >
              اعادة ارسال الرمز
            </Text>
          </TouchableOpacity>

          <View>
            {resend_status == true
              ? <View />
              : <CountDown
                  size={15}
                  until={50}
                  onFinish={() => setResendStatus(true)}
                  digitStyle={{ backgroundColor: "#FFF" }}
                  digitTxtStyle={{ color: "#230D33" }}
                  timeLabelStyle={{ color: "red", fontWeight: "Regular" }}
                  separatorStyle={{ color: "#230D33" }}
                  timeToShow={["M", "S"]}
                  timeLabels={{ m: null, s: null }}
                  showSeparator
                />}
          </View>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </KeyboardAvoidingView>
  );
};
export default OtpScreen;
