import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity, Animated } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import NavigateCard from "../components/NavigateCard";
import RideOptionsCard from "../components/RideOptionsCard";
import ErrorBoundary from "../components/ErrorBoundary";
import Map from "../components/Map";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const GetMapScreen = () => {
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
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={tw`bg-white absolute top-16 left-8 z-50 p-3 rounded-full`}>
                    <Icon type="antdesign" color="black" name="arrowleft" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={tw`bg-white absolute top-16 right-8 z-50 p-3 rounded-full`}>
                    <Icon type="antdesign" color="black" name="contacts" />
                </TouchableOpacity>
                <Animated.View style={{ flex: mapHeight }}>
                    <ErrorBoundary>
                        <Map />
                    </ErrorBoundary>
                </Animated.View>
                <Animated.View style={[tw`h-1/2`, { flex: cardHeight }]}>
                    <TouchableOpacity style={{ alignItems: "center", padding: 10 }} onPress={toggleHeight}>
                        <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
                            <Icon name="arrow-up" type="feather" />
                        </Animated.View>
                    </TouchableOpacity>
                    <Stack.Navigator>
                        <Stack.Screen name="NavigateCard" component={NavigateCard} options={{ headerShown: false }} />
                        <Stack.Screen name="RideOptionsCard" component={RideOptionsCard} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default GetMapScreen;

const styles = StyleSheet.create({});
