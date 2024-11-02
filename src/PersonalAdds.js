import {
    Image,
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import {
    FontAwesome5,
    Entypo,
    AntDesign
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import api from "./../constants/constants";
import DrawerScreenHeader from "./../components/DrawerScreenHeader";

import Toast from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";


export default function PersonalAdds({ route, navigation }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );

    useEffect(() => {
        _retrieveData();
    }, []);


    const render_order = (val) => {
        switch (val) {
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
        let url = api.custom_url + "user/ads.php?user_id=" + user_id;
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
                    setData(json.data);
                    setLoading(false);
                    console.log(JSON.stringify(json));
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
                    لا توجد لديك أي إعلاناتي
                </Text>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <StatusBar barStyle="default" backgroundColor="#34ace0" />
            <DrawerScreenHeader screenTitle={"إعلاناتي"} />
            <FlatList
                contentContainerStyle={{
                    marginTop: 20,
                    paddingHorizontal: 10,
                    width: "100%",
                }}
                ListEmptyComponent={handleEmptyProp()}
                numColumns={2}
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("AddDetails", {
                                item: item
                            });
                        }}
                        style={styles.itemContainer}
                    >
                        <ImageBackground
                            imageStyle={styles.itemImg}
                            source={{ uri: api.media_url + item.images.split(",")[0] }}>

                            <View style={styles.itemContent}>
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert('تأكيد !',
                                            'هل أنت متأكد من تغيير حالة هذاالإعلان',
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

                                    }}>

                                    {item.status == "active" ?
                                        <Entypo name="eye-with-line" size={30} color="red" />
                                        :
                                        <AntDesign name="eye" size={24} color="green" />
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate("EditAdd", { item: item })}>
                                    <FontAwesome5 name="edit" size={30} color="#34ace0" />
                                </TouchableOpacity>

                            </View>

                        </ImageBackground>

                        <View style={{
                            width: "100%",
                            flexDirection: "row-reverse",
                            justifyContent: "space-between",
                            padding: 10,
                        }}>
                            <Text style={{ fontFamily: "Bold", color: '#34ace0' }}>
                                {item.price} SR
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

                        <View style={{
                            paddingHorizontal: 10,
                            marginVertical: 10,
                            width: "100%",
                        }}>

                            <Text style={{
                                fontFamily: "Bold",
                                color: '#000',
                                fontSize: 12
                            }}>
                                {item.title}
                            </Text>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                width: "100%",
                                marginTop: 10,
                                alignItems: "center"
                            }}>
                                <Entypo name="location-pin" size={24} color="grey" />
                                <Text style={{ fontFamily: "Regular", color: 'grey' }}>
                                    {item.address}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                onPress={() => { navigation.navigate("DepartSelect") }}
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
                <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                    إضافة إعلان
                </Text>
                <AntDesign name="plus" size={24} color="#FFF" />
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
        flexDirection: "row-reverse",
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 160,
        width: "100%",
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
        marginHorizontal: 5,
        width: "48%",
        marginVertical: 5,
        backgroundColor: "#FFF",
        elevation: 5,
    },
    item: {
        width: "100%"
    }
});