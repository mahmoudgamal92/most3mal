import React, { Component, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    StatusBar,
    Modal,
    ImageBackground,
    FlatList
} from "react-native";
import {
    FontAwesome,
    MaterialIcons,
    Ionicons,
    AntDesign,
    Entypo,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import moment from 'moment';
import { ScrollView } from "react-native-gesture-handler";

const AddDetail = ({ route, navigation }) => {
    const [isLoading, setLoading] = React.useState(false);
    const [user_id, setUserID] = useState(null);
    const { item } = route.params;
    const [offers, setOffers] = useState([]);
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const [input_modal, setInputModal] = React.useState(false);
    const [offers_modal, setOfferModal] = React.useState(false);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        _retriveData();
    }, []);

    const _retriveData = async () => {
        console.log()
        const user_token = await AsyncStorage.getItem("user_token");
        const user_id = await AsyncStorage.getItem("user_id");
        const user_name = await AsyncStorage.getItem("user_name");
        setUserID(user_id);
    }

    const toggleFavorite = async () => {
        try {
            const user_id = await AsyncStorage.getItem("user_id");
            let formData = new FormData();
            formData.append("ad_id", item.id);
            formData.append("user_id", user_id);
            fetch("https://mestamal.com/mahmoud/api/custom/wishlist.php", {
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
                .then(responseJson => {
                    alert(responseJson.message);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const getadOffers = async () => {
        setOfferModal(true);
        setLoading(true);
        let url = "https://mestamal.com/mahmoud/api/custom/offers.php?item_id=" + item.id;
        try {
            fetch(url, {
                method: "GET",
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success == true) {
                        setOffers(json.data);
                    }
                    else {
                        setOffers([]);
                    }
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }

    }

    const sendOffer = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        const user_id = await AsyncStorage.getItem("user_id");
        let url = "https://mestamal.com/mahmoud/api/api.php/records/item_offers";
        const body = JSON.stringify({
            "user_id": user_id,
            "user_token": user_token,
            "amount": item.price,
            "item_id": item.id,
            "status": "waiting",
            "created_at": new Date().toString(),
            "updated_at": new Date().toString()
        });
        try {
            fetch(url, {
                method: "POST",
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
                    setInputModal(false);
                    alert("تم إضافة عرضك بنجاح");
                    //alert(JSON.stringify(json));
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };



    const _acceptOffer = async (offer_id) => {
        const user_token = await AsyncStorage.getItem("user_token");
        const user_id = await AsyncStorage.getItem("user_id");
        let url = "https://mestamal.com/mahmoud/api/api.php/records/item_offers/" + offer_id;
        const body = JSON.stringify({
            "status": "pending",
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
                    setInputModal(false);
                    alert("تم قبول العرض ");
                    navigation.navigate("OfferInfo", {
                        "offer_id": offer_id
                    })
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };


    const _openChat = async (user_id, user_name) => {
        const user_token = await AsyncStorage.getItem("user_token");
        setLoading(true);
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
                        setLoading(false);
                        navigation.navigate("ChatScreen",
                            {
                                chat_id: user_id,
                                user_name: user_name,
                            });
                    }
                    else {
                        setLoading(false);
                        alert(json.msg);

                    }
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
                    paddingHorizontal: 20,
                }}
            >

                <View style={{ width: "20%", alignItems: "flex-end" }}>

                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" onPress={() => navigation.goBack()} />

                </View>

                <View style={{ width: "60%", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{
                        color: "#FFF",
                        fontFamily: "Regular",
                        textAlign: "center",
                        fontSize: 18,
                    }}>
                        {item.title}
                    </Text>
                </View>


                <View style={{ width: "20%", alignItems: "flex-start" }}>
                    <MaterialIcons
                        name="favorite-border"
                        size={24}
                        color="#FFF" />
                </View>
            </View>


            <View>
                <ImageBackground
                    source={{ uri: "https://mestamal.com/uploads/" + item.main_image }}
                    style={{ width: "100%", height: 280 }} >
                </ImageBackground>
            </View>


            <View style={{
                backgroundColor: "#FFF",
                marginTop: -20,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                flex: 1
            }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        marginBottom: 100
                    }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 20,
                            marginVertical: 20,
                            alignItems: "center"
                        }}>

                        <Text style={{ fontFamily: "Bold", fontSize: 25, color: "grey" }}>
                            {item.price} SAR
                        </Text>

                        {item.user_id == user_id
                            ?
                            <View style={{ width: "50%" }}>
                                <TouchableOpacity
                                    onPress={() => getadOffers(item.id)}
                                    style={{
                                        width: "100%",
                                        flexDirection: "row",
                                        height: 40,
                                        backgroundColor: "#34ace0",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        borderRadius: 10,
                                        paddingHorizontal: 10
                                    }}>
                                    <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}>
                                        عرض طلبات الشراء
                                    </Text>

                                    <AntDesign name="shoppingcart" size={24} color="#FFF" />

                                </TouchableOpacity>
                            </View> :
                            <View style={{ width: "40%" }}>
                                <TouchableOpacity
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
                                    }}>
                                    <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}>
                                        طلب المنتج
                                    </Text>

                                    <AntDesign name="shoppingcart" size={24} color="#FFF" />

                                </TouchableOpacity>
                            </View>
                        }

                    </View>

                    <View style={{ paddingHorizontal: 20 }}>

                        <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#000" }}>
                            {item.title}
                        </Text>

                        <Text style={{ color: "grey", fontFamily: "Regular", marginTop: 20, }}>
                            {item.details}
                        </Text>
                    </View>

                    <View style={{ paddingHorizontal: 20, marginVertical: 30 }}>

                        <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#000" }}>
                            العنوان
                        </Text>

                        <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>

                            <Entypo name="location-pin" size={24} color="grey" />
                            <Text style={{ color: "grey", fontFamily: "Regular" }}>
                                {item.address}
                            </Text>

                        </View>


                    </View>

                    {item.user !== undefined ?

                        <View style={{ paddingHorizontal: 30, marginTop: 20 }}>
                            <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#000" }}>
                                معلومات الناشر
                            </Text>

                            <View style={{
                                flexDirection: "row-reverse",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 10
                            }}>

                                <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
                                    <Image source={require('./../assets/profile.png')} style={{ width: 50, height: 50, borderRadius: 50, marginHorizontal: 5 }} />

                                    <Text style={{ color: "grey", fontFamily: "Bold", fontSize: 18 }}>
                                        {
                                            item.user != null ? item.user.name : "لاتوجد معلومات"
                                        }
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                </View>
                            </View>
                        </View>
                        :
                        null
                    }
                </ScrollView>
                {item.user_id == user_id
                    ?
                    null

                    // <View style={{
                    //     justifyContent: "space-between",
                    //     alignItems: "center",
                    //     flexDirection: "row",
                    //     paddingHorizontal: 20,
                    //     position: "absolute",
                    //     bottom: 20,
                    //     width: "100%"

                    // }}>
                    //     <View style={{ width: "40%" }}>
                    //         <TouchableOpacity
                    //             style={{
                    //                 width: "100%",
                    //                 flexDirection: "row",
                    //                 height: 40,
                    //                 backgroundColor: "#34ace0",
                    //                 alignItems: "center",
                    //                 justifyContent: "space-between",
                    //                 borderRadius: 10,
                    //                 paddingHorizontal: 10,
                    //             }}>
                    //             <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}>
                    //                 تعديل المنتج
                    //             </Text>

                    //             <AntDesign name="edit" size={24} color="#FFF" />

                    //         </TouchableOpacity>
                    //     </View>

                    //     <View style={{ width: "40%" }}>
                    //         <TouchableOpacity
                    //             onPress={() => deleteAdd(item.id)}
                    //             style={{
                    //                 width: "100%",
                    //                 flexDirection: "row",
                    //                 height: 40,
                    //                 backgroundColor: "red",
                    //                 alignItems: "center",
                    //                 justifyContent: "space-between",
                    //                 borderRadius: 10,
                    //                 paddingHorizontal: 10
                    //             }}>
                    //             <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}>
                    //                 حذف المنتج
                    //             </Text>

                    //             <AntDesign name="delete" size={24} color="#FFF" />

                    //         </TouchableOpacity>
                    //     </View>
                    // </View>
                    :
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        position: "absolute",
                        bottom: 10,
                        width: "100%",
                        paddingHorizontal: 10
                    }}>

                        <View style={{ width: "20%", }}>
                            <TouchableOpacity
                                onPress={() => toggleFavorite()}
                                style={{ width: 60, height: 60, backgroundColor: "#4BAE52", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                                <MaterialIcons name="favorite-border" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: "60%" }}>
                            <TouchableOpacity
                                onPress={() => { navigation.navigate("Contact") }}
                                style={{ width: "100%", height: 60, backgroundColor: "#FE5722", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                                <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 15 }}>
                                    الإبلاغ عن مشكلة
                                </Text>

                            </TouchableOpacity>
                        </View>

                        <View style={{ width: "20%", alignItems: "flex-end" }}>
                            {item.user !== undefined ?
                                <TouchableOpacity
                                    onPress={() => _openChat(item.user_id, item.user.name)}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        backgroundColor: "#000",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 10,
                                    }}>
                                    {isLoading ?
                                        <ActivityIndicator size="small" color="#FFF" /> :
                                        <Ionicons name="chatbubbles-outline" size={24} color="#FFF" />
                                    }
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    style={{
                                        width: 60,
                                        height: 60,
                                        backgroundColor: "red",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 10,
                                    }}>
                                    {isLoading ?
                                        <ActivityIndicator size="small" color="#FFF" /> :
                                        <AntDesign name="delete" size={24} color="#FFF" />
                                    }
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                }

            </View>

            <Modal transparent={true} animationType="slide" visible={input_modal}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { width: "90%", marginVertical: 100 }]}>
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
                                        أرسل عرضك
                                    </Text>

                                    <Text
                                        style={{
                                            fontFamily: "Regular",
                                            marginBottom: 10,
                                            textAlign: "center",
                                            marginVertical: 20
                                        }}>
                                        نص تجريبي للتأكيد علي المستخدم قبل إضافةالعرض
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
                                    }}>
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
                    <View style={[styles.modalView, { width: "90%", marginVertical: 100 }]}>
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
                            }}>
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
                            <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontFamily: "Bold", marginVertical: 10 }}>
                                    العروض المتاحة للمنتج
                                </Text>
                            </View>
                            <FlatList
                                data={offers}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={handleEmptyProp()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("OfferInfo", {
                                            "offer_id": item.id
                                        })}
                                        style={{
                                            flexDirection: "row-reverse",
                                            borderColor: "#DDDDDD",
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            padding: 10,
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                            marginVertical: 5
                                        }}>

                                        <View style={{
                                            width: "35%",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            flexDirection: "row"
                                        }}>
                                            {item.status == "waiting" ?
                                                <TouchableOpacity
                                                    onPress={() => _acceptOffer(item.id)}
                                                    style={{
                                                        backgroundColor: "#34ace0",
                                                        borderRadius: 5,
                                                        padding: 5

                                                    }}>
                                                    <Text style={{ fontFamily: "Regular", color: "#FFF" }}>
                                                        قبول
                                                    </Text>
                                                </TouchableOpacity>
                                                :
                                                null
                                            }
                                            <TouchableOpacity
                                                onPress={() => _openChat(item.user_id, "test")}
                                                style={{
                                                    backgroundColor: "green",
                                                    borderRadius: 5,
                                                    padding: 5,
                                                }}>
                                                <Text style={{ fontFamily: "Regular", color: "#FFF" }}>
                                                    محادثة
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{
                                            width: "45%",
                                            alignItems: "flex-start",
                                            justifyContent: "center",
                                            paddingLeft: 10
                                        }}>
                                            <Text
                                                style={{ fontFamily: "Bold", fontSize: 15, color: "#000" }}>
                                                {item.user.name}
                                            </Text>


                                            <Text style={{ fontFamily: "Bold", fontSize: 12, color: "#34ace0" }}>
                                                {item.amount} ربال
                                            </Text>

                                            <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-around",
                                                alignItems: "center",
                                                marginTop: 10
                                            }}>
                                                <MaterialIcons name="date-range" size={24} color="grey" />

                                                <Text style={{ fontFamily: "Regular", fontSize: 12, color: "grey" }}>
                                                    {
                                                        moment(item.created_at).format("MMM Do YY")
                                                    }

                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ width: "20%" }}>
                                            <Image source={require('./../assets/man.png')}
                                                style={{ width: 60, height: 60, resizeMode: "contain", }} />
                                        </View>

                                    </TouchableOpacity>

                                )}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: "#F194FF",
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
    },
});
export default AddDetail;