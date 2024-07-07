import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import GiveNavigateCard from "../components/GiveNavigateCard";
import RiderOptionsCard from "../components/RiderOptionsCard";
import ErrorBoundary from "../components/ErrorBoundary";
import Map from "../components/Map";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { selectUser } from "../slices/navSlice";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();

const GiveMapScreen = () => {
  const { vehicle, driverLicense } = useSelector(selectUser);
  const navigation = useNavigation();

  const mapHeight = useRef(new Animated.Value(0.5)).current;
  const cardHeight = useRef(new Animated.Value(0.5)).current;
  const arrowRotation = useRef(new Animated.Value(0)).current; // For rotating the arrow icon

  const toggleHeight = () => {
    Animated.timing(mapHeight, {
      toValue: mapHeight._value === 0.5 ? 0.25 : 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(cardHeight, {
      toValue: cardHeight._value === 0.5 ? 0.75 : 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(arrowRotation, {
      toValue: arrowRotation._value === 0 ? 1 : 0, // Rotate to 180 degrees or back to 0
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Interpolating arrow rotation value
  const arrowRotate = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={tw`bg-white absolute top-16 left-8 z-50 p-3 rounded-full`}
        >
          <Icon type="antdesign" color="black" name="arrowleft" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={tw`bg-white absolute top-16 right-8 z-50 p-3 rounded-full`}
        >
          <Icon type="antdesign" color="black" name="contacts" />
        </TouchableOpacity>
        <Animated.View style={{ flex: mapHeight }}>
          <ErrorBoundary>
            <Map />
          </ErrorBoundary>
        </Animated.View>
        <Animated.View style={[tw`h-1/2`, { flex: cardHeight }]}>
          <TouchableOpacity
            style={{ alignItems: "center", padding: 10 }}
            onPress={toggleHeight}
          >
            <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
              <Icon name="arrow-up" type="feather" />
            </Animated.View>
          </TouchableOpacity>
          {vehicle?.licensePlate &&
          vehicle?.vehicleMake &&
          vehicle?.vehicleModel &&
          vehicle?.vehicleColor &&
          driverLicense?.licenseNumber &&
          driverLicense?.licenseExpiryDate ? (
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
          ) : (
            <View>
              <Text style={tw`text-center py-5 text-xl`}>
                Add your vehicle information to give a ride
              </Text>
              <TouchableOpacity
                style={tw`bg-gray-800 p-4 rounded-md mr-4 ml-4 mb-14`}
                onPress={() => navigation.navigate("Profile")}
              >
                <Text style={tw`text-white text-center font-bold text-lg`}>
                  Complete Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GiveMapScreen;

const styles = StyleSheet.create({});
