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
import { LinearGradient } from 'expo-linear-gradient';

import React, { useState, useRef, useEffect } from "react";
import { MaterialIcons, AntDesign, SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import Constants from "expo-constants";
import api from "./../constants/constants";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import toastConfig from "./../constants/Toast";
export default function ChooseBank({ route, navigation }) {
    const [loading, setLoading] = useState(false);
    const [selected_id, setSelectedId] = useState("");
    const [data, setData] = useState([]);
    const { balance } = route.params;

    useFocusEffect(
        React.useCallback(() => {
            _getUserBanks();
        }, [])
    );


    useEffect(() => {
        _getUserBanks();
    }, []);

    const handleEmptyProp = () => {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 40
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
                    لا يوجد لديك أي حسابات بنكية
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate("AddBank")}
                    style={{
                        backgroundColor: "#34ace0",
                        width: "100%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        marginTop: 40
                    }}>

                    <Text style={{ fontFamily: "Regular", fontSize: 16, color: "#FFF" }}>
                        إضافة حساب جديد
                    </Text>

                </TouchableOpacity>
            </View>
        );
    };

    const _getUserBanks = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        setLoading(true);
        let url = api.custom_url + "payment/banks.php?user_token=" + user_token;
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

                    if (json.success == true) {
                        setLoading(false);
                        setData(json.data);
                    }
                    else {
                        setLoading(false);
                    }
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    }

    const _orderWithdraw = async () => {

        const user_id = await AsyncStorage.getItem("user_id");
        let url = api.dynamic_url + "payment_process";
        const body = JSON.stringify({
            payment_token: "none",
            payment_type: "withdraw",
            payment_status: "pending",
            payment_gateway: "none",
            bank_account: selected_id,
            amount: balance,
            user_id: user_id,
            created_at: new Date().toString()
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
                    Toast.show({
                        type: "successToast",
                        text1: "تم تسجيل طلب سحب الرصيد , سيتم خصم الرصيد عند التحويل من الإدارة",
                        bottomOffset: 80,
                        visibilityTime: 2000
                    });
                    navigation.replace("MyWallet");
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    }
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
                        إختر الحساب البنكي
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
                    إختر الحساب البنكي
                </Text>

            </View>


            <FlatList
                columnWrapperStyle={{
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                }}
                numColumns={2}
                ListEmptyComponent={handleEmptyProp()}

                data={data}
                style={{ width: "100%", marginBottom: 100 }}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) =>

                    <LinearGradient
                        colors={['#34ACE0', '#83D0CB']}
                        style={[styles.itemContainer, {
                            borderColor: selected_id == item.account_id ? "red" : "#DDDDDD"
                        }]}>
                        <TouchableOpacity onPress={() => setSelectedId(item.account_id)}>

                            <ImageBackground source={require('./../assets/mask.png')} style={{
                                flexDirection: "row",

                            }}>
                                <Image source={require("./../assets/man.png")} style={{
                                    width: 80,
                                    height: 80
                                }} />


                                <View style={styles.itemInfo}>
                                    <View style={{ width: "100%" }}>
                                        <Text style={{
                                            paddingVertical: 10,
                                            fontFamily: "Bold",
                                            fontSize: 16,
                                            color: "#FFF"
                                        }}>
                                            {item.account_holder}
                                        </Text>

                                        <Text style={{ fontFamily: "Regular", fontSize: 16, color: "#FFF", textAlign: "left" }}>
                                            #{item.account_number}
                                        </Text>
                                        <Text style={{ fontFamily: "Regular", fontSize: 16, color: "#FFF", textAlign: "left" }}>
                                            #{item.bank_swift}
                                        </Text>
                                    </View>

                                    <AntDesign name="delete" size={24} color="#FFF" />
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>

                    </LinearGradient>

                }
            />

            {data.length !== 0 &&
                <View style={{
                    position: "absolute",
                    bottom: 70,
                    paddingHorizontal: 20,
                    width: "100%",
                }}>
                    <TouchableOpacity
                        onPress={() => _orderWithdraw()}
                        style={{
                            backgroundColor: "#34ace0",
                            width: "100%",
                            height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                        }}>

                        <Text style={{ fontFamily: "Bold", fontSize: 20, color: "#FFF" }}>
                            تأكيد
                        </Text>

                    </TouchableOpacity>
                </View>
            }
            <Toast config={toastConfig} />

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
        width: "95%",
        height: 120,
        padding: 10,
        marginVertical: 10,
        borderColor: "#DDDDDD",
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center"
    },

    itemImg: {
        width: 80,
        height: 80,
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