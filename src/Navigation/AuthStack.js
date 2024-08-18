import { createStackNavigator } from "@react-navigation/stack";

import AppStack from "./AppStack";
import Splash from "./../SplashScreen";
import SignIn from "./../SignIn";
import SignUp from "./../SignUp";
import OtpScreen from "./../OtpScreen";
import ForgotPwd from "./../ForgotPwd";
import SignInSupport from "./../SignInSupport";
import NewPwd from "./../NewPwd";


export default AuthenticationStack = () => {
  const AuthStack = createStackNavigator();
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false
      }}
    >
      <AuthStack.Screen name="DrawerStack" component={AppStack} />
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="ForgotPwd" component={ForgotPwd} />
      <AuthStack.Screen name="NewPwd" component={NewPwd} />
      <AuthStack.Screen name="OtpScreen" component={OtpScreen} />
      <AuthStack.Screen name="SignInSupport" component={SignInSupport} />
    </AuthStack.Navigator>
  );
};
