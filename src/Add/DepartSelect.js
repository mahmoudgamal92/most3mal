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
import { FontAwesome5, Feather, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import styles from "./../../constants/style";
export default function CatSelect({ route, navigation }) {

    const [data, setData] = useState([]);
    const [current_item, setCurrentItem] = useState(0);
    const [item_name, setItemName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        _retrieveData();
    }, []);


    const _retrieveData = async () => {
        fetch("https://mestamal.com/api/departments", {
            method: "GET",
            headers: {
                Accept: "*/*",
                Connection: "keep-alive",
            },
        })
            .then(response => response.json())
            .then(json => {
                setLoading(false);
                setData(json);

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
                    اختر القسم
                </Text>


                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right : 20 }}
                >
                    <Feather name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>

            </View>



            <View style={{ flex: 1, width: "100%", alignItems: "center" }}>

                <Text style={{ fontFamily: "Bold", textAlign: "center", fontSize: 18, marginVertical: 25 }}>
                    ماذا تريد أن تبيع أو تعلن؟
                </Text>

                <View style={{ width: "80%", height: "77%" }}>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setCurrentItem(item.id);
                                    setItemName(JSON.parse(item.name).ar);
                                }}
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
                        )}

                    />
                </View>

                <View style={{ paddingHorizontal: 20, width: "100%" }}>
                    <TouchableOpacity
                        onPress={() => {
                            {
                                current_item == 0 ? alert("الرجاء اختيار القسم") :


                                navigation.navigate("CatSelect",
                                    {
                                        depart_id: current_item,
                                        depart_name: item_name
                                    });
                            }
                        }}
                        style={styles.primaryBtn}>
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