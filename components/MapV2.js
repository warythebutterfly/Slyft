import { StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDestination,
  selectOrigin,
  setTravelTimeInformation,
} from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";

const milesToKilometers = (miles) => {
  const mile = parseFloat(miles);

  const kilometersPerMile = 1.60934;
  const kilometers = (mile * kilometersPerMile).toFixed(2) + " km";
  return kilometers;
};

const MapV2 = () => {
  // const origin = useSelector(selectOrigin);
  // const destination = useSelector(selectDestination);
  // const dispatch = useDispatch();
  // const navigation = useNavigation();
  const mapRef = useRef(null);

  //   useEffect(() => {
  //     if (!origin || !destination) navigation.navigate("Home");

  //     mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
  //       edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //     });
  //   }, [origin, destination]);

  //   useEffect(() => {
  //     if (!origin || !destination) return;

  //     const getTravelTime = async () => {
  //       try {
  //         const res = await fetch(
  //           `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}`
  //         );
  //         const data = await res.json();
  //         data.rows[0].elements[0].distance.text = milesToKilometers(
  //           data.rows[0].elements[0].distance.text
  //         );
  //         dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
  //       } catch (error) {
  //         console.error("Error fetching travel time:", error);
  //       }
  //     };

  //     getTravelTime();
  //   }, [origin, destination, dispatch]);

  //   if (!origin) {
  //     navigation.navigate("Home"); // or a loading indicator
  //   }

  return (
    <MapView
      ref={mapRef}
      style={styles.container}
      mapType="mutedStandard"
      initialRegion={{
        latitude: 6.5244,
        longitude: 3.3792,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {/* {origin && destination && (
        <MapViewDirections
          origin={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          destination={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="black"
          onError={(errorMessage) => console.error('MapViewDirections error:', errorMessage)}
        />
      )}
      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Origin"
          description={origin.description}
          identifier="origin"
        />
      )}
      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="Destination"
          description={destination.description}
          identifier="destination"
        />
      )} */}
    </MapView>
  );
};

export default MapV2;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
