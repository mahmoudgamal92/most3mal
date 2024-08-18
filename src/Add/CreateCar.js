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
import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import styles from "./../../constants/style";
import api from "./../../constants/constants";

import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import toastConfig from "./../../constants/Toast";
import { NativeBaseProvider, Radio } from "native-base";
import { KeyboardAvoidingView } from "react-native";

export default function Create({ navigation, route }) {
  const mapRef = useRef(null);
  const { depart_id, cat_id } = route.params;
  const [images, setImages] = useState([]);
  const [coords, setCoords] = useState("");

  // Car Entered Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [seatNumber, setSeatNumber] = useState(0);
  const [carModel, setCarModel] = useState(0);
  const [car_status, setCarStatus] = useState("new");
  const [geer, setGeer] = useState("manual");
  const [engine, setEngine] = useState("electricity");
  const [push_system, setPushSystem] = useState("four_wheel");
  const [address, setAddress] = useState("");

  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [latitude, setLatitude] = useState(24.7136);
  const [longitude, setLongitude] = useState(46.6753);
  // Loading Data
  const [loading, setLoading] = useState(false);

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
      const user_token = await AsyncStorage.getItem("user_token");
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
      formData.append("seats_number", seatNumber);
      formData.append("model", carModel);
      formData.append("car_gear", geer);
      formData.append("engine_type", engine);
      formData.append("drive_system", push_system);

      images.map((item, index) => {
        formData.append("images[]", {
          uri: item.uri,
          name: item.name,
          type: item.type
        });
      });

      fetch(api.custom_url + "ads/create.php", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
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
        })
        .finally(() => setLoading(false));
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
    <NativeBaseProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
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
            إضافة إعلان سيارات
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
          <View style={styles.loginBox}>
            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
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
                alignItems: "center",
                justifyContent: "center"
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
              <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
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
              <Text style={{ fontFamily: "Bold" }}>
                سعر الإعلان (بالريال السعودي)
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.newAddinput}
                onChangeText={text => setPrice(toEnglishNumber(text))}
                placeholder="أدخل سعر الإعلان"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                عدد المقاعد
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.newAddinput}
                onChangeText={text => setSeatNumber(toEnglishNumber(text))}
                keyboardType="numeric"
                placeholder="عدد مقاعد السيارة"
              />
            </View>

            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                موديل السيارة
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.newAddinput}
                onChangeText={text => setCarModel(toEnglishNumber(text))}
                keyboardType="numeric"
                placeholder="أدخل سنة موديل السيارة"
              />
            </View>

            {/* حالة السيارة */}
            <View style={{ width: "100%" }}>
              <View style={[styles.inputLabelContainer, { marginBottom: 20 }]}>
                <Text style={{ fontFamily: "Bold" }}>حالة السيارة</Text>
              </View>

              <Radio.Group
                name="car_status"
                accessibilityLabel="car_status"
                value={car_status}
                onChange={nextValue => {
                  setCarStatus(nextValue);
                }}
              >
                <View
                  aria-label="status_option1"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 20,
                    padding: 15
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      جديد
                    </Text>
                    <Radio value="new" my={1} />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      مستعمل
                    </Text>
                    <Radio value="used" my={1} />
                  </View>
                </View>
              </Radio.Group>
            </View>

            {/* حالة السيارة */}
            <View style={{ width: "100%" }}>
              <View style={[styles.inputLabelContainer, { marginBottom: 20 }]}>
                <Text style={{ fontFamily: "Bold" }}>نوع الغيار</Text>
              </View>

              <Radio.Group
                name="geer"
                accessibilityLabel="geer"
                value={geer}
                onChange={nextValue => {
                  setGeer(nextValue);
                }}
              >
                <View
                  aria-label="geer_option1"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 20,
                    padding: 15
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      عادي
                    </Text>
                    <Radio value="manual" my={1} />
                  </View>

                  <View
                    aria-label="geer_option2"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      أوتوماتيك
                    </Text>
                    <Radio value="automatic" my={1} />
                  </View>
                </View>
              </Radio.Group>
            </View>

            {/* حالة السيارة */}
            <View style={{ width: "100%" }}>
              <View style={[styles.inputLabelContainer, { marginBottom: 20 }]}>
                <Text style={{ fontFamily: "Bold" }}>نوع المحرك</Text>
              </View>

              <Radio.Group
                name="engine"
                accessibilityLabel="engine"
                value={engine}
                onChange={nextValue => {
                  setEngine(nextValue);
                }}
              >
                <View
                  aria-label="engine_option1"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 20,
                    padding: 15
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      كهرباء
                    </Text>
                    <Radio value="electricity" my={1} />
                  </View>

                  <View
                    aria-label="engine_option3"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      بنزين
                    </Text>
                    <Radio value="petrol" my={1} />
                  </View>

                  <View
                    aria-label="engine_option2"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      ديزل
                    </Text>
                    <Radio value="diesel" my={1} />
                  </View>
                </View>
              </Radio.Group>
            </View>

            {/* حالة السيارة */}
            <View style={{ width: "100%" }}>
              <View style={[styles.inputLabelContainer, { marginBottom: 20 }]}>
                <Text style={{ fontFamily: "Bold" }}>نظام الدفع</Text>
              </View>

              <Radio.Group
                name="push_system"
                accessibilityLabel="push_system"
                value={push_system}
                onChange={nextValue => {
                  setPushSystem(nextValue);
                }}
              >
                <View
                  aria-label="push_option1"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 20,
                    padding: 15
                  }}
                >
                  <View
                    aria-label="push_option2"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      الرباعي
                    </Text>
                    <Radio value="four_wheel" my={1} />
                  </View>

                  <View
                    aria-label="push_option3"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      الخلفي
                    </Text>
                    <Radio value="behind" my={1} />
                  </View>

                  <View
                    aria-label="push_option4"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "33%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginHorizontal: 10
                      }}
                    >
                      الأمامي
                    </Text>
                    <Radio value="front" my={1} />
                  </View>
                </View>
              </Radio.Group>
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
              <Text style={{ fontFamily: "Bold", textAlign: "left" }}>
                الحي
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.newAddinput}
                onChangeText={text => setCity(text)}
                placeholder="أدخل الحي"
              />
            </View>

            <View style={styles.inputLabelContainer}>
              <Text style={{ fontFamily: "Bold", marginVertical: 10 }}>
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

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => NewAdd()}
            >
              {loading == true
                ? <ActivityIndicator size={40} color="#FFF" />
                : <Text style={styles.btnText}>إنشاء الإعلان</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Toast config={toastConfig} />
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}