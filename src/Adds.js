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
    AntDesign
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Adds({ route, navigation }) {
    const { depart_id, depart_name } = route.params;
    const [data, setData] = useState([]);
    const [cats, setCats] = useState([]);
    const [current_cat, setCurrentCat] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        _retrieveCats();
        _retrieveData();
    }, []);



    const _retrieveCats = async () => {
        fetch("https://mestamal.com/api/categories", {
            method: "GET",
            headers: {
                Accept: "*/*",
                Connection: "keep-alive",
            },
        })
            .then(response => response.json())
            .then(json => {
                setLoading(false);
                const arr = [];
                for (let i = 0; i < json.length; i++) {
                    if (json[i].depart_id == depart_id) {
                        arr.push(json[i]);
                    }
                }
                setCats(arr);
            }
            )
            .catch(error => {
                setLoading(false);
                console.error(error);
            }
            );
    }
    const _retrieveData = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        setLoading(true);
        let url = "";
        if (current_cat !== null) {
            url = "https://mestamal.com/api/ads?depart_id=" + depart_id + "&cat_id=" + current_cat;
        }
        else {
            url = "https://mestamal.com/api/ads?depart_id=" + depart_id;
        }
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

const changeCat = async (cat_id) => {
    setCurrentCat(cat_id);
    const user_token = await AsyncStorage.getItem("user_token");
    setLoading(true);
  
     let url = "https://mestamal.com/api/ads?depart_id=" + depart_id + "&cat_id=" + cat_id;
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
}

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#34ace0" />
            <View style={styles.header}>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "center",
                        height: 60,
                        alignItems: "center",
                        backgroundColor: "#34ace0",
                        paddingHorizontal: 30
                    }}>
                    <View>

                    </View>
                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                        {depart_name}
                    </Text>

                    <TouchableOpacity
                        style={{ position: "absolute", right: 20, }}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={{ marginTop: 10, marginBottom: 20,paddingHorizontal:10 }}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item.cat_id}
                    style={{
                        marginTop: 10,
                    }}
                >
                    {cats.map((item, index) => {
                        return (
                            <TouchableOpacity 
                            onPress={() => changeCat(item.id)}
                            style={{
                                flexDirection: "row-reverse",
                                backgroundColor: current_cat == item.id ? "#0393ce" : "#FFF",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderWidth: 1,
                                borderColor: "#0393ce",
                                marginHorizontal: 5,
                                borderRadius: 30,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Text style={{
                                    fontFamily: "Bold",
                                    color: current_cat == item.id ? "#FFF" : "#143656",
                                    marginVertical: 5,
                                    fontFamily: "Bold"
                                }}>
                                    {JSON.parse(item.name).ar}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}

                </ScrollView>

            </View>
            <FlatList
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    width: "100%",
                }}
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

                            source={{
                                uri:
                                    item.main_image == null || item.main_image == "" || item.main_image == "0"
                                        ?
                                        "https://fakeimg.pl/400x400?text=Most3mal&font=noto"
                                        :
                                        "https://mestamal.com/uploads/" + item.main_image
                            }}
                        >
                            <View style={styles.itemContent}>


                            </View>

                        </ImageBackground>


                        <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
                            <Text style={{ fontFamily: "Bold", color: '#000', textAlign: "left", fontSize: 12 }}>
                                {item.title}
                            </Text>


                        </View>

                        <View style={{
                            width: "100%",
                            flexDirection: "row-reverse",
                            justifyContent: "space-between",
                            paddingHorizontal: 10,
                            marginVertical: 10,
                            alignItems: "center",

                        }}>
                            <Text style={{ fontFamily: "Bold", color: 'grey' }}>
                                {item.price} SR
                            </Text>
                            <AntDesign name="shoppingcart" size={24} color='#34ace0' />
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
        backgroundColor: "#FFF",
        elevation: 5,
    },
    item: {
        width: "100%"
    }
});