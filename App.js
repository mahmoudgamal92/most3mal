import {StyleSheet,Linking, I18nManager } from "react-native";
import { useFonts } from "expo-font";

import { NavigationContainer } from '@react-navigation/native';

import AuthStack from "./src/Navigation/AuthStack";

export default function App() {
  I18nManager.forceRTL(true);
  I18nManager.allowRTL(true);

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


 
  return (
    <NavigationContainer>
    <AuthStack />
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