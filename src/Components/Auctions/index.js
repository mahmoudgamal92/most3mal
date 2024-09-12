import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
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
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Content-type": "multipart/form-data;",
                    "cache-control": "no-cache",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive"
                }
            });
            const json = await response.json();
            console.log(JSON.stringify(json));
            setData(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <FlatList
            data={data}
            ListEmptyComponent={<EmptyComponent message='لم تقم بإضافة أي مزادات حتي الأن' />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 120
            }}
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
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontFamily: "Regular",
                                color: "#2196f3",
                                fontSize: 12,
                                paddingHorizontal: 10,
                                textAlign: "right"
                            }}
                        >
                            {item.auction_number}#
                        </Text>
                        <Text
                            style={{
                                fontFamily: "Bold",
                                fontSize: 15,
                                textAlign: "right",
                                paddingHorizontal: 10,
                                flexWrap: 'wrap'  // Allow text to wrap
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
                                uri: api.media_url + item.images?.split(",")[0]
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
