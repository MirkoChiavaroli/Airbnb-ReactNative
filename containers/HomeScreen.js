import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../assets/colors";

const { ground, red, lightRed, darkGrey, lightGrey, black, yellow } = colors;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fecthData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        // console.log(responde.data);
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

  // <FontAwesome name="star" size={24} color={yellow} />
  // <FontAwesome name="star" size={24} color={lightGrey} />

  return isLoading ? (
    <View style={styles.wait}>
      <ActivityIndicator size="large" color={red} />
    </View>
  ) : (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id} //parfois si id n'est pas string il faut mettre function > string a voir la sintaxe
        renderItem={({ item, index }) => {
          // console.log(item);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate("Room", { annonceId: item._id });
                // console.log(item._id);
              }}
            >
              <View style={styles.annonce}>
                <View style={styles.priceContainer}>
                  <ImageBackground
                    source={{ uri: item.photos[0].url }}
                    style={styles.annoncePicture}
                  >
                    <Text style={styles.price}>{item.price}€</Text>
                  </ImageBackground>
                </View>

                <View style={styles.annonceDescr}>
                  <View style={styles.annonceRating}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title}
                    </Text>

                    <Text style={styles.etoiles}>
                      {displayStars(item.ratingValue)}

                      <Text style={styles.reviews}>{item.reviews} reviews</Text>
                    </Text>
                  </View>
                  <Image
                    source={{ uri: item.user.account.photo.url }}
                    style={styles.annonceAvatar}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  wait: {
    justifyContent: "center",
    paddingTop: 150,
  },

  annonce: {
    flex: 1,
  },

  annoncePicture: {
    width: "100%",
    height: 160,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  price: {
    fontSize: 20,
    color: "white",
    padding: 10,
    backgroundColor: black,
    textAlign: "center",
    marginBottom: 10,
  },

  annonceDescr: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    paddingHorizontal: 25,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    color: red,
    marginBottom: 10,
  },
  annonceAvatar: {
    borderRadius: 50,
    height: 70,
    width: 70,
    marginLeft: 60,
  },
});
