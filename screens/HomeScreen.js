import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "react-native-elements";
import NavFavourites from "../components/NavFavourites";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/navSlice";

const validationSchema = Yup.object().shape({
  location: Yup.string().required("Location is required"),
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

const HomeScreen = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      location: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log("Form submitted with values:");
      //, values);
      // Dispatch actions or perform other logic as needed
    },
  });

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <View>
          <Text
            style={{
              height: 100,
              //   fontFamily: "ProximaNova-Bold", // Adjust based on the actual font file and variant you have
              fontSize: 60,
              fontWeight: "bold",
              color: "#000", // Set your desired color
            }}
          >
            Slyft
          </Text>
        </View>

        <GooglePlacesAutocomplete
          placeholder="Where From?"
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
            },
          }}
          onPress={(data, details = null) => {
            formik.setFieldValue("location", data.description);
            // console.log("location", details.geometry.location);
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );
            dispatch(setDestination(null));
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
              style={styles.clearButton}
              onPress={() => {
                this.textInput?.clear();
                // Handle the clear button press
                formik.setFieldValue("location", "");
                dispatch(setOrigin(null));
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
          //predefinedPlaces={[homePlace, workPlace]}
          debounce={200}
          value={formik.values.location}
          onChangeText={(text) => {
            // console.log("text", text);
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
        <NavOptions formik={formik} />
        <NavFavourites formik={formik} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
