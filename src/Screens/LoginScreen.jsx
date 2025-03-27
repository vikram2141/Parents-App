import React, { useState, useEffect } from "react";
import { 
  View, Text,Image, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = async () => {
    try {
      const user = await AsyncStorage.getItem("userData");
      if (user) {
        navigation.replace("Home"); // Redirect if already logged in
      }
    } catch (error) {
      console.error("Error checking user login:", error);
    }
  };

  const handleForgotPasswordScreen = () => {
    navigation.navigate("ForgotPassword");
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    Keyboard.dismiss(); // Dismiss keyboard when submitting

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://therapy.kidstherapy.me/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        Alert.alert("Login Successful", "Welcome back!");
        navigation.replace("Home");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Network error. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
         <TouchableOpacity style={styles.logoButton}>
                 <Image source={require('../../src/assets/sun.png')} style={styles.logoImage} />
                 </TouchableOpacity>
        </View>

        <Text style={styles.title}>Log In Now</Text>
        <Text style={styles.subtitle}>Login to continue using our app</Text>

        <Text style={styles.label}>Enter Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

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

        <TouchableOpacity onPress={handleForgotPasswordScreen}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: { alignItems: "center", marginBottom: 30, backgroundColor: "#0073e6", padding: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  logoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  logoImage: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    resizeMode: 'contain',   
      paddingHorizontal: 60,
      paddingVertical: 60,
      borderRadius: 66,
      backgroundColor:"#fff"

  },
   title: { fontSize: 24, fontWeight: "bold", color: "#090D4D", marginBottom: 5, paddingHorizontal: 20 },
  subtitle: { fontSize: 14, color: "#090D4D", marginBottom: 20, paddingHorizontal: 20 },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10, color: "#090D4D", paddingHorizontal: 25 },
  input: { backgroundColor: "#E7EDFF", padding: 12, borderRadius: 4, marginTop: 5, marginHorizontal: 20 },
  passwordContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#E7EDFF", borderRadius: 4, marginTop: 5, marginHorizontal: 20 },
  passwordInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 10 },
  eyeButton: { padding: 10 },
  forgotPassword: { color: "#0073e6", textAlign: "right", paddingHorizontal: 20 },
  loginButton: { backgroundColor: "#0080DC", padding: 12, borderRadius: 60, alignItems: "center", marginTop: 30, marginHorizontal: 30 },
  loginButtonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16, paddingHorizontal: 10 },
});

export default LoginScreen;
