import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    useWindowDimensions
} from "react-native";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import api from "./../../../constants/constants";
import { EmptyComponent } from './../index';
import { useNavigation } from '@react-navigation/native';

export const Auctions = ({ }) => {
    const navigation = useNavigation();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        _retrieveData();
    }, []);

    const _retrieveData = async () => {
        setLoading(true);
        let url = api.custom_url + "auctions/list.php";
        try {
            fetch(url, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Content-type": "multipart/form-data;",
                    "cache-control": "no-cache",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive"
                }
            })
                .then(response => response.json())
                .then(json => {
                    console.log(JSON.stringify(json));
                    setData(json.data);
                    setLoading(false);
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <FlatList
            data={data}
            ListEmptyComponent={<EmptyComponent message='No Auctions Avalible' />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("AuctionDetails", {
                            item: item
                        })}
                    style={{
                        flexDirection: "row",
                        borderColor: "#DDDDDD",
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                        alignItems: "center",
                        backgroundColor: "#FFF",
                        justifyContent: "flex-end",
                        marginVertical: 5
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                color: "#2196f3",
                                fontSize: 15,
                                marginHorizontal: 10,
                                textAlign: "right"
                            }}
                        >
                            {item.auction_number}#
                        </Text>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                fontSize: 15,
                                marginHorizontal: 10,
                                textAlign: "right"
                            }}
                        >
                            {item.title}
                        </Text>

                        <View
                            style={{
                                marginHorizontal: 10,
                                flexDirection: "row-reverse"
                            }}
                        >
                            <AntDesign name="calendar" size={24} color="grey" />
                            <Text style={{ fontFamily: "Regular", color: "grey" }}>
                                {moment(item.end_date).format("MMM Do YY")} تاريخ الانتهاء :
                            </Text>
                        </View>
                    </View>

                    <View style={{}}>
                        <Image
                            source={{
                                uri:
                                    api.media_url + item.images?.split(",")[0]
                            }}
                            style={{
                                width: 100,
                                height: 100,
                                resizeMode: "cover",
                                borderRadius: 10
                            }}
                        />
                    </View>
                </TouchableOpacity>}
        />
    );
}