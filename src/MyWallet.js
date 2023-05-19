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
    Feather,
    SimpleLineIcons
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
export default function MyWallet({ route, navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#34ace0" />
            <View
                style={{
                    paddingTop: Constants.statusBarHeight * 1.6,
                    width: "100%",
                    height: "50%",
                    alignItems: "center",
                    backgroundColor: "#34ace0",
                }}>
                <View style={{
                    flexDirection: "row-reverse",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>

                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={40} color="#FFF" />
                        </TouchableOpacity>
                    </View>



                    <View style={{ width: "60%", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 30 }}>
                            محفظتي
                        </Text>
                    </View>


                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
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

                <View style={{ marginVertical: 40, width: "100%", paddingHorizontal: 60 }}>

                    <Text style={{
                        fontFamily: "Bold", fontSize: 20, color: "#FFF",
                        textAlign: "right"
                    }}>
                        الرصيد المتاح
                    </Text>

                    <Text style={{ fontFamily: "Bold", fontSize: 40, color: "#FFF", textAlign: "right" }}>
                        10.000 $
                    </Text>

                </View>




                <View style={{ width: "100%", flexDirection: "row" }}>

                    <View style={{ width: "50%", paddingHorizontal: 10, }}>

                        <TouchableOpacity style={{ width: "100%", height: 50, backgroundColor: "#FFF", borderRadius: 30, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontFamily: "Bold", color: "#34ace0", fontSize: 20 }}>
                                شحن الرصيد
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "50%", paddingHorizontal: 10 }}>
                        <TouchableOpacity style={{ width: "100%", height: 50, backgroundColor: "#FFF", borderRadius: 30, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontFamily: "Bold", color: "#34ace0", fontSize: 20 }}>
                                سحب الرصيد
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>


            </View>


            <View style={{
                width: "100%",
                marginTop: -30,
                backgroundColor: "#FFFF",
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                height: "50%",
                justifyContent: "center",
                alignItems: "center",
            }}>

                <Image source={require("../assets/transaction.png")}
                    style={{
                        width: 200,
                        height: 200,
                        alignSelf: "center",
                    }} />

                <View style={{ paddingHorizontal: 20 }}>

                    <Text style={{ fontFamily: "Bold", fontSize: 20, textAlign: "center" }}>
                        لا يوجد لديك أي معاملات
                    </Text>

                    <Text style={{ fontFamily: "Regular", textAlign: "center", marginTop: 20, color: "grey" }}>
                        لا توجد لديك أي معاملات حتى الآن , قم بشحن أو سحب الأموال من حسابك حتي يتم عرضها هنا
                    </Text>

                </View>


            </View>


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