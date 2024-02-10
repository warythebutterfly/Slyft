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
import { useSelector } from "react-redux";
import { selectUser } from "../slices/navSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/navSlice";

const ResetPasswordScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const navigateToLogin = () => {
    // Navigation logic to Login screen
  };

  const handleResend = () => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/user/auth/forgot-password`, user, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setLoading(false);

        if (response.data.success) {
          Toast.show({
            type: "success",
            position: "top",
            text1: `An otp has been sent to ${user.email}. Use this otp to reset your password`,
            visibilityTime: 3000,
            autoHide: true,
          });
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
            fontSize: 60,
            fontWeight: "bold",
            color: "#000",
          }}
        >
          Slyft
        </Text>
      </View>

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={yup.object().shape({
          otp: yup
            .string()
            .matches(/^[0-9]{6}$/, "OTP must be a 6-digit number")
            .required("OTP is required"),
        })}
        onSubmit={(values) => {
          values.email = user.email;
          values.type = "forgot";
          setLoading(true);
          // Perform Reset password logic here
          console.log("Submit pressed with:", values);
          axios
            .post(`${BASE_URL}/user/auth/verify-otp`, values, {
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
                    otp: values.otp,
                  })
                );
                navigation.navigate("NewPassword");
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
                placeholder="OTP"
                keyboardType="numeric"
                onChangeText={handleChange("otp")}
                onBlur={handleBlur("otp")}
                value={values.otp}
              />
              {touched.otp && errors.otp && (
                <Text style={tw`text-red-500 mt-2`}>{errors.otp}</Text>
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

            <TouchableOpacity onPress={handleResend}>
              <Text style={tw`text-gray-500`}>
                Didn't recieve an OTP? Resend
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
