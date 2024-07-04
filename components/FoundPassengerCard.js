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

const DigitBox = ({ digit }) => {
  return (
    <View style={styles.digitContainer}>
      <Text style={styles.digitText}>{digit}</Text>
    </View>
  );
};

const FoundPassengerCard = ({ route }) => {
  const navigation = useNavigation();
  const { passenger, pin } = route.params;
  const digits = pin.toString().split("").map(Number) || [];
  const [rideStarted, setRideStarted] = useState(false);
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
    const ws = new WebSocket(
      `wss://free.blr2.piesocket.com/v3/1?api_key=dKA1PcoBPSDNAVPH8sUOpn6LTHEaArJjWJomLZ9U&notify_self=1&userId=${passenger.user._id}`
    );

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
              {passenger.travelTimeInformation.duration.text}
            </Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationInfo}>
            <Text style={styles.label}>Pick-up point</Text>
            <Text style={styles.locationText}>
              {passenger.origin.description}
            </Text>
            <Text style={styles.label}>Drop-off point</Text>
            <Text style={styles.locationText}>
              {passenger.destination.description}
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
