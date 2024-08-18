import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Platform,
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
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome
} from "@expo/vector-icons";
import styles from "./../../constants/style";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import toastConfig from "./../../constants/Toast";
import { KeyboardAvoidingView } from "react-native";
import api from "../../constants/constants";

export default function Create({ route, navigation }) {
  const { item } = route.params;
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
      setTitle(item.title);
      setDescription(item.details);
      setPrice(item.price);
      setState("test");
      setCity("test");
      setCoords("479575.75957,895.580");
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
    if (title.length < 10) {
      alert("لايمكن إضافة إعلان أقل من 10 حروف");
    } else if (description == "" || price == "") {
      alert("لابد من إكمال البيانات كاملة");
    } else {
      const user_token = await AsyncStorage.getItem("user_token");
      setLoading(true);
      let formData = new FormData();
      formData.append("id", item.id);
      formData.append("title", title);
      formData.append("details", description);
      formData.append("price", price);
      formData.append("address", state + "," + city);
      formData.append("coords", coords);
      images.map((item, index) => {
        formData.append("images[]", {
          uri: item.uri,
          name: item.name,
          type: item.type
        });
      });
      fetch(api.custom_url + "ads/update.php", {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(json => {
          if (json.success == true) {
            Toast.show({
              type: "successToast",
              text1: "تم تعديل الإعلان بنجاح",
              bottomOffset: 80,
              visibilityTime: 2000
            });

            setLoading(false);
            navigation.goBack();
          } else {
            Toast.show({
              type: "errorToast",
              text1: "هناك مشكلة في تعديل الإعلان ",
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

  const _removeImg = (uri) => {
    setImages(images.filter(item => item.uri !== uri));
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
        <Text style={{ fontFamily: "Regular", color: "#FFF", fontSize: 16 }}>
          {item.title}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", right: 20 }}
        >
          <MaterialIcons name="arrow-forward-ios" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={[styles.loginBox, { marginTop: 10 }]}>
          <View style={{
            width: "100%",
            paddingHorizontal: 10
          }}>
            <Text style={{
              fontFamily: "Bold",
              marginVertical: 20,
              textAlign: 'right'
            }}>
              الصور الحالية للمنتج
            </Text>
            <ScrollView
              horizontal
            >
              {item.images.split(",").map((item, index) => {
                return (
                  <Image
                    source={{ uri: api.media_url + item }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginHorizontal: 5
                    }}
                  />
                );
              })}
            </ScrollView>

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
            <Text style={{
              fontFamily: "Bold",
              fontSize: 15,
              textAlign: 'right'
            }}>
              عنوان الإعلان (أكثر من 10 حروف)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setTitle(text)}
              placeholder="أدخل عنوان الإعلان"
              defaultValue={item.title}
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text
              style={{
                fontFamily: "Bold",
                textAlign: 'right',
                fontSize: 15
              }}
            >
              وصف الإعلان
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddTextArea}
              onChangeText={text => setDescription(text)}
              placeholder="أدخل وصف الإعلان"
              defaultValue={item.details}
              multiline={true}
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text style={{
              fontFamily: "Bold",
              textAlign: 'right'
            }}>
              سعر الإعلان (بالريال السعودي)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setPrice(toEnglishNumber(text))}
              placeholder="أدخل سعر الإعلان"
              defaultValue={item.price.toString()}
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text style={{
              fontFamily: "Bold",
              textAlign: 'right'
            }}>
              المدينة
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setState(text)}
              placeholder="أدخل المنطقة"
              defaultValue={item.address.split(",")[0].toString()}
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text style={{
              fontFamily: "Bold",
              textAlign: 'right'
            }}>
              الحي
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.newAddinput}
              onChangeText={text => setCity(text)}
              placeholder="أدخل المدينة"
              defaultValue={item.address.split(",")[1].toString()}
            />
          </View>

          <View style={styles.inputLabelContainer}>
            <Text
              style={{
                fontFamily: "Bold",
                textAlign: "right",
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

          <TouchableOpacity style={[styles.primaryBtn, {
            marginBottom: 60
          }]} onPress={() => NewAdd()}>
            {loading == true
              ? <ActivityIndicator size={40} color="#FFF" />
              : <Text style={styles.btnText}>تعديل الإعلان </Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </KeyboardAvoidingView>
  );
}
