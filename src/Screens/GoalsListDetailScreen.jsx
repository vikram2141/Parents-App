"use client"

import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import axios from "axios"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const GoalsListDetailScreen = ({ route }) => {
  const [activeTab, setActiveTab] = useState("Details")
  const [profileData, setProfileData] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigation = useNavigation()
  const { appointment } = route.params || {}

  // This effect runs when the component mounts or when appointment changes
  useEffect(() => {
    if (appointment) {
      console.log("Setting profile data from appointment:", appointment)
      setProfileData(appointment)
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [appointment])

  // This effect will run every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen focused, checking data")

      // If we already have profileData but it's not the same as the appointment in route.params
      if (profileData && appointment && profileData.id !== appointment.id) {
        console.log("Updating profile data from new appointment")
        setProfileData(appointment)
      }

      // If we don't have profileData but we have appointment in route.params
      if (!profileData && appointment) {
        console.log("Setting profile data from appointment on focus")
        setProfileData(appointment)
        setLoading(false)
      }

      return () => {
       
      }
    }, [profileData, appointment]),
  )

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!appointment?.user?.api_token) {
        console.warn("No API token found, skipping request.")
        return
      }

      setLoading(true)
      try {
        const response = await axios.get("https://therapy.kidstherapy.me/api/profile", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${appointment.user.api_token}`,
          },
        })
        setUser(response.data)
        setError(null)
      } catch (error) {
        console.error("API Error:", error)
        setError(error.response?.data?.message || "Failed to load profile data.")
        Alert.alert("Error", "Failed to fetch user profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (appointment?.user?.api_token) {
      fetchUserProfile()
    }
  }, [appointment])

  // Navigate to GoalsListNotes with the correct data
  const handleGoToNotes = () => {
    if (profileData) {
      navigation.navigate("GoalsListNotes", { profileData })
    } else if (appointment) {
      navigation.navigate("GoalsListNotes", { profileData: appointment })
    } else {
      Alert.alert("Error", "No appointment data available")
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.logoText}>Goals List</Text>
      </View>
      {/* Sync Button */}
      <TouchableOpacity style={styles.syncButton} onPress={() => Alert.alert("Sync", "Syncing data...")}>
        <Text style={styles.syncText}>Sync</Text>
      </TouchableOpacity>

      {/* Tab Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={activeTab === "Details" ? styles.activeButton : styles.inactiveButton}
          onPress={() => setActiveTab("Details")}
        >
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={handleGoToNotes}>
          <Text style={styles.inactiveText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={() => navigation.navigate("GoalsListVerify")}>
          <Text style={styles.inactiveText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : profileData ? (
          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Patient name:</Text>
              <Text style={styles.value}>{profileData.user?.name || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Doctor name:</Text>
              <Text style={styles.value}>{user?.name || "Pallavi Nathani"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Therapy:</Text>
              <Text style={styles.value}>{profileData.hospital_department.name || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{profileData.appointment_date || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Time:</Text>
              <Text style={styles.value}>
                {profileData.start_time && profileData.end_time
                  ? `${profileData.start_time} To ${profileData.end_time}`
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{profileData.appointment_status?.name || "N/A"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{profileData.problem || "N/A"}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>No appointment data available</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.collectButton} onPress={() => navigation.navigate("CollectData")}>
        <Text style={styles.collectButtonText}>Send for Signin</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007AFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  logoText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  syncButton: {
    alignSelf: "flex-end",
    backgroundColor: "#E7EDFF",
    borderWidth: 1,
    borderColor: "#0080DC",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginRight: 20,
  },
  syncText: {
    color: "#0080DC",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  activeButton: {
    backgroundColor: "#0080DC",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  inactiveButton: {
    borderColor: "#007bff",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  inactiveText: {
    color: "#007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    margin: 20,
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    margin: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  collectButton: {
    backgroundColor: "#0080DC",
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: "center",
    marginVertical: 15,
    margin: 20,
  },
  collectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
export default GoalsListDetailScreen

