import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableOpacity,
    FlatList,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useState, useRef, useEffect } from "react";
import { MaterialIcons, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import Constants from "expo-constants";
import api from "./../constants/constants";

export default function ChoosePaymentMethod({ route, navigation }) {
    const [loading, setLoading] = useState(false);
    const [selected_id, setSelectedId] = useState([]);
    const [user_id, setUserID] = useState([]);
    const { invoice_value } = route.params;
    const data = [
        {
            id: "1",
            title: "الدفع عن طريق الفيزا",
            image: require('./../assets/payment/visa.png'),
        },
        {
            id: "2",
            title: "الدفع عن طريق كي نت",
            image: require('./../assets/payment/knet.png'),
        },
        {
            id: "3",
            title: "الدفع عن طريق الأمريكان إكسبريس",
            image: require('./../assets/payment/express.jpg'),

        },
        {
            id: "4",
            title: "الدفع عن طريق مدى",
            image: require('./../assets/payment/mada.png'),

        },
    ];


    const _proceedPayment = async () => {
        const user_id = await AsyncStorage.getItem("user_id");
        setLoading(true);
        let url = api.custom_url + "payment/payment.php?user_id=" + user_id + "&invoice_value=" + invoice_value;
        try {
            fetch(url, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Content-type": "multipart/form-data;",
                    "cache-control": "no-cache",
                }
            })
                .then(response => response.json())
                .then(json => {
                    if (json.success == "true") {
                        setLoading(false);
                        navigation.navigate("PaymentProcess", { url: json.url });
                    }
                    else {
                        setLoading(false);
                        alert(JSON.stringify(json));

                    }
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#34ace0" />
            <View style={{
                paddingTop: Constants.statusBarHeight * 1.3,
                flexDirection: "row-reverse",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#34ace0",
                paddingBottom: 10
            }}>

                <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-forward-ios" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>



                <View style={{ width: "80%", paddingLeft: 15 }}>
                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                        أختر وسيلة الدفع
                    </Text>
                </View>



            </View>

            <View style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
                marginBottom: 50,
            }}>
                <Text style={{ fontSize: 20, fontFamily: "Bold" }}>
                    أختر وسيلة الدفع المناسبة لك
                </Text>

            </View>


            <FlatList
                columnWrapperStyle={{
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                }}
                numColumns={2}
                data={data}
                style={{ width: "100%", marginBottom: 100 }}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity
                        onPress={() => setSelectedId(item.id)}
                        style={[styles.itemContainer, {
                            borderColor: selected_id == item.id ? "#34ace0" : "#DDDDDD",
                        }]}>

                        <Image
                            style={styles.itemImg}
                            source={item.image} />

                        <View style={styles.itemInfo}>
                            <Text style={{ paddingVertical: 10, fontFamily: "Bold" }}>
                                {item.title}
                            </Text>
                            <MaterialIcons name="keyboard-arrow-left" size={24} color="grey" />
                        </View>
                    </TouchableOpacity>
                }
            />
            <View style={{
                position: "absolute",
                bottom: 40,
                paddingHorizontal: 20,
                width: "100%",
            }}>
                <TouchableOpacity
                    onPress={() => _proceedPayment()}
                    style={{
                        backgroundColor: "#34ace0",
                        width: "100%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                    }}>
                    {loading ? (
                        <ActivityIndicator size={40} color="#FFF" />
                    ) : (
                        <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#FFF" }}>
                            التالي
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "center"
    },

    itemContainer: {
        borderRadius: 5,
        backgroundColor: "#FFF",
        width: "95%",
        maxHeight: 200,
        marginVertical: 10,
        borderColor: "#DDDDDD",
        borderWidth: 1.5,
        flexDirection: "row"
    },

    itemImg: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: "#FFF",
    },

    itemInfo: {
        flexDirection: "row",
        width: "70%",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingHorizontal: 10
    },
    item: {
        width: "100%"
    }
});