import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/core";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

// Package expo-location pour accéder et récupérer les coordonnées GPS de l'appareil
import * as Location from "expo-location";

// Package react-native-maps pour afficher une Map
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import colors from "../assets/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
const { ground, red, lightRed, darkGrey, lightGrey, black, yellow } = colors;

export default function AroundScreen() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const navigation = useNavigation();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  useEffect(() => {
    const getPermission = async () => {
      //domandare il permesso al cliente di accedere ai dati GPS telefono
      const { status } = await Location.requestForegroundPermissionsAsync();
      // console.log(status);
      if (status === "granted") {
        // se ok recupero i dati GPS telefono
        const location = await Location.getCurrentPositionAsync({});
        // console.log(location.coords.latitude);
        // console.log(location.coords.longitude);

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);

        try {
          const response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
          );
          // console.log("response >>>>", response.data);
          setData(response.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        setError(true);
        //sinon vado verso la home ... ma come?? :)
      }
      setIsLoading(false);
    };
    getPermission();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.wait}>
          <ActivityIndicator size="large" color={red} />
        </View>
      ) : error ? (
        <Text>Permission refusée</Text>
      ) : (
        <>
          <MapView
            style={styles.map}
            // Pour centrer la carte sur une certaine région :
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            // Pour afficher la position de l'utilisateur :
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsPointsOfInterest={true}
          >
            {data.map((item, index) => {
              return (
                <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude: item.location[1],
                    longitude: item.location[0],
                  }}
                  onPress={() => {
                    navigation.navigate("Room", { annonceId: item._id });
                    // console.log(item._id);
                  }}
                />
              );
            })}
          </MapView>
        </>
      )}
    </View>
  );
}

// showsMyLocationView

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
  },
  wait: {
    justifyContent: "center",
    paddingTop: 150,
  },
  map: {
    height: "100%",
    width: "100%",
    color: black,
    position: "absolute",
  },
  buttonCont: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 15,
    paddingLeft: 310,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: black,
  },
});
