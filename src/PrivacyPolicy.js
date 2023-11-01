import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,

    ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import styles from "../constants/style";
export default function PrivacyPolicy({ route, navigation }) {
    const [privacy, setPrivacy] = useState("");
    useEffect(() => {
        _retriveData();
    }, []);

    const _retriveData = async () => {
        fetch("https://www.mestamal.com/api/uses/ar", {
            method: "GET",
            headers: {
                Accept: "*/*",
                "Content-type": "multipart/form-data;",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
            },
        })
            .then(response => response.json())
            .then(json => {
                const regex = /<[^>]*>/mgi
                setPrivacy(json.description.replace(regex, ""));
            }
            )
            .catch(error => {
                console.error(error);
            }
            );
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="default" backgroundColor="#34ace0" />
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

                <View style={{
                    flexDirection: "row",
                    width: "100%",
                    paddingHorizontal: 20,
                    alignItems: "center"

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

                    <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 16, marginLeft: 20 }}>
                       الشروط و الأحكام
                    </Text>
                </View>


                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right: 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={{
                    marginTop: 50,
                    alignItems: "center",
                    justifyContent: "center"
                }}>

                <View style={{ width: "100%", paddingHorizontal: 20 }}>

                    <Text style={{ fontFamily: "Regular" }}>
                        {privacy}
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
}