import {
    Animated,
    Image,
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    ScrollView
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from "./../../constants/style";
export default function CatSelect({ route, navigation }) {
    const [image, setImage] = useState(null);
    const [imageURI, setImageURI] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);


    const AddAuction = async () => {
        const user_token = await AsyncStorage.getItem("user_token");

        setLoading(true);
        let formData = new FormData();
        formData.append("title", title);
        formData.append("details", description);
        formData.append("duration", 2);
        formData.append("country_id", 2);
        formData.append("city_id", 1);
        formData.append("images[]", image);

        fetch("https://mestamal.com/api/auction/create", {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-type": "multipart/form-data;",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                Authorization: "Bearer " + user_token
            },
            body: formData
        })
            .then(response => response.json())
            .then(json => {
                setLoading(false);
               /// alert(JSON.stringify(json));
                //console.log(json);
            }
            )
            .catch(error => {
                setLoading(false);
                console.error(error);
            }
            );
    }



    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                let localUri = result.assets[0].uri;
                let filename = localUri.split("/").pop();
                let match = /\.(\w+)$/.exec(filename);
                let img_type = match ? `image/${match[1]}` : `image`;
                setImageURI(localUri);
                setImage({
                    uri: localUri,
                    name: filename,
                    type: img_type
                });
            }
        } catch (E) {
            console.log(E);
        }
    };

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
                }}
            >


                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                    تواصل معنا
                </Text>


                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right : 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>


            </View>

    

                    <TouchableOpacity style={styles.primaryBtn}
                        onPress={() => AddAuction()}>

                        {loading == true ?
                            <ActivityIndicator size={40} color="#FFF" />
                            :
                            <Text style={styles.btnText}>التالي</Text>
                        }

                    </TouchableOpacity>
           
        </View>
    );
}