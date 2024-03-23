import React, { useState, useEffect } from "react";
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
import { selectUser } from "../slices/navSlice";
import { useSelector } from "react-redux";

const LoginScreen = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const navigateToSignUp = () => {
    navigation.navigate("SignUp");
  };
  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket("wss://socketsbay.com/wss/v2/1/demo/");
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        //console.log("Received message:", message.user);
        // ws.send(
        //   JSON.stringify({
        //     user: "552975295sfg",
        //   })
        // );
        if (user._id.toString() === message.user.toString())
          setMessages((prevMessages) => [...prevMessages, message]);
      } catch (error) {
        // console.log("definitely not for me");
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  // const sendMessage = async (message, userId) => {
  //   console.log("got heereeee");
  //   if (message.trim() !== "") {
  //     // Send the message to the WebSocket server
  //     const messageObject = { user: userId, message };
  //     console.log("messageObject", messageObject);
  //     ws.send("yosiiiiiiiiiiiiiiiiiiiiiiiiii");
  //   }
  // };

  const sendMessage = (message) => {
    if (message.trim() !== "" && socket) {
      socket.send(
        JSON.stringify({
          user: "552975295sfg",
          message: { user: "rwertweytiyrti" },
        })
      );
      //setMessage("");
    }
  };
  // const subscribe = (userId) => {
  //   if (message.trim() !== "" && socket) {
  //     socket.send(
  //       JSON.stringify({
  //         user: userId,
  //       })
  //     );
  //     //setMessage("");
  //   }
  // };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={tw`flex-1 justify-center items-center p-4 bg-white`}
    >
      <View>
        <Text
          style={{
            height: 100,
            // fontFamily: "ProximaNova-Bold", // Adjust based on the actual font file and variant you have
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
          password: "",
        }}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email("Invalid email")
            .test(
              "unilagEmail",
              "Enter a student or staff email address",
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
          password: yup.string().required("Password is required"),
        })}
        onSubmit={(values) => {
          setLoading(true);
          // Perform sign-up logic here
          console.log("Login pressed");

          axios
            .post(`${BASE_URL}/user/auth/login`, values, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              setLoading(false);

              if (response.data.success) {
                const token = response?.data.data.token;
                dispatch(
                  setUser({
                    token: response.data.data.token,
                  })
                );
                axios
                  .get(`${BASE_URL}/user/me`, {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    //console.log("dataaa", response.data);
                    dispatch(
                      setUser({ ...user, token, ...response.data.data })
                    );
                    subscribe(response.data.data._id.toString());
                  });
                navigation.navigate("Home");
              } else {
                console.log(response);
              }
            })
            .catch((error) => {
              console.log(error);
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

            <View style={tw`w-full mb-6`}>
              <TextInput
                style={tw`h-12 bg-gray-100 rounded-md px-4`}
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {touched.password && errors.password && (
                <Text style={tw`text-red-500 mt-2`}>{errors.password}</Text>
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
                  Login
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToSignUp}>
              <Text style={tw`text-gray-500 text-center mb-6`}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToForgotPassword}>
              <Text style={tw`text-gray-500 text-center`}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
