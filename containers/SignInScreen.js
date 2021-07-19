import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../assets/colors";
const { ground, red, lightRed, darkGrey, lightGrey, black } = colors;

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (text) => {
    setEmail(text);
  };
  const handlePassword = (text) => {
    setPassword(text);
  };

  const handleSubmit = async () => {
    try {
      if (email && password) {
        const data = {
          email,
          password,
        };
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          data
        );
        console.log(response);
        const userToken = "secret-token";
        setToken(userToken);
      } else {
        setError("Champs manquants.");
      }
    } catch (error) {
      console.log(error.response.data.error);
      if (error.response.status === 401) {
        setError("Email / Mot de passe incorrect");
      } else {
        console.log(error.message);
      }
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.body}>
      <View style={styles.container}>
        <Image
          source={require("../assets/img/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View>
          <TextInput
            placeholder="email"
            onChangeText={handleEmail}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={handlePassword}
            style={styles.input}
          />
          <TouchableOpacity
            title="Sign in"
            onPress={async () => {
              const userToken = "secret-token";
              setToken(userToken);
              handleSubmit();
            }}
            style={styles.sign}
          >
            <Text style={styles.signInUp}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text>No accont ? Register </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: ground,
    padding: 30,
  },
  container: {
    alignItems: "center",
    flex: 1,
  },
  logo: {
    justifyContent: "center",
  },
  input: {
    width: 300,
    fontSize: 15,
    marginBottom: 20,
    padding: 10,
    borderBottomColor: lightRed,
    borderBottomWidth: 1,
  },
  sign: {
    alignContent: "center",
  },
  signInUp: {
    fontSize: 25,
    color: darkGrey,
    textAlign: "center",
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 40,
    paddingVertical: 20,
    width: "80%",
  },
});
