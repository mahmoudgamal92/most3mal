import { Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  AntDesign,
  Feather
} from "@expo/vector-icons";
import CustomDrawer from "./../../CustomDrawer";
import ProfilePage from "./../ProfilePage";
import Contact from "./../Contact";
import ResetPwd from "./../ResetPwd";
import MyWallet from "./../MyWallet";
import MyAuctions from "./../MyAuctions";
import MyOrders from "./../MyOrders";
import Settings from "./../Settings";
import PrivacyPolicy from "./../PrivacyPolicy";
import HowWorks from "./../HowWorks";
import Tabs from "./Tabs";

export default DrawerStack = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerItemStyle: {
          borderRadius: 0,
          width: "100%",
          marginVertical: 0
        },
        headerShown: false,
        drawerPosition: "right"
      }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Tabs}
        options={{
          title: () =>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <AntDesign
                  name="home"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Feather
                  name="user"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Entypo
                  name="wallet"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <AntDesign
                  name="infocirlceo"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons
                  name="pricetags"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons
                  name="call"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Entypo
                  name="lock"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <AntDesign
                  name="infocirlceo"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialIcons
                  name="privacy-tip"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <AntDesign
                  name="infocirlceo"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#000", fontFamily: "Bold" }}>
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
  )};
