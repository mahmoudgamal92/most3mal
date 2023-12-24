import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import styles from "./../../constants/style";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import toastConfig from "./../../constants/Toast";
import { KeyboardAvoidingView } from "react-native";
import api from "./../../constants/constants";

export default function Create({ route, navigation }) {
  const { depart_id, cat_id } = route.params;
  const [image, setImage] = useState(null);
  const [imageURI, setImageURI] = useState(null);
  const [images, setImages] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coords, setCoords] = useState("");

  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [latitude, setLatitude] = useState(24.7136);
  const [longitude, setLongitude] = useState(46.6753);

  const [loading, setLoading] = useState(false);
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

  function toEnglishNumber(strNum) {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩".split("");
    const englishNumbers = "0123456789".split("");
    strNum = strNum.replace(
      /[٠١٢٣٤٥٦٧٨٩]/g,
      x => englishNumbers[arabicNumbers.indexOf(x)]
    );
    strNum = strNum.replace(/[^\d]/g, "");
    return strNum;
  }

  const goToMyLocation = async () => {
    mapRef.current.animateCamera({
      center: { latitude: latitude, longitude: longitude }
    });
  };

  const NewAdd = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    if (title.length < 10) {
      alert("لايمكن إضافة إعلان أقل من 10 حروف");
    } else if (description == "" || price == "") {
      alert("لابد من إكمال البيانات كاملة");
    } else {
      setLoading(true);
      let formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("ad_number", parseInt(Math.random() * 100000));
      formData.append("title", title);
      formData.append("details", description);
      formData.append("price", parseInt(price));
      formData.append("depart_id", parseInt(depart_id));
      formData.append("cat_id", parseInt(cat_id));
      formData.append("address", state + "," + city);
      formData.append("coords", coords);

      images.map((item, index) => {
        formData.append("images[]", {
          uri: item.uri,
          name: item.name,
          type: item.type
        });
      });
      
      fetch(api.custom_url + "ads/create.php", {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(json => {
          if (json.success == true) {
            Toast.show({
              type: "successToast",
              text1: "تم إنشاء الإعلان بنجاح",
              bottomOffset: 80,
              visibilityTime: 2000
            });

            setLoading(false);

            setTimeout(() => {
              navigation.pop(3);
            }, 1000);
          } else {
            Toast.show({
              type: "errorToast",
              text1: "هناك مشكلة في إضافة الإعلان ",
              bottomOffset: 80,
              visibilityTime: 2000
            });
            setLoading(false);
          }
        })
        .catch(error => {
          setLoading(false);
          console.error(error);
        });
    }
  };


  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });
      if (!result.canceled) {
        let localUri = result.uri;
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

  const _removeImg = async src => {
    setImages(images.filter(item => item.uri !== src));
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar backgroundColor="#34ace0" />
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
          إضافة إعلان
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", right: 20 }}
        >
          <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={[styles.loginBox, { marginTop: 10 }]}>
          <View style={styles.inputLabelContainer}>
            <Text
              style={{ fontFamily: "Bold", textAlign: "left", fontSize: 15 }}
            >
              تحميل صورة الإعلان
            </Text>
          </View>


          <TouchableOpacity
            onPress={() => pickImage()}
            style={styles.imgUploadContainer}
          >
            <Image
              style={styles.imgUploadIcon}
              source={require("./../../assets/camera.png")}
            />
          </TouchableOpacity>

          <View
            style={{
              width: "100%",
              marginBottom: 10,
              flexDirection: "row-reverse",
              flexWrap: "wrap",
              alignItems:"center",
              justifyContent:"center"
            }}
          >
            {images.map((item, index) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => _removeImg(item.src)}
                    style={{ marginBottom: -20, zIndex: 849849 }}
                  >
                    <Image
                      source={require("./../../assets/cross.png")}
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
            <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
              عنوان الإعلان (أكثر من 10 حروف)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setTitle(text)}
              placeholder="أدخل عنوان الإعلان"
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text
              style={{ fontFamily: "Bold", textAlign: "left", fontSize: 15 }}
            >
              وصف الإعلان
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
            <Text style={{ fontFamily: "Bold", textAlign: "left" }}>
              سعر الإعلان (بالريال السعودي)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setPrice(toEnglishNumber(text))}
              placeholder="أدخل سعر الإعلان"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text style={{ fontFamily: "Bold", textAlign: "left" }}>
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
            <Text style={{ fontFamily: "Bold", textAlign: "left" }}>الحي</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setCity(text)}
              placeholder="أدخل الحي"
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text
              style={{
                fontFamily: "Bold",
                textAlign: "left",
                marginVertical: 10
              }}
            >
              إختر الموقع الجغرافي
            </Text>
            <Text
              style={{ fontFamily: "Regular", textAlign: "left", color: "red" }}
            >
              لن يظهر إلا عند قبول العرض و تسليم المنتج*
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
                right: 10,
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
                  textAlign: "right",
                  marginVertical: 10,
                  color: "#FFF"
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
                setCoords(
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

          <TouchableOpacity style={styles.primaryBtn} onPress={() => NewAdd()}>
            {loading == true
              ? <ActivityIndicator size={40} color="#FFF" />
              : <Text style={styles.btnText}>إنشاء الإعلان</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </KeyboardAvoidingView>
  );
}
