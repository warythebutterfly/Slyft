import { StyleSheet, View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";

const HomeScreen = () => {
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
        {/* <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={{
            url: "https://links.papareact.com/gzs",
          }}
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
