import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import MapView from "react-native-maps";
import colors from "../assets/colors";
const { ground, red, lightRed, darkGrey, lightGrey, black, yellow } = colors;

const RoomScreen = ({ route }) => {
  // console.log("route >>", route);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fecthData = async () => {
      try {
        let annonceId = route.params.annonceId;

        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${annonceId}`
        );

        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fecthData();
  }, []);

  const displayStars = (value) => {
    const tab = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= value) {
        tab.push(<FontAwesome name="star" size={24} color={yellow} key={i} />);
      } else {
        tab.push(
          <FontAwesome name="star" size={24} color={lightGrey} key={i} />
        );
      }
    }
    return tab;
  };

  return isLoading ? (
    <View style={styles.wait}>
      <ActivityIndicator size="large" color={red} />
    </View>
  ) : (
    <View style={styles.container}>
      <View>
        <ImageBackground
          source={{ uri: data.photos[0].url }}
          style={styles.annoncePicture}
        >
          <Text style={styles.price}>{data.price}€</Text>
        </ImageBackground>

        <View style={styles.annonceDescr}>
          <View style={styles.annonceRating}>
            <Text style={styles.title} numberOfLines={1}>
              {data.title}
            </Text>

            <Text style={styles.etoiles}>
              {displayStars(data.ratingValue)}

              <Text style={styles.reviews}>{data.reviews} reviews</Text>
            </Text>
          </View>
          <Image
            source={{ uri: data.user.account.photo.url }}
            style={styles.annonceAvatar}
            resizeMode="cover"
          />

          <Text style={styles.title}>{data.description}</Text>
        </View>
      </View>
      <View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: data.location[1],
            longitude: data.location[0],
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true}
        >
          <MapView.Marker
            coordinate={{
              latitude: data.location[1],
              longitude: data.location[0],
            }}
          />
        </MapView>
      </View>
    </View>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 5,
  },
  wait: {
    justifyContent: "center",
    paddingTop: 150,
  },
  title: {
    color: black,
    fontSize: 20,
  },
  annoncePicture: {
    width: 200,
    height: 200,
  },
  annonceAvatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  price: {
    fontSize: 20,
    color: "white",
    padding: 5,
    backgroundColor: black,
    textAlign: "center",
  },
});
