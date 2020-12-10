import { createStackNavigator } from "react-navigation-stack";

import Splash from "./screens/";

export default SplashBlueprintNavigator = createStackNavigator(
  {
    Splash: { screen: Splash }
  },
  {
    initialRouteName: "Splash",
    defaultNavigationOptions: ({ navigation }) => ({ header: null }),
  }
);
