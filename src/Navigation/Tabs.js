import { Platform, Text } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

import AppStack from "./AppStack";
import Favorite from "./../Favourite";
import Conversations from "./../Conversations";
import MyAdds from "./../MyAdds";
import Auctions from "./../Auctions";


export default TabNavigator = () => {
    const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator
      initialRouteName="AppStack"
      backBehavior="initialRoute"
      backgroundColor="#34ace0"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFF",
          height: Platform.OS == "android" ? 60 : 80
        }
      }}
    >
      <Tabs.Screen
        name="HomePage"
        component={AppStack}
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
            <MaterialCommunityIcons
              name="file-document-multiple-outline"
              size={22}
              color={color}
            />
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