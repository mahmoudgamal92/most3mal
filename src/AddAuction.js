import {
  Image,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MaterialIcons,
  FontAwesome,
  Feather
} from "@expo/vector-icons";
import styles from "../constants/style";

import Toast from "react-native-toast-message";
import toastConfig from "./../constants/Toast";

import moment from "moment";
import MapView, { Marker } from "react-native-maps";

export default function CreateAuction({ route, navigation }) {
  const [images, setImages] = useState([]);
  const [imageURI, setImageURI] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState(24.7136);
  const [longitude, setLongitude] = useState(46.6753);

  const mapRef = useRef(null);

  useEffect(() => {
    _retrieveData();
  }, []);

  const _retrieveData = async () => {
    try {
      const location = await AsyncStorage.getItem("current_location");
      if (location !== null) {
        // We have data!!
        setLatitude(JSON.parse(location).latitude);
        setLongitude(JSON.parse(location).longitude);
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        //aspect: [3, 3],
        quality: 1
      });
      if (!result.canceled) {
        let localUri = result.assets[0].uri;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let img_type = match ? `image/${match[1]}` : `image`;
        setImages([
          ...images,
          {
            uri: localUri,
            name: filename,
            type: img_type
          }
        ]);
      }
    } catch (E) {
      console.log(E);
    }
  };
  const _removeImg = (src) => {
    setImages((prevImages) => prevImages.filter(item => item.uri !== src));
  };



  const goToMyLocation = async () => {
    mapRef.current.animateCamera({
      center: { latitude: latitude, longitude: longitude }
    });
  };

  const _insertAuction = async () => {
    if (images.length == 0) {
      Toast.show({
        type: "erorrToast",
        text1: "لابد من اختيار صوره للمنتج",
        bottomOffset: 80,
        visibilityTime: 2000
      });
      return;
    }
    const user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);

    const formData = new FormData();
    formData.append("auction_number", parseInt(Math.random() * 1000000));
    formData.append("title", title);
    formData.append("user_id", user_id);
    formData.append("details", description);
    formData.append("address", `${state}, ${city}`);
    formData.append("start_date", moment().format());
    formData.append("end_date", moment().add(7, "days").format());
    formData.append("duration", 7);

    images.forEach(item => {
      formData.append("images[]", {
        uri: item.uri,
        name: item.name,
        type: item.type
      });
    });

    try {
      const response = await fetch("https://mestamal.com/dashboard/api_mobile/custom/auctions/create.php", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "multipart/form-data",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        },
        body: formData
      });

      const json = await response.json();
      setLoading(false);

      if (json.success) {
        Toast.show({
          type: "successToast",
          text1: "تم إضافة المزاد بنجاح",
          bottomOffset: 80,
          visibilityTime: 2000
        });
        navigation.goBack();
        console.log(json);
      } else {
        Toast.show({
          type: "erorrToast",
          text1: "هناك خطأ في البيانات المدخلة",
          bottomOffset: 80,
          visibilityTime: 2000
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error inserting auction: ", error);
      Toast.show({
        type: "erorrToast",
        text1: "حدث خطأ أثناء إضافة المزاد",
        bottomOffset: 80,
        visibilityTime: 2000
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <StatusBar barStyle="default" backgroundColor="#34ace0" />
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
            إضافة مزاد
          </Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", left: 20 }}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.loginBox}>
            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", fontSize: 15, textAlign: 'right' }}>
                تحميل صورة المنتج
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => pickImage()}
              style={styles.imgUploadContainer}
            >
              <Feather name="camera" size={60} color="#FFF" />

            </TouchableOpacity>

            <View
              style={{
                width: "100%",
                marginBottom: 10,
                flexDirection: "row-reverse",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {images.map((item, index) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => _removeImg(item.uri)}
                      style={{ marginBottom: -20, zIndex: 849849 }}
                    >
                      <Image
                        source={require("./../assets/cross.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </TouchableOpacity>
                    <Image
                      source={{ uri: item.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                        marginHorizontal: 5
                      }}
                    />
                  </View>
                );
              })}
            </View>

            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", fontSize: 15, textAlign: 'right' }}>
                عنوان المنتج
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.newAddinput}
                onChangeText={text => setTitle(text)}
                placeholder="أدخل عنوان المنتج"
              />
            </View>

            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", fontSize: 15, textAlign: 'right' }}>
                وصف المنتج
              </Text>
            </View>




            <View style={styles.inputContainer}>
              <TextInput
                style={styles.newAddTextArea}
                onChangeText={text => setDescription(text)}
                placeholder="أدخل وصف الإعلان"
                multiline={true}
              />
            </View>



            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", textAlign: 'right' }}>
                المدينة
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.newAddinput}
                onChangeText={text => setState(text)}
                placeholder="أدخل المدينة"
              />
            </View>

            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", textAlign: 'right' }}>الحي</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.newAddinput}
                onChangeText={text => setCity(text)}
                placeholder="أدخل الحي"
              />
            </View>


            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", marginVertical: 10, textAlign: 'right' }}>
                أختر عنوان الإعلان
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                height: 300,
                marginTop: 10,
                borderRadius: 20,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#46D0D9"
              }}
            >
              <TouchableOpacity
                onPress={() => goToMyLocation()}
                style={{
                  position: "absolute",
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  top: 10,
                  left: 10,
                  backgroundColor: "#34ACE0",
                  zIndex: 10000,
                  borderRadius: 10,
                  paddingVertical: 2,
                  paddingHorizontal: 5
                }}
              >
                <MaterialIcons name="my-location" size={24} color="#FFF" />
                <Text
                  style={{
                    fontFamily: "Regular",
                    marginVertical: 10,
                    color: "#FFF",
                    textAlign: 'right'
                  }}
                >
                  الموقع الحالي
                </Text>
              </TouchableOpacity>

              <MapView
                ref={mapRef}
                style={{ flex: 1, width: "100%" }}
                showsUserLocation={true}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 1.0,
                  longitudeDelta: 1.0
                }}
                onRegionChangeComplete={region => {
                  setAddress(
                    parseFloat(region.latitude) +
                    "," +
                    parseFloat(region.longitude)
                  );
                }}
              />

              <View
                style={{
                  left: "45%",
                  position: "absolute",
                  top: "30%"
                }}
              >
                <FontAwesome name="map-marker" size={60} color="#051A3A" />
              </View>
            </View>


            <TouchableOpacity
              style={[styles.primaryBtn, {
                marginBottom: 60
              }]}
              onPress={() => _insertAuction()}
            >
              {loading == true
                ? <ActivityIndicator size={40} color="#FFF" />
                : <Text style={styles.btnText}>إنشاء المزاد</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Toast config={toastConfig} />
      </View>
      <Toast config={toastConfig} />

    </KeyboardAvoidingView>
  );
}
