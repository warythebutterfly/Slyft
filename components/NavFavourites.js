import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  setDestination,
  setOrigin,
  selectOrigin,
  selectUser,
  setUser,
} from "../slices/navSlice";
import axios from "axios";
import { BASE_URL } from "@env";

const NavFavourites = ({ formik, data }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(setUser({ ...user, ...response.data.data }));
          console.log(user);
          data = [
            {
              id: "1",
              icon: "home",
              location: "Home",
              destination: user.location?.address,
              description: user.location?.address,
              geometry: {
                location: {
                  lat: user.location?.latitude,
                  lng: user.location?.longitude,
                },
              },
            },
            {
              id: "2",
              icon: "school",
              location: "School",
              destination: "University of Lagos, Lagos, Nigeria",
              description: "University of Lagos, Lagos, Nigeria",
              geometry: { location: { lat: 6.515759, lng: 3.3898447 } },
            },
          ];
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(
            "Server responded with error status:",
            error.response.status
          );
          console.error("Error message:", error.response.data);
          navigation.navigate("Login");
        } else if (error.request) {
          // The request was made but no response was received
          console.error(
            "Request made but no response received:",
            error.request
          );
          navigation.navigate("Login");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
          navigation.navigate("Login");
        }
      });
  }, []);
  const origin = useSelector(selectOrigin);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => {
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />;
      }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={tw`flex-row items-center p-5`}
          onPress={() => {
            console.log(item.description);
            if (item.description) {
              formik.setFieldValue("location", item.description);
              dispatch(
                setOrigin({
                  location: item.geometry.location,
                  description: item.description,
                })
              );
            }

            if (origin)
              dispatch(
                setDestination({
                  location: item.geometry.location,
                  description: item.description,
                })
              );
          }}
        >
          <Icon
            style={tw`mr-4 rounded-full bg-gray-300 p-3`}
            type="material"
            color="white"
            name={item.icon}
            size={18}
          />
          <View>
            <Text style={tw`text-lg font-semibold`}>{item.location}</Text>
            <Text style={tw`text-gray-500`}>{item.destination}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default NavFavourites;

const styles = StyleSheet.create({});
