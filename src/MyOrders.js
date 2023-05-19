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


export default function MyOrders({ route, navigation }) {

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
                    flexDirection:"row",
                    width:"100%",
                    paddingHorizontal:20

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

                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20,marginLeft:20 }}>
                    طلباتي
                </Text>

                </View>

             
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right : 20 }}>
                    <Feather name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={{ 
                flex: 1, 
                backgroundColor: "#FFF", 
                paddingHorizontal: 20,
                alignItems:"center",
                justifyContent:"center"
                }}>
               <Image source={require('./../assets/broken-heart.png')} style={{
                width:200,
                height:200
               }}/>
               <Text style={{fontFamily:"Regular",color:"grey",fontSize:20}}>
                لا يوجد لديك أي طلبات
               </Text>
            </View>
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