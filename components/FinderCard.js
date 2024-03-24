import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const FinderCard = ({ route }) => {
  const navigation = useNavigation();
  const { message, parentRoute, rideInformation } = route.params;
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const handleCancelPress = () => {
    setLoading(true); // Set loading state to true
    setButtonDisabled(true); // Disable the button

    // Simulate a delay to show loading
    setTimeout(() => {
      setLoading(false); // Set loading state to false
      // Perform any cancel ride logic here
      console.log("cancel pressed");
      if (socket) {
        socket.send(
          JSON.stringify({
            action: "remove",
            type: rideInformation.match.riderType ? "passenger" : "driver",
            payload: rideInformation,
          })
        );
      }

      navigation.navigate(`${parentRoute}`);
    }, 2000); // Simulating a delay of 2 seconds for loading
  };

  useEffect(() => {
    const ws = new WebSocket("wss://socketsbay.com/wss/v2/1/demo/");
    setSocket(ws);
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send(
        JSON.stringify({
          action: "add",
          type: rideInformation.match.riderType ? "passenger" : "driver",
          payload: rideInformation,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        //console.log("Received message:", event);

        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        // ws.send(
        //   JSON.stringify({
        //     type: "driver",
        //     payload: rideInformation,
        //   })
        // );
        console.log(
          rideInformation.user._id.toString(),
          message.user.toString()
        );
        if (rideInformation.user._id.toString() === message.user.toString()) {
          setMessages((prevMessages) => [...prevMessages, message]);
          //setMessage(message);
          console.log("youre seing this cause youre the user");
          navigation.navigate("FoundCard", {
            message: message.message,
            parentRoute: "FinderCard",
            rideInformation,
            driver: message.driverDetails,
            passenger: message.passengerDetails,
          });
        }
      } catch (error) {
        // console.log("definitely not for me");
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Detect if the user swiped back
      if (e.data.action.type === "POP") {
        // Handle the swipe back event
        console.log("User swiped back");

        if (socket) {
          socket.send(
            JSON.stringify({
              action: "remove",
              type: rideInformation.match.riderType ? "passenger" : "driver",
              payload: rideInformation,
            })
          );
        }
      }
    });

    return unsubscribe;
  }, [navigation, socket]);

  return (
    <>
      <View style={tw`h-40 flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000" />

        <Text style={tw`mt-2 text-lg font-semibold`}>{message}</Text>
      </View>

      <View style={tw`mt-auto border-t border-gray-200`}>
        <TouchableOpacity
          style={[
            tw`bg-black py-3 m-3 rounded-md h-14 justify-center`,
            buttonDisabled && tw`opacity-50`, // Apply opacity to disabled button
          ]}
          onPress={handleCancelPress}
          disabled={buttonDisabled} // Disable the button based on state
        >
          <Text style={tw`text-center text-white text-xl`}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default FinderCard;

const styles = StyleSheet.create({});
