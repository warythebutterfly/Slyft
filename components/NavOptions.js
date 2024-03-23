import { Text, TouchableOpacity, View, FlatList, Image } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../slices/navSlice";

const data = [
  {
    id: "1",
    title: "Get a lift",
    image: "https://links.papareact.com/3pn",
    screen: "GetMap",
  },
  {
    id: "2",
    title: "Give a lift",
    image: "https://links.papareact.com/3pn",
    screen: "GiveMap",
  },
];

const NavOptions = ({ formik }) => {
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);

  const navigateToMap = (screen) => {
    // Access formik.values and other formik methods as needed
    console.log("Location from formik:", formik.values.location);
    formik.handleSubmit();
    formik.values.location && navigation.navigate(screen);
  };

  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40`}
          onPress={() => navigateToMap(item.screen)}
          disabled={!origin}
        >
          <View style={tw`${!origin && "opacity-60"} `}>
            <Image
              style={{ width: 120, height: 120, resizeMode: "contain" }}
              source={{ uri: item.image }}
            />
            <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
            <Icon
              style={tw`p-2 bg-black rounded-full w-10 mt-4`}
              type="antdesign"
              color="white"
              name="arrowright"
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default NavOptions;
