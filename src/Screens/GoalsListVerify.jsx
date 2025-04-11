"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

const GoalsListVerify = () => {
  const [formData, setFormData] = useState({
    caregiverName: "",
    caregiverSignature: "",
    staffName: "",
  })

  const [selectedStaff, setSelectedStaff] = useState([])
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const navigation = useNavigation()

  // Add this useEffect to store the appointment data when the component mounts
  useEffect(() => {
    const getAndStoreAppointmentData = async () => {
      try {
        // Check if we already have appointment data in AsyncStorage
        const existingData = await AsyncStorage.getItem("currentAppointment")
        if (existingData) {
          console.log("Using existing appointment data from AsyncStorage")
          return
        }

        // If not, try to fetch it from the API
        const userData = await getUserData()
        if (!userData || !userData.api_token) {
          console.error("No user token available")
          return
        }

        // Make API call to get the current appointment
        // This is a placeholder - you'll need to replace with your actual API endpoint
        const response = await axios.get("https://therapy.kidstherapy.me/api/current-appointment", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userData.api_token}`,
          },
        })

        if (response.data && response.data.appointment) {
          // Store the appointment data in AsyncStorage
          await AsyncStorage.setItem("currentAppointment", JSON.stringify(response.data.appointment))
          console.log("Stored appointment data in AsyncStorage")
        }
      } catch (error) {
        console.error("Error getting appointment data:", error)
      }
    }

    getAndStoreAppointmentData()
  }, [getUserData])

  // Function to get user data from AsyncStorage
  const getUserData = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("userData")
      if (!user) throw new Error("User not found in storage")

      const parsedUserData = JSON.parse(user)
      return parsedUserData
    } catch (error) {
      console.error("Error getting user data:", error)
      Alert.alert("Error", "Failed to get user data. Please login again.")
      return null
    }
  }, [])

  // Fetch therapists from API
  const fetchTherapists = useCallback(async () => {
    try {
      setLoading(true)

      const userData = await getUserData()
      if (!userData) {
        setLoading(false)
        return
      }

      const token = userData?.api_token
      if (!token) {
        console.error("No token found in stored user data")
        setLoading(false)
        return
      }

      console.log("Fetching therapists with token:", token)

      const response = await axios.get("https://therapy.kidstherapy.me/api/therapist-list", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("API Response:", response.data)

      if (response.data && Array.isArray(response.data.therapists)) {
        const formattedData = response.data.therapists.map((therapist) => ({
          label: therapist.name,
          value: therapist.id.toString(),
        }))
        setStaffList(formattedData)

        // Set selected staff from API (assuming staffName contains IDs)
        if (formData.staffName) {
          try {
            // Try to parse as JSON first (in case it's stored as JSON array)
            let staffIds
            try {
              staffIds = JSON.parse(formData.staffName)
            } catch {
              // If not JSON, split by comma
              staffIds = formData.staffName.split(",")
            }

            // Ensure all IDs are strings
            const selectedIds = staffIds.map((id) => id.toString())
            setSelectedStaff(selectedIds)
          } catch (error) {
            console.error("Error parsing staff IDs:", error)
            setSelectedStaff([])
          }
        }
      } else {
        console.error("Unexpected API response format:", response.data)
        Alert.alert("Error", "Failed to load therapist list. Please try again.")
      }
    } catch (error) {
      console.error("Error fetching therapists:", error.response?.data || error.message)
      Alert.alert("Error", "Failed to load therapist list. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [getUserData, formData.staffName])

  // Add or remove staff from selection
  const toggleStaffSelection = (staffId) => {
    setSelectedStaff((prev) => {
      if (prev.includes(staffId)) {
        return prev.filter((id) => id !== staffId)
      } else {
        return [...prev, staffId]
      }
    })
  }

  useEffect(() => {
    fetchTherapists()
  }, [fetchTherapists])

  // Filter staff list based on search term
  const filteredStaff = staffList.filter((staff) => staff.label.toLowerCase().includes(searchTerm.toLowerCase()))

  // Render staff selection modal
  const renderStaffSelectionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Staff</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredStaff}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.staffItem, selectedStaff.includes(item.value) && styles.selectedStaffItemInList]}
                onPress={() => toggleStaffSelection(item.value)}
              >
                <Text
                  style={[
                    styles.staffItemText,
                    selectedStaff.includes(item.value) && styles.selectedStaffItemTextInList,
                  ]}
                >
                  {item.label}
                </Text>
                {selectedStaff.includes(item.value) && <Icon name="check" size={20} color="#fff" />}
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyListText}>No staff found</Text>}
          />

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              setModalVisible(false)
              // Update formData with selected staff IDs
              setFormData((prev) => ({
                ...prev,
                staffName: selectedStaff.join(","),
              }))
            }}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals List</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.inactiveButton}
          onPress={async () => {
            try {
              const userData = await AsyncStorage.getItem("userData")
              if (!userData) {
                Alert.alert("Error", "User data not found. Please login again.")
                return
              }

              const user = JSON.parse(userData)

              // Get the appointment data from AsyncStorage if available
              const appointmentData = await AsyncStorage.getItem("currentAppointment")
              if (appointmentData) {
                const appointment = JSON.parse(appointmentData)
                // Add the user data to the appointment object
                appointment.user = user
                navigation.navigate("GoalsListDetail", { appointment })
              } else {
                Alert.alert("Error", "No appointment data found. Please select an appointment from the home screen.")
              }
            } catch (error) {
              console.error("Error navigating to details:", error)
              Alert.alert("Error", "Failed to navigate to details screen.")
            }
          }}
        >
          <Text style={styles.inactiveText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inactiveButton}
          onPress={async () => {
            try {
              const userData = await AsyncStorage.getItem("userData")
              if (!userData) {
                Alert.alert("Error", "User data not found. Please login again.")
                return
              }

              const user = JSON.parse(userData)

              // Get the appointment data from AsyncStorage if available
              const appointmentData = await AsyncStorage.getItem("currentAppointment")
              if (appointmentData) {
                const appointment = JSON.parse(appointmentData)
                // Add the user data to the appointment object
                appointment.user = user
                navigation.navigate("GoalsListNotes", { profileData: appointment })
              } else {
                Alert.alert("Error", "No appointment data found. Please select an appointment from the home screen.")
              }
            } catch (error) {
              console.error("Error navigating to notes:", error)
              Alert.alert("Error", "Failed to navigate to notes screen.")
            }
          }}
        >
          <Text style={styles.inactiveText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activeButton}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.staffSection}>
          <Text style={styles.label}>Name of Staff</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
          ) : (
            <>
              <View style={styles.selectedStaffContainer}>
                {selectedStaff.length > 0 ? (
                  selectedStaff.map((staffId) => {
                    const staff = staffList.find((s) => s.value === staffId)
                    return (
                      <View key={staffId} style={styles.selectedStaffItem}>
                        <Text style={styles.selectedStaffText}>{staff ? staff.label : "Unknown Staff"}</Text>
                        <TouchableOpacity
                          style={styles.removeStaffButton}
                          onPress={() => toggleStaffSelection(staffId)}
                        >
                          <Icon name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                  <Text style={styles.noStaffText}>No staff selected</Text>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {renderStaffSelectionModal()}
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: "#007bff",
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
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  staffSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  staffSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007bff",
    marginBottom: 10,
  },
  staffSelectorText: {
    fontSize: 16,
    color: "#333",
  },
  selectedStaffContainer: {
    marginTop: 10,
  },
  selectedStaffItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedStaffText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  removeStaffButton: {
    padding: 5,
  },
  noStaffText: {
    fontSize: 14,
    color: "gray",
    fontStyle: "italic",
    padding: 10,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  staffItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedStaffItemInList: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  staffItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedStaffItemTextInList: {
    color: "white",
  },
  emptyListText: {
    textAlign: "center",
    padding: 20,
    color: "gray",
    fontStyle: "italic",
  },
  doneButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default GoalsListVerify
