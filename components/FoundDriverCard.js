import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

const Col = ({ numRows, children }) => {
  return <View style={styles[`${numRows}col`]}>{children}</View>;
};

const Row = ({ children }) => <View style={styles.row}>{children}</View>;

const DigitBox = ({ digit }) => {
  return (
    <View
      style={[
        tw`w-14 h-12 bg-gray-200 m-2 mx-1 flex justify-center items-center`,
        styles.digitContainer,
      ]}
    >
      <Text style={tw`text-lg font-bold`}>{digit}</Text>
    </View>
  );
};

const FoundDriverCard = ({ route }) => {
  const navigation = useNavigation();
  const { driver, message, pin, passenger } = route.params;

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  console.log(
    "-------------------------------------------PASSENGER-----------------------------------------------------"
  );
  console.log(passenger);
  console.log(
    "---------------------------------------MESSAGE---------------------------------------------------------"
  );
  console.log(message);
  const digits = pin.toString().split("").map(Number) || [];

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Detect if the user swiped back
      if (e.data.action.type === "POP") {
        // Handle the swipe back event
        console.log("User swiped back");
        //this means you dont want to be paired with said driver anymore,
        //need an endpoint to add the passenger back into the passengers array
        //this endpoint will also notify the driver that the ride was canceled, and the driver is navigated back to passenger options card
        //handleCancelPress();
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const userId = passenger.user._id;
    const ws = new WebSocket(
      `wss://free.blr2.piesocket.com/v3/1?api_key=dKA1PcoBPSDNAVPH8sUOpn6LTHEaArJjWJomLZ9U&notify_self=1&userId=${userId}`
    );
    setSocket(ws);
    ws.onopen = () => {
      console.log("Connected to founddriver WebSocket server");
    };

    ws.onmessage = (event) => {
      try {
        //console.log("Received message:", event);

        const message = JSON.parse(event.data);
        console.log("Received message:", message.user);

        console.log(
          "USER IDS",
          passenger.user._id.toString(),
          message.user.toString()
        );
        if (passenger.user._id.toString() === message.user.toString()) {
          setMessages((prevMessages) => [...prevMessages, message]);
          //setMessage(message);
          console.log("youre seeing this cause youre the passenger");
          navigation.navigate("RateUser", {
            user: driver,
            type: "driver",
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

  return (
    <ScrollView style={tw`h-80`}>
      <View style={[styles.app, tw`items-center px-4`]}>
        <Row>
          <Col numRows={4}>
            <Text
              style={[
                tw`mt-2 text-lg p-2 mr-2`,
                { textAlign: "center", textAlignVertical: "center" },
              ]}
            >
              {message}
            </Text>
          </Col>
        </Row>
        <Row>
          <Col numRows={3}>
            <Text style={tw`mt-2 px-2`}>Pick-up point</Text>
            <Text style={tw`mt-2 p-2 text-lg font-semibold mr-2 mb-1`}>
              {driver.origin.description}
            </Text>
            <Text style={tw`mt-1 px-2`}>Drop-off point</Text>
            <Text style={tw`mt-2 p-2 text-lg font-semibold mr-2`}>
              {driver.destination.description}
            </Text>
          </Col>
          <Col numRows={1}>
            <Text style={tw`mt-2 p-2`}>Travel time</Text>
            <Text
              style={tw`bg-black mt-2 text-lg font-semibold text-center text-white h-14 justify-center items-center p-3 mx-2`}
            >
              {driver.travelTimeInformation.duration.text}
            </Text>
          </Col>
        </Row>
        <Row>
          <Col numRows={2}>
            <Text style={tw`mt-2 text-lg p-2 mr-2`}>
              Pin code for this ride
            </Text>
          </Col>
          <Col numRows={2}>
            <View style={tw`flex flex-row justify-center items-center`}>
              {digits.map((digit, index) => (
                <DigitBox key={index} digit={digit} />
              ))}
            </View>
          </Col>
        </Row>
        <Row>
          <Col numRows={2}>
            <View style={tw`relative mt-2 text-lg flex items-center`}>
              <View style={tw`flex items-center mr-2`}>
                <Icon name="user" type="font-awesome" color="#000" size={30} />
                <View style={tw`bg-gray-200 rounded-full ml-1 px-2 py-1 my-1`}>
                  <Text>{driver.user.rating}</Text>
                </View>
              </View>
              <View style={tw`flex items-center`}>
                <Icon name="star" type="font-awesome" color="#000" />
              </View>
            </View>
          </Col>
          <Col numRows={2}>
            <Text style={tw`mt-2 p-2 text-lg font-semibold mr-2 mb-2`}>
              {driver.user.vehicle.licensePlate}
            </Text>
            <Text style={tw`text-lg p-2 mr-2`}>
              {driver.user.vehicle.vehicleColor.trim()}{" "}
              {driver.user.vehicle.vehicleMake.trim()}{" "}
              {driver.user.vehicle.vehicleModel}
            </Text>
          </Col>
        </Row>
        <Row>
          <Col numRows={4}>
            <View
              style={[
                tw`mt-2 p-2 mr-2`,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text>
                <Text style={tw`text-lg text-blue-500`}>
                  {driver?.user.firstname.trim()} {driver?.user.lastname}
                </Text>
                <Text style={tw`text-lg`}>
                  {" "}
                  - {driver?.user.userType} Driver
                </Text>{" "}
              </Text>
            </View>
          </Col>
        </Row>
        {/* Additional Information Section */}
        <Row>
          <Col numRows={3}>
            <Text style={tw`mt-2 text-lg p-2 mr-2`}>Contact Driver</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${driver.user.phoneNumber}`)}
            >
              <Text
                style={tw`mt-2 p-2 text-lg font-semibold mr-2 text-blue-500`}
              >
                {driver.user.phoneNumber}
              </Text>
            </TouchableOpacity>
            {/* <Text style={tw`mt-2 p-2 text-lg font-semibold mr-2`}>
              License Plate: {driver.user.vehicle.licensePlate}
            </Text> */}
            {/* Additional license information */}
            {/* <Text style={tw`mt-1 p-2 text-lg mr-2`}>
              License No: {driver.user.vehicle.licenseNumber}
            </Text>
            <Text style={tw`mt-1 p-2 text-lg mr-2`}>
              License Expiry: {driver.user.vehicle.licenseExpiry}
            </Text> */}
          </Col>
          <Col numRows={1}>
            {/* Placeholder for driver's photo */}
            {driver.user.avatar ? (
              <Image
                style={tw`w-24 h-24 rounded-full mx-auto`}
                source={{
                  uri: `data:image/jpeg;base64,${driver.user.avatar}`,
                }}
              />
            ) : (
              <Icon
                name="user-circle"
                type="font-awesome"
                color="#000"
                size={60}
              />
            )}
          </Col>
        </Row>
        <Row>
          {/* <Col numRows={4}>
            <Text style={tw`mt-2 text-lg p-2 mr-2`}>Bio or Description</Text>
            
            <Text style={tw`mt-2 p-2 text-lg mr-2`}>
              Experienced driver with a clean record. Offering comfortable rides
              with WiFi and charging ports available.
            </Text>
          </Col> */}
          {/* <Col numRows={4}>
            <View style={tw`mt-auto border-t border-gray-200`}>
              <TouchableOpacity
                style={tw`bg-black py-3 m-3 rounded-md h-14 justify-center 
          `}
                onPress={() => console.log("cancel ride pressed")}
              >
                <Text style={tw`text-center text-white text-xl`}>
                  Cancel Ride
                </Text>
              </TouchableOpacity>
            </View>
          </Col> */}
        </Row>
        <Row>
          <Col numRows={2}>
            <View style={tw`mt-auto border-t border-gray-200`}>
              <TouchableOpacity
                style={tw`bg-black py-3 m-3 rounded-md h-14 justify-center 
          `}
                onPress={() => handleAcceptPress()}
              >
                <Text style={tw`text-center text-white text-xl`}>
                  Accept Ride
                </Text>
              </TouchableOpacity>
            </View>
          </Col>
          <Col numRows={2}>
            <View style={tw`mt-auto border-t border-gray-200`}>
              <TouchableOpacity
                style={tw`bg-black py-3 m-3 rounded-md h-14 justify-center 
          `}
                onPress={() => handleCancelPress()}
              >
                <Text style={tw`text-center text-white text-xl`}>
                  Cancel Ride
                </Text>
              </TouchableOpacity>
            </View>
          </Col>
        </Row>
      </View>
    </ScrollView>
  );
};

export default FoundDriverCard;

const styles = StyleSheet.create({
  app: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  "1col": {
    flex: 1,
  },
  "2col": {
    flex: 2,
  },
  "3col": {
    flex: 3,
  },
  "4col": {
    flex: 4,
  },
  digitContainer: {
    width: 30,
  },
});
