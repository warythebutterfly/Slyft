import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import Toast from "react-native-toast-message";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectTravelTimeInformation } from "../slices/navSlice";

const data = [
  {
    id: "Slyft1",
    title: "Slyft",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
    number: 3,
  },
  {
    id: "Slyft2",
    title: "Slyft for Student",
    multiplier: 1.2,
    image: "https://links.papareact.com/7pf",
    number: 1,
  },
  {
    id: "Slyft3",
    title: "Slyft for Staff",
    multiplier: 1.75,
    image: "https://links.papareact.com/5w8",
    number: 4,
  },
];

const RiderCard = () => {
  const navigation = useNavigation();
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [selected, setSelected] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [cardOptionsDisabled, setCardOptionsDisabled] = useState(false);

  const handleChooseOption = () => {
    // Show the Toast with autoHide set to false
    // Toast.show({
    //   type: "success",
    //   position: "top",
    //   text1: `Finding a ${selected?.title} for you!`,
    //   autoHide: true, // Don't hide the Toast automatically
    // });

    setButtonDisabled(true);
    setCardOptionsDisabled(true);
    navigation.navigate("FinderCard", {
      message: `Finding a ${selected?.title} for you!`,
      parentRoute: "RiderCard",
    });
  };
  return (
    <>
      <View>
        <TouchableOpacity
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
          onPress={() => navigation.navigate("NavigateCard")}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>

        <Text style={tw`text-center text-xl py-5`}>
          Select a Lift - {travelTimeInformation?.distance.text}
        </Text>
      </View>
      <FlatList
        style={tw`h-40`}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelected(item);
              setButtonDisabled(false);
            }}
            style={tw`flex-row justify-between items-center px-10 ${
              item.id === selected?.id &&
              "m-2 bg-gray-200 border-2 rounded-lg h-32"
            }`}
          >
            <Image
              style={{ width: 100, height: 100, resizeMode: "contain" }}
              source={{ uri: item.image }}
            />
            <View style={tw`-ml-6`}>
              <Text style={tw`text-xl font-semibold`}>{item.title}</Text>
              <Text>{travelTimeInformation?.duration.text} Travel Time</Text>
            </View>
            <View>
              <Icon name="user" type="font-awesome" color="#000" size={30} />
              <View style={styles.numberContainer}>
                <Text style={styles.numberText}>{item.number}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={tw`mt-auto border-t border-gray-200`}>
        <TouchableOpacity
          disabled={!selected || buttonDisabled}
          style={tw`bg-black py-3 m-3 rounded-md h-14 justify-center ${
            (!selected || buttonDisabled) && "bg-gray-300"
          }`}
          onPress={() => handleChooseOption()}
        >
          <Text style={tw`text-center text-white text-xl`}>
            Choose {selected?.title}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default RiderCard;

const styles = StyleSheet.create({});
