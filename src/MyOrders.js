import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert,
  Modal
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
  FontAwesome,
  Feather,
  AntDesign
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import api from "./../constants/constants";
import Toast from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
import DrawerScreenHeader from "./../components/DrawerScreenHeader";

export default function MyOrders({ route, navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input_modal, setInputModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [current_item, setCurrentItem] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    _retrieveData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      _retrieveData();
    }, [])
  );


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
          text: "تم إستلام الطلب"
        };
      case "active":
        return {
          color: "#54B7D3",
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


  const _retrieveData = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    setLoading(true);
    //alert(user_id);
    let url = api.custom_url + "user/offers.php?ads=true&user_id=" + user_id;
    try {
      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(json => {
          if (json.success == true) {
            setData(json.data);
          } else {
            //   alert(JSON.stringify(json));
            setData([]);
          }
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async id => {
    try {
      fetch(api.dynamic_url + "item_offers/" + id, {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "Accept-Encoding": "gzip, deflate, br"
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          Toast.show({
            type: "successToast",
            text1: "تم حذف الإعلان بنجاح",
            topOffset: 120,
            visibilityTime: 2000
          });
          _retrieveData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrder = async () => {
    if (amount !== 0 && current_item !== 0) {
      try {
        fetch(api.dynamic_url + "item_offers/" + current_item, {
          method: "PUT",
          headers: {
            Accept: "*/*",
            "Content-type": "multipart/form-data;",
            "Accept-Encoding": "gzip, deflate, br"
          },
          body: JSON.stringify({
            amount: amount
          })
        })
          .then(response => response.json())
          .then(responseJson => {
            setInputModal(false);
            alert("تم تعديل العرض بنجاح");
            _retrieveData();
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("لابد من إضافة السعر");
    }
  };

  const handleEmptyProp = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 160
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
          لم تقم بإضافة أي طلبات
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#34ace0" />
      <DrawerScreenHeader screenTitle={"طلباتي"} />

      <View style={{ flex: 1, backgroundColor: "#FFF", paddingHorizontal: 20 }}>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={handleEmptyProp()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("OfferInfo", {
                  offer_id: item.id
                })}
              style={{
                flexDirection: "row",
                borderColor: "#DDDDDD",
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                justifyContent: "flex-end",
                marginVertical: 5
              }}
            >

              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: render_order(item.status).color,
                width: 100,
                height: 30,
                zIndex: 9999,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  color: "#FFF",
                  fontFamily: 'Regular',
                  fontSize: 10
                }}>
                  {render_order(item.status).text}
                </Text>
              </View>
              {item.status == 'waiting' ?
                <View
                  style={{
                    width: "30%",
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: "space-around"
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentItem(item.id);
                      setInputModal(!input_modal);
                    }}
                  >
                    <AntDesign name="edit" size={30} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "تأكيد الحذف!",
                        "هل أنت متأكد من حذف هذاالإعلان",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          { text: "OK", onPress: () => deleteOrder(item.id) }
                        ]
                      );
                    }}
                  >
                    <AntDesign name="delete" size={30} color="red" />
                  </TouchableOpacity>
                </View>
                :
                null
              }
              <View
                style={{
                  width: "50%",
                  paddingHorizontal: 20,
                  alignItems: "flex-end",
                  justifyContent: "center"
                }}
              >
                <Text style={{ fontFamily: "Regular", fontSize: 12, color: "grey" }}>
                  {item.ad.title}
                </Text>
                <Text style={{ fontFamily: "Bold", fontSize: 14, color: "#34ace0" }}>
                  {item.amount} ربال
                </Text>
                <View
                  style={{
                    flexDirection: "row-reverse",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: 10
                  }}
                >
                  <MaterialIcons name="date-range" size={24} color="grey" />

                  <Text
                    style={{
                      fontFamily: "Regular",
                      fontSize: 12,
                      color: "grey"
                    }}
                  >
                    {moment(item.created_at).format("MMM Do YY")}
                  </Text>
                </View>
              </View>

              <View style={{ width: "20%" }}>
                <Image
                  source={{
                    uri: api.media_url + item.ad.images.split(",")[0],
                  }}
                  defaultSource={require('./../assets/picture.png')}
                  style={{
                    width: 70,
                    height: 70,
                    resizeMode: "cover",
                    borderRadius: 10
                  }}
                />
              </View>
            </TouchableOpacity>
          }
        />
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
                <View>
                  <Text
                    style={{
                      fontFamily: "Bold",
                      color: "#051A3A",
                      marginBottom: 10
                    }}
                  >
                    تعديل عرضك
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Regular",
                      color: "#051A3A",
                      marginBottom: 10,
                      fontSize: 12,
                      color: "red"
                    }}
                  >
                    * لابد أن تحتوي محفظتك علي المبلغ المدخل
                  </Text>
                </View>

                <TextInput
                  onChangeText={value => setAmount(value)}
                  placeholder="أدخل السعر الجديد"
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
                  onPress={() => updateOrder()}
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
                        تعديل
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

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  header: {
    paddingTop: Constants.statusBarHeight,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5
  },
  cats: {
    flexDirection: "row",
    marginVertical: 20
  },
  cat: {
    justifyContent: "center",
    alignItems: "center"
  },
  catItem: {
    borderWidth: 2,
    borderColor: "#FF9000",
    marginHorizontal: 10,
    borderRadius: 30,
    width: 60,
    height: 60,
    resizeMode: "contain",
    borderRadius: 30
  },
  catText: {
    fontFamily: "Bold",
    color: "#143656",
    marginVertical: 5,
    fontFamily: "Bold"
  },

  body: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5
  },
  itemContent: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 160
  },
  featuredItem: {
    height: 160,
    alignItems: "flex-start",
    padding: 5,
    flexDirection: "row-reverse"
  },

  itemImg: {
    width: "100%",
    resizeMode: "contain",
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  logo: {
    width: 50,
    height: 50,
    padding: 5,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#000"
  },

  itemContainer: {
    borderRadius: 15,
    width: "48%",
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: "#828282"
  },
  item: {
    width: "100%"
  },

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