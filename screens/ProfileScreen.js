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
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { BASE_URL, GOOGLE_MAPS_APIKEY } from "@env";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../slices/navSlice";

const ProfileScreen = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

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
            response.data.data.dateOfBirth.split("T")[0];
          response.data.data.driverLicense.licenseExpiryDate =
            response.data.data.driverLicense.licenseExpiryDate.split("T")[0];
          setProfile({ ...profile, ...response.data.data });
        } else {
          setProfile({ ...profile });
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
    console.log("im here");
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

    // // Validate phone number format
    if (profile.phoneNumber && !isValidPhoneNumber(profile.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidDateFormat = (dateString) => {
    // Regular expression to validate date format YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    // Regular expression to validate phone number format
    return /^(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}$/.test(
      phoneNumber
    );
  };

  const handleUpdateProfile = async () => {
    if (!validate()) {
      Alert.alert("Validation Failed");
      return;
    }

    try {
      setLoading(true);
      console.log(profile);
      const response = await axios.put(
        `${BASE_URL}/user/${profile._id}`, // Replace with the actual user ID
        profile,
        {
          headers: {
            "Content-Type": "application/json",
            // Replace with the actual authorization token if needed
            Authorization: `Bearer ${user.token}`,
          },
        }
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

  const renderItem = ({ item }) => (
    <View style={tw`mb-4`}>
      <Text style={tw`text-lg font-bold mb-2`}>{item.title}</Text>
      {item.content}
    </View>
  );

  const formFields = [
    {
      title: "First Name",
      content: (
        <TextInput
          style={tw`border p-2`}
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
          style={tw`border p-2`}
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
          style={tw`border p-2`}
          placeholder="Date of Birth"
          value={profile.dateOfBirth}
          onChangeText={(value) => handleInputChange("dateOfBirth", value)}
        />
      ),
    },
    {
      title: "Phone Number",
      content: (
        <TextInput
          style={tw`border p-2`}
          placeholder="Phone Number"
          value={profile.phoneNumber}
          onChangeText={(value) => handleInputChange("phoneNumber", value)}
        />
      ),
    },
    {
      title: "Home Address",
      content: (
        <GooglePlacesAutocomplete
          placeholder="Enter Address"
          styles={{
            container: { flex: 0 },
            textInput: {
              fontSize: 18,
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 10,
              marginVertical: 5,
            },
          }}
          fetchDetails={true}
          onPress={(data, details = null) =>
            handleAddressChange(data.description, details)
          }
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
            components: "country:NG",
          }}
          textInputProps={{ clearButtonMode: "never" }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={200}
        />
      ),
    },
    {
      title: "Gender",
      content: (
        <TextInput
          style={tw`border p-2`}
          placeholder="Gender"
          value={profile.gender}
          onChangeText={(value) => handleInputChange("gender", value)}
        />
      ),
    },
    {
      title: "Country",
      content: (
        <TextInput
          style={tw`border p-2`}
          placeholder="Country"
          value={profile.country}
          onChangeText={(value) => handleInputChange("country", value)}
        />
      ),
    },
    {
      title: "Driver License",
      content: (
        <View>
          <TextInput
            style={tw`border p-2 mb-4`}
            placeholder="License Number"
            value={profile.driverLicense.licenseNumber}
            onChangeText={(value) =>
              handleNestedInputChange("driverLicense", "licenseNumber", value)
            }
          />
          <TextInput
            style={tw`border p-2 mb-4`}
            placeholder="License Expiry Date"
            value={profile.driverLicense.licenseExpiryDate}
            onChangeText={(value) =>
              handleNestedInputChange(
                "driverLicense",
                "licenseExpiryDate",
                value
              )
            }
          />
          <TextInput
            style={tw`border p-2`}
            placeholder="License State"
            value={profile.driverLicense.licenseState}
            onChangeText={(value) =>
              handleNestedInputChange("driverLicense", "licenseState", value)
            }
          />
        </View>
      ),
    },
    {
      title: "Vehicle",
      content: (
        <View>
          <TextInput
            style={tw`border p-2 mb-4`}
            placeholder="Vehicle Make"
            value={profile.vehicle.vehicleMake}
            onChangeText={(value) =>
              handleNestedInputChange("vehicle", "vehicleMake", value)
            }
          />
          <TextInput
            style={tw`border p-2 mb-4`}
            placeholder="Vehicle Model"
            value={profile.vehicle.vehicleModel}
            onChangeText={(value) =>
              handleNestedInputChange("vehicle", "vehicleModel", value)
            }
          />
          <TextInput
            style={tw`border p-2 mb-4`}
            placeholder="Vehicle Year"
            value={profile.vehicle.vehicleYear}
            onChangeText={(value) =>
              handleNestedInputChange("vehicle", "vehicleYear", value)
            }
          />
          <TextInput
            style={tw`border p-2 mb-4`}
            placeholder="Vehicle Color"
            value={profile.vehicle.vehicleColor}
            onChangeText={(value) =>
              handleNestedInputChange("vehicle", "vehicleColor", value)
            }
          />
          <TextInput
            style={tw`border p-2 mb-4`}
            placeholder="License Plate"
            value={profile.vehicle.licensePlate}
            onChangeText={(value) =>
              handleNestedInputChange("vehicle", "licensePlate", value)
            }
          />
          {/* <TextInput
            style={tw`border p-2`}
            placeholder="Vehicle Registration Expiry"
            value={profile.vehicle.vehicleRegistrationExpiry}
            onChangeText={(value) =>
              handleNestedInputChange(
                "vehicle",
                "vehicleRegistrationExpiry",
                value
              )
            }
          /> */}
        </View>
      ),
    },
    // {
    //   title: "Insurance",
    //   content: (
    //     <View>
    //       <TextInput
    //         style={tw`border p-2 mb-4`}
    //         placeholder="Insurance Company"
    //         value={profile.insurance.insuranceCompany}
    //         onChangeText={(value) =>
    //           handleNestedInputChange("insurance", "insuranceCompany", value)
    //         }
    //       />
    //       <TextInput
    //         style={tw`border p-2 mb-4`}
    //         placeholder="Insurance Policy Number"
    //         value={profile.insurance.insurancePolicyNumber}
    //         onChangeText={(value) =>
    //           handleNestedInputChange(
    //             "insurance",
    //             "insurancePolicyNumber",
    //             value
    //           )
    //         }
    //       />
    //       <TextInput
    //         style={tw`border p-2`}
    //         placeholder="Insurance Expiry Date"
    //         value={profile.insurance.insuranceExpiryDate}
    //         onChangeText={(value) =>
    //           handleNestedInputChange("insurance", "insuranceExpiryDate", value)
    //         }
    //       />
    //     </View>
    //   ),
    // },
  ];

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <FlatList
        data={formFields}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={tw`p-4`}
        ListHeaderComponent={
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-lg font-bold`}>Edit Profile</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon type="antdesign" name="close" />
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={tw`bg-gray-800 p-4 rounded-md w-full mb-14`}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={tw`text-white text-center font-bold text-lg`}>
                Update Profile
              </Text>
            )}
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
