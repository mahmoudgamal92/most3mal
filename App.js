import { Platform, StyleSheet, Text, View, Linking, I18nManager } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  Feather
} from "@expo/vector-icons";
import CustomDrawer from './CustomDrawer';
import Splash from "./src/SplashScreen";
import SignIn from "./src/SignIn";
import SignUp from "./src/SignUp";
import NewAdd from "./src/NewAdd";
import ChatScreen from "./src/ChatScreen";

import HomePage from "./src/HomePage";
import Favorite from "./src/Favourite";
import Conversations from "./src/Conversations";
import MyAdds from "./src/MyAdds";
import Auctions from "./src/Auctions";
import Adds from "./src/Adds";
import ChoosePaymentMethod from "./src/ChoosePaymentMethod";
import PaymentProcess from "./src/PaymentProcess";

import AddDetails from "./src/AddDetails";
import AddAuction from "./src/AddAuction";

import AuctionDetails from "./src/AuctionDetails";
import ProfilePage from "./src/ProfilePage";
import Contact from "./src/Contact";
import ResetPwd from "./src/ResetPwd";
import ForgotPwd from "./src/ForgotPwd";

import DepartSelect from "./src/Add/DepartSelect";
import OfferInfo from "./src/OfferInfo";

import CatSelect from "./src/Add/CatSelect";
import SubCatSelect from "./src/Add/SubCatSelect";
import CreateCar from "./src/Add/CreateCar";
import CreateRealEstate from "./src/Add/CreateRealEstate";
import CreateGeneralAdd from "./src/Add/Create";
import MyWallet from "./src/MyWallet";
import MyAuctions from "./src/MyAuctions";
import MyAuction from "./src/MyAuction";
import MyOrders from "./src/MyOrders";
import Settings from "./src/Settings";
import CountDown from "./src/CountDown";

import SearchResult from "./src/SearchResult";
import PrivacyPolicy from "./src/PrivacyPolicy";
import HowWorks from "./src/HowWorks";
import EditProfile from "./src/EditProfile";
import PaymentSuccess from "./src/PaymentSuccess";
import PaymentErorr from "./src/PaymentErorr";

