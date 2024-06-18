import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
  FontAwesome
} from "@expo/vector-icons";
import api from "./../constants/constants";

import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function MyWallet({ route, navigation }) {
  const [data, setData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [input_modal, setInputModal] = React.useState(false);
  const [charge_modal, setChargeModal] = React.useState(false);

  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [amount, setAmount] = useState("0");

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
      _retriveTransactions();
    }, [])
  );

  const _proceedToPayment = () => {
    setChargeModal(false);
    setInputModal(false);
    navigation.navigate("ChoosePaymentMethod", {
      invoice_value: amount
    });
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
        setData(json.data[0]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const _retriveTransactions = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    fetch(api.dynamic_url + "payment_process?filter=user_id,eq," + user_id + "&order=payment_id,desc",
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-type": "multipart/form-data;",
          "cache-control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive"
        }
      }
    )
      .then(response => response.json())
      .then(json => {
        setPayments(json.records);
        console.log(json);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const orderWithdraw = async () => {
    if (data.current_balance == null || parseInt(amount) > parseInt(data.current_balance)) {
      alert("لا يوجد لديك رصيد لسحب المبلغ المطلوب")
    }

    else {
      navigation.navigate("ChooseBank", {
        balance: amount
      });
    }
  };

  const handleEmptyProp = () => {
    return (
      <View
        style={{
          width: "100%",
          marginTop: 50,
          height: "50%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={require("../assets/transaction.png")}
          style={{
            width: 200,
            height: 200,
            alignSelf: "center"
          }}
        />

        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{ fontFamily: "Bold", fontSize: 20, textAlign: "center" }}
          >
            لا يوجد لديك أي معاملات
          </Text>

          <Text
            style={{
              fontFamily: "Regular",
              textAlign: "center",
              marginTop: 20,
              color: "grey"
            }}
          >
            لا توجد لديك أي معاملات حتى الآن , قم بشحن أو سحب الأموال من حسابك
            حتي يتم عرضها هنا
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#34ace0" />
      <View
        style={{
          paddingTop: Constants.statusBarHeight * 1.6,
          width: "100%",
          height: "50%",
          alignItems: "center",
          backgroundColor: "#34ace0"
        }}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={{ width: "60%", alignItems: "center" }}>
            <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 30 }}>
              محفظتي
            </Text>
          </View>

          <View
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <SimpleLineIcons name="menu" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{ marginVertical: 40, width: "100%", paddingHorizontal: 60 }}
        >
          <Text
            style={{
              fontFamily: "Bold",
              fontSize: 20,
              color: "#FFF",
              textAlign: "center"
            }}
          >
            الرصيد المتاح
          </Text>

          <Text
            style={{
              fontFamily: "Bold",
              fontSize: 40,
              color: "#FFF",
              textAlign: "center"
            }}
          >
            {data.current_balance == null
              ? "0.00 ريال"
              : data.current_balance + " " + "ريال"}
          </Text>
        </View>

        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={{ width: "50%", paddingHorizontal: 10 }}>
            <TouchableOpacity
              onPress={() => setChargeModal(!charge_modal)}
              style={{
                width: "100%",
                height: 50,
                backgroundColor: "#FFF",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{ fontFamily: "Bold", color: "#34ace0", fontSize: 20 }}
              >
                شحن الرصيد
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: "50%", paddingHorizontal: 10 }}>
            <TouchableOpacity
              onPress={() => setInputModal(true)}
              style={{
                width: "100%",
                height: 50,
                backgroundColor: "#FFF",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{ fontFamily: "Bold", color: "#34ace0", fontSize: 20 }}
              >
                سحب الرصيد
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#FFF",
          borderRadius: 40,
          marginTop: -30,
          paddingHorizontal: 20,
          flex: 1,
          paddingTop: 20
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Bold",
            width: "100%",
            marginBottom: 10
          }}
        >
          المعاملات المالية
        </Text>

        <FlatList
          data={payments}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={handleEmptyProp()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                borderColor: "#DDDDDD",
                backgroundColor: "#FFF",
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                justifyContent: "flex-end",
                marginVertical: 5
              }}
            >
              <View
                style={{
                  width: "25%",
                  paddingHorizontal: 20,
                  alignItems: "flex-start",
                  justifyContent: "center"
                }}
              >
                {item.payment_type == "deposite"
                  ? <Image
                    source={require("./../assets/deposite.png")}
                    style={{ width: 50, height: 50 }}
                  />
                  : <Image
                    source={require("./../assets/withdraw.png")}
                    style={{ width: 50, height: 50 }}
                  />}
              </View>
              <View
                style={{
                  width: "75%",
                  paddingHorizontal: 20,
                  alignItems: "flex-start",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: "100%"
                  }}
                >
                  {item.payment_type == "deposite"
                    ? <Text style={{ color: "green", fontFamily: "Bold" }}>
                      عملية إيداع
                    </Text>
                    : <Text style={{ color: "red", fontFamily: "Bold" }}>
                      عملية سحب
                    </Text>}
                  <Text
                    style={{ fontFamily: "Bold", fontSize: 15, color: "#000" }}
                  >
                    {item.amount} ربال
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: 10
                  }}
                >
                  <MaterialIcons name="date-range" size={24} color="grey" />

                  <Text
                    style={{
                      fontFamily: "Regular",
                      fontSize: 14,
                      color: "grey"
                    }}
                  >
                    {item.created_at}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>}
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
                    سحب الرصيد
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
                  placeholder="أدخل  المبلغ المراد سحبة"
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
                  onPress={() => orderWithdraw()}
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
                        flexDirection: "row-reverse",
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
                        سحب
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

      <Modal transparent={true} animationType="slide" visible={charge_modal}>
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
              onPress={() => setChargeModal(!charge_modal)}
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
                    شحن الرصيد
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
                    أدخل المبلغ المراد شحنة
                  </Text>
                </View>

                <TextInput
                  onChangeText={value => setAmount(value)}
                  placeholder="أدخل  المبلغ المراد شحنة"
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
                  onPress={() => _proceedToPayment()}
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
                        flexDirection: "row-reverse",
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
                        متابعة
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
    flexDirection: "row-reverse",
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 160,
    width: "100%"
  },
  featuredItem: {
    height: 160,
    alignItems: "flex-start",
    padding: 5,
    flexDirection: "row-reverse"
  },

  itemImg: {
    width: "100%",
    resizeMode: "cover",
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
    marginHorizontal: 5,
    width: "48%",
    marginVertical: 5,
    backgroundColor: "#FFF",
    elevation: 5
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
