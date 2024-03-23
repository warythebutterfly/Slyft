import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const FinderCard = ({ route }) => {
  const navigation = useNavigation();
  const { message, parentRoute } = route.params;
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleCancelPress = () => {
    setLoading(true); // Set loading state to true
    setButtonDisabled(true); // Disable the button

    // Simulate a delay to show loading
    setTimeout(() => {
      setLoading(false); // Set loading state to false
      // Perform any cancel ride logic here
      console.log("cancel pressed");
      navigation.navigate(`${parentRoute}`);
    }, 2000); // Simulating a delay of 2 seconds for loading
  };

  return (
    <>
      <View style={tw`h-40 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000" />

        <Text
          style={tw`mt-2 text-lg font-semibold flex-1 justify-center items-center`}
        >
          {message}
        </Text>
      </View>

      <View style={tw`mt-auto border-t border-gray-200`}>
        <TouchableOpacity
          style={[
            tw`bg-black py-3 m-3 rounded-md h-14 justify-center`,
            buttonDisabled && tw`opacity-50`, // Apply opacity to disabled button
          ]}
          onPress={handleCancelPress}
          disabled={buttonDisabled} // Disable the button based on state
        >
          <Text style={tw`text-center text-white text-xl`}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <Toast innerRef={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default FinderCard;

const styles = StyleSheet.create({});
