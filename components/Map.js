import { StyleSheet, View, Image } from "react-native";
import React, { useEffect } from "react";
import { selectOrigin, selectDestination, setTravelTimeInformation} from "../slices/navSlice";
import { useSelector, useDispatch } from "react-redux";
import { GOOGLE_MAPS_APIKEY } from "@env";

const milesToKilometers = (miles) => {
  const mile = parseFloat(miles);

  const kilometersPerMile = 1.60934;
  const kilometers = (mile * kilometersPerMile).toFixed(2) + " km";
  return kilometers;
};

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const dispatch = useDispatch();
  // const mapRef = useRef(null);

  // useEffect(() => {
  //   if (!origin || !destination) return;

  //   mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
  //     edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //   });
  // }, [origin, destination]);

  useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}`
        );
        const data = await res.json();
        data.rows[0].elements[0].distance.text = milesToKilometers(
          data.rows[0].elements[0].distance.text
        );
        dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
      } catch (error) {
        console.error("Error fetching travel time:", error);
      }
    };

    getTravelTime();
  }, [origin, destination, dispatch]);

  // if (!origin) {
  //   return null; // or a loading indicator
  // }

  return (
    <View>
      <Image
        height={"100%"}
        source={{
          uri: `https://www.google.com/maps/d/thumbnail?mid=14hjCHb8_vkv3TpUGTdpIN4NKF84&hl=en_US`,
        }}
      />
    </View>
    // <MapView
    //   ref={mapRef}
    //   style={tw`flex-1`}
    //   mapType="mutedStandard"
    //   initialRegion={{
    //     latitude: origin.location.lat,
    //     longitude: origin.location.lng,
    //     latitudeDelta: 0.005,
    //     longitudeDelta: 0.005,
    //   }}
    // >
    //   {origin && destination && (
    //     <MapViewDirections
    //       origin={{
    //         latitude: origin.location.lat,
    //         longitude: origin.location.lng,
    //       }}
    //       destination={{
    //         latitude: destination.location.lat,
    //         longitude: destination.location.lng,
    //       }}
    //       apikey={GOOGLE_MAPS_APIKEY}
    //       strokeWidth={3}
    //       strokeColor="black"
    //       onError={(errorMessage) => console.error('MapViewDirections error:', errorMessage)}
    //     />
    //   )}
    //   {origin?.location && (
    //     <Marker
    //       coordinate={{
    //         latitude: origin.location.lat,
    //         longitude: origin.location.lng,
    //       }}
    //       title="Origin"
    //       description={origin.description}
    //       identifier="origin"
    //     />
    //   )}
    //   {destination?.location && (
    //     <Marker
    //       coordinate={{
    //         latitude: destination.location.lat,
    //         longitude: destination.location.lng,
    //       }}
    //       title="Destination"
    //       description={destination.description}
    //       identifier="destination"
    //     />
    //   )}
    // </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
