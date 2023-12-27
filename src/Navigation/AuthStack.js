import { createStackNavigator } from "@react-navigation/stack";

import DrawerStack from "./Drawer";
import Splash from "./../SplashScreen";
import SignIn from "./../SignIn";
import SignUp from "./../SignUp";
import OtpScreen from "./../OtpScreen";
import ForgotPwd from "./../ForgotPwd";


export default AuthenticationStack = () => {
    const AuthStack = createStackNavigator();
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false
      }}
    >
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="ForgotPwd" component={ForgotPwd} />
      <AuthStack.Screen name="OtpScreen" component={OtpScreen} />
      <AuthStack.Screen name="DrawerStack" component={DrawerStack} />
    </AuthStack.Navigator>
  );
};
