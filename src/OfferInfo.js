import React, { Component, useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
  TextInput
} from "react-native";
import {
  Feather,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";
import { Rating, AirbnbRating } from "react-native-ratings";
import api from "./../constants/constants";

export default function OrderInfo({ route, navigation }) {
  const { offer_id } = route.params;

  const [profile, setProfile] = useState([]);
  const [orderInfo, setOrderInfo] = useState([]);
  const [orderClient, setOrderClient] = useState([]);
  const [itemSeller, setItemSeller] = useState([]);
  const [orderItem, setOrderItem] = useState([]);
  const [user_token, setUserToken] = useState(null);
  const [user_id, setUserID] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliver_modal, SetdeliverModal] = useState(false);
  const [chat_loading, setChatLoading] = useState(false);
  const [rating_text, setRatingText] = useState("");
  const [rating_val, setRatingValue] = useState("");

  const [lat, setLat] = useState(24.7136);
  const [long, setLong] = useState(46.6753);
  useEffect(() => {
    _retrieveData();
    getProfile();
  }, []);

  const openAddressOnMap = (label, lat, lng) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q="
    });
    const latLng = `${lat},${lng}`;
    //const label = label;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  };

  const render_order = val => {
    switch (val) {
      case "waiting":
        return {
          color: "#54B7D3",
          text: "بانتظار قبول العرض"
        };

      case "declined":
        return {
          color: "red",
          text: "مرفوض من البائع "
        };

      case "pending":
        return {
          color: "grey",
          text: "بإنتظار شحن الرصيد"
        };

      case "delivering":
        return {
          color: "green",
          text: "جاري توصيل الطلب "
        };

      case "delivered":
        return {
          color: "green",
          text: "تم توصيل الطلب "
        };

      default:
        return {
          color: "#119fbf",
          text: "حالة غير معروفة"
        };
    }
  };

  const _retrieveData = async () => {
    try {
      const user_token = await AsyncStorage.getItem("user_token");
      const user_id = await AsyncStorage.getItem("user_id");
      setUserToken(user_token);
      setUserID(user_id);
      fetch(api.custom_url+"orders/index.php?offer_id="+offer_id,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-type": "multipart/form-data;",
            "Accept-Encoding": "gzip, deflate, br",
            "cache-control": "no-cache",
            Connection: "keep-alive"
          }
        }
      )
        .then(response => response.json())
        .then(json => {
          if (json.success == "true") {
            setOrderInfo(json.offer_info);
            setOrderClient(json.client_info);
            setItemSeller(json.seller_info);
            setOrderItem(json.item);
            setLat(json.item.coords.split(",")[0]);
            setLong(json.item.coords.split(",")[1]);
          } else {
            setData([]);
          }
        })
        // .finally(() => setLoading(false))
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

 
  const getProfile = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    fetch(api.custom_url + "user/info.php?user_id=" + user_id, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-type": "multipart/form-data;",
        "cache-control": "no-cache",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive"
      }
    })
      .then(response => response.json())
      .then(json => {
        //alert(JSON.stringify(json))
        setProfile(json.data[0]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const _openChat = async (user_id, user_name) => {
    const user_token = await AsyncStorage.getItem("user_token");
    setChatLoading(true);
    let url = "https://mestamal.com/api/contact/" + user_id;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          Authorization: "Bearer " + user_token
        }
      })
        .then(response => response.json())
        .then(json => {
          if (json.status == true) {
            setChatLoading(false);
            navigation.navigate("ChatScreen", {
              chat_id: user_id,
              user_name: user_name
            });
          } else {
            setChatLoading(false);
            alert(json.msg);
          }
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const _navigateChat = async () => {
    const user_id = await AsyncStorage.getItem("user_id");

    if (user_id == orderClient.id) {
      _openChat(itemSeller.id, itemSeller.name);
    } else if (user_id == itemSeller.id) {
      _openChat(orderClient.id, orderClient.name);
    }
  };

  const deliverOrder = async offer_id => {
    let url = api.custom_url + "orders/ad/deliver.php?offer_id=" + offer_id;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        }
      })
        .then(response => response.json())
        .then(json => {
          SetdeliverModal(false);
          alert("تم إستلام الطلب  بنجاح");
          _retrieveData();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const _payForOrder = async offer_id => {
    const user_token = await AsyncStorage.getItem("user_token");
    const user_id = await AsyncStorage.getItem("user_id");
    let url = api.dynamic_url + "item_offers/" +
      offer_id;
    const body = JSON.stringify({
      status: "delivering"
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
          setModalVisible(false);
          alert("تم الايداع بنجاح");
          _retrieveData();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const _rateOrder = async offer_id => {
    let url = api.dynamic_url + "item_offers/" +
      offer_id;
    const body = JSON.stringify({
      rating_text: rating_text,
      rating_val: rating_val
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
          alert("شكرا علي تقييمك");
          _retrieveData();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="transparent" />

      <View style={styles.header}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            <MaterialIcons name="keyboard-arrow-right" size={40} color="#FFF" />
          </TouchableOpacity>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text
              style={{
                color: "#FFF",
                fontFamily: "Regular",
                color: "#FFF",
                fontSize: 18
              }}
            >
              بيانات الطلب
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{
          width: "100%"
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#FFF",
            marginVertical: 15,
            marginHorizontal: 20,
            shadowColor: "#000",
            paddingVertical: 20,
            paddingHorizontal: 10,
            borderRadius: 5,
            shadowOffset: {
              width: 0,
              height: 9
            },
            shadowOpacity: 0.5,
            shadowRadius: 12.35,
            elevation: 19
          }}
        >
          <View style={{ width: "70%", alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 22
              }}
            >
              <View style={{ width: "20%" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#140c40",
                    borderRadius: 50,
                    width: 30,
                    height: 30
                  }}
                >
                  <Feather name="user" size={22} color="#FFF" />
                </View>
              </View>

              <View style={{ marginHorizontal: 10, width: "80%" }}>
                <Text
                  style={{
                    color: "grey",
                    fontFamily: "Bold",
                    fontSize: 12,
                    width: "90%"
                  }}
                >
                  البائع :
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Bold",
                    fontSize: 12,
                    textAlign: "left",
                    width: "90%"
                  }}
                >
                  {itemSeller.name}
                </Text>
              </View>
            </View>

            <View style={{ width: "100%" }}>
              <View
                style={{
                  height: 30,
                  borderLeftWidth: 1,
                  borderColor: "grey",
                  marginHorizontal: 22,
                  borderStyle: "dashed"
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 22
              }}
            >
              <View style={{ width: "20%" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#140c40",
                    borderRadius: 50,
                    width: 30,
                    height: 30
                  }}
                >
                  <Feather name="user" size={22} color="#FFF" />
                </View>
              </View>

              <View style={{ marginHorizontal: 10, width: "80%" }}>
                <Text
                  style={{
                    color: "grey",
                    fontFamily: "Bold",
                    fontSize: 12,
                    width: "90%"
                  }}
                >
                  العميل :
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Bold",
                    fontSize: 12,
                    width: "90%",
                    textAlign: "left"
                  }}
                >
                  {orderClient.name}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "30%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: 35,
                backgroundColor: render_order(orderInfo.status).color,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                marginBottom: 5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: "Bold",
                  fontSize: 9
                }}
              >
                {render_order(orderInfo.status).text}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => _navigateChat()}
              style={{
                backgroundColor: "#41A2D8",
                paddingHorizontal: 10,
                width: 100,
                paddingVertical: 5,
                borderRadius: 5,
                marginVertical: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: "Bold",
                  marginHorizontal: 5
                }}
              >
                محادثة
              </Text>
              <Ionicons name="chatbox-ellipses-sharp" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#FFF",
            marginVertical: 15,
            marginHorizontal: 20,
            shadowColor: "#000",
            paddingVertical: 20,
            paddingHorizontal: 10,
            borderRadius: 5,
            shadowOffset: {
              width: 0,
              height: 9
            },
            shadowOpacity: 0.5,
            shadowRadius: 12.35,
            elevation: 19
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingHorizontal: 10
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 50, alignItems: "center" }}>
                <MaterialIcons
                  name="confirmation-number"
                  size={24}
                  color="grey"
                  style={{ marginHorizontal: 5 }}
                />
              </View>
              <Text style={{ fontFamily: "Bold", color: "grey", fontSize: 16 }}>
                رقم الطلب : {orderInfo.id}#
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 50, alignItems: "center" }}>
                <FontAwesome5
                  name="money-check-alt"
                  size={24}
                  color="grey"
                  style={{ marginHorizontal: 5 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: "Bold",
                  color: "#119fbf",
                  marginVertical: 10,
                  fontSize: 16
                }}
              >
                السعر : {orderInfo.amount} ريال
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 50, alignItems: "center" }}>
                <AntDesign
                  name="calendar"
                  size={24}
                  color="grey"
                  style={{ marginHorizontal: 5 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: "Bold",
                  color: "#000",
                  marginVertical: 10
                }}
              >
                تاريخ العرض :
                {moment(orderInfo.created_at).format("MMM Do YY")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{ width: "100%", paddingHorizontal: 20, marginVertical: 10 }}
        >
          <Text style={{ fontFamily: "Bold", fontSize: 18 }}>
            بيانات المنتج
          </Text>
        </View>

        <View style={{ width: "100%", paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              backgroundColor: "#FFF",
              alignItems: "center",
              paddingHorizontal: 10,
              marginVertical: 10,
              paddingVertical: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,

              elevation: 6
            }}
          >
            <View style={{ width: "25%" }}>
              <Image
                source={{
                  uri: api.media_url + orderItem.images
                }}
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
            </View>

            <View style={{ width: "60%", paddingHorizontal: 10 }}>
              <Text style={{ fontFamily: "Bold", fontSize: 12 }}>
                {orderItem.title}
              </Text>

              <Text style={{ fontFamily: "Bold", color: "#119fbf" }}>
                {orderItem.price} ر.س
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {orderInfo.status == "delivering" && itemSeller.id == user_id
          ? <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginVertical: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "green"
              }}>
              <Text style={{ fontFamily: "Bold", color: "#FFF",fontSize:13 }}>
                تم شحن الرصيد و إيداعة في محفظتك لدي مستعمل . كوم
              </Text>
            </View>
          : null}

        {orderInfo.status == "pending" && orderInfo.user_id == user_id
          ? <View
              style={{
                flexDirection: "row-reverse",
                width: "100%",
                paddingHorizontal: 20,
                justifyContent: "space-between"
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.primaryBtn}
              >
                <Text style={styles.btnText}>دفع المبلغ</Text>
                <MaterialIcons name="attach-money" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          : null}

        {orderInfo.status == "delivering" && orderInfo.user_id == user_id
          ? <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                marginVertical: 20
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  marginVertical: 10
                }}
              >
                موقع الإستلام : انقر علي الخريطة
              </Text>
              <TouchableOpacity
                onPress={() =>
                  openAddressOnMap(
                    orderItem.title,
                    parseFloat(lat),
                    parseFloat(long)
                  )}
                style={{
                  width: "100%",
                  height: 300,
                  borderRadius: 20,
                  overflow: "hidden"
                }}
              >
                <MapView
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    borderRadius: 20
                  }}
                  rotateEnabled={false}
                  scrollEnabled={false}
                  initialRegion={{
                    latitude: parseFloat(lat) || 0,
                    longitude: parseFloat(long) || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                  }}
                >
                  <Marker
                    key={"7484"}
                    coordinate={{
                      latitude: parseFloat(lat) || 0,
                      longitude: parseFloat(long) || 0
                    }}
                  >
                    <Entypo name="location-pin" size={50} color="black" />
                  </Marker>
                </MapView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => SetdeliverModal(true)}
                style={styles.primaryBtn}
              >
                <Text style={styles.btnText}>إستلام الطلب</Text>
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          : null}

        {orderInfo.status == "delivered" && orderInfo.user_id == user_id
          ? <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                marginVertical: 20
              }}
            >
              {orderInfo.rating_val == "" || orderInfo.rating_val == "0"
                ? <View
                    style={{
                      width: "100%"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Bold",
                        marginVertical: 10
                      }}
                    >
                      تقييم البائع :
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Regular",
                        marginVertical: 10
                      }}
                    >
                      اترك تقييم للبائع , حتي تساعدة علي تحسين جودة منتجة و ايضا
                      مساعدة الأخرين علي اتخاذ قرارات أفضل
                    </Text>

                    <AirbnbRating
                      style={{
                        fontFamily: "Bold"
                      }}
                      count={5}
                      onFinishRating={rating => setRatingValue(rating)}
                      reviews={[
                        "سيئ للغاية",
                        "مقبول",
                        "متوسط الجودة",
                        "جودة جيدة",
                        "جودة ممتازة"
                      ]}
                      size={20}
                    />

                    <View
                      style={{
                        marginVertical: 10
                      }}
                    >
                      <TextInput
                        onChangeText={value => setRatingText(value)}
                        style={{
                          width: "100%",
                          color: "#000",
                          backgroundColor: "#FFF",
                          borderRadius: 20,
                          height: 80,
                          paddingHorizontal: 20
                        }}
                      />

                      <TouchableOpacity
                        onPress={() => _rateOrder(orderInfo.id)}
                        style={{
                          backgroundColor: "#41A2D8",
                          marginVertical: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 20,
                          padding: 10
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Bold",
                            color: "#FFF"
                          }}
                        >
                          تقييم
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                : <View
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: 10
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Bold",
                        textAlign: "center"
                      }}
                    >
                      تم تقييم البائع
                    </Text>

                    <AirbnbRating
                      style={{
                        fontFamily: "Bold"
                      }}
                      defaultRating={parseInt(orderInfo.rating_val)}
                      isDisabled={true}
                      count={5}
                      reviews={[
                        "سيئ للغاية",
                        "علي غير المستوي المرجو",
                        "متوسط الجودة",
                        "جودة جيدة",
                        "جودة ممتازة"
                      ]}
                      size={20}
                    />

                    <Text
                      style={{
                        fontFamily: "Bold",
                        textAlign: "center",
                        marginVertical: 5
                      }}
                    >
                      {orderInfo.rating_text}
                    </Text>
                  </View>}
            </View>
          : null}

        {orderInfo.status == "delivered" &&
        orderInfo.user_id !== user_id &&
        orderInfo.rating_val !== ""
          ? <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                marginVertical: 20
              }}
            >
              {orderInfo.rating_val !== ""
                ? <View
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: 10
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Bold",
                        textAlign: "center"
                      }}
                    >
                      تم التقييم من قبل المشتري
                    </Text>

                    <AirbnbRating
                      style={{
                        fontFamily: "Bold"
                      }}
                      isDisabled={true}
                      count={5}
                      reviews={[
                        "سيئ للغاية",
                        "علي غير المستوي المرجو",
                        "متوسط الجودة",
                        "جودة جيدة",
                        "جودة ممتازة"
                      ]}
                      size={20}
                    />

                    <Text
                      style={{
                        fontFamily: "Bold",
                        textAlign: "center",
                        marginVertical: 5
                      }}
                    >
                      {orderInfo.rating_text}
                    </Text>
                  </View>
                : null}
            </View>
          : null}
      </ScrollView>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={[styles.modalView, { width: "90%", marginVertical: 100 }]}
            >
              <View
                style={{
                  backgroundColor: "#41A2D8",
                  width: 60,
                  height: 60,
                  marginTop: -60,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: "#FFF"
                }}
              >
                <MaterialIcons name="attach-money" size={24} color="#FFF" />
              </View>

              <View style={{ width: "100%" }}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <AntDesign name="closecircleo" size={24} color="black" />
                </TouchableOpacity>
              </View>
              {parseInt(profile.current_balance) < parseInt(orderItem.price)
                ? <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: "Regular"
                        }}
                      >
                        عميلنا العزيز , رصيدك الحالي لا يسمح بدفع المبلغ المطلوب
                        , الراجاء الشحن و إعادة المحاولة
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => navigation.navigate("MyWallet")}
                      style={{
                        flexDirection: "row-reverse",
                        backgroundColor: "#41A2D8",
                        width: "100%",
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        marginTop: 20
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "Bold",
                          color: "#FFF"
                        }}
                      >
                        شحن رصيدك
                      </Text>
                      <MaterialIcons
                        name="attach-money"
                        size={24}
                        color="#FFF"
                      />
                    </TouchableOpacity>
                  </View>
                : <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: "Regular"
                        }}
                      >
                        عميلنا العزيز , يرجي العلم أن أي مبالغ تقوم بتحريرها
                        للبائع , ستظل في ستظل في محفظتك على مستعمل . كوم حتي
                        تقوم بإستلام طلبك من البائع و تأكيد إستلام الطلب من
                        التطبيق
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => _payForOrder(orderInfo.id)}
                      style={{
                        flexDirection: "row-reverse",
                        backgroundColor: "#41A2D8",
                        width: "100%",
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        marginTop: 20
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "Bold",
                          color: "#FFF"
                        }}
                      >
                        تحرير المبلغ
                      </Text>
                      <MaterialIcons
                        name="attach-money"
                        size={24}
                        color="#FFF"
                      />
                    </TouchableOpacity>
                  </View>}
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={deliver_modal}
          onRequestClose={() => {
            SetdeliverModal(!deliver_modal);
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={[styles.modalView, { width: "90%", marginVertical: 100 }]}
            >
              <View
                style={{
                  backgroundColor: "#41A2D8",
                  width: 60,
                  height: 60,
                  marginTop: -60,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: "#FFF"
                }}
              >
                <MaterialIcons name="attach-money" size={24} color="#FFF" />
              </View>

              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  onPress={() => SetdeliverModal(!deliver_modal)}
                >
                  <AntDesign name="closecircleo" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Regular"
                    }}
                  >
                    عزيزي مستخدم مستعمل .كوم في حال الضغط على استلام الطلب فأنت
                    تتحمل المسؤوليه كامله عن استلامكم المنتج او الخدمه في وضعها
                    السليم بعد فحصكم لها وتوافق على تحرير المبلغ من قبل منصة
                    مستعمل . كوم لحساب البائع أو مقدم الخدمه ولا تتحمل منصة
                    مستعمل . كوم ادنى مسؤوليه تجاه ذلك ..
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => deliverOrder(orderInfo.id)}
                  style={{
                    flexDirection: "row-reverse",
                    backgroundColor: "#41A2D8",
                    width: "100%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    marginTop: 20
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "Bold",
                      color: "#FFF"
                    }}
                  >
                    إستلام الطلب
                  </Text>
                  <MaterialIcons name="attach-money" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    paddingTop: Constants.statusBarHeight,
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#34ace0",
    height: 100,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  primaryBtn: {
    flexDirection: "row-reverse",
    backgroundColor: "#41A2D8",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },

  modalPrimaryBtn: {
    flexDirection: "row-reverse",
    backgroundColor: "#119fbf",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  contactBtn: {
    backgroundColor: "#140c40",
    width: "25%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },

  btnText: {
    marginHorizontal: 10,
    fontSize: 20,
    color: "#FFF",
    fontFamily: "Regular"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 30,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
