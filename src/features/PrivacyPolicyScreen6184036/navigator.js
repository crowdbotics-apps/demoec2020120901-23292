import { createStackNavigator } from "react-navigation-stack";

import Privacy from "./screens/";

export default PrivacyBlueprintNavigator = createStackNavigator(
  {
    Privacy: { screen: Privacy }
  },
  {
    initialRouteName: "Privacy",
    defaultNavigationOptions: ({ navigation }) => ({ header: null }),
  }
);
