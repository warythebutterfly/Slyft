import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import React, { useEffect } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import NavFavourites from "./NavFavourites";
import axios from "axios";
import { BASE_URL } from "@env";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/navSlice";
import { setUser } from "../slices/navSlice";

const validationSchema = Yup.object().shape({
  location: Yup.string().required("Destination is required"),
});

//TODO: get actual lat and long from user
const homePlace = {
  description: "Home",
  geometry: { location: { lat: 6.5288565, lng: 3.3809722 } },
};
const workPlace = {
  description: "School",
  geometry: { location: { lat: 6.515759, lng: 3.3898447 } },
};

const NavigateCard = () => {
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
  const navigation = useNavigation();
  const formik = useFormik({
    initialValues: {
      destination: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log("Form submitted with values:", values);
      // Dispatch actions or perform other logic as needed
    },
  });
  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* TODO: Replace name after logging in */}
      <Text style={tw`text-center py-5 text-xl`}>
        Good morning, {user.firstname}
      </Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}>
        <GooglePlacesAutocomplete
          placeholder="Where to?"
          styles={toInputBoxStyles}
          onPress={(data, details = null) => {
            formik.setFieldValue("location", data.description);
            dispatch(
              setDestination({
                location: details.geometry.location,
                description: data.description,
              })
            );
            //TODO: This should navigate if only form is valid
            navigation.navigate("RideOptionsCard");
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          listViewDisplayed="auto"
          enablePoweredByContainer={false}
          minLength={2}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
            components: "country:NG",
          }}
          textInputProps={{
            clearButtonMode: "never",
            ref: (input) => {
              this.textInput = input;
            },
          }}
          renderRightButton={() => (
            <TouchableOpacity
              style={toInputBoxStyles.clearButton}
              onPress={() => {
                this.textInput?.clear();
                // Handle the clear button press
                formik.setFieldValue("location", "");
                dispatch(setDestination(null));
              }}
            >
              <Icon
                name="clear"
                size={10}
                style={tw`p-1 bg-gray-200 rounded-full mt-3`}
                color="#fff"
              />
            </TouchableOpacity>
          )}
          nearbyPlacesAPI="GooglePlacesSearch"
          // predefinedPlaces={[homePlace, workPlace]}
          debounce={200}
          value={formik.values.location}
          onChangeText={(text) => {
            console.log("text", text);
            this.textInput = text;
            formik.setFieldValue("location", text);
          }}
          onBlur={formik.handleBlur("location")}
        />
        {formik.touched.location && formik.errors.location && (
          <Text style={tw`text-red-500 mt-2 pl-2 mb-2`}>
            {formik.errors.location}
          </Text>
        )}
        <NavFavourites formik={formik} />
      </View>

      {/* TODO: Cant click on this unless you have destination setup */}
      <View
        style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("RideOptionsCard")}
          style={tw`flex flex-row justify-between bg-black w-24 px-4 py-3 rounded-full`}
        >
          <Icon name="car" type="font-awesome" color="white" size={16} />
          <Text style={tw`text-white text-center`}>Rides</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("RideOptionsCard")}
          style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}
        >
          <Icon name="car" type="font-awesome" color="black" size={16} />
          <Text style={tw`text-center`}>Rides</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("RideOptionsCard")}
          style={tw`flex flex-row justify-between bg-black w-24 px-4 py-3 rounded-full`}
        >
          <Icon name="car" type="font-awesome" color="white" size={16} />
          <Text style={tw`text-white text-center`}>Rides</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    backgroundColor: "rgb(209 213 219)",
    borderRadius: 0,
    fontSize: 18,
    position: "relative",
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  clearButton: {
    paddingHorizontal: 2,
    position: "absolute",
    right: 25,
  },
});
