import { createStackNavigator } from "react-navigation-stack";

import LoginSignup from "./screens/LoginSignup";
import PasswordRecover from "./screens/PasswordRecover";
import SetPassword from "./screens/SetPassword";

export default LoginSignupBlueprintNavigator = createStackNavigator(
  {
    LoginSignup,
    PasswordRecover,
    SetPassword
  },
  {
    initialRouteName: "LoginSignup",
    defaultNavigationOptions: ({ navigation }) => ({ header: null }),
  }
);
