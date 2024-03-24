import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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

const milesToKilometers = (miles) => {
  //console.log(miles, miles);
  const mile = parseFloat(miles);
  //console.log(mile);
  const kilometersPerMile = 1.60934;
  const kilometers = (mile * kilometersPerMile).toFixed(2) + " km";
  //isNaN(kilometers) ? "" : kilometers;
  //console.log(kilometers);
  return kilometers;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const showToast = () => {
  Toast.show({
    type: "success",
    position: "top",
    text1: "Finding a slyft for you!",
    // visibilityTime: 3000,
    // autoHide: true,
  });
};
const Map = () => {
  const [distance, setDistance] = useState(null);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  const dispatch = useDispatch();

  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;
    //console.log("ORIGIN & DESTINATION");
    //console.log(origin, destination);
    //zoom and fit to markers
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [origin, destination]);

  useEffect(() => {
    //Travel time
    if (!origin || !destination) return;
    const getTravelTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          //console.log(JSON.stringify(data));
          //console.log(data.rows[0].elements[0]);
          data.rows[0].elements[0].distance.text = milesToKilometers(
            data.rows[0].elements[0].distance.text
          );
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));

          // data.rows[0].elements[0].distance.text = `${(
          //   calculateDistance(
          //     parseFloat(origin.location.lat),
          //     parseFloat(origin.location.lng),
          //     parseFloat(destination.location.lat),
          //     parseFloat(destination.location.lng)
          //   ).toFixed(2) * 1.8
          // ).toFixed(2)} km`;
          // data.rows[0].elements[0].duration.text = `${Math.round(
          //   (calculateDistance(
          //     parseFloat(origin.location.lat),
          //     parseFloat(origin.location.lng),
          //     parseFloat(destination.location.lat),
          //     parseFloat(destination.location.lng)
          //   ).toFixed(2) /
          //     10) *
          //     60
          // )} mins`;
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        });
    };

    //Distance calc
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const a = 6378137; // Semi-major axis of the WGS84 ellipsoid in meters
      const b = 6356752.3142;
      const f = 1 / 298.257223563; // Flattening of the WGS84 ellipsoid

      const degToRad = (degrees) => degrees * (Math.PI / 180);

      const phi1 = degToRad(lat1);
      const phi2 = degToRad(lat2);
      const lambda1 = degToRad(lon1);
      const lambda2 = degToRad(lon2);

      const L = lambda2 - lambda1;

      const tanU1 = (1 - f) * Math.tan(phi1);
      const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
      const sinU1 = tanU1 * cosU1;
      const tanU2 = (1 - f) * Math.tan(phi2);
      const cosU2 = 1 / Math.sqrt(1 + tanU2 * tanU2);
      const sinU2 = tanU2 * cosU2;

      let lambda = L;
      let lambdaP,
        sinLambda,
        cosLambda,
        sinSigma,
        cosSigma,
        sigma,
        sinAlpha,
        cosSqAlpha,
        cos2SigmaM,
        C;

      let iterations = 0;
      do {
        sinLambda = Math.sin(lambda);
        cosLambda = Math.cos(lambda);
        sinSigma = Math.sqrt(
          cosU2 * sinLambda * (cosU2 * sinLambda) +
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
              (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
        );
        if (sinSigma == 0) return 0; // Co-incident points
        cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        sigma = Math.atan2(sinSigma, cosSigma);
        sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
        cosSqAlpha = 1 - sinAlpha * sinAlpha;
        cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;
        if (isNaN(cos2SigmaM)) cos2SigmaM = 0; // Equatorial line: cosSqAlpha=0
        C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambdaP = lambda;
        lambda =
          L +
          (1 - C) *
            f *
            sinAlpha *
            (sigma +
              C *
                sinSigma *
                (cos2SigmaM +
                  C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
      } while (Math.abs(lambda - lambdaP) > 1e-12 && ++iterations < 1000);

      if (iterations >= 1000) return NaN; // Formula failed to converge

      const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
      const A =
        1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
      const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
      const deltaSigma =
        B *
        sinSigma *
        (cos2SigmaM +
          (B / 4) *
            (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
              (B / 6) *
                cos2SigmaM *
                (-3 + 4 * sinSigma * sinSigma) *
                (-3 + 4 * cos2SigmaM * cos2SigmaM)));

      const s = b * A * (sigma - deltaSigma); // Distance in meters

      return s / 1000;
    };

    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {origin && destination && (
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
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
