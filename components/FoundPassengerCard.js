import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { WEBSOCKET_URL } from "@env";
import axios from "axios";
import { BASE_URL } from "@env";

const DigitBox = ({ digit }) => {
  return (
    <View style={styles.digitContainer}>
      <Text style={styles.digitText}>{digit}</Text>
    </View>
  );
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const FoundPassengerCard = ({ route }) => {
  const navigation = useNavigation();
  const { passenger, pin, driver } = route.params;
  const digits = pin.toString().split("").map(Number) || [];
  const [rideStarted, setRideStarted] = useState(false);
  const [tripId, setTripId] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "POP") {
        console.log("User swiped back");
        // handleCancelPress(); // Uncomment and implement if needed
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    let timerInterval;
    if (!rideStarted) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }

    return () => clearInterval(timerInterval);
  }, [rideStarted]);

  const handleStartEndRide = () => {
    const ws = new WebSocket(`${WEBSOCKET_URL}&userId=${passenger.user._id}`);

    if (rideStarted) {
      console.log("Driver ended ride");

      ws.onopen = () => {
        console.log("Connected passenger to WebSocket server");
        ws.send(
          JSON.stringify({
            user: passenger.user._id,
            navigate: true,
          })
        );
      };
      axios.patch(
        `${BASE_URL}/trip/update-trip/${tripId}`,
        {
          status: "completed",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigation.navigate("RateUser", {
        user: passenger,
        type: "passenger",
      });
      // Logic for ending the ride
    } else {
      console.log("Driver started ride");
      ws.onopen = () => {
        console.log("Connected passenger to WebSocket server 2");
        ws.send(
          JSON.stringify({
            user: passenger.user._id,
            toast: true,
          })
        );
      };
      setRideStarted(true);

      axios
        .post(
          `${BASE_URL}/trip/start-trip`,
          {
            driverId: driver.user._id,
            passengerId: passenger.user._id,
            driverLocation: driver.origin.location,
            passengerLocation: passenger.origin.location,
            driverDestination: driver.destination.location,
            passengerDestination: passenger.destination.location,
            distanceApart: calculateDistance(
              driver.origin.location.lat,
              driver.origin.location.lng,
              passenger.origin.location.lat,
              passenger.origin.location.lng
            ),
            timeElapsed: timer,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            setTripId(response.data.data._id.toString());
          } else {
            console.log(response);
          }
        });
      // .catch((error) => {
      //   console.log(error);
      //   setLoading(false);
      //   if (error.response) {
      //     // The request was made and the server responded with a status code
      //     // that falls out of the range of 2xx
      //     console.error(
      //       "Server responded with error status:",
      //       error.response.status
      //     );
      //     console.error("Error message:", error.response.data);
      //     Toast.show({
      //       type: "error",
      //       position: "top",
      //       text1: error.response.data.errors[0],
      //       visibilityTime: 3000,
      //       autoHide: true,
      //     });
      //   } else if (error.request) {
      //     // The request was made but no response was received
      //     console.error(
      //       "Request made but no response received:",
      //       error.request
      //     );
      //     Toast.show({
      //       type: "error",
      //       position: "top",
      //       text1: "Something went wrong. please try again later.",
      //       visibilityTime: 3000,
      //       autoHide: true,
      //     });
      //   } else {
      //     // Something happened in setting up the request that triggered an Error
      //     console.error("Error setting up request:", error.message);
      //     Toast.show({
      //       type: "error",
      //       position: "top",
      //       text1: "Something went wrong. please try again later.",
      //       visibilityTime: 3000,
      //       autoHide: true,
      //     });
      //   }
      // });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Paired!</Text>

        <View style={styles.passengerInfoContainer}>
          <View style={styles.avatarContainer}>
            {passenger.user.avatar ? (
              <Image
                style={styles.avatar}
                source={{
                  uri: `data:image/jpeg;base64,${passenger.user.avatar}`,
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
          </View>

          <View style={styles.travelTimeContainer}>
            <Text style={styles.label}>Travel time</Text>
            <Text style={styles.travelTime}>
              {passenger?.travelTimeInformation?.duration?.text}
            </Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationInfo}>
            <Text style={styles.label}>Pick-up point</Text>
            <Text style={styles.locationText}>
              {passenger?.origin?.description}
            </Text>
            <Text style={styles.label}>Drop-off point</Text>
            <Text style={styles.locationText}>
              {passenger?.destination?.description}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.phoneIconContainer}
            onPress={() => Linking.openURL(`tel:${passenger.user.phoneNumber}`)}
          >
            <Icon name="phone" type="font-awesome" color="#000" size={30} />
          </TouchableOpacity>
        </View>

        <View style={styles.pinCodeContainer}>
          <Text style={styles.label}>Pin code for this ride</Text>
          <View style={styles.digitsContainer}>
            {digits.map((digit, index) => (
              <DigitBox key={index} digit={digit} />
            ))}
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Icon name="star" type="font-awesome" color="#000" size={30} />
          <Text style={styles.ratingText}>
            {passenger.user?.rating.toFixed(2)}
          </Text>
        </View>

        <View style={styles.passengerNameContainer}>
          <Text style={styles.passengerName}>
            {passenger?.user.firstname} {passenger?.user.lastname} -{" "}
            {passenger?.user.userType} Passenger
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>

        <TouchableOpacity
          style={styles.startRideButton}
          onPress={handleStartEndRide}
        >
          <Text style={styles.startRideButtonText}>
            {rideStarted ? "End Ride" : "Start Ride"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FoundPassengerCard;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  passengerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    flex: 3,
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  travelTimeContainer: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  travelTime: {
    backgroundColor: "black",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    borderRadius: 8,
  },
  locationContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  locationInfo: {
    flex: 3,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  phoneIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pinCodeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  digitsContainer: {
    flexDirection: "row",
  },
  digitContainer: {
    width: 56,
    height: 48,
    backgroundColor: "#E5E7EB",
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  digitText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingText: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  passengerNameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  passengerName: {
    fontSize: 18,
    color: "#3B82F6",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF0000",
  },
  startRideButton: {
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginVertical: 10,
  },
  startRideButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
