import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const navigation = useNavigation(); // Initialize navigation

  const handleForgotPasswordScreen = () => {
    navigation.navigate("ForgotPassword");
  };
  const handleHomeScreen=()=>{
    navigation.navigate("Home");
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoButton}>
          <Text style={styles.logoText}>Logo Here</Text>
        </TouchableOpacity>
      </View>

      {/* Login Text */}
      <Text style={styles.title}>Log In Now</Text>
      <Text style={styles.subtitle}>Login to continue using our app</Text>

      {/* Email Input */}
      <Text style={styles.label}>Enter Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input with Eye Icon */}
      <Text style={styles.label}>Enter Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Your Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeButton}>
          <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={handleForgotPasswordScreen}>
        <Text style={styles.forgotPassword}>Forget Password</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleHomeScreen}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
       
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#0073e6",
    padding: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,

  },
  logoButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 6,
  },
  logoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#090D4D",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#090D4D",
    marginBottom: 5,
    paddingHorizontal: 20,

  },
  subtitle: {
    fontSize: 14,
    color: "#090D4D",
    marginBottom: 20,
    paddingHorizontal: 20,

  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 1,
    color: "#090D4D",
    paddingHorizontal: 25,

  },
  input: {
    backgroundColor: "#E7EDFF",
    padding: 12,
    borderRadius: 4,
    marginTop: 5,
    margin:20,
   

  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7EDFF",
    borderRadius: 4,
    marginTop: 5,
    margin:20,

    
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    

  },
  eyeButton: {
    padding: 10,
    
  },
  forgotPassword: {
    color: "#0073e6",
    textAlign: "right",
    paddingHorizontal: 20,

  },
  loginButton: {
    backgroundColor: "#0080DC",
    padding: 12,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 30,
    marginEnd:30,
    marginStart:30,

    
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 10,
    

  },
});

export default LoginScreen;
