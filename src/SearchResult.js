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
    FlatList
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
    Ionicons,
    MaterialIcons,
    FontAwesome5,
    Entypo,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./../constants/constants";

export default function SearchResult({ route, navigation }) {
    const { search_param } = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        _retrieveData();
    }, []);

    const _retrieveData = async () => {

        const user_token = await AsyncStorage.getItem("user_token");
        setLoading(true);
        let url = api.custom_url + "ads/search.php?param=" + search_param;
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
                    setData(json.data);
                    setLoading(false);
                    //alert(JSON.stringify(json));
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
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
                        backgroundColor: "#34ace0"
                    }}>
                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                        نتيجة البحث عن "{search_param}"
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={{ position: "absolute", right: 20, }}>
                        <MaterialIcons name="arrow-forward-ios" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>

            </View>

            <FlatList
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    width: "100%",
                }}
                numColumns={2}
                data={data}
                keyExtractor={item => item.adv_id}
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
                                >
                                    <MaterialIcons
                                        name="favorite-border"
                                        size={30}
                                        color="red"
                                    />
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
                                    {item.address !== null ? item.address : "لايوجد عنوان"}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

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
        borderWidth: 0.5,
        borderColor: "#828282",
    },
    item: {
        width: "100%"
    }
});