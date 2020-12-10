import { createStackNavigator } from "react-navigation-stack";

import Home from "./screens/";

export default HomeBlueprintNavigator = createStackNavigator(
  {
    Home: { screen: Home }
  },
  {
    initialRouteName: "Home"
  }
);
