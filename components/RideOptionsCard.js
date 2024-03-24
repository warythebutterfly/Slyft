import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import Toast from "react-native-toast-message";
import RiderCard from "./RiderCard";
import FinderCard from "./FinderCard";
import FoundCard from "./FoundCard";

const Stack = createStackNavigator();

const RideOptionsCard = () => {
  return (
    <SafeAreaView style={tw`bg-white flex-grow`}>
      <Stack.Navigator>
        <Stack.Screen
          name="RiderCard"
          component={RiderCard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FinderCard"
          component={FinderCard}
          // initialParams={{ message: "Finding a passenger for you!" }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FoundCard"
          component={FoundCard}
          // initialParams={{ message: "Finding a passenger for you!" }}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default RideOptionsCard;

const styles = StyleSheet.create({});
