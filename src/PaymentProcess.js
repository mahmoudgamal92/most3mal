import * as React from 'react';
import { WebView } from 'react-native-webview';
import {
    Text,
    View,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import api from "./../constants/constants";

export default function PaymentProcess({ route, navigation }) {
    const { url } = route.params;
    return (
        <View style={{ flex: 1, backgroundColor: "#34ace0" }}>
            <StatusBar backgroundColor="#34ace0" barStyle="light-content" />
            <View>
                <View style={{
                    backgroundColor: "#34ace0",
                    flexDirection: 'row-reverse',
                    paddingTop: Constants.statusBarHeight,
                    paddingHorizontal: 10,
                }}>

                    <View style={{ width: "10%", justifyContent: "center" }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ justifyContent: "center" }}>
                            <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" style={{
                                marginHorizontal: 10
                            }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center", width: "90%" }}>
                        <Text
                            style={{
                                textAlign: "right",
                                padding: 10,
                                marginRight: "5%",
                                color: "white",
                                fontFamily: "Bold",
                                fontSize: 20,
                            }}
                        >
                            إتمام عملية الدفع
                        </Text>
                    </View>
                </View>
            </View>

            <WebView
                onNavigationStateChange={(e) => {
                    const navigation_info = JSON.parse(JSON.stringify(e));
                    console.log(navigation_info);
                    const url = navigation_info.url;
                    if (url.includes(api.payment_success)) {
                        setTimeout(() => {
                            navigation.replace("PaymentSuccess");
                        }, 2000);
                    }
                    else if (url.includes(api.payment_failure)) {
                        setTimeout(() => {
                            navigation.replace("PaymentErorr");
                        }, 2000);
                    }
                }}
                source={{ uri: url }} />
        </View>
    );
}