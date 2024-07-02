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
import axios from "axios";
import { BASE_URL } from "@env";

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
      axios
        .post(`${BASE_URL}/ride/unrequest-ride`, {
          rideInformation,
        })
        .then((response) => {
          if (response.data.success) {
            console.log(response.data.message);
          } else {
            console.error("Error response:", response);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error(
              "Server responded with error status:",
              error.response.status
            );
            console.error("Error message:", error.response.data);
            navigation.navigate("Login");
          } else if (error.request) {
            console.error(
              "Request made but no response received:",
              error.request
            );
            navigation.navigate("Login");
          } else {
            console.error("Error setting up request:", error.message);
            navigation.navigate("Login");
          }
        });

      navigation.navigate(`${parentRoute}`);
    }, 2000); // Simulating a delay of 2 seconds for loading
  };

  useEffect(() => {
    const userId = rideInformation.user._id;
    const ws = new WebSocket(
      `wss://free.blr2.piesocket.com/v3/1?api_key=dKA1PcoBPSDNAVPH8sUOpn6LTHEaArJjWJomLZ9U&notify_self=1&userId=${userId}`
    );
    setSocket(ws);
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send(
        JSON.stringify({
          // action: "add",
          // type: rideInformation.match.riderType ? "passenger" : "driver",
          // payload: rideInformation,
          user: rideInformation.user._id,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        //console.log("Received message:", event);

        const message = JSON.parse(event.data);
        console.log("Received message:", message.user);
        // ws.send(
        //   JSON.stringify({
        //     type: "driver",
        //     payload: rideInformation,
        //   })
        // );
        console.log(
          "USER IDS",
          rideInformation.user._id.toString(),
          message.user.toString()
        );
        if (rideInformation.user._id.toString() === message.user.toString()) {
          setMessages((prevMessages) => [...prevMessages, message]);
          //setMessage(message);
          console.log("youre seing this cause youre the user");
          navigation.navigate("FoundDriverCard", {
            message: "We found you a ride!",
            parentRoute: "FinderCard",
            rideInformation,
            driver: message.match.driver,
            passenger: message.match.passenger,
            pin: message.match.pin,
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

  // useEffect(() => {
  //   const type = rideInformation.match.riderType ? "passenger" : "driver";
  //   if (type === "driver") {
  //     //console.log(rideInformation);
  //     axios
  //       .post(`${BASE_URL}/ride/offer-ride`, {
  //         rideInformation,
  //       })
  //       .then((response) => {
  //         if (response.data.success) {
  //           //console.log(response.data.data.length);
  //           if (response.data.data[0].passengers.length > 0) {
  //             //console.log("why am i navigating???");
  //             navigation.navigate("PassengerOptionsCard", {
  //               parentRoute: "FinderCard",
  //               rideInformation,
  //               matches: response.data.data,
  //             });
  //           } else {
  //             //make request to offer ride again
  //           }
  //         } else {
  //           console.log(
  //             "-----------------------------------------------ERROR--------------------------------------------"
  //           );
  //           console.log(response);
  //         }
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           // The request was made and the server responded with a status code
  //           // that falls out of the range of 2xx
  //           console.error(
  //             "Server responded with error status:",
  //             error.response.status
  //           );
  //           console.error("Error message:", error.response.data);
  //           navigation.navigate("Login");
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           console.error(
  //             "Request made but no response received:",
  //             error.request
  //           );
  //           navigation.navigate("Login");
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.error("Error setting up request:", error.message);
  //           navigation.navigate("Login");
  //         }
  //       });
  //   } else {
  //     axios
  //       .post(`${BASE_URL}/ride/request-ride`, {
  //         rideInformation,
  //       })
  //       .then((response) => {
  //         if (response.data.success) {
  //           console.log(response.data.message);
  //           //this means the user has been added to the list of passengers
  //           // he now has to wait until a driver accepts his request
  //         } else {
  //           console.log(response);
  //         }
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           // The request was made and the server responded with a status code
  //           // that falls out of the range of 2xx
  //           console.error(
  //             "Server responded with error status:",
  //             error.response.status
  //           );
  //           console.error("Error message:", error.response.data);
  //           navigation.navigate("Login");
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           console.error(
  //             "Request made but no response received:",
  //             error.request
  //           );
  //           navigation.navigate("Login");
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.error("Error setting up request:", error.message);
  //           navigation.navigate("Login");
  //         }
  //       });
  //   }
  // }, []);

  useEffect(() => {
    const type = rideInformation.match.riderType ? "passenger" : "driver";
    let isMounted = true;

    const offerRide = () => {
      console.log("making the request again");
      axios
        .post(`${BASE_URL}/ride/offer-ride`, {
          rideInformation,
        })
        .then((response) => {
          if (response.data.success) {
            if (response.data.data[0].passengers.length > 0) {
              navigation.navigate("PassengerOptionsCard", {
                parentRoute: "FinderCard",
                rideInformation,
                matches: response.data.data,
              });
            } else {
              if (isMounted) {
                setTimeout(offerRide, 5000); // Retry after 5 seconds
              }
            }
          } else {
            console.error("Error response:", response);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error(
              "Server responded with error status:",
              error.response.status
            );
            console.error("Error message:", error.response.data);
            navigation.navigate("Login");
          } else if (error.request) {
            console.error(
              "Request made but no response received:",
              error.request
            );
            navigation.navigate("Login");
          } else {
            console.error("Error setting up request:", error.message);
            navigation.navigate("Login");
          }
        });
    };

    if (type === "driver") {
      offerRide();
    } else {
      axios
        .post(`${BASE_URL}/ride/request-ride`, {
          rideInformation,
        })
        .then((response) => {
          if (response.data.success) {
            console.log(response.data.message);
          } else {
            console.error(response);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error(
              "Server responded with error status:",
              error.response.status
            );
            console.error("Error message:", error.response.data);
            navigation.navigate("Login");
          } else if (error.request) {
            console.error(
              "Request made but no response received:",
              error.request
            );
            navigation.navigate("Login");
          } else {
            console.error("Error setting up request:", error.message);
            navigation.navigate("Login");
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [rideInformation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Detect if the user swiped back
      if (e.data.action.type === "POP") {
        // Handle the swipe back event
        console.log("User swiped back");
        handleCancelPress();
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
