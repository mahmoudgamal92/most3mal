import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import {
    SimpleLineIcons,
    MaterialIcons
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const DrawerScreenHeader = ({ screenTitle }) => {
    const navigation = useNavigation();


    return (
        <View
            style={{
                width: "100%",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#34ace0"
            }}
        >
            <View
                style={{
                    flexDirection: "row-reverse",
                    width: "100%",
                    alignItems: "center"
                }}>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()}
                    style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <SimpleLineIcons name="menu" size={40} color="#FFF" />
                </TouchableOpacity>

                <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 20, paddingHorizontal: 20 }}>
                    {screenTitle}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ position: "absolute", left: 20 }}
            >
                <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

export default DrawerScreenHeader;


