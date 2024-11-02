import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Modal,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Platform
} from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  Feather,
  AntDesign,
  Entypo
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
import api from "../constants/constants";
import { toEnglishNumber } from '@utils';
export default function AuctionDetails({ route, navigation }) {
  const { item } = route.params;
  const [user_id, setUserID] = useState(null);
  const [input_modal, setInputModal] = useState(false);
  const [report_modal, setReportModal] = useState(false);
  const [prev_offer, setPrevOffer] = useState(false);
  const [amount, setAmount] = useState("");
  const [problem, setProblem] = useState("");

  const [buttonLoading, setButtonLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [images, setImages] = useState([]);

  const countDownDate = new Date(item.end_date).getTime();
  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  useFocusEffect(
    React.useCallback(() => {
      _retrieveData();
    }, [])
  );

  useEffect(
    () => {
      _retrieveData();
      const interval = setInterval(() => {
        setCountDown(countDownDate - new Date().getTime());
      }, 1000);
      return () => clearInterval(interval);
    },
    [countDownDate]
  );

  const reportProblem = () => {
    Toast.show({
      type: "successToast",
      text1: "تم ارسال مشكلتك للإدارة بنجاح , سيتم التواصل معك في اقرب وقت ",
      bottomOffset: 80,
      visibilityTime: 2000
    });
    setReportModal(!report_modal);
  };

  const getReturnValues = countDown => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      countDown % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(countDown % (1000 * 60 * 60) / (1000 * 60));
    const seconds = Math.floor(countDown % (1000 * 60) / 1000);

    return [days, hours, minutes, seconds];
  };

  const render_order = val => {
    switch (val) {
      case "waiting":
        return {
          color: "#54B7D3",
          text: "بانتظار قبول العرض"
        };
      case "inactive":
        return {
          color: "red",
          text: "غير نشط"
        };

      case "cancelled":
        return {
          color: "red",
          text: "ملغي"
        };

      case "active":
        return {
          color: "green",
          text: "نشط"
        };

      case "declined":
        return {
          color: "red",
          text: "مرفوض من البائع "
        };

      case "pending":
        return {
          color: "grey",
          text: "بإنتظار إيداع المبلغ"
        };

      case "delivering":
        return {
          color: "green",
          text: "جاري إستلام الطلب "
        };

      case "delivered":
        return {
          color: "green",
          text: "تم إستلام الطلب "
        };

      default:
        return {
          color: "#119fbf",
          text: "حالة غير معروفة"
        };
    }
  };

  const _retrieveData = async () => {
    setImages(item.images?.split(","));
    const user_token = await AsyncStorage.getItem("user_token");
    const user_id = await AsyncStorage.getItem("user_id");
    setUserID(user_id);
    _getOffers();
  };

  const _getOffers = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    let url = api.custom_url + "orders/auction/offers.php?item_id=" + item.id;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "cache-control": "no-cache"
        }
      })
        .then(response => response.json())
        .then(json => {
          if (json.success == true) {
            setOffers(json.data);
            setPrevOffer(json.data.filter(obj => obj.user_id === user_id.toString()).length);
            console.log(json.data);
            console.log("------------------------")
            console.log()
          } else {
            setOffers([]);
            console.log(JSON.stringify(json));
          }
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const sendOffer = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    let formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("auction_id", item.id);
    formData.append("amount", amount);

    let url = api.custom_url + "orders/auction/insert.php";
    try {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        },
        body: formData
      })
        .then(response => response.json())
        .then(json => {
          console.log(JSON.stringify(json));
          if (json.success == true) {
            Toast.show({
              type: "successToast",
              text1: "تم إضافة العرض بنجاح ",
              bottomOffset: 80,
              visibilityTime: 2000
            });
            setInputModal(!input_modal);
            _getOffers();
          } else {
            Toast.show({
              type: "successToast",
              text1: "نأسف هناك مشكلة من طرفنا",
              bottomOffset: 80,
              visibilityTime: 2000
            });
          }
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const _acceptOffer = async offer_id => {
    const user_id = await AsyncStorage.getItem("user_id");
    let url = api.dynamic_url + "offers/" + offer_id;
    const body = JSON.stringify({
      status: "pending"
    });
    try {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        },
        body: body
      })
        .then(response => response.json())
        .then(json => {
          setInputModal(false);
          Toast.show({
            type: "successToast",
            text1: "تم قبول العرض ",
            bottomOffset: 80,
            visibilityTime: 2000
          });
          navigation.navigate("AuctionOfferInfo", {
            offer_id: offer_id
          });
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const _openChat = async (reciver_id, reciver_name) => {
    const user_id = await AsyncStorage.getItem("user_id");
    const user_name = await AsyncStorage.getItem("user_name");
    let url = api.custom_url + "messaging/create.php";
    let formData = new FormData();
    formData.append("sender_id", user_id);
    formData.append("sender_name", user_name);
    formData.append("reciver_id", reciver_id);
    formData.append("reciver_name", reciver_name);

    try {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        },
        body: formData
      })
        .then(response => response.json())
        .then(json => {
          if (json.success == true) {
            navigation.navigate("ChatScreen", {
              chat_id: json.id
            });
          } else {
            console.log(JSON.stringify(json));
          }
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmptyOffers = () => {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "80%",
            borderColor: "#DDDDDD",
            borderWidth: 2,
            paddingVertical: 10,
            borderRadius: 10
          }}
        >
          <Text style={{ fontFamily: "Regular", color: "grey", fontSize: 20 }}>
            لا يوجد عروض حتي الأن
          </Text>
        </View>
      </View>
    );
  };

  const CountdownTimer = () => {
    const [days, hours, minutes, seconds] = getReturnValues(countDown);
    if (days + hours + minutes + seconds <= 0) {
      return (
        <View>
          <Text style={{
            color: 'red'
          }}>
            Expired
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#4bae52",
                width: 40,
                height: 40,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                {seconds}
              </Text>
            </View>
            <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 10 }}>
              ثانية
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#4bae52",
                width: 40,
                height: 40,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                {minutes}
              </Text>
            </View>
            <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 10 }}>
              دقيقة
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#4bae52",
                width: 40,
                height: 40,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                {hours}
              </Text>
            </View>
            <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 10 }}>
              ساعة
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#4bae52",
                width: 40,
                height: 40,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                {days}
              </Text>
            </View>
            <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 10 }}>
              يوم
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
      <StatusBar backgroundColor="#34ace0" />

      <View
        style={{
          width: "100%",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#34ace0",
          paddingHorizontal: 20
        }}
      >
        <View style={{ width: "10%", alignItems: "flex-end" }}>
          <MaterialIcons
            name="arrow-forward-ios"
            size={30}
            color="#FFF"
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={{ width: "90%" }}>
          <Text
            style={{
              color: "#FFF",
              fontFamily: "Regular",
              textAlign: 'center',
              fontSize: 16
            }}
          >
            {item.title}
          </Text>
        </View>
      </View>

      <View>
        {images?.length > 1
          ? <ScrollView
            horizontal
            pagingEnabled
            style={{
              width: windowWidth,
              height: 280
            }}
          >
            {images.map(item => {
              return (
                <ImageBackground
                  source={{ uri: api.media_url + item }}
                  style={{
                    width: windowWidth,
                    height: 280,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    padding: 30
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: 40,
                      flexDirection: "row",
                      backgroundColor: "grey",
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Bold",
                        color: "#FFF",
                        margin: 5
                      }}
                    >
                      {images.length}
                    </Text>

                    <Entypo name="images" size={24} color="#FFF" />
                  </View>
                </ImageBackground>
              );
            })}
          </ScrollView>
          : <ImageBackground
            source={{ uri: api.media_url + item.images?.split(",")[0] }}
            style={{ width: "100%", height: 280 }}
          />}
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#FFF",
          marginTop: -20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20
        }}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginVertical: 20,
            alignItems: "flex-start"
          }}
        >
          {item.user_id == user_id
            ? <TouchableOpacity
              style={{
                backgroundColor: "#34ace0",
                width: 150,
                height: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{ fontFamily: "Bold", color: "#FFF", fontSize: 18 }}
              >
                مزاد شخصي
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
              onPress={() => setInputModal(true)}
              style={{
                backgroundColor: "#34ace0",
                width: 150,
                height: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {prev_offer ?

                <Text
                  style={{ fontFamily: "Bold", color: "#FFF", fontSize: 18 }}
                >
                  تعديل عرضك
                </Text>
                :
                <Text
                  style={{ fontFamily: "Bold", color: "#FFF", fontSize: 18 }}
                >
                  أضف عرض
                </Text>
              }
            </TouchableOpacity>
          }
          <View
            style={{
              justifyContent: "space-around",
              width: "50%",
              flexDirection: "row"
            }}
          >
            {CountdownTimer()}
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#F75B00", textAlign: 'right', marginVertical: 20 }}>
              {item.title}
            </Text>
          </View>

          <View style={{ paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
            <Text style={{ fontFamily: "Bold", fontSize: 16, color: "#41A2D8" }}>
              وصف المزاد
            </Text>
            <Text style={{
              fontFamily: "Regular",
              color: '#FFF',
              backgroundColor: render_order(item.status).color,
              paddingHorizontal: 10,
              paddingVertical: 2,
              borderRadius: 5
            }}>
              {render_order(item.status).text}
            </Text>
          </View>


          <View style={{ paddingHorizontal: 20, alignItems: 'flex-end' }}>
            <Text
              style={{ color: "grey", fontFamily: "Regular", marginTop: 20 }}
            >
              {item.details}
            </Text>
          </View>

          <View style={{ paddingHorizontal: 20, marginVertical: 30, alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: "Bold", fontSize: 16, color: "#41A2D8" }}>
              العنوان
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10
              }}
            >
              <Text style={{ color: "grey", fontFamily: "Bold" }}>
                {item.address}
              </Text>
              <Entypo name="location-pin" size={24} color="grey" />
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text
              style={{
                fontFamily: "Bold",
                color: "grey",
                fontSize: 16,
                marginBottom: 10,
                textAlign: 'right',
                color: "#41A2D8"
              }}
            >
              معلومات الناشر
            </Text>

            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "flex-start"
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("./../assets/profile.png")}
                  style={{ width: 60, height: 60, marginHorizontal: 5 }}
                />
              </View>

              <View style={{ alignItems: "flex-start" }}>
                <Text
                  style={{ color: "grey", fontFamily: "Bold", fontSize: 18, textAlign: 'right' }}
                >
                  {item.user.name}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{
                    fontFamily: 'Regular',
                    fontSize: 12,
                    color: 'grey'
                  }}>
                    لا يتوفر تقييم للمعلن
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text style={{ fontFamily: "Bold", color: "grey", fontSize: 16, textAlign: 'right' }}>
              العروض
            </Text>
          </View>

          <FlatList
            style={{
              width: "100%",
              marginTop: 20,
              flex: 1,
              paddingBottom: 80
            }}
            ListEmptyComponent={handleEmptyOffers}
            contentContainerStyle={{
              justifyContent: "center"
            }}
            data={offers}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    width: "90%",
                    marginVertical: 10,
                    backgroundColor: "#FFF",
                    borderRadius: 5,
                    padding: 10,
                    paddingHorizontal: 10,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4
                    },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,
                    elevation: 9
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row-reverse",
                      justifyContent: "space-between",
                      width: "100%"
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row-reverse",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        source={require("./../assets/profile.png")}
                        style={{ width: 50, height: 50, marginHorizontal: 5 }}
                      />
                      <Text
                        style={{
                          color: "#000",
                          fontSize: 14,
                          fontFamily: "Bold",
                          textAlign: "left"
                        }}
                      >
                        {item.user.name}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        style={{
                          color: "grey",
                          textAlign: "left",
                          fontFamily: "Regular"
                        }}
                      >
                        {item.amount} ريال
                      </Text>

                      <Image
                        source={require("./../assets/kas.png")}
                        style={{ width: 30, height: 30, marginHorizontal: 5 }}
                      />
                    </View>
                  </View>

                  {route.params.item.user_id == user_id
                    ? <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginVertical: 10
                      }}
                    >
                      {item.status == "waiting"
                        ? <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginVertical: 10
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => _acceptOffer(item.id)}
                            style={{
                              height: 40,
                              width: 120,
                              backgroundColor: "#4BAE52",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                              marginHorizontal: 5,
                              flexDirection: "row"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Regular",
                                color: "#FFFF"
                              }}
                            >
                              موافقة
                            </Text>
                            <Feather
                              name="check-square"
                              size={24}
                              color="#FFF"
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              _openChat(item.user_id, item.user.name)}
                            style={{
                              height: 40,
                              width: 120,
                              backgroundColor: "#FE5722",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                              marginHorizontal: 5,
                              flexDirection: "row"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Regular",
                                color: "#FFFF"
                              }}
                            >
                              محادثة
                            </Text>
                            <Ionicons
                              name="chatbubble-ellipses"
                              size={24}
                              color="#FFF"
                            />
                          </TouchableOpacity>
                        </View>
                        : <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%"
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: render_order(item.status)
                                .color,
                              height: 40,
                              width: 120,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                              marginHorizontal: 5,
                              flexDirection: "row"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Regular",
                                color: "#FFF"
                              }}
                            >
                              {render_order(item.status).text}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("AuctionOfferInfo", {
                                offer_id: item.id
                              })}
                            style={{
                              height: 40,
                              width: 120,
                              backgroundColor: "green",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                              marginHorizontal: 5,
                              flexDirection: "row"
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Regular",
                                color: "#FFFF",
                                marginHorizontal: 5
                              }}
                            >
                              عرض
                            </Text>
                            <AntDesign name="eye" size={24} color="#FFF" />
                          </TouchableOpacity>
                        </View>}
                    </View>
                    : null}
                </View>
              </View>}
          />

          {item.user_id == user_id
            ? <View
              style={{
                flexDirection: "row",
                backgroundColor: "#FFF",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: 10,
                marginBottom: 20
              }}
            >
              <View style={{ width: "20%" }}>
                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#4BAE52",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10
                  }}
                >
                  <AntDesign name="sharealt" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={{ width: "80%" }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Contact");
                  }}
                  style={{
                    width: "100%",
                    height: 60,
                    backgroundColor: "#FE5722",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "Bold",
                      fontSize: 18
                    }}
                  >
                    الإبلاغ عن مشكلة
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            : <View
              style={{
                flexDirection: "row",
                backgroundColor: "#FFF",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: 10,
                marginBottom: 20
              }}
            >
              <View style={{ width: "20%" }}>
                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#4BAE52",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10
                  }}
                >
                  <AntDesign name="sharealt" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={{ width: "60%" }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Contact");
                  }}
                  style={{
                    width: "100%",
                    height: 60,
                    backgroundColor: "#FE5722",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "Bold",
                      fontSize: 18
                    }}
                  >
                    الإبلاغ عن مشكلة
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: "20%", alignItems: "flex-end" }}>
                <TouchableOpacity
                  onPress={() => _openChat(item.user_id, item.user.name)}
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#000",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10
                  }}
                >
                  <Ionicons
                    name="chatbubbles-outline"
                    size={24}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            </View>}
        </ScrollView>
      </View>

      <Modal transparent={true} animationType="slide" visible={input_modal}>
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, { width: "90%", marginVertical: 100 }]}
          >
            <View
              style={{
                backgroundColor: "#41A2D8",
                width: 60,
                height: 60,
                marginTop: -20,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 30,
                borderWidth: 1,
                borderColor: "#FFF"
              }}
            >
              <MaterialIcons name="attach-money" size={24} color="#FFF" />
            </View>

            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "flex-end",
                paddingHorizontal: 20,
                marginVertical: -25,
                zIndex: 1000
              }}
              onPress={() => setInputModal(!input_modal)}
            >
              <FontAwesome name="close" size={30} color="grey" />
            </TouchableOpacity>

            <View style={{ height: 250, width: "100%", padding: 20 }}>
              <View style={{ width: "100%", marginTop: 10 }}>
                <Text
                  style={{
                    fontFamily: "Bold",
                    color: "#051A3A",
                    marginBottom: 10
                  }}
                >
                  أرسل عرضك
                </Text>
                <TextInput
                  onChangeText={value => setAmount(toEnglishNumber(value))}
                  placeholder="أدخل عرضك هنا"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#FFF",
                    height: 60,
                    marginBottom: 20,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#41A2D8",
                    width: "100%",
                    fontFamily: "Regular",
                    textAlign: "right"
                  }}
                />
              </View>

              <View style={{}}>
                <TouchableOpacity
                  onPress={() => sendOffer()}
                  style={{
                    backgroundColor: "#41A2D8",
                    paddingVertical: 15,
                    borderRadius: 20,
                    width: "100%",
                    marginBottom: 20
                  }}
                >
                  {buttonLoading == false
                    ? <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontFamily: "Bold",
                          marginHorizontal: 10
                        }}
                      >
                        ارسال
                      </Text>
                      <Ionicons name="send" size={24} color="#FFF" />
                    </View>
                    : <ActivityIndicator size="large" color={"#FFF"} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} animationType="slide" visible={report_modal}>
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, { width: "90%", marginVertical: 100 }]}
          >
            <View
              style={{
                backgroundColor: "#41A2D8",
                width: 60,
                height: 60,
                marginTop: -20,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 30,
                borderWidth: 1,
                borderColor: "#FFF"
              }}
            >
              <Feather name="alert-triangle" size={24} color="#FFF" />
            </View>

            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "flex-end",
                paddingHorizontal: 20,
                marginVertical: -25,
                zIndex: 1000
              }}
              onPress={() => setReportModal(!report_modal)}
            >
              <FontAwesome name="close" size={30} color="grey" />
            </TouchableOpacity>

            <View style={{ width: "100%", padding: 20 }}>
              <View style={{ width: "100%", marginTop: 10 }}>
                <Text
                  style={{
                    fontFamily: "Bold",
                    color: "#051A3A",
                    marginBottom: 10
                  }}
                >
                  أدخل وصف المشكلة التي تواجهها
                </Text>
                <TextInput
                  onChangeText={value => setProblem(value)}
                  style={{
                    backgroundColor: "#FFF",
                    height: 120,
                    marginBottom: 20,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    width: "100%",
                    fontFamily: "Regular",
                    textAlign: "right"
                  }}
                />
              </View>

              <View style={{}}>
                <TouchableOpacity
                  onPress={() => reportProblem()}
                  style={{
                    backgroundColor: "#41A2D8",
                    paddingVertical: 15,
                    borderRadius: 20,
                    width: "100%",
                    marginBottom: 20
                  }}
                >
                  {buttonLoading == false
                    ? <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontFamily: "Bold",
                          marginHorizontal: 10
                        }}
                      >
                        ارسال
                      </Text>
                      <Ionicons name="send" size={24} color="#FFF" />
                    </View>
                    : <ActivityIndicator size="large" color={"#FFF"} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    marginBottom: 50,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "red",
    marginVertical: 20,
    width: "80%",
    marginBottom: 40
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },

  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Bold"
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
    fontFamily: "Bold",
    marginHorizontal: 10
  },
  modalBody: {
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: "Regular"
  }
});
