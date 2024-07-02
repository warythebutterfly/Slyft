import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import Toast from "react-native-toast-message";
import PassengerCard from "./PassengerCard";
import FinderCard from "./FinderCard";
import FoundPassengerCard from "./FoundPassengerCard";
import PassengerOptionsCard from "./PassengerOptionsCard";

const Stack = createStackNavigator();

const RiderOptionsCard = () => {
  return (
    <SafeAreaView style={tw`bg-white flex-grow`}>
      <Stack.Navigator>
        <Stack.Screen
          name="PassengerCard"
          component={PassengerCard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FinderCard"
          component={FinderCard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PassengerOptionsCard"
          component={PassengerOptionsCard}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        {/* <Stack.Screen
          name="FoundCard"
          component={FoundCard}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="FoundPassengerCard"
          component={FoundPassengerCard}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>

      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default RiderOptionsCard;

const styles = StyleSheet.create({});
