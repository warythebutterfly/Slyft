// AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import GetMapScreen from "./screens/GetMapScreen";
import GiveMapScreen from "./screens/GiveMapScreen";
import DebugScreen from "./screens/DebugScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";
import OTPScreen from "./screens/OTPScreen";
import RateUserScreen from "./screens/RateUserScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GetMap"
        component={GetMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GiveMap"
        component={GiveMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RateUser"
        component={RateUserScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
