import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { BASE_URL } from "@env";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/navSlice";

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={tw`flex-1 justify-center items-center p-4 bg-white`}
    >
      <View>
        <Text
          style={{
            height: 100,
            //fontFamily: "ProximaNova-Bold", // Adjust based on the actual font file and variant you have
            fontSize: 60,
            fontWeight: "bold",
            color: "#000", // Set your desired color
          }}
        >
          Slyft
        </Text>
      </View>

      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email("Invalid email")
            .test(
              "unilagEmail",
              "Enter your student or staff email address",
              function (value) {
                // Check if the email ends with either "@live.unilag.edu.ng" or "@unilag.edu.ng"
                if (value.endsWith("@live.unilag.edu.ng")) {
                  // Check if the matric number has 9 digits
                  const matricNumber = value.split("@")[0]; // Extract the matric number
                  return matricNumber.length === 9;
                }
                return value.endsWith("@unilag.edu.ng");
              }
            )
            .required("Email is required"),
        })}
        onSubmit={(values) => {
          setLoading(true);
          // Perform Forgot password logic here
          console.log("Submit pressed with:", values);
          axios
            .post(`${BASE_URL}/user/auth/forgot-password`, values, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              setLoading(false);

              if (response.data.success) {
                dispatch(
                  setUser({
                    email: values.email,
                  })
                );
                Toast.show({
                  type: "success",
                  position: "top",
                  text1: `An otp has been sent to ${values.email}. Use this otp to reset your password`,
                  visibilityTime: 3000,
                  autoHide: true,
                });
                setTimeout(() => {
                  navigation.navigate("ResetPassword");
                }, 2000);
              } else {
                console.log(response);
              }
            })
            .catch((error) => {
              setLoading(false);
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(
                  "Server responded with error status:",
                  error.response.status
                );
                console.error("Error message:", error.response.data);
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: error.response.data.errors[0],
                  visibilityTime: 3000,
                  autoHide: true,
                });
              } else if (error.request) {
                // The request was made but no response was received
                console.error(
                  "Request made but no response received:",
                  error.request
                );
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "Something went wrong. please try again later.",
                  visibilityTime: 3000,
                  autoHide: true,
                });
              } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up request:", error.message);
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "Something went wrong. please try again later.",
                  visibilityTime: 3000,
                  autoHide: true,
                });
              }
            });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={tw`w-full mb-6`}>
              <TextInput
                style={tw`h-12 bg-gray-100 rounded-md px-4`}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={tw`text-red-500 mt-2`}>{errors.email}</Text>
              )}
            </View>

            <TouchableOpacity
              style={tw`bg-gray-800 p-4 rounded-md w-full mb-14`}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={tw`text-white text-center font-bold text-lg`}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={tw`text-gray-500`}>
                Already have an account? Log in
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
