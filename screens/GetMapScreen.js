import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  PanResponder,
  Animated,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import NavigateCard from "../components/NavigateCard";
import RideOptionsCard from "../components/RideOptionsCard";
import Map from "../components/Map";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const GetMapScreen = () => {
  const navigation = useNavigation();

  const [mapHeight] = useState(new Animated.Value(0.5));
  const [cardHeight] = useState(new Animated.Value(0.5));
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Start the gesture if a vertical swipe is detected
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 10
        );
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: Animated.event([null, { dy: cardHeight }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        if (gestureState.dy < -50) {
          // Swiped up
          Animated.timing(mapHeight, {
            toValue: 0.25,
            duration: 300,
            useNativeDriver: false,
          }).start();
          Animated.timing(cardHeight, {
            toValue: 0.75,
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dy > 50) {
          // Swiped down
          Animated.timing(mapHeight, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: false,
          }).start();
          Animated.timing(cardHeight, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else {
          // Return to original state if swipe is small
          Animated.spring(mapHeight, {
            toValue: 0.5,
            useNativeDriver: false,
          }).start();
          Animated.spring(cardHeight, {
            toValue: 0.5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

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
          <Map />
        </Animated.View>
        <Animated.View
          style={[tw`h-1/2`, { flex: cardHeight }]}
          {...panResponder.panHandlers}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="NavigateCard"
              component={NavigateCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RideOptionsCard"
              component={RideOptionsCard}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GetMapScreen;

const styles = StyleSheet.create({});
