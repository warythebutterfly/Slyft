import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import GiveNavigateCard from "../components/GiveNavigateCard";
import RiderOptionsCard from "../components/RiderOptionsCard";
import React from "react";
import Map from "../components/Map";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const GiveMapScreen = () => {
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={tw`bg-white absolute top-16 left-8 z-50 p-3 rounded-full`}
        >
          <Icon type="antdesign" color="black" name="arrowleft" />
        </TouchableOpacity>
        <View style={tw`h-1/2`}>
          <Map />
        </View>
        <View style={tw`h-1/2`}>
          <Stack.Navigator>
            <Stack.Screen
              name="GiveNavigateCard"
              component={GiveNavigateCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RiderOptionsCard"
                component={RiderOptionsCard}
                options={{ headerShown: false }}
              />
          </Stack.Navigator>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GiveMapScreen;

const styles = StyleSheet.create({});
