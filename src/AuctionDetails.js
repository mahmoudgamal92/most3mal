import React, { Component, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    ActivityIndicator,
    StatusBar,
    Modal,
    ImageBackground,
    SafeAreaView
} from "react-native";
import {
    FontAwesome,
    MaterialIcons,
    Ionicons,
    Feather,
    AntDesign,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
export default function AuctionDetails({ route, navigation }) {

    const { item } = route.params;
    const [user_id, setUserID] = useState(null);
    const [input_modal, setInputModal] = useState(false);
    const [report_modal, setReportModal] = useState(false);

    const [amount, setAmount] = useState("");
    const [problem, setProblem] = useState("");

    const [buttonLoading, setButtonLoading] = useState(false);
    const [data, setData] = useState([]);
    const [offers, setOffers] = useState([]);
    const [user_name, setUserName] = useState("");

    const countDownDate = new Date(item.end_date).getTime();
    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

    useEffect(() => {
        _retrieveData();
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);
        return () => clearInterval(interval);
    }, [countDownDate]);


    const CountdownTimer = () => {
        const [days, hours, minutes, seconds] = getReturnValues(countDown);
        if (days + hours + minutes + seconds <= 0) {
            return (
                <View>
                    <Text>Expired</Text>
                </View>
            );
        } else {
            return (
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>

                    <View style={{ alignItems: "center" }}>
                        <View style={{ backgroundColor: "#4bae52", width: 40, height: 40, borderRadius: 5, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                                {seconds}
                            </Text>
                        </View>
                        <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 10 }}>
                            ثانية
                        </Text>
                    </View>

                    <View style={{ alignItems: "center" }}>
                        <View style={{ backgroundColor: "#4bae52", width: 40, height: 40, borderRadius: 5, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                                {minutes}
                            </Text>
                        </View>
                        <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 10 }}>
                            دقيقة
                        </Text>
                    </View>



                    <View style={{ alignItems: "center" }}>
                        <View style={{ backgroundColor: "#4bae52", width: 40, height: 40, borderRadius: 5, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                                {hours}
                            </Text>
                        </View>
                        <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 10 }}>
                            ساعة
                        </Text>
                    </View>


                    <View style={{ alignItems: "center" }}>
                        <View style={{ backgroundColor: "#4bae52", width: 40, height: 40, borderRadius: 5, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontFamily: "Bold", color: "#FFF" }}>
                                {days}
                            </Text>
                        </View>
                        <Text style={{ fontFamily: "Bold", color: "#000", fontSize: 10 }}>
                            يوم
                        </Text>
                    </View>

                </View>

            );
        }
    };



    const reportProblem = () => {
        alert("تم ارسال مشكلتك للإدارة بنجاح , سيتم التواصل معك في اقرب وقت ");
        setReportModal(!report_modal);
    }

    function toEnglishNumber(strNum) {
        const arabicNumbers = "٠١٢٣٤٥٦٧٨٩".split("");
        const englishNumbers = "0123456789".split("");
        strNum = strNum.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (x) => englishNumbers[arabicNumbers.indexOf(x)]);   
        strNum = strNum.replace(/[^\d]/g, "");
        return strNum;
      }



    const getReturnValues = (countDown) => {
        // calculate time left
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

        return [days, hours, minutes, seconds];
    };



    const _retrieveData = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        const user_id = await AsyncStorage.getItem("user_id");
        setUserID(user_id);
        fetch("https://www.mestamal.com/api/user/auction/" + item.id + "/get", {
            method: "GET",
            headers: {
                Accept: "*/*",
                "Content-type": "multipart/form-data;",
                "cache-control": "no-cache",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                Authorization: "Bearer " + user_token
            }
        })
            .then(response => response.json())
            .then(json => {
                setData(json);
                setOffers(json.offers);
                setUserName(json.user.name);
                // alert(JSON.stringify(json));
                // console.log(json);
            }
            )
            .catch(error => {
                console.error(error);
            }
            );
    }


    const sendOffer = async () => {
        let formData = new FormData();
        formData.append("amount", amount);
        const user_token = await AsyncStorage.getItem("user_token");
        let url = "https://www.mestamal.com/api/user/auctions/" + item.id + "/add_offer";
        try {
            fetch(url, {
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Content-type": "multipart/form-data;",
                    "cache-control": "no-cache",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive",
                    "Authorization": "Bearer " + user_token
                },
                body: formData
            })
                .then(response => response.json())
                .then(json => {
                    if (json.status == true) {
                        alert(json.msg);
                        setInputModal(!input_modal);
                        _retrieveData();

                    }
                    else {
                        // setBtnLoading(false);
                        alert("هناك مشكلة ");

                    }
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };



    const _openChat = async () => {
        const user_token = await AsyncStorage.getItem("user_token");
        //setLoading(true);
        let url = "https://mestamal.com/api/contact/" + item.user_id;
        try {
            fetch(url, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Content-type": "multipart/form-data;",
                    "cache-control": "no-cache",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive",
                    Authorization: "Bearer " + user_token
                }
            })
                .then(response => response.json())
                .then(json => {
                    if (json.status == true) {
                        // setLoading(false);
                        navigation.navigate("ChatScreen",
                            {
                                chat_id: item.user_id,
                                user_name: item.user.name,
                            });
                    }
                    else {
                        //setLoading(false);
                        alert(json.msg);

                    }
                })
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
            <StatusBar backgroundColor="#34ace0" />

            <View
                style={{
                    width: "100%",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#34ace0",
                    paddingHorizontal: 20,
                }}
            >

                <View style={{ width: "20%", alignItems: "flex-end" }}>
                    <MaterialIcons name="arrow-back-ios" size={30} color="#FFF" onPress={() => navigation.goBack()} />

                </View>

                <View style={{ width: "80%", alignItems: "flex-start", }}>
                    <Text style={{
                        color: "#FFF",
                        fontFamily: "Regular",
                        fontSize: 18,
                    }}>
                        {item.title}
                    </Text>
                </View>
            </View>

            <View>
                <ImageBackground source={{ uri: "https://mestamal.com/uploads/" + item.main_image }}
                    style={{ width: "100%", height: 280, resizeMode: "contain" }} >
                    <View style={{
                        paddingTop: Constants.statusBarHeight * 1.2,
                        flexDirection: "row",
                        width: "100%",
                        paddingHorizontal: 20
                    }}>

                    </View>

                </ImageBackground>
            </View>

            <View style={{
                flex: 1,
                backgroundColor: "#FFF",
                marginTop: -20,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,

            }}>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        marginVertical: 20,
                        alignItems: "flex-start",
                    }}>

                    {item.user.id == user_id
                        ?
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#34ace0",
                                width: 150,
                                height: 40,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 18 }}>
                                مزاد شخصي
                            </Text>
                        </TouchableOpacity>
                        :

                        <TouchableOpacity
                            onPress={() => setInputModal(true)}
                            style={{
                                backgroundColor: "#34ace0",
                                width: 150,
                                height: 40,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <Text style={{ fontFamily: "Bold", color: "#FFF", fontSize: 18 }}>
                                أضف عرض
                            </Text>
                        </TouchableOpacity>
                    }

                    <View style={{
                        justifyContent: "space-around",
                        width: "50%",
                        flexDirection: "row"
                    }}>
                        {CountdownTimer()}
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ width: "100%", marginBottom: 50 }}>
                    <View style={{ paddingHorizontal: 20 }}><Text style={{ fontFamily: "Bold", fontSize: 20, color: "#000" }}>
                        {item.title}
                    </Text>
                    </View>
                    <View>
                        <Text style={{ color: "grey", fontFamily: "Regular", paddingHorizontal: 20, marginTop: 20 }}>
                            {item.details}
                        </Text>

                    </View>
                    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>

                        <Text style={{ fontFamily: "Bold", color: "#34ace0", fontSize: 16, marginBottom: 10 }}>
                            معلومات الناشر
                        </Text>

                        <View style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                        }}>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('./../assets/profile.png')}
                                    style={{ width: 60, height: 60, marginHorizontal: 5 }} />
                            </View>


                            <View style={{ alignItems: "flex-start" }}>

                                <Text style={{ color: "grey", fontFamily: "Bold", fontSize: 18 }}>
                                    {user_name}
                                </Text>

                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                    <AntDesign name="star" size={20} color="#F7D000" />
                                </View>
                            </View>

                        </View>
                    </View>


                    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                        <Text style={{ fontFamily: "Bold", color: "#34ace0", fontSize: 16 }}>
                            العروض
                        </Text>
                    </View>

                    <FlatList
                        style={{ width: "100%", marginTop: 20, paddingHorizontal: 20, flex: 1, paddingBottom: 80 }}
                        contentContainerStyle={{
                            justifyContent: "center",
                        }}
                        data={offers}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (

                            <View style={{
                                width: "100%",
                                borderColor: "#DDDDDD",
                                flexDirection: "row",
                                backgroundColor: "#FFF",
                                justifyContent: "space-between",
                                paddingVertical: 10,
                                marginBottom: 5,
                                borderRadius: 5,
                                borderWidth: 1,
                                paddingHorizontal: 10
                            }}>

                                <Text style={{ color: "#000", fontFamily: "Bold", textAlign: "left" }}>
                                    {item.user.name}
                                </Text>


                                <Text style={{ color: "grey", textAlign: "left", fontFamily: "Regular" }}>
                                    {item.amount} ريال
                                </Text>

                            </View>
                        )} />
                </ScrollView>

                {item.user.id == user_id ? 
                
                <View style={{
                    flexDirection: "row",
                    backgroundColor: "#FFF",
                    justifyContent: "space-between",
                    position: "absolute",
                    bottom: 10,
                    width: "100%",
                    paddingHorizontal: 10
                }}>

                    <View style={{ width: "20%", }}>
                        <TouchableOpacity style={{ width: 60, height: 60, backgroundColor: "#4BAE52", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                            <AntDesign name="sharealt" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "80%" }}>
                        <TouchableOpacity 
                          onPress={() => setReportModal(!input_modal)}
                        style={{ width: "100%", height: 60, backgroundColor: "#FE5722", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                            <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 18 }}>
                                الإبلاغ عن مشكلة
                            </Text>
                        </TouchableOpacity>
                    </View>

       
                </View>
                :
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: "#FFF",
                        justifyContent: "space-between",
                        position: "absolute",
                        bottom: 10,
                        width: "100%",
                        paddingHorizontal: 10
                    }}>

                        <View style={{ width: "20%", }}>
                            <TouchableOpacity style={{ width: 60, height: 60, backgroundColor: "#4BAE52", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                                <AntDesign name="sharealt" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: "60%" }}>
                            <TouchableOpacity 
                            onPress={() => setReportModal(!input_modal)}
                            style={{ width: "100%", height: 60, backgroundColor: "#FE5722", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                                <Text style={{ color: "#FFF", fontFamily: "Bold", fontSize: 18 }}>
                                    الإبلاغ عن مشكلة
                                </Text>
                            </TouchableOpacity>
                        </View>

                       
                        <View style={{ width: "20%", alignItems: "flex-end" }}>
                            <TouchableOpacity
                                onPress={() => _openChat()}
                                style={{
                                    width: 60,
                                    height: 60,
                                    backgroundColor: "#000",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 10
                                }}>
                                <Ionicons name="chatbubbles-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

}

             
            </View>

            <Modal transparent={true} animationType="slide" visible={input_modal}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { width: "90%", marginVertical: 100 }]}>
                        <View
                            style={{
                                backgroundColor: "#41A2D8",
                                width: 60,
                                height: 60,
                                marginTop: -20,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: "#FFF"
                            }}
                        >
                            <MaterialIcons name="attach-money" size={24} color="#FFF" />
                        </View>

                        <TouchableOpacity
                            style={{
                                width: "100%",
                                alignItems: "flex-end",
                                paddingHorizontal: 20,
                                marginVertical: -25,
                                zIndex: 1000
                            }}
                            onPress={() => setInputModal(!input_modal)}
                        >
                            <FontAwesome name="close" size={30} color="grey" />
                        </TouchableOpacity>

                        <View style={{ height: 250, width: "100%", padding: 20 }}>
                            <View style={{ width: "100%", marginTop: 10 }}>
                                <Text
                                    style={{
                                        fontFamily: "Bold",
                                        color: "#051A3A",
                                        marginBottom: 10
                                    }}
                                >
                                    أرسل عرضك
                                </Text>
                                <TextInput
                                    onChangeText={value => setAmount(toEnglishNumber(value))}
                                    placeholder="أدخل عرضك هنا"
                                   // keyboardType="numeric"
                                    style={{
                                        backgroundColor: "#FFF",
                                        height: 60,
                                        marginBottom: 20,
                                        paddingHorizontal: 10,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: "#41A2D8",
                                        width: "100%",
                                        fontFamily: "Regular",
                                        textAlign: "right"
                                    }}
                                />
                            </View>

                            <View style={{}}>
                                <TouchableOpacity
                                    onPress={() => sendOffer()}
                                    style={{
                                        backgroundColor: "#41A2D8",
                                        paddingVertical: 15,
                                        borderRadius: 20,
                                        width: "100%",
                                        marginBottom: 20
                                    }}
                                >
                                    {buttonLoading == false
                                        ? <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "white",
                                                    textAlign: "center",
                                                    fontFamily: "Bold",
                                                    marginHorizontal: 10
                                                }}
                                            >
                                                ارسال
                                            </Text>
                                            <Ionicons name="send" size={24} color="#FFF" />
                                        </View>
                                        : <ActivityIndicator size="large" color={"#FFF"} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>



            <Modal transparent={true} animationType="slide" visible={report_modal}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { width: "90%", marginVertical: 100 }]}>
                        <View
                            style={{
                                backgroundColor: "#41A2D8",
                                width: 60,
                                height: 60,
                                marginTop: -20,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: "#FFF"
                            }}
                        >
                            <Feather name="alert-triangle" size={24} color="#FFF" />
                        </View>

                        <TouchableOpacity
                            style={{
                                width: "100%",
                                alignItems: "flex-end",
                                paddingHorizontal: 20,
                                marginVertical: -25,
                                zIndex: 1000
                            }}
                            onPress={() => setReportModal(!report_modal)}
                        >
                            <FontAwesome name="close" size={30} color="grey" />
                        </TouchableOpacity>

                        <View style={{ width: "100%", padding: 20 }}>
                            <View style={{ width: "100%", marginTop: 10 }}>
                                <Text
                                    style={{
                                        fontFamily: "Bold",
                                        color: "#051A3A",
                                        marginBottom: 10
                                    }}
                                >
                                   أدخل وصف المشكلة التي تواجهها
                                </Text>
                                <TextInput
                                    onChangeText={value => setProblem(value)}
                                    style={{
                                        backgroundColor: "#FFF",
                                        height: 160,
                                        marginBottom: 20,
                                        paddingHorizontal: 10,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: "#DDDDDD",
                                        width: "100%",
                                        fontFamily: "Regular",
                                        textAlign: "right"
                                    }}
                                />
                            </View>

                            <View style={{}}>
                                <TouchableOpacity
                                    onPress={() => reportProblem()}
                                    style={{
                                        backgroundColor: "#41A2D8",
                                        paddingVertical: 15,
                                        borderRadius: 20,
                                        width: "100%",
                                        marginBottom: 20
                                    }}
                                >
                                    {buttonLoading == false
                                        ? <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "white",
                                                    textAlign: "center",
                                                    fontFamily: "Bold",
                                                    marginHorizontal: 10
                                                }}
                                            >
                                                ارسال
                                            </Text>
                                            <Ionicons name="send" size={24} color="#FFF" />
                                        </View>
                                        : <ActivityIndicator size="large" color={"#FFF"} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        marginBottom: 50,
        width: "80%",
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "red",
        marginVertical: 20,
        width: "80%",
        marginBottom: 40
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },

    textStyle: {
        color: "white",
        textAlign: "center",
        fontFamily: "Bold"
    },
    modalText: {
        marginBottom: 10,
        textAlign: "center",
        fontSize: 20,
        marginTop: 20,
        fontFamily: "Bold",
        marginHorizontal: 10
    },
    modalBody: {
        textAlign: "center",
        marginTop: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontFamily: "Regular"
    },
});
