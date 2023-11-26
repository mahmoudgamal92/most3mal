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
    FontAwesome5,
    Entypo,
    AntDesign
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import toastConfig from "./../constants/Toast";


export default function MyAdds({ route, navigation }) {

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


    const _retrieveData = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        setLoading(true);
        let url = "https://mestamal.com/api/user/ads";
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
                fetch("https://mestamal.com/api/user/ads/" + ad_id + "/delete", {
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
              لا توجد لديك أي إعلاناتي
            </Text>
          </View>
        );
      };
    

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#34ace0" />
            <View style={styles.header}>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 60,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#34ace0",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 0.36,
                        shadowRadius: 6.68,

                        elevation: 11,
                    }}>
                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                        إعلاناتي
                    </Text>
                </View>
            </View>


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
                            source={{ uri: "https://mestamal.com/uploads/" + item.main_image }}
                        >

                            <View style={styles.itemContent}>

                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert('تأكيد التعطيل!', 'هل أنت متأكد من تعطيل هذاالإعلان', [
                                            {
                                                text: 'Cancel',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            { text: 'OK', onPress: () => deleteAdd(item.id) },
                                        ]);

                                    }}
                                >
                       <Entypo name="eye-with-line" size={30} color="red" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate("EditAdd",{
                                    item : item
                                })}>
                                    <FontAwesome5 name="edit" size={30} color="#34ace0" />
                                </TouchableOpacity>

                            </View>

                        </ImageBackground>
                        <View style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 10
                        }}>
                            <Text style={{ fontFamily: "Bold", color: '#34ace0' }}>
                                {item.price} SR
                            </Text>
                            <Text style={{ fontFamily: "Regular", color: 'grey' }}>
                                10 Month ago
                            </Text>
                        </View>

                        <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>

                            <Text style={{ fontFamily: "Bold", color: '#000', textAlign: "right" }}>
                                {item.title}
                            </Text>

                            <View style={{
                                flexDirection: "row-reverse",
                                justifyContent: "flex-start",
                                width: "100%",
                                marginTop: 10,
                                alignItems: "center"
                            }}>
                                <Entypo name="location-pin" size={24} color="grey" />
                                <Text style={{ fontFamily: "Regular", color: 'grey' }}>
                                    {/* {item.address !== null ? item.address : "لايوجد عنوان"} */}
                                    عرض العنوان
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