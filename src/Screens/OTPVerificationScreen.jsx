import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const OtpVerificationScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(15);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) inputRefs.current[index + 1].focus();
  };

  // Handle backspace navigation
  const handleBackspace = (value, index) => {
    if (value === "" && index > 0) inputRefs.current[index - 1].focus();
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Verify OTP API call
  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://therapy.kidstherapy.me/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", data.message || "OTP Verified!");
        navigation.navigate("CreateNewPassword");
      } else {
        Alert.alert("Error", data.message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Network Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoButton}>
          <Text style={styles.logoText}>Logo Here</Text>
        </TouchableOpacity>
      </View>

      {/* OTP Verification Text */}
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your email.
      </Text>

      {/* OTP Input */}
      <Text style={styles.label}>Enter Code</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") handleBackspace(digit, index);
            }}
            keyboardType="number-pad"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={verifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyButtonText}>Verify</Text>
        )}
      </TouchableOpacity>

      {/* Resend OTP Section */}
      <View style={styles.resendContainer}>
        <TouchableOpacity disabled={timer > 0}>
          <Text
            style={[
              styles.resendText,
              { color: timer > 0 ? "#888" : "#0073e6" },
            ]}
          >
            Resend Code
          </Text>
        </TouchableOpacity>
        <Text style={styles.timer}> 0:{timer < 10 ? `0${timer}` : timer}</Text>
      </View>
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
    borderRadius: 10,
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
    paddingStart: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#090D4D",
    marginBottom: 20,
    textAlign: "center",
    paddingRight:100
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#090D4D",
    paddingStart: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#F0F4F8",
  },
  verifyButton: {
    backgroundColor: "#0080DC",
    padding: 12,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 30,
  },
  verifyButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0080DC",
  },
  timer: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0073e6",
    marginLeft: 10,
  },
});

export default OtpVerificationScreen;
