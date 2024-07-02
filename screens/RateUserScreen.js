import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "@env";

const RateUserScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user, type } = route.params;
  const [rating, setRating] = useState(0);

  const handleRatingPress = (value) => {
    setRating(value);
  };

  const handleSubmitRating = () => {
    // Logic to submit the rating to the server
    console.log("Rating submitted:", rating);
    //TODO endpoint to update user rating
    axios
      .patch(`${BASE_URL}/user/rating/${user.user._id}`, {
        rating,
      })
      .then((response) => {
        if (response.data.success) {
          navigation.navigate("Home");
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
          navigation.navigate("Home");
        } else if (error.request) {
          console.error(
            "Request made but no response received:",
            error.request
          );
          navigation.navigate("Home");
        } else {
          console.error("Error setting up request:", error.message);
          navigation.navigate("Home");
        }
      });
  };

  return (
    <View style={styles.container}>
      {type === "passenger" ? (
        <Text style={styles.title}>Rate Your Passenger</Text>
      ) : (
        <Text style={styles.title}>Rate Your Driver</Text>
      )}
      <Text style={styles.passengerName}>
        {user?.user.firstname} {user?.user.lastname}
      </Text>

      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => handleRatingPress(value)}
          >
            <Icon
              name="star"
              type="font-awesome"
              color={value <= rating ? "#FFD700" : "#E5E7EB"}
              size={40}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitRating}
      >
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RateUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  passengerName: {
    fontSize: 20,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
