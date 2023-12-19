import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    ScrollView
} from "react-native";
import React, { useState } from "react";
import styles from "../constants/style";

export default function About({ route, navigation }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
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
                   عن التطبيق 
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right : 20 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={{ 
                    marginTop:50,
                    alignItems: "center",
                    justifyContent:"center" }}
            >
                <View style={{
                        width: "90%",
                        justifyContent: "center",
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 5
                        },
                        shadowOpacity: 0.34,
                        shadowRadius: 6.27,
                    
                        elevation: 10
                }}>
                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}>
                           أدخل بريدك الإلكتروني
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.newAddinput}
                            onChangeText={text => setTitle(text)}
                            placeholder="أدخل عنوان البريد الإلكتروني" />
                    </View>
                    <View style={styles.inputLabelContainer}>
                        <Text style={{ fontFamily: "Bold", textAlign: "right", fontSize: 15 }}>
                           موضوع التواصل
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.newAddTextArea}
                            onChangeText={text => setDescription(text)}
                            placeholder="أدخل موضوع التواصل"
                            multiline={true}
                        />
                    </View>
                    <TouchableOpacity style={styles.primaryBtn}
                        onPress={() => AddAuction()}>

                        {loading == true ?
                            <ActivityIndicator size={40} color="#FFF" />
                            :
                            <Text style={styles.btnText}>أرسل الأن</Text>
                        }
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}