import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import tw from "tailwind-react-native-classnames";
import Toast from "react-native-toast-message";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  selectTravelTimeInformation,
  selectUser,
  selectOrigin,
  selectDestination,
} from "../slices/navSlice";

//selecting the type of passenger i want in my car
const data = [
  {
    id: "Slyft1",
    title: "Staff or Student",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
    // number: 3,
  },
  {
    id: "Slyft2",
    title: "Student",
    multiplier: 1.2,
    image: "https://links.papareact.com/7pf",
    // number: 1,
  },
  {
    id: "Slyft3",
    title: "Staff",
    multiplier: 1.75,
    image: "https://links.papareact.com/5w8",
    // number: 4,
  },
];

const PassengerCard = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [selected, setSelected] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [cardOptionsDisabled, setCardOptionsDisabled] = useState(false);

  const rideInformation = {
    type: "driver",
    user: { ...user },
    origin: { ...origin },
    destination: { ...destination },
    travelTimeInformation: { ...travelTimeInformation },
    match: { userType: user.userType, passengerType: selected?.title },
  };

  const handleChooseOption = () => {
    setButtonDisabled(true);
    setCardOptionsDisabled(true);
    navigation.navigate("FinderCard", {
      message: `Finding a ${selected?.title} passenger for you!`,
      parentRoute: "PassengerCard",
      rideInformation,
    });
  };
  return (
    <>
      <View>
        <TouchableOpacity
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
          onPress={() => navigation.navigate("GiveNavigateCard")}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>

        <Text style={tw`text-center text-xl py-5`}>
          Select the type of passenger
          {/* - {travelTimeInformation?.distance.text} */}
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
          disabled={!selected}
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

export default PassengerCard;

const styles = StyleSheet.create({
  numberContainer: {
    position: "absolute",
    top: -5,
    right: -10,
    // backgroundColor: "red", // Set your desired background color
    borderRadius: 10,
    padding: 5,
  },
  numberText: {
    color: "#000", // Set your desired text color
    fontSize: 12,
    fontWeight: "bold",
  },
});