export default function App() {
  I18nManager.forceRTL(true);
  I18nManager.allowRTL(true);

  const HomeStack = createStackNavigator();
  const Tabs = createBottomTabNavigator();
  const Drawer = createDrawerNavigator();
  let [fontsLoaded] = useFonts({
    Bold: require("./fonts/Bold.ttf"),
    Light: require("./fonts/Light.ttf"),
    Regular: require("./fonts/Regular.ttf"),
    Medium: require("./fonts/Medium.ttf"),
    ExtraBold: require("./fonts/ExtraBold.ttf")
  });
  if (!fontsLoaded) {
    return null;
  }
//ruriyrud

  const ContactFunc = () => {
    Linking.openURL('mailto:support@example.com');
  }


  const TabNavigator = () => {
    return (
      <Tabs.Navigator
        initialRouteName="HomePage"
        backBehavior="initialRoute"
        backgroundColor="#34ace0"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFF",
            height: Platform.OS == "android" ? 60 : 80,
          }
        }}

      >




        <Tabs.Screen
          name="HomePage"
          component={HomePage}
          options={{
            tabBarLabel: ({ color, size }) =>
              <Text style={{ fontFamily: "Regular", color }}>الرئيسية</Text>,
            tabBarIcon: ({ color, size }) =>
              <MaterialCommunityIcons
                name="home-search-outline"
                size={22}
                color={color}
              />
          }}
        />





        <Tabs.Screen
          name="Favorite"
          component={Favorite}
          options={{
            tabBarLabel: ({ color, size }) =>
              <Text style={{ fontFamily: "Regular", color }}>المفضلة</Text>,
            tabBarIcon: ({ color, size }) =>
              <MaterialIcons name="favorite-outline" size={22} color={color} />
          }}
        />




        <Tabs.Screen
          name="Conversations"
          component={Conversations}
          options={{
            tabBarLabel: ({ color, size }) =>
              <Text style={{ fontFamily: "Regular", color }}>المحادثات</Text>,
            tabBarIcon: ({ color, size }) =>
              <Ionicons name="ios-chatbubbles-outline" size={22} color={color} />
          }}
        />




        <Tabs.Screen
          name="MyAdds"
          component={MyAdds}
          options={{
            tabBarLabel: ({ color, size }) =>
              <Text style={{ fontFamily: "Regular", color }}>إعلاناتي</Text>,
            tabBarIcon: ({ color, size }) =>
              <MaterialCommunityIcons name="file-document-multiple-outline" size={22} color={color} />
          }}
        />


        <Tabs.Screen
          name="Auctions"
          component={Auctions}
          options={{
            tabBarLabel: ({ color, size }) =>
              <Text style={{ fontFamily: "Regular", color }}>المزادات </Text>,
            tabBarIcon: ({ color, size }) =>
              <Ionicons name="md-hand-right-outline" size={24} color={color} />
          }}
        />







      </Tabs.Navigator>
    );
  };

  const ClientDrawer = () => {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerItemStyle: {
            borderRadius: 0,
            width: '100%',
            marginVertical: 0,

          },
          headerShown: false,
          drawerPosition: "right"
        }}
        drawerContent={props => <CustomDrawer {...props} />}>
        <Drawer.Screen
          name="Home"
          component={TabNavigator}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <AntDesign name="home" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    الرئيسية
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />




        <Drawer.Screen
          name="ProfilePage"
          component={ProfilePage}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <Feather name="user" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    الملف الشخصي
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />





        <Drawer.Screen
          name="MyWallet"
          component={MyWallet}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <Entypo name="wallet" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    محفظتي
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />



        <Drawer.Screen
          name="MyOrders"
          component={MyOrders}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <AntDesign name="infocirlceo" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    طلباتي
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />




        <Drawer.Screen
          name="MyAuctions"
          component={MyAuctions}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <Ionicons name="pricetags" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    مزاداتي
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />




        <Drawer.Screen
          name="Contact"
          component={Contact}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <Ionicons name="call" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    تواصل معنا
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />


        <Drawer.Screen
          name="ResetPwd"
          component={ResetPwd}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <Entypo name="lock" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    تغيير كلمة المرور
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />



        <Drawer.Screen
          name="HowWorks"
          component={HowWorks}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <AntDesign name="infocirlceo" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    كيف يعمل التطبيق
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />





        <Drawer.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <MaterialIcons name="privacy-tip" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    الشروط و الأحكام
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />


        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={{
            title: () =>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", }}>
                  <AntDesign name="infocirlceo" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#000', fontFamily: 'Bold' }}>
                    الإعدادات
                  </Text>
                </View>

                <View>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </View>

              </View>
          }}
        />

      </Drawer.Navigator>



    );
  }

  return (
    <NavigationContainer>
      <HomeStack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false
        }}>
        <HomeStack.Screen name="AppHome" component={ClientDrawer} />
        <HomeStack.Screen name="Splash" component={Splash} />
        <HomeStack.Screen name="SignIn" component={SignIn} />
        <HomeStack.Screen name="SignUp" component={SignUp} />
        <HomeStack.Screen name="ForgotPwd" component={ForgotPwd} />
        <HomeStack.Screen name="NewAdd" component={NewAdd} />
        <HomeStack.Screen name="ChatScreen" component={ChatScreen} />
        <HomeStack.Screen name="Adds" component={Adds} />
        <HomeStack.Screen name="Auctions" component={Auctions} />
        <HomeStack.Screen name="AddDetails" component={AddDetails} />
        <HomeStack.Screen name="AddAuction" component={AddAuction} />
        <HomeStack.Screen name="MyAuction" component={MyAuction} />
        <HomeStack.Screen name="AuctionDetails" component={AuctionDetails} />
        <HomeStack.Screen name="ProfilePage" component={ProfilePage} />
        <HomeStack.Screen name="Contact" component={Contact} />
        <HomeStack.Screen name="ResetPwd" component={ResetPwd} />
        <HomeStack.Screen name="DepartSelect" component={DepartSelect} />
        <HomeStack.Screen name="CatSelect" component={CatSelect} />
        <HomeStack.Screen name="SubCatSelect" component={SubCatSelect} />
        <HomeStack.Screen name="CreateCarAdd" component={CreateCar} />
        <HomeStack.Screen name="CreateRealEstate" component={CreateRealEstate} />
        <HomeStack.Screen name="CreateGeneralAdd" component={CreateGeneralAdd} />
        <HomeStack.Screen name="MyWallet" component={MyWallet} />
        <HomeStack.Screen name="SearchResult" component={SearchResult} />
        <HomeStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <HomeStack.Screen name="HowWorks" component={HowWorks} />
        <HomeStack.Screen name="MyAuctions" component={MyAuctions} />
        <HomeStack.Screen name="EditProfile" component={EditProfile} />
        <HomeStack.Screen name="CountDown" component={CountDown} />
        <HomeStack.Screen name="ChoosePaymentMethod" component={ChoosePaymentMethod} />
        <HomeStack.Screen name="PaymentProcess" component={PaymentProcess} />
        <HomeStack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <HomeStack.Screen name="PaymentErorr" component={PaymentErorr} />
        <HomeStack.Screen name="OfferInfo" component={OfferInfo}/>


      </HomeStack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});