import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);

  const handleForgotPassword = () => {
    // Perform ForgotPassword logic here
    console.log("ForgotPassword pressed with:", { email });
    navigation.navigate("Login");
  };

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

      <View style={tw`w-full mb-6`}>
        <TextInput
          style={tw`h-12 bg-gray-100 rounded-md px-4`}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <TouchableOpacity
        style={tw`bg-gray-800 p-4 rounded-md w-full mb-14`}
        onPress={handleForgotPassword}
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
        <Text style={tw`text-gray-500`}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
