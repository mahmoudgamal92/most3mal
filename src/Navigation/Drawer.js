import { Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from '@react-navigation/native';
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  AntDesign,
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import CustomDrawer from "./../../CustomDrawer";
import ProfilePage from "./../ProfilePage";
import Contact from "./../Contact";
import MyWallet from "./../MyWallet";
import MyAuctions from "./../MyAuctions";
import MyOrders from "./../MyOrders";
import Settings from "./../Settings";
import PersonalAdds from "./../PersonalAdds";
import AppStack from "./AppStack";
import TabNavigator from "./Tabs";

export default DrawerStack = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      backBehavior="history"
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
        component={TabNavigator}
        options={{
          title: () =>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row-reverse" }}>
                <AntDesign
                  name="home"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
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
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row-reverse" }}>
                <Feather
                  name="user"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
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
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row-reverse" }}>
                <Entypo
                  name="wallet"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
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
        name="PersonalAdds"
        component={PersonalAdds}
        options={{
          title: () =>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row-reverse" }}>

                <MaterialCommunityIcons
                  name="file-document-multiple-outline"
                  size={24}
                  color="black" style={{ marginLeft: 10 }}
                />

                <Text style={{ color: "#000", fontFamily: "Bold" }}>
                  اعلاناتي
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
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row-reverse" }}>
                <Ionicons name="hand-right-outline" size={24} color="black"
                  style={{ marginLeft: 10 }} />

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
        name="MyOrders"
        component={MyOrders}
        options={{
          title: () =>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row-reverse" }}>
                <AntDesign
                  name="infocirlceo"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
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



      {/* <Drawer.Screen
        name="Contact"
        component={Contact}
        options={{
          title: () =>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row-reverse" }}>
                <Ionicons
                  name="call"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
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
      /> */}


      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          title: () =>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row-reverse" }}>

                <Feather
                  name="settings"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
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
  )
};
