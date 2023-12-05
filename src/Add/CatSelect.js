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
    ScrollView,
    FlatList
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Feather, MaterialIcons, Entypo } from '@expo/vector-icons';
import styles from "./../../constants/style";
export default function CatSelect({ route, navigation }) {

    const [data, setData] = useState([]);
    const [current_item, setCurrentItem] = useState(0);
    const [loading, setLoading] = useState(false);
    const { depart_id, depart_name } = route.params;

    useEffect(() => {
        _retrieveData();
    }, []);


    const proceedToInsertion = (depart, cat) => {
        if (current_item == 0) {
            alert("الرجاء اختيار الفئة");
        }
        else {
            // Real Estate
            if (depart_id == 56) {
                navigation.navigate("CreateCarAdd",
                    { depart_id: depart, cat_id: cat });
            }


            // Cars
            else if (depart_id == 55) {
                navigation.navigate("CreateRealEstate",
                    { depart_id: depart, cat_id: cat });
            }


            // all other departments
            else {
                navigation.navigate("CreateGeneralAdd",
                    { depart_id: depart, cat_id: cat });

            }
        }
    }

    const _retrieveData = async () => {
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
                setData(arr);

                if (arr.length == 0) {
                    proceedToInsertion(depart_id, 0);
                }
            }
            )
            .catch(error => {
                setLoading(false);
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
                }}
            >


                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20 }}>
                    {depart_name}
                </Text>


                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right: 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>

            </View>


            <View style={{ flex: 1, width: "100%", alignItems: "center" }}>

                <Text style={{ fontFamily: "Bold", textAlign: "center", fontSize: 18, marginVertical: 25 }}>
                    ماذا تريد أن تبيع أو تعلن؟
                </Text>

                <View style={{ width: "77%", flex: 1 }}>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            item.depart_id == depart_id ?
                                <TouchableOpacity
                                    onPress={() => { setCurrentItem(item.id) }}
                                    style={{
                                        height: 60,
                                        flexDirection: "row-reverse",
                                        borderColor: current_item == item.id ? "#34ace0" : "#CCC",
                                        borderWidth: current_item == item.id ? 2 : 1,
                                        borderRadius: 10,
                                        justifyContent: "space-between",
                                        width: "100%",
                                        alignItems: "center",
                                        marginVertical: 10,
                                        paddingHorizontal: 10
                                    }}>
                                    {item.image == null || item.image == "" ?

                                        <View style={{ borderColor: "grey", borderWidth: 2, borderRadius: 20, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
                                            <Feather name="image" size={25} color="grey" />
                                        </View>
                                        :
                                        <Image
                                            source={{ uri: "https://mestamal.com/uploads/" + item.image }} style={{ width: 40, height: 40, resizeMode: "contain" }} />
                                    }
                                    <Text
                                        style={{ fontFamily: "Bold", fontSize: 18, color: "black" }}>
                                        {JSON.parse(item.name).ar}
                                    </Text>

                                </TouchableOpacity>
                                : null
                        )}

                    />
                </View>

                <View style={{ paddingHorizontal: 20, width: "100%" }}>
                    <TouchableOpacity
                        onPress={() => proceedToInsertion(depart_id, current_item)}
                        style={{
                            backgroundColor: "#34ACE0",
                            width: "100%",
                            height: 60,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 20,
                            marginTop: 20,
                            marginBottom: 30
                        }}>
                        {loading == true ?
                            <ActivityIndicator size={40} color="#FFF" />
                            :
                            <Text style={styles.btnText}>التالي</Text>
                        }

                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
}