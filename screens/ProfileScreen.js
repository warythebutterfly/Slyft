import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { BASE_URL, GOOGLE_MAPS_APIKEY } from "@env";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../slices/navSlice";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const ProfileScreen = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [image, setImage] = useState(null);
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    phoneNumber: "",
    gender: "",
    country: "",
    homeAddress: {
      address: "",
      latitude: null,
      longitude: null,
    },
    distanceThreshold: "",
    driverLicense: {
      licenseNumber: "",
      licenseExpiryDate: "",
      licenseState: "",
    },
    vehicle: {
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      vehicleColor: "",
      licensePlate: "",
      vehicleRegistrationExpiry: "",
    },
    insurance: {
      insuranceCompany: "",
      insurancePolicyNumber: "",
      insuranceExpiryDate: "",
    },
    availability: {
      days: [],
      availableTimeStart: "",
      availableTimeEnd: "",
    },
    avatar: "",
  });

  const [errors, setErrors] = useState({});
  const [addressText, setAddressText] = useState("");

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
          response.data.data.dateOfBirth =
            response.data.data.dateOfBirth?.split("T")[0];
          response.data.data.driverLicense = {
            ...response.data.data.driverLicense,
            licenseExpiryDate:
              response.data.data.driverLicense?.licenseExpiryDate?.split(
                "T"
              )[0],
          };

          setProfile({ ...profile, ...response.data.data });
          dispatch(setUser({ ...user, ...profile, ...response.data.data }));
          setSpinner(false);
        } else {
          setProfile({ ...profile });
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

    setAddressText(profile.homeAddress.address);
  }, []);

  const handleInputChange = (name, value) => {
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleNestedInputChange = (category, name, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [category]: {
        ...prevProfile[category],
        [name]: value,
      },
    }));
  };

  const handleAddressChange = (address, details) => {
    setAddressText(address);
    setProfile((prevProfile) => ({
      ...prevProfile,
      homeAddress: {
        address: address,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      },
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Validate date format for dateOfBirth and licenseExpiryDate
    if (profile.dateOfBirth && !isValidDateFormat(profile.dateOfBirth)) {
      newErrors.dateOfBirth = "Invalid date format (YYYY-MM-DD)";
    }

    if (
      profile.driverLicense.licenseExpiryDate &&
      !isValidDateFormat(profile.driverLicense.licenseExpiryDate)
    ) {
      newErrors.licenseExpiryDate = "Invalid date format (YYYY-MM-DD)";
    }

    // Validate phone number format
    if (profile.phoneNumber && !isValidPhoneNumber(profile.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidDateFormat = (dateString) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return /^(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}$/.test(
      phoneNumber
    );
  };

  const handleUpdateProfile = async () => {
    if (!validate()) {
      Alert.alert("Validation Failed", JSON.stringify(errors));
      return;
    }

    try {
      setLoading(true);

      profile.distanceThreshold = parseFloat(profile.distanceThreshold);

      const response = await axios.put(
        `${BASE_URL}/user/${profile._id}`, // Replace with the actual user ID
        profile
      );

      if (response.data.success) {
        dispatch(setUser({ ...user, ...response.data.data }));
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.05, // Reduce quality to compress the image
      base64: true,
    });

    if (!result.canceled) {
      // Compress the image
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }], // Resize image to reduce size
        {
          compress: 0.05,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      setImage(manipResult.uri);
      handleInputChange("avatar", manipResult.base64);
    }
  };

  const renderItem = ({ item }) => (
    <View style={tw`mb-4 mx-3`}>
      <Text style={tw`text-lg font-bold mb-2`}>{item.title}</Text>
      {item.content}
    </View>
  );

  const formFields = [
    {
      title: "",
      content: (
        <View style={tw`items-center w-full mb-6`}>
          {spinner ? (
            <ActivityIndicator
              size="large"
              color="#000"
              style={tw`w-24 h-24 rounded-full mb-4`}
            />
          ) : (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${profile.avatar}`,
              }}
              style={tw`w-24 h-24 rounded-full mb-4`}
            />
          )}
          <TouchableOpacity
            onPress={pickImage}
            style={tw`bg-gray-200 p-2 rounded-md`}
          >
            <Text style={tw`text-center`}>Upload Profile Picture</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      title: "First Name",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="First Name"
          value={profile.firstname}
          onChangeText={(value) => handleInputChange("firstname", value)}
        />
      ),
    },
    {
      title: "Last Name",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Last Name"
          value={profile.lastname}
          onChangeText={(value) => handleInputChange("lastname", value)}
        />
      ),
    },
    {
      title: "Date of Birth",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={profile.dateOfBirth}
          onChangeText={(value) => handleInputChange("dateOfBirth", value)}
        />
      ),
    },
    {
      title: "Phone Number",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Phone Number"
          value={profile.phoneNumber}
          onChangeText={(value) => handleInputChange("phoneNumber", value)}
        />
      ),
    },
    {
      title: "Gender",
      content: (
        <RNPickerSelect
          style={{
            inputIOS: tw`h-12 bg-gray-100 rounded-md px-4`,
            inputAndroid: tw`h-12 bg-gray-100 rounded-md px-4`,
          }}
          placeholder={{ label: "Select Gender", value: null }}
          value={profile.gender}
          onValueChange={(value) => handleInputChange("gender", value)}
          items={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
          ]}
        />
      ),
    },
    // {
    //   title: "Country",
    //   content: (
    //     <TextInput
    //       style={tw`border p-2`}
    //       placeholder="Country"
    //       value={profile.country}
    //       onChangeText={(value) => handleInputChange("country", value)}
    //     />
    //   ),
    // },
    // {
    //   title: "Home Address",
    //   content: (
    //     <GooglePlacesAutocomplete
    //       placeholder="Enter Address"
    //       fetchDetails={true}
    //       onPress={(data, details = null) => {
    //         handleAddressChange(data.description, details);
    //       }}
    //       query={{
    //         key: GOOGLE_MAPS_APIKEY,
    //         language: "en",
    //       }}
    //       textInputProps={{
    //         value: addressText,
    //         onChangeText: (text) => setAddressText(text),
    //         placeholderTextColor: "#999",
    //       }}
    //       styles={{
    //         textInput: tw`border p-2`,
    //         container: { flex: 0 },
    //       }}
    //     />
    //   ),
    // },
    {
      title: "Distance Threshold (km)",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Distance Threshold (km)"
          value={profile.distanceThreshold.toString()}
          onChangeText={(value) =>
            handleInputChange("distanceThreshold", value)
          }
          keyboardType="numeric"
        />
      ),
    },
    {
      title: "Driver License Number",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Driver License Number"
          value={profile.driverLicense.licenseNumber}
          onChangeText={(value) =>
            handleNestedInputChange("driverLicense", "licenseNumber", value)
          }
        />
      ),
    },
    {
      title: "Driver License Expiry Date",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Driver License Expiry Date (YYYY-MM-DD)"
          value={profile.driverLicense.licenseExpiryDate}
          onChangeText={(value) =>
            handleNestedInputChange("driverLicense", "licenseExpiryDate", value)
          }
        />
      ),
    },
    {
      title: "Driver License State",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Driver License State"
          value={profile.driverLicense.licenseState}
          onChangeText={(value) =>
            handleNestedInputChange("driverLicense", "licenseState", value)
          }
        />
      ),
    },
    {
      title: "Vehicle Make",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Vehicle Make"
          value={profile.vehicle.vehicleMake}
          onChangeText={(value) =>
            handleNestedInputChange("vehicle", "vehicleMake", value)
          }
        />
      ),
    },
    {
      title: "Vehicle Model",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Vehicle Model"
          value={profile.vehicle.vehicleModel}
          onChangeText={(value) =>
            handleNestedInputChange("vehicle", "vehicleModel", value)
          }
        />
      ),
    },
    {
      title: "Vehicle Year",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Vehicle Year"
          value={profile.vehicle.vehicleYear}
          onChangeText={(value) =>
            handleNestedInputChange("vehicle", "vehicleYear", value)
          }
        />
      ),
    },
    {
      title: "Vehicle Color",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Vehicle Color"
          value={profile.vehicle.vehicleColor}
          onChangeText={(value) =>
            handleNestedInputChange("vehicle", "vehicleColor", value)
          }
        />
      ),
    },
    {
      title: "Vehicle License Plate",
      content: (
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="License Plate"
          value={profile.vehicle.licensePlate}
          onChangeText={(value) =>
            handleNestedInputChange("vehicle", "licensePlate", value)
          }
        />
      ),
    },
    // {
    //   title: "Vehicle Registration Expiry Date",
    //   content: (
    //     <TextInput
    //       style={tw`h-12 bg-gray-100 rounded-md px-4`}
    //       placeholder="Vehicle Registration Expiry Date (YYYY-MM-DD)"
    //       value={profile.vehicle.vehicleRegistrationExpiry}
    //       onChangeText={(value) =>
    //         handleNestedInputChange(
    //           "vehicle",
    //           "vehicleRegistrationExpiry",
    //           value
    //         )
    //       }
    //     />
    //   ),
    // },
    // {
    //   title: "Insurance Company",
    //   content: (
    //     <TextInput
    //       style={tw`border p-2`}
    //       placeholder="Insurance Company"
    //       value={profile.insurance.insuranceCompany}
    //       onChangeText={(value) =>
    //         handleNestedInputChange("insurance", "insuranceCompany", value)
    //       }
    //     />
    //   ),
    // },
    // {
    //   title: "Insurance Policy Number",
    //   content: (
    //     <TextInput
    //       style={tw`border p-2`}
    //       placeholder="Insurance Policy Number"
    //       value={profile.insurance.insurancePolicyNumber}
    //       onChangeText={(value) =>
    //         handleNestedInputChange("insurance", "insurancePolicyNumber", value)
    //       }
    //     />
    //   ),
    // },
    // {
    //   title: "Insurance Expiry Date",
    //   content: (
    //     <TextInput
    //       style={tw`border p-2`}
    //       placeholder="Insurance Expiry Date (YYYY-MM-DD)"
    //       value={profile.insurance.insuranceExpiryDate}
    //       onChangeText={(value) =>
    //         handleNestedInputChange("insurance", "insuranceExpiryDate", value)
    //       }
    //     />
    //   ),
    // },
  ];

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={tw`flex-1 justify-center pt-10 bg-white`}
    >
      <FlatList
        data={formFields}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <View style={tw`mt-4 mx-3`}>
            <TouchableOpacity
              style={tw`bg-gray-800 p-4 rounded-md w-full mb-14`}
              onPress={handleUpdateProfile}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={tw`text-white text-center font-bold`}>
                  Update Profile
                </Text>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
