import React, { useState, useEffect } from "react";
import {
    Image,
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Modal,
    ScrollView,
    TextInput,
    Platform,
    Linking
} from "react-native";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons, Entypo } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import api from "./../constants/constants";
import { Rating, AirbnbRating } from "react-native-ratings";
import Toast from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
export default function AuctionOfferInfo({ route, navigation }) {
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
    const [lat, setLat] = useState(24.7136);
    const [long, setLong] = useState(46.6753);
    const [rating_text, setRatingText] = useState("");
    const [rating_val, setRatingValue] = useState(0);
    const [chat_loading, setChatLoading] = useState(false);

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





    const _navigateChat = async () => {
        const user_id = await AsyncStorage.getItem("user_id");

        if (user_id == orderClient.id) {
            _openChat(itemSeller.id, itemSeller.name);
        } else if (user_id == itemSeller.id) {
            _openChat(orderClient.id, orderClient.name);
        }
    };


    const _rateOrder = async offer_id => {
        let url = api.dynamic_url + "offers/" +
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
                    Toast.show({
                        type: "successToast",
                        text1: "شكرا على تقييمك",
                        bottomOffset: 80,
                        visibilityTime: 2000
                    });
                    _retrieveData();
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };


    const render_order = (val) => {
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
                    text: "جاري إستلام الطلب "
                };
            case "go_pay":
                return {
                    color: "grey",
                    text: "إدفع المبلغ"
                };

            case "delivered":
                return {
                    color: "green",
                    text: "تم إستلام الطلب "
                };

            default:
                return {
                    color: "#119fbf",
                    text: val
                };

        }
    };
    const _retrieveData = async () => {
        try {
            const user_token = await AsyncStorage.getItem("user_token");
            const user_id = await AsyncStorage.getItem("user_id");
            setUserToken(user_token);
            setUserID(user_id);
            fetch(api.custom_url + "orders/index.php?auction_offer_id=" + offer_id,
                {
                    method: "GET",
                    headers: {
                        Accept: "*/*",
                        "Content-type": "multipart/form-data;",
                        "Accept-Encoding": "gzip, deflate, br",
                        "cache-control": "no-cache",
                        Connection: "keep-alive",
                    }
                })
                .then(response => response.json())
                .then(json => {
                    if (json.success == "true") {
                        setOrderInfo(json.offer_info);
                        setOrderClient(json.client_info);
                        setItemSeller(json.seller_info);
                        setOrderItem(json.item);
                    }
                    else {
                        setData([]);
                    }
                }
                )
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
                console.log(JSON.stringify(json))
                setProfile(json.data[0]);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const deliverOrder = async (offer_id) => {
        let url = api.custom_url + "orders/auction/deliver.php?auction_offer_id=" + offer_id;
        try {
            fetch(url, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Content-type": "multipart/form-data;",
                    "cache-control": "no-cache",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive",
                }
            })
                .then(response => response.json())
                .then(json => {
                    SetdeliverModal(false);
                    Toast.show({
                        type: "successToast",
                        text1: "تم إستلام الطلب  بنجاح",
                        bottomOffset: 80,
                        visibilityTime: 2000
                    });
                    _retrieveData();
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };




    const _payForOrder = async (offer_id) => {
        const user_token = await AsyncStorage.getItem("user_token");
        const user_id = await AsyncStorage.getItem("user_id");
        let url = api.dynamic_url + "offers/" + offer_id;
        const body = JSON.stringify({
            "status": "delivering",
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
                    setModalVisible(false);
                    Toast.show({
                        type: "successToast",
                        text1: "تم الايداع بنجاح",
                        bottomOffset: 80,
                        visibilityTime: 2000
                    });
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
                        flexDirection: "row-reverse",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            justifyContent: "center",
                            alignItems: "flex-end"
                        }}>
                        <MaterialIcons name="keyboard-arrow-right" size={40} color="#FFF" />
                    </TouchableOpacity>

                    <View style={{ alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ color: "#FFF", fontFamily: "Regular", color: "#FFF", fontSize: 18 }}>
                            بيانات الطلب
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={{
                    width: "100%",
                }}
            >

                <TouchableOpacity
                    style={{
                        flexDirection: "row-reverse",
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
                        <View style={{ flexDirection: "row-reverse", alignItems: "center", marginHorizontal: 22, }}>

                            <View style={{ width: "20%" }}>
                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#140c40",
                                    borderRadius: 50,
                                    width: 30,
                                    height: 30,
                                }}>
                                    <Feather name="user" size={22} color="#FFF" />
                                </View>
                            </View>

                            <View style={{ marginHorizontal: 10, width: "80%" }}>
                                <Text
                                    style={{ color: "grey", fontFamily: "Bold", fontSize: 12, width: "90%" }}>
                                    البائع :
                                </Text>
                                <Text
                                    style={{ color: "black", fontFamily: "Bold", fontSize: 12, textAlign: "right", width: "90%" }}
                                >
                                    {itemSeller.name}
                                </Text>
                            </View>

                        </View>

                        <View style={{ width: "100%" }}>
                            <View
                                style={{
                                    height: 30,
                                    borderRightWidth: 1,
                                    borderColor: "grey",
                                    marginHorizontal: 22,
                                    borderStyle: "dashed"
                                }}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row-reverse",
                                alignItems: "center",
                                marginHorizontal: 22
                            }}
                        >


                            <View style={{ width: "20%" }}>
                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#140c40",
                                    borderRadius: 50,
                                    width: 30,
                                    height: 30,
                                }}>
                                    <Feather name="user" size={22} color="#FFF" />
                                </View>
                            </View>

                            <View style={{ marginHorizontal: 10, width: "80%" }}>
                                <Text
                                    style={{ color: "grey", fontFamily: "Bold", fontSize: 12, width: "90%" }}
                                >
                                    العميل :
                                </Text>
                                <Text
                                    style={{ color: "black", fontFamily: "Bold", fontSize: 12, width: "90%", textAlign: "right" }}
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

                        <TouchableOpacity
                            onPress={() => _navigateChat()}
                            style={{
                                backgroundColor: "#41A2D8",
                                paddingHorizontal: 10,
                                width: 100,
                                paddingVertical: 5,
                                borderRadius: 5,
                                marginVertical: 15,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 9
                                },
                                shadowOpacity: 0.5,
                                shadowRadius: 12.35,
                                elevation: 19
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

                        {orderInfo.status == "pending" && orderInfo.user_id == user_id ?

                            <View
                                style={{
                                    height: 35,
                                    width: "100%",
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
                                        fontSize: 12
                                    }}
                                >
                                    {render_order("go_pay").text}
                                </Text>
                            </View>
                            :

                            <View
                                style={{
                                    height: 35,
                                    width: 100,
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
                        }


                    </View>

                </TouchableOpacity>

                <View style={{ width: "100%", paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: "Bold", fontSize: 18 }}>
                        بيانات العرض :
                    </Text>
                </View>

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

                    <View style={{
                        width: "100%",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingHorizontal: 10
                    }}>

                        <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
                            <View style={{ width: 50, alignItems: "center" }}>
                                <MaterialIcons name="confirmation-number" size={24} color="grey"
                                    style={{ marginHorizontal: 5 }} />
                            </View>
                            <Text style={{ fontFamily: "Bold", color: "grey", fontSize: 16 }}>
                                رقم الطلب : {orderInfo.id}#
                            </Text>

                        </View>



                        <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
                            <View style={{ width: 50, alignItems: "center" }}>
                                <FontAwesome5 name="money-check-alt" size={24} color="grey"
                                    style={{ marginHorizontal: 5 }} />
                            </View>
                            <Text style={{ fontFamily: "Bold", color: "#119fbf", marginVertical: 10, fontSize: 16 }}>

                                السعر : {orderInfo.amount} ريال
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
                            <View style={{ width: 50, alignItems: "center" }}>

                                <AntDesign name="calendar" size={24} color="grey"
                                    style={{ marginHorizontal: 5 }} />
                            </View>
                            <Text style={{ fontFamily: "Bold", color: "#000", marginVertical: 10 }}>
                                تاريخ  العرض :   {orderInfo.created_at}
                            </Text>

                        </View>

                        {orderInfo.status == "delivering" && orderInfo.user_id == user_id ?
                            <View style={{
                                flexDirection: "row-reverse",
                                width: "100%",
                                paddingHorizontal: 20,
                                justifyContent: "space-between",
                            }}>
                                <TouchableOpacity
                                    onPress={() => SetdeliverModal(true)}
                                    style={styles.primaryBtn}>
                                    <Text style={styles.btnText}>
                                        إستلام الطلب
                                    </Text>
                                    <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                            :
                            null
                        }


                        {orderInfo.status == "pending" && orderInfo.user_id == user_id ?
                            <View style={{
                                flexDirection: "row-reverse",
                                width: "100%",
                                paddingHorizontal: 20,
                                justifyContent: "space-between",
                            }}>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(true)}
                                    style={styles.primaryBtn}>
                                    <Text style={styles.btnText}>
                                        دفع المبلغ
                                    </Text>
                                    <MaterialIcons name="attach-money" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                            :
                            null
                        }

                    </View>
                </TouchableOpacity>
                <View style={{ width: "100%", paddingHorizontal: 20, }}>
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
                                height: 3,
                            },
                            shadowOpacity: 0.27,
                            shadowRadius: 4.65,

                            elevation: 6,
                        }}>

                        <View style={{ width: "75%", paddingHorizontal: 10 }}>
                            <Text style={{ fontFamily: "Bold", fontSize: 12, textAlign: "right" }}>
                                {orderItem.title}
                            </Text>
                        </View>


                        <View style={{ width: "25%" }}>
                            <Image
                                source={{
                                    uri: api.media_url + orderItem.images
                                }}
                                style={{ width: 80, height: 80, borderRadius: 10 }} />
                        </View>

                    </TouchableOpacity>
                </View>


                {orderInfo.status == "delivering" && itemSeller.id == user_id ?
                    <View style={{
                        width: "100%",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        marginVertical: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: 'green'
                    }}>

                        <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                            تم شحن الرصيد وايداعه في حسابنا
                        </Text>

                    </View>
                    :
                    null
                }




                {orderInfo.status == "delivering" && orderInfo.user_id == user_id
                    ? <View
                        style={{
                            width: "100%",
                            paddingHorizontal: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Bold",
                                marginVertical: 10
                            }}
                        >
                            موقع الإستلام : انقر على الخريطة
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
                                        marginTop: 10
                                    }}
                                >
                                    اترك تقييم للبائع , حتى تساعده على تحسين جوده منتجه و ايضا
                                    مساعدة الأخرين على اتخاذ قرارات أفضل ..
                                </Text>
                                <AirbnbRating
                                    style={{
                                        fontFamily: "Bold"
                                    }}
                                    count={5}
                                    defaultRating={0}
                                    onFinishRating={rating => setRatingValue(rating)}
                                    reviews={[
                                        "سيئ",
                                        "مقبول",
                                        "جيد",
                                        "جيد جدا",
                                        "ممتاز"
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
                                            fontFamily: "Bold",
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

                            :

                            <View
                                style={{
                                    backgroundColor: "#FFF",
                                    borderRadius: 10
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Bold",
                                        textAlign: "center",
                                        marginTop: 10
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
                                        "سيئ",
                                        "مقبول",
                                        "جيد",
                                        "جيد جدا",
                                        "ممتاز"
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

            </ScrollView>

            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>

                        <View style={[styles.modalView, { width: "90%", marginVertical: 100 }]}>
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
                            {parseFloat(profile.current_balance) < orderInfo.amount ?
                                <View style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <View>
                                        <Text style={{
                                            fontFamily: "Regular"
                                        }}>
                                            {orderInfo.amount}
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
                                        }}>
                                        <Text style={{
                                            textAlign: "center",
                                            fontFamily: "Bold",
                                            color: "#FFF"
                                        }}>
                                            شحن رصيدك
                                        </Text>
                                        <MaterialIcons name="attach-money" size={24} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: "Regular"
                                            }}
                                        >
                                            عميلنا العزيز , يرجي العلم أن أي مبالغ تقوم بتحريرها
                                            للبائع ,ستحفظ في محفظتك على مستعمل . كوم حتى
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
                                        }}>
                                        <Text style={{
                                            textAlign: "center",
                                            fontFamily: "Bold",
                                            color: "#FFF"
                                        }}>
                                            تحرير المبلغ
                                        </Text>
                                        <MaterialIcons name="attach-money" size={24} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            }

                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={deliver_modal}
                    onRequestClose={() => {
                        console.log('Modal has been closed.');
                        SetdeliverModal(!deliver_modal);
                    }}>
                    <View style={styles.centeredView}>

                        <View style={[styles.modalView, { width: "90%", marginVertical: 100 }]}>
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
                                <TouchableOpacity onPress={() => SetdeliverModal(!deliver_modal)}>
                                    <AntDesign name="closecircleo" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <View>
                                    <Text style={{
                                        fontFamily: "Regular"
                                    }}>
                                        عزيزي مستخدم مستعمل .كوم في حال الضغط على استلام الطلب فأنت تتحمل المسؤوليه كامله عن استلامكم المنتج او الخدمه في وضعها السليم بعد فحصكم لها وتوافق على تحرير المبلغ من قبل منصة مستعمل . كوم لحساب البائع أو مقدم الخدمه ولا تتحمل منصة مستعمل . كوم ادنى مسؤوليه تجاه ذلك ..
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
                                    }}>
                                    <Text style={{
                                        textAlign: "center",
                                        fontFamily: "Bold",
                                        color: "#FFF"
                                    }}>
                                        إستلام الطلب
                                    </Text>
                                    <MaterialIcons name="attach-money" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <Toast config={toastConfig} />
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
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});