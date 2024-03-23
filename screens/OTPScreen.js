import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/navSlice";
import { useNavigation } from "@react-navigation/native";

const OTPScreen = ({ route }) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState(null);
  const { values } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleResendCode = () => {
    console.log("Resend code requested");
    setLoading(true);
    axios
      .post(
        `${BASE_URL}/user/auth/verify-email`,
        { email: values.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);

        if (response.data.success) {
          Toast.show({
            type: "success",
            position: "top",
            text1: response.data.message,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: "error",
            position: "top",
            text1: response.data.errors[0],
            visibilityTime: 3000,
            autoHide: true,
          });
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

  const handleSubmit = () => {
    setLoading(true);
    console.log("Verification button pressed");
    console.log(`${BASE_URL}/user/auth/verify-otp`, "code", code);
    axios
      .post(
        `${BASE_URL}/user/auth/verify-otp`,
        { email: values.email, otp: code.toString(), type: "verification" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);

        if (response.data.success) {
          axios
            .post(`${BASE_URL}/user/auth/register`, values, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              setLoading(false);

              if (response.data.success) {
                dispatch(
                  setUser({
                    token: response.data.data.token,
                  })
                );

                Toast.show({
                  type: "success",
                  position: "top",
                  text1: response.data.message,
                  visibilityTime: 3000,
                  autoHide: true,
                });
                navigation.navigate("Login");
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
        } else {
          Toast.show({
            type: "error",
            position: "top",
            text1: response.data.errors[0],
            visibilityTime: 3000,
            autoHide: true,
          });
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
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.logoText}>Slyft</Text>
      </View>
      <OTPInputView
        style={styles.otpInput}
        pinCount={6}
        autoFocusOnLoad
        codeInputFieldStyle={styles.codeInputField}
        codeInputHighlightStyle={styles.codeInputHighlight}
        onCodeFilled={(code) => {
          console.log(`Code is ${code}, you are good to go!`);
          setCode(code);
        }}
      />
      <TouchableOpacity
        style={tw`bg-gray-800 p-4 rounded-md w-96 mb-4`}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw`text-white text-center font-bold text-lg`}>
            Verify
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-gray-300 p-4 rounded-md w-96`}
        onPress={handleResendCode}
        disabled={loading}
      >
        <Text style={tw`text-black text-center font-bold text-lg`}>
          Resend Code
        </Text>
      </TouchableOpacity>
      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  logoText: {
    height: 100,
    fontSize: 60,
    fontWeight: "bold",
    color: "#000",
  },
  otpInput: {
    width: "90%",
    height: 400,
  },
  codeInputField: {
    width: 40,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "#000",
  },
  codeInputHighlight: {
    borderColor: "#000",
  },
});
