import {
    Animated,
    Image,
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Linking,
    ActivityIndicator,
    ScrollView,
    FlatList,
    Alert
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
    Ionicons,
    MaterialIcons,
    SimpleLineIcons,
    Entypo,
    Feather,
    AntDesign
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";


export default function HomePage({ route, navigation }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        _retrieveData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );

    const _retrieveData = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        setLoading(true);
        let url = "https://mestamal.com/api/user/auctions";
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
                    setData(json);
                    setLoading(false);
                    //alert(JSON.stringify(json));
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };



    const deleteAdd = async (ad_id) => {
        try {
            const user_token = await AsyncStorage.getItem("user_token");
            if (user_token !== null) {
                fetch("https://mestamal.com/api/user/auctions/" + ad_id + "/delete", {
                    method: "POST",
                    headers: {
                        Accept: "*/*",
                        "Content-type": "multipart/form-data;",
                        "Accept-Encoding": "gzip, deflate, br",
                        Connection: "keep-alive",
                        Authorization: "Bearer " + user_token
                    },
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        if (responseJson.status == true) {
                            Toast.show({
                                type: 'successToast',
                                text1: "تم حذف الإعلان بنجاح",
                                topOffset: 120,
                                visibilityTime: 2000,
                            });

                            _retrieveData();
                        }
                        else {
                            Toast.show({
                                type: 'erorrToast',
                                text1: "خط أثناء حذف الإعلان",
                                bottomOffset: 80,
                                visibilityTime: 2000,
                            });

                        }
                    });
            } else {
                alert("هناك مشكلة الحذف");
            }
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
                    لم تقم بإضافة أي مزادات حتي الأن
                </Text>
            </View>
        );
    };



    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#34ace0" />

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

                <View style={{
                    flexDirection: "row",
                    width: "100%",
                    paddingHorizontal: 20

                }}>

                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}

                        style={{
                            justifyContent: "center",
                            alignItems: "flex-start"
                        }}
                    >
                        <SimpleLineIcons name="menu" size={40} color="#FFF" />

                    </TouchableOpacity>

                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20, marginLeft: 20 }}>
                        مزاداتي
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right: 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, backgroundColor: "#FFF", paddingHorizontal: 20 }}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={handleEmptyProp()}
                    renderItem={({ item }) => (

                        <TouchableOpacity
                            onPress={() => navigation.navigate("MyAuction", {
                                item: item
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


                            <View style={{ width: "20%", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity
                                    onPress={() => {

                                        Alert.alert('تأكيد الحذف!', 'هل أنت متأكد من حذف هذاالإعلان', [

                                            {
                                                text: 'Cancel',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            { text: 'OK', onPress: () => deleteAdd(item.id) },
                                        ]);

                                    }}
                                >
                                    <AntDesign name="delete" size={30} color="red" />
                                </TouchableOpacity>
                            </View>


                            <View style={{
                                width: "60%",
                                marginHorizontal: 10,
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Text style={{ fontFamily: "Bold", fontSize: 15 }}>
                                    {item.title}
                                </Text>
                                <Text style={{ fontFamily: "Bold", fontSize: 15, color: "grey" }}>
                                    {item.details}
                                </Text>

                                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>

                                </View>


                            </View>

                            <View style={{ width: "20%" }}>
                                <Image source={{ uri: "https://mestamal.com/uploads/" + item.main_image }}
                                    style={{ width: 70, height: 70, resizeMode: "cover", borderRadius: 10 }} />
                            </View>
                        </TouchableOpacity>

                    )}
                />
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate("AddAuction")}
                style={{
                    width: 120,
                    height: 50,
                    borderRadius: 30,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: '#34ace0',
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                }}>

                <Entypo name="plus" size={24} color="#FFF" />
                <Text style={{ fontFamily: "Bold", color: "#FFF", marginHorizontal: 5 }}>
                    إضافة مزاد
                </Text>
            </TouchableOpacity>
            <Toast config={toastConfig} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
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
        borderTopRightRadius: 10,
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
        borderColor: "#828282",
    },
    item: {
        width: "100%"
    }
});