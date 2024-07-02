import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import tw from "tailwind-react-native-classnames";
import Toast from "react-native-toast-message";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/navSlice";
import axios from "axios";
import { BASE_URL } from "@env";

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

const PassengerOptionsCard = ({ route }) => {
  const { matches, rideInformation } = route.params;
  console.log(matches[0].passengers);

  useEffect(() => {
    //find more passengers
  }, []);

  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const [selected, setSelected] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [cardOptionsDisabled, setCardOptionsDisabled] = useState(false);

  const handleChooseOption = (passenger) => {
    setButtonDisabled(true);
    setCardOptionsDisabled(true);
    const match = { driver: matches[0].driver, passenger };

    axios
      .post(
        `${BASE_URL}/ride/accept`,
        {
          driverId: matches[0].driver.user._id,
          passengerId: passenger.user._id,
          match,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          navigation.navigate("FoundPassengerCard", {
            parentRoute: "PassengerOptionsCard",
            passenger,
            pin: response.data.data.pin,
          });
        } else {
          console.log(
            "-----------------------------------------------ERROR--------------------------------------------"
          );
          console.log(response);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(
            "Server responded with error status:",
            error.response.status
          );
          console.error("Error message:", error.response.data);
          navigation.navigate("PassengerOptionsCard", {
            parentRoute: "FinderCard",
            rideInformation,
            matches,
          });
        } else if (error.request) {
          console.error(
            "Request made but no response received:",
            error.request
          );
          navigation.navigate("PassengerOptionsCard", {
            parentRoute: "FinderCard",
            rideInformation,
            matches,
          });
        } else {
          console.error("Error setting up request:", error.message);
          navigation.navigate("PassengerOptionsCard", {
            parentRoute: "FinderCard",
            rideInformation,
            matches,
          });
        }
      });
  };

  return (
    <>
      <View>
        <TouchableOpacity
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
          onPress={() => navigation.navigate("FinderCard")}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>

        <Text style={tw`text-center text-xl py-5`}>Select your passenger</Text>
      </View>
      <FlatList
        style={tw`h-40`}
        data={matches[0].passengers}
        keyExtractor={(item) => item.user._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelected(item);
              setButtonDisabled(false);
            }}
            style={tw`flex-row justify-between items-center pl-4 pr-2 py-4 ${
              item.user._id === selected?.user._id &&
              "m-2 bg-gray-200 border-2 rounded-lg"
            }`}
          >
            {item.user.avatar ? (
              <Image
                style={styles.avatar}
                source={{ uri: `data:image/jpeg;base64,${item.user.avatar}` }}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="user" type="font-awesome" size={24} color="#ccc" />
              </View>
            )}
            <View style={tw`flex-1 ml-4`}>
              <Text style={tw`text-xl font-semibold`}>
                {item.user.firstname} {item.user.lastname} ({item.user.gender}{" "}
                {item.user.userType})
              </Text>
              <Text>Location: {item.origin.description}</Text>
              <Text>Destination: {item.destination.description}</Text>
              <Text>
                You are{" "}
                {calculateDistance(
                  matches[0].driver.origin.location.lat,
                  matches[0].driver.origin.location.lng,
                  item.origin.location.lat,
                  item.origin.location.lng
                ).toFixed(2)}{" "}
                km apart
              </Text>
            </View>
            <View style={tw`flex items-center`}>
              <View style={styles.ratingContainer}>
                <Icon
                  name="star"
                  type="font-awesome"
                  color="#FFD700"
                  size={10}
                />
                <Text style={styles.ratingText}>
                  {item.user.rating?.toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={tw`mt-auto border-t border-gray-200`}>
        <TouchableOpacity
          disabled={!selected}
          style={tw`bg-black py-3 m-3 rounded-md h-14 justify-center ${
            (!selected || buttonDisabled) && "bg-gray-300"
          }`}
          onPress={() => handleChooseOption(selected)}
        >
          <Text style={tw`text-center text-white text-xl`}>
            Pick {selected?.user.firstname}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PassengerOptionsCard;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: "#FFD700", // Golden color to match the star
    fontWeight: "bold",
    fontSize: 16,
  },
});
