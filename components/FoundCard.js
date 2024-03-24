import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";

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

const FoundCard = ({ route }) => {
  const navigation = useNavigation();
  const { message, parentRoute, rideInformation, driver, passenger } =
    route.params;
  const digits =
    driver?.pin.toString().split("").map(Number) ||
    passenger?.pin.toString().split("").map(Number) ||
    [];

  return (
    <ScrollView
      //contentContainerStyle={styles.scrollContainer}
      style={tw`h-80`} // Set a static height
    >
      <View style={[styles.app, tw`h-40 items-center px-4`]}>
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
              {rideInformation.origin.description}
            </Text>
            <Text style={tw`mt-1 px-2`}>Drop-off point</Text>
            <Text style={tw`mt-2 p-2 text-lg font-semibold mr-2`}>
              {rideInformation.destination.description}
            </Text>
          </Col>
          <Col numRows={1}>
            <Text style={tw`mt-2 p-2`}>Travel time</Text>
            <Text
              style={tw`bg-black mt-2 text-lg font-semibold text-center text-white h-14 justify-center items-center p-3 mx-2`}
            >
              {rideInformation.travelTimeInformation.duration.text}
            </Text>
            {/* TODO: This section has the travel distance */}
            {/* <Text style={tw`mt-2 p-2`}>Travel distance</Text>
            <Text
              style={[
                tw`bg-black mt-2 text-lg font-semibold text-center text-white h-14 justify-center items-center p-3 mx-2`,
                { flexWrap: "wrap" },
              ]}
            >
              {rideInformation.travelTimeInformation.distance.text}
            </Text> */}
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
                  <Text>{driver?.rating || passenger?.rating}</Text>
                </View>
              </View>
              {/* <View style={tw`flex items-center`}>
                <Icon name="star" type="font-awesome" color="#000" />
              </View> */}
            </View>
          </Col>
          {driver && (
            <Col numRows={2}>
              <Text style={tw`mt-2 p-2 text-lg font-semibold mr-2 mb-2`}>
                {driver?.plateNumber}
              </Text>
              <Text style={tw`text-lg p-2 mr-2`}>{driver?.carName}</Text>
            </Col>
          )}
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
              {driver && (
                <Text>
                  <Text style={tw`text-lg text-blue-500`}>
                    {driver?.driverName}
                  </Text>
                  <Text style={tw`text-lg`}> - top rated driver</Text>{" "}
                </Text>
              )}

              {passenger && (
                <Text>
                  <Text style={tw`text-lg text-blue-500`}>
                    {passenger?.passengerName}
                  </Text>
                  <Text style={tw`text-lg`}> - top rated passenger</Text>{" "}
                </Text>
              )}
            </View>
          </Col>
        </Row>
        {/* <Row>
          <Col numRows={3}>
            <TextInput
              style={tw`p-2 bg-gray-200 rounded-full`}
              placeholder="Enter text..."
            />
          </Col>
          <Col numRows={1}>
            // TODO: Telephone icon
            </Col>
        </Row> */}
      </View>
    </ScrollView>
  );
};

export default FoundCard;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  app: {
    flexGrow: 1,
    flex: 4, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: 400,
    //  backgroundColor: "red",
  },
  row: {
    flexDirection: "row",
  },
  "1col": {
    // backgroundColor: "lightblue",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 1,
  },
  "2col": {
    // backgroundColor: "green",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 2,
  },
  "3col": {
    // backgroundColor: "orange",
    borderColor: "#fff",
    borderWidth: 1,
    flex: 3,
  },
  "4col": {
    flex: 4,
  },
  digitContainer: {
    width: 30, // Adjust the width according to your preference
  },
  numberContainer: {
    //position: "absolute",
    //top: 5,
    //right: 10,
    // backgroundColor: "red", // Set your desired background color
    // borderRadius: 10,
    padding: 5,
  },
  numberText: {
    color: "#000", // Set your desired text color
    fontSize: 12,
    fontWeight: "bold",
  },
});
