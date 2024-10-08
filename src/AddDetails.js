import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Modal,
  ImageBackground,
  FlatList,
  Dimensions,
  Alert
} from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  AntDesign,
  Entypo
} from "@expo/vector-icons";
import api from "./../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
import { useFocusEffect } from '@react-navigation/native';

const AddDetail = ({ route, navigation }) => {

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [isLoading, setLoading] = React.useState(false);
  const [user_id, setUserID] = useState(null);
  const { item } = route.params;
  const [offers, setOffers] = useState([]);
  const [images, setImages] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);

  const [buttonLoading, setButtonLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [input_modal, setInputModal] = useState(false);
  const [offers_modal, setOfferModal] = useState(false);
  const [item_status, setStatus] = useState(item.status);
  useFocusEffect(
    React.useCallback(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchData = async () => {
        try {
          await _retriveData(signal);
          await getadOffers(signal);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();

      return () => controller.abort(); // Cleanup on unmount
    }, [item.id]) // Reloads only when the item.id changes
  );

  // useEffect(() => {
  //   _retriveData();
  //   getadOffers();
  // }, []);

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
          text: "تم إستلام الطلب "
        };
      case "active":
        return {
          color: "green",
          text: "نـــشـط"
        };

      case "inactive":
        return {
          color: "red",
          text: "غير نشط"
        };


      case "pending":
        return {
          color: "grey",
          text: "قيد الانتظار"
        };
      case "done":
        return {
          color: "green",
          text: "مكتمل"
        };
      default:
        return {
          color: "#119fbf",
          text: "حالة غير معروفة"
        };
    }
  };

  const _retriveData = async () => {
    setImages(item.images.split(','));
    const user_token = await AsyncStorage.getItem("user_token");
    const user_id = await AsyncStorage.getItem("user_id");
    const user_name = await AsyncStorage.getItem("user_name");
    setUserID(user_id);
    getIsAddFavourite(user_id, item.id);
  };


  const toggleFavorite = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      let formData = new FormData();
      formData.append("ad_id", item.id);
      formData.append("user_id", user_id);
      fetch(api.custom_url + "wishlist/toggle.php", {
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
          Toast.show({
            type: "successToast",
            text1: responseJson.message,
            bottomOffset: 160,
            visibilityTime: 10000
          });
          setIsFavorited(!isFavorited);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getIsAddFavourite = async (user_id, item_id) => {
    setLoading(true);
    let url = api.custom_url + "user/isFavourite.php?item_id=" + item_id + '&user_id=' + user_id;
    try {
      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(json => {

          if (json.success == true) {
            setIsFavorited(true);

          } else {
            setIsFavorited(false);
          }
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };


  const getadOffers = async () => {
    setLoading(true);
    let url = api.custom_url + "ads/offers.php?item_id=" + item.id;
    try {
      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(json => {

          if (json.success == true) {
            setOffers(json.data);
            // setOffers([]);

          } else {
            setOffers([]);
          }
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const sendOffer = async () => {
    const user_token = await AsyncStorage.getItem("user_token");
    const user_id = await AsyncStorage.getItem("user_id");
    let url = api.dynamic_url + "item_offers";
    const body = JSON.stringify({
      user_id: user_id,
      user_token: user_token,
      amount: item.price,
      item_id: item.id,
      status: "waiting",
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      rating_text: "",
      rating_val: ""
    });
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
        body: body
      })
        .then(response => response.json())
        .then(json => {
          setInputModal(false);
          Toast.show({
            type: "successToast",
            text1: "تم تقديم عرضك بنجاح !",
            bottomOffset: 160,
            visibilityTime: 10000
          });
          navigation.navigate("OfferInfo", {
            offer_id: json
          });
          //getadOffers();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };


  const _acceptOffer = async offer_id => {
    setOfferModal(false);
    let url = api.custom_url + "orders/ad/accept.php";
    let formData = new FormData();
    formData.append("offer_id", offer_id);
    formData.append("item_id", item.id);
    formData.append("status", "pending");
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
          setInputModal(false);

          Toast.show({
            type: "successToast",
            text1: "تم قبول العرض",
            bottomOffset: 160,
            visibilityTime: 10000
          });
          navigation.navigate("OfferInfo", {
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
            setOfferModal(!offers_modal);
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


  const updateStatus = async (id, status) => {

    let url = api.dynamic_url + "ads/" + id;
    const body = JSON.stringify({
      "status": status == "active" ? "inactive" : "active",
    });
    try {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
        body: body
      })
        .then(response => response.json())
        .then(json => {
          Toast.show({
            type: "successToast",
            text1: "تم  تغيير حالة الاعلان بنجاح",
            bottomOffset: 160,
            visibilityTime: 10000
          });
          const new_status = JSON.parse(body);
          setStatus(new_status.status);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };


  const handleEmptyProp = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50
        }}
      >
        <Image
          source={require("./../assets/broken-heart.png")}
          style={{ width: 200, height: 200 }}
        />
        <Text
          style={{
            fontFamily: "Regular",
            color: "#c9c9c9",
            fontSize: 18,
            marginTop: 10
          }}
        >
          لا توجد أي عروض علي المنتج
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
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
        <View style={{ width: "20%", alignItems: "flex-end" }}>
          <MaterialIcons
            name="arrow-forward-ios"
            size={30}
            color="#FFF"
            onPress={() => navigation.goBack()}
          />
        </View>

        <View
          style={{
            width: "60%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontFamily: "Regular",
              textAlign: "center",
              fontSize: 18
            }}
          >
            {item.title}
          </Text>
        </View>

        <View style={{ width: "20%", alignItems: "flex-start" }}>
          <AntDesign name="sharealt" size={24} color="#FFF" />
        </View>
      </View>

      <View>

        {images.length > 1 ?
          <ScrollView
            horizontal
            pagingEnabled
            style={{
              width: windowWidth,
              height: 280,
            }}>

            {images.map((item) => {
              return (
                <ImageBackground
                  source={{ uri: api.media_url + item }}
                  resizeMode="stretch"
                  style={{
                    width: windowWidth,
                    height: 280,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    padding: 30
                  }}
                >
                  <View style={{
                    width: 50,
                    height: 40,
                    flexDirection: "row",
                    backgroundColor: "grey",
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Text style={{
                      fontFamily: "Bold",
                      color: "#FFF",
                      margin: 5
                    }}>
                      {images.length}
                    </Text>

                    <Entypo name="images" size={24} color="#FFF" />
                  </View>
                </ImageBackground>
              )
            })
            }

          </ScrollView>
          :
          <ImageBackground
            resizeMode="stretch"
            source={{ uri: api.media_url + item.images.split(",")[0] }}
            style={{ width: "100%", height: 280 }}
          />
        }
      </View>

      <View
        style={{
          backgroundColor: "#FFF",
          marginTop: -20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          flex: 1
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginBottom: 100
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginVertical: 20,
              alignItems: "center"
            }}
          >
            <Text style={{ fontFamily: "Bold", fontSize: 25, color: "grey" }}>
              {item.price} SAR
            </Text>

            {item.user_id == user_id
              ? <View style={{ width: "50%" }}>
                <TouchableOpacity
                  onPress={() => {
                    //getadOffers();
                    setOfferModal(true);
                  }}
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    height: 40,
                    backgroundColor: "#34ace0",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    paddingHorizontal: 10
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: "Bold",
                      fontSize: 15
                    }}
                  >
                    عرض طلبات الشراء
                  </Text>

                  <AntDesign name="shoppingcart" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              : <View style={{ width: "40%", justifyContent: "flex-end" }}>
                <View>
                  {offers.find(obj => obj.user_id === user_id)
                    ?
                    <View>

                      <TouchableOpacity
                        //onPress={() => setInputModal(true)}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          height: 40,
                          backgroundColor: "#34ace0",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: 10,
                          paddingHorizontal: 10
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFF",
                            fontFamily: "Bold",
                            fontSize: 15
                          }}
                        >
                          تم إضافة طلبك
                        </Text>

                        <AntDesign
                          name="checkcircle"
                          size={24}
                          color="#FFF"
                        />
                      </TouchableOpacity>


                    </View>

                    : <TouchableOpacity
                      onPress={() => setInputModal(true)}
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        height: 40,
                        backgroundColor: "#34ace0",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: 10,
                        paddingHorizontal: 10
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFF",
                          fontFamily: "Bold",
                          fontSize: 15
                        }}
                      >
                        طلب المنتج
                      </Text>

                      <AntDesign
                        name="shoppingcart"
                        size={24}
                        color="#FFF"
                      />
                    </TouchableOpacity>}
                </View>
              </View>}
          </View>
          {offers.find(obj => obj.user_id === user_id)
            ?
            <View style={{
              width: '90%',
              marginHorizontal: 20,
              backgroundColor: '#8dc63f',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5

            }}>
              <Text style={{
                width: '100%',
                fontFamily: 'Regular',
                color: '#FFF',
                fontSize: 13
              }}>
                إنتقل إلي قسم طلباتي من القائمة الرئيسية , لمتابعة حالة طلبك
              </Text>
            </View>

            : null}

          <View style={{ paddingHorizontal: 20, alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#F75B00", textAlign: 'right', marginVertical: 20 }}>
              {item.title}
            </Text>
          </View>


          <View style={{ paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
            <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#41A2D8" }}>
              وصف الإعلان
            </Text>
            <Text style={{
              fontFamily: "Regular",
              color: '#FFF',
              backgroundColor: render_order(item_status).color,
              paddingHorizontal: 10,
              paddingVertical: 2,
              borderRadius: 5
            }}>
              {render_order(item_status).text}
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
            <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#41A2D8" }}>
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

          {item.user !== undefined
            ? <View style={{ paddingHorizontal: 30, marginTop: 20 }}>
              <Text
                style={{ fontFamily: "Bold", fontSize: 20, color: "#000", textAlign: 'right' }}
              >
                بيانات المعلن :
              </Text>

              <View
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >

                  <Text
                    style={{
                      color: "grey",
                      fontFamily: "Bold",
                      fontSize: 18
                    }}
                  >
                    {item.user != null ? item.user.name : "لاتوجد معلومات"}
                  </Text>

                  <Image
                    source={require("./../assets/profile.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      marginHorizontal: 5
                    }}
                  />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <AntDesign name="star" size={20} color="#F7D000" />
                  <AntDesign name="star" size={20} color="#F7D000" />
                  <AntDesign name="star" size={20} color="#F7D000" />
                  <AntDesign name="star" size={20} color="#F7D000" />
                  <AntDesign name="star" size={20} color="#F7D000" /> */}
                  <Text style={{
                    fontFamily: 'Regular',
                    fontSize: 12,
                    color: 'grey',
                    textAlign: 'right'
                  }}>
                    لا يتوفر تقييم للمعلن
                  </Text>
                </View>
              </View>
            </View>
            : null}

        </ScrollView>
        {item.user_id == user_id
          ? <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 20,
              position: "absolute",
              bottom: 20,
              width: "100%"
            }}
          >
            <View style={{ width: "40%" }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditAdd", {
                    item: item
                  })}
                style={{
                  width: "100%",
                  flexDirection: "row",
                  height: 40,
                  backgroundColor: "#34ace0",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 10,
                  paddingHorizontal: 10
                }}
              >
                <Text
                  style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}
                >
                  تعديل المنتج
                </Text>

                <AntDesign name="edit" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={{ width: "40%" }}>
              {item_status == 'active' ?

                <TouchableOpacity
                  onPress={() => {
                    Alert.alert('تأكيد !',
                      'هل أنت متأكد من تغيير حالة هذا الإعلان',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => updateStatus(item.id, item_status)
                        },
                      ]);

                  }}
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    height: 40,
                    backgroundColor: "red",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    paddingHorizontal: 10
                  }}
                >
                  <Text
                    style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}
                  >
                    تعطيل المنتج
                  </Text>
                  <Entypo name="eye-with-line" size={24} color="#FFF" />
                </TouchableOpacity>
                :
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert('تأكيد !',
                      'هل أنت متأكد من تغيير حالة هذا الإعلان',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => updateStatus(item.id, item.status)
                        },
                      ]);

                  }}
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    height: 40,
                    backgroundColor: "green",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    paddingHorizontal: 10
                  }}
                >
                  <Text
                    style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}
                  >
                    تنشيط المنتج
                  </Text>
                  <Entypo name="eye" size={24} color="#FFF" />
                </TouchableOpacity>
              }
            </View>
          </View>
          : <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "absolute",
              bottom: 10,
              width: "100%",
              paddingHorizontal: 10
            }}
          >
            <View style={{ width: "20%" }}>
              <TouchableOpacity
                onPress={() => toggleFavorite()}
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#4BAE52",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10
                }}
              >
                <AntDesign
                  name={isFavorited ? "heart" : "hearto"}
                  size={24}
                  color={isFavorited ? "red" : "#FFF"}
                />
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
                  style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}
                >
                  الإبلاغ عن مشكلة
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: "20%", alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() =>
                  _openChat(
                    item.user_id,
                    item.user !== null ? item.user.name : "مستخدم محذوف"
                  )}
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#000",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10
                }}
              >
                {chatLoading
                  ? <ActivityIndicator size="small" color="#FFF" />
                  : <Ionicons
                    name="chatbubbles-outline"
                    size={24}
                    color="#FFF"
                  />}
              </TouchableOpacity>
            </View>
          </View>}
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

            <View style={{ height: 200, width: "100%", padding: 20 }}>
              <View style={{ width: "100%", marginTop: 10 }}>
                <View>
                  <Text
                    style={{
                      fontFamily: "Bold",
                      color: "#051A3A",
                      marginBottom: 10
                    }}
                  >
                    طلب المنتج
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Regular",
                      marginBottom: 10,
                      textAlign: "center",
                      marginVertical: 20
                    }}
                  >
                    سيتم إرسال الطلب للبائع و بمجرد القبول سيتم إبلاغك لتحويل
                    المبلغ
                  </Text>
                </View>
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

      <Modal transparent={true} animationType="slide" visible={offers_modal}>
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
              <Entypo name="list" size={24} color="#FFF" />
            </View>

            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "flex-end",
                paddingHorizontal: 20,
                marginVertical: -25,
                zIndex: 1000
              }}
              onPress={() => setOfferModal(!offers_modal)}
            >
              <FontAwesome name="close" size={30} color="grey" />
            </TouchableOpacity>

            <View style={{ height: 500, width: "100%", padding: 20 }}>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{ fontFamily: "Bold", marginVertical: 10 }}>
                  العروض المتاحة للمنتج
                </Text>
              </View>
              <FlatList
                data={offers}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={handleEmptyProp()}
                renderItem={({ item }) =>


                  <TouchableOpacity
                    onPress={() => {
                      setOfferModal(!offers_modal);
                      navigation.navigate("OfferInfo", {
                        offer_id: item.id
                      })
                    }}
                    style={{
                      flexDirection: "row",
                      borderColor: "#DDDDDD",
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      alignItems: "center",
                      marginVertical: 5
                    }}
                  >
                    {item.status == "waiting"
                      ? <View
                        style={{
                          width: "40%",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexDirection: "row"
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => _acceptOffer(item.id)}
                          style={{
                            backgroundColor: "#34ace0",
                            borderRadius: 5,
                            padding: 5
                          }}
                        >
                          <Text
                            style={{ fontFamily: "Regular", color: "#FFF" }}
                          >
                            قـبـول
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            _openChat(
                              item.user_id,
                              item.user !== null ? item.user.name : "مستخدم محذوف"
                            )}
                          style={{
                            backgroundColor: "green",
                            borderRadius: 5,
                            padding: 5
                          }}
                        >
                          <Text
                            style={{ fontFamily: "Regular", color: "#FFF" }}
                          >
                            محادثة
                          </Text>
                        </TouchableOpacity>
                      </View>
                      : <View
                        style={{
                          backgroundColor: render_order(item.status).color,
                          position: "absolute",
                          top: 0,
                          right: 0,
                          padding: 5,
                          borderTopRightRadius: 10
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Regular",
                            color: "#FFF",
                            textAlign: 'right'
                          }}
                        >
                          {render_order(item.status).text}
                        </Text>
                      </View>}

                    <View
                      style={{
                        width: "60%",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingLeft: 10,
                        paddingRight: 20
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Bold",
                          fontSize: 15,
                          color: "#000",
                          textAlign: 'right'
                        }}
                      >
                        {item.user.name}
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Bold",
                          fontSize: 20,
                          color: "#34ace0",

                          textAlign: 'right'

                        }}
                      >
                        {item.amount}{' '}
                        ريال
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          marginTop: 10
                        }}
                      >


                        <Text
                          style={{
                            fontFamily: "Regular",
                            fontSize: 12,
                            color: "grey"
                          }}
                        >
                          {moment(item.created_at).format("MMM Do YY")}
                        </Text>

                        <MaterialIcons
                          name="date-range"
                          size={24}
                          color="grey"
                        />
                      </View>
                    </View>


                  </TouchableOpacity>

                }
              />
            </View>
          </View>
        </View>
      </Modal>
      <Toast config={toastConfig} />

    </View>
  );
};

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
export default AddDetail;
