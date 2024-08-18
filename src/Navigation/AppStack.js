import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./Tabs";
import ChatScreen from "./../ChatScreen";
import OtpScreen from "./../OtpScreen";
import Auctions from "./../Auctions";
import Adds from "./../Adds";
import ChoosePaymentMethod from "./../ChoosePaymentMethod";
import PaymentProcess from "./../PaymentProcess";
import AddDetails from "./../AddDetails";
import AddAuction from "./../AddAuction";
import AuctionDetails from "./../AuctionDetails";
import ProfilePage from "./../ProfilePage";
import Contact from "./../Contact";
import ResetPwd from "./../ResetPwd";
import DepartSelect from "./../Add/DepartSelect";
import OfferInfo from "./../OfferInfo";
import MyBids from "./../MyBids";
import CatSelect from "./../Add/CatSelect";
import CreateCar from "./../Add/CreateCar";
import CreateGeneralAdd from "./../Add/Create";
import MyWallet from "./../MyWallet";
import MyAuctions from "./../MyAuctions";
import AuctionOfferInfo from "./../AuctionOfferInfo";
import SearchResult from "./../SearchResult";
import PrivacyPolicy from "./../PrivacyPolicy";
import HowWorks from "./../HowWorks";
import TermsAndConditions from "./../TermsAndConditions";

import EditProfile from "./../EditProfile";
import PaymentSuccess from "./../PaymentSuccess";
import PaymentErorr from "./../PaymentErorr";
import EditAdd from "./../Add/Edit";

import AddBank from "./../AddBank";
import ChooseBank from "./../ChooseBank";
import EditAuction from "./../EditAuction";

import DrawerStack from './Drawer';
export default AppStack = () => {
  const HomeStack = createStackNavigator();

  return (
    <HomeStack.Navigator
      initialRouteName="Tabs"
      backBehavior='hsitory'
      screenOptions={{
        headerShown: false
      }}
    >
      <HomeStack.Screen name="DrawerStack" component={DrawerStack} />
      <HomeStack.Screen name="ChatScreen" component={ChatScreen} />
      <HomeStack.Screen name="Adds" component={Adds} />
      <HomeStack.Screen name="Auctions" component={Auctions} />
      <HomeStack.Screen name="AddDetails" component={AddDetails} />
      <HomeStack.Screen name="AddAuction" component={AddAuction} />
      <HomeStack.Screen name="AuctionDetails" component={AuctionDetails} />
      <HomeStack.Screen name="ProfilePage" component={ProfilePage} />
      <HomeStack.Screen name="Contact" component={Contact} />
      <HomeStack.Screen name="ResetPwd" component={ResetPwd} />
      <HomeStack.Screen name="DepartSelect" component={DepartSelect} />
      <HomeStack.Screen name="CatSelect" component={CatSelect} />
      <HomeStack.Screen name="CreateCarAdd" component={CreateCar} />
      <HomeStack.Screen
        name="CreateGeneralAdd"
        component={CreateGeneralAdd}
      />
      <HomeStack.Screen name="MyWallet" component={MyWallet} />
      <HomeStack.Screen name="SearchResult" component={SearchResult} />
      <HomeStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <HomeStack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <HomeStack.Screen name="HowWorks" component={HowWorks} />
      <HomeStack.Screen name="MyAuctions" component={MyAuctions} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen
        name="ChoosePaymentMethod"
        component={ChoosePaymentMethod}
      />
      <HomeStack.Screen name="PaymentProcess" component={PaymentProcess} />
      <HomeStack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <HomeStack.Screen name="PaymentErorr" component={PaymentErorr} />
      <HomeStack.Screen name="OfferInfo" component={OfferInfo} />
      <HomeStack.Screen
        name="AuctionOfferInfo"
        component={AuctionOfferInfo}
      />
      <HomeStack.Screen name="MyBids" component={MyBids} />
      <HomeStack.Screen name="EditAdd" component={EditAdd} />
      <HomeStack.Screen name="OtpScreen" component={OtpScreen} />

      <HomeStack.Screen name="AddBank" component={AddBank} />
      <HomeStack.Screen name="ChooseBank" component={ChooseBank} />
      <HomeStack.Screen name="EditAuction" component={EditAuction} />

    </HomeStack.Navigator>
  );
};
