import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  setDestination,
  setOrigin,
  selectOrigin,
} from "../slices/navSlice";

const data = [
  {
    id: "1",
    icon: "home",
    location: "Home",
    destination: "Oredola Street, Lagos, Nigeria",
    description: "Oredola Street, Lagos, Nigeria",
    geometry: { location: { lat: 6.5288565, lng: 3.3809722 } },
  },
  {
    id: "2",
    icon: "school",
    location: "School",
    destination: "University of Lagos, Lagos, Nigeria",
    description: "University of Lagos, Lagos, Nigeria",
    geometry: { location: { lat: 6.515759, lng: 3.3898447 } },
  },
];

const NavFavourites = ({ formik }) => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => {
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />;
      }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={tw`flex-row items-center p-5`}
          onPress={() => {
            console.log(item.description);
            formik.setFieldValue("location", item.description);
            dispatch(
              setOrigin({
                location: item.geometry.location,
                description: item.description,
              })
            );
            if (origin)
              dispatch(
                setDestination({
                  location: item.geometry.location,
                  description: item.description,
                })
              );
          }}
        >
          <Icon
            style={tw`mr-4 rounded-full bg-gray-300 p-3`}
            type="material"
            color="white"
            name={item.icon}
            size={18}
          />
          <View>
            <Text style={tw`text-lg font-semibold`}>{item.location}</Text>
            <Text style={tw`text-gray-500`}>{item.destination}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default NavFavourites;

const styles = StyleSheet.create({});
