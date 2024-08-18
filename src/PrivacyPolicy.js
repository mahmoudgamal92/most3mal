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
import api from "./../constants/constants";
import DrawerScreenHeader from "./../components/DrawerScreenHeader";

export default function PrivacyPolicy({ route, navigation }) {
    const [privacy, setPrivacy] = useState("");
    useEffect(() => {
        _retriveData();
    }, []);

    const _retriveData = async () => {
        fetch(api.custom_url + "settings/index.php?keys=privacy_ar", {
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
                setPrivacy(json.data[0].val.replace(regex, ""));
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

            <DrawerScreenHeader screenTitle={"سياسة الإستخدام و الخصوصية"} />

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