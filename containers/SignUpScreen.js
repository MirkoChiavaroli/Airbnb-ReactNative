import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import Constants from "expo-constants";
import axios from "axios";
import colors from "../assets/colors";
const { ground, red, lightRed, darkGrey, lightGrey, black } = colors;

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmail = (text) => {
    setEmail(text);
  };
  const handleUsername = (text) => {
    setUsername(text);
  };
  const handlePassword = (text) => {
    setPassword(text);
  };
  const handleConfirmPassword = (text) => {
    setConfirmPassword(text);
  };
  const handleDescription = (text) => {
    setDescription(text);
  };

  const handleSubmit = async ({ navigation }) => {
    if (email && username && password && confirmPassword && description) {
      // Si tous les champs sont remplis
      if (password === confirmPassword) {
        // si les 2 MDP sont identiques
        try {
          // on passe à la requête
          const response = await axios.post(
            "https://express-airbnb-api.herokuapp.com/user/sign_up",
            {
              email,
              username,
              password,
              description,
            }
          );
          if (response.data.token) {
            setToken(response.data.token);
          }
        } catch (error) {
          if (
            error.response.data.error ===
              "This email already has an account." ||
            error.response.data.error ===
              "This username already has an account."
          ) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage("An error occurred");
          }
        }
      } else {
        // si les 2 MDP ne sont pas identiques
        setErrorMessage("MDP doivent être identiques");
      }
    } else {
      // Si tous les champs ne sont pas remplis
      setErrorMessage("Remplir tous les champs");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Image
          source={require("../assets/img/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.title}>Sign up</Text>
        </View>

        <TextInput
          placeholder="email"
          onChangeText={handleEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="username"
          onChangeText={handleUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Describe youself in a few words..."
          onChangeText={handleDescription}
          multiline={true}
          style={styles.inputDescr}
        />

        <TextInput
          placeholder="password"
          secureTextEntry={true}
          onChangeText={handlePassword}
          style={styles.input}
        />

        <TextInput
          placeholder="confirm password"
          secureTextEntry={true}
          onChangeText={handleConfirmPassword}
          style={styles.input}
        />

        <View style={styles.btnView}>
          <Text>{errorMessage}</Text>

          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text>Aller vers sign in screen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignUpScreen;

const styles = StyleSheet.create({
  logo: {
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
  },
  input: {
    width: "85%",
    fontSize: 15,
    marginBottom: 20,
    padding: 10,
    borderBottomColor: lightRed,
    borderBottomWidth: 1,
  },
  inputDescr: {
    width: "85%",
    height: 40,
    fontSize: 15,
    marginBottom: 20,
    padding: 10,
    borderColor: lightRed,
    borderWidth: 1,
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
