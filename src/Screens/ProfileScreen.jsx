import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormData from "form-data";

const ProfileScreen = () => {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [emailDataUpdate, setEmailDataUpdate] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = await AsyncStorage.getItem("userData");
      if (!user) throw new Error("User not found in storage");

      const userData = JSON.parse(user);
      setEmailDataUpdate(userData.email);

      let data = new FormData();
      let config = {
        method: "get",
        url: "https://therapy.kidstherapy.me/api/profile",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data", // Fixed Content-Type issue
          Authorization: `Bearer ${userData.api_token}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log("Profile Data:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Data using FlatList to prevent VirtualizedLists warning */}
      <FlatList
        data={profile ? [profile] : []}
        keyExtractor={() => "profile-data"}
        renderItem={({ item }) => (
          <View>
            <View style={styles.profileContainer}>
              <Image source={{ uri: item.image }} style={styles.profileImage} />
              <Text style={styles.profileName}>{item.name}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={item.name || ""} editable={false} />

              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={emailDataUpdate || ""} editable={false} />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} value={item.phone || ""} editable={false} />

              <Text style={styles.label}>Address</Text>
              <TextInput style={styles.input} value={item.address || ""} editable={false} />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutVisible(true)}>
              <MaterialCommunityIcons name="logout" size={20} color="blue" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.loadingText}>Loading...</Text>}
      />

      {/* Logout Modal */}
      <Modal transparent visible={logoutVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <MaterialCommunityIcons name="logout" size={40} color="blue" />
            <Text style={styles.modalText}>Are you sure you want to Logout?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLogoutVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.yesButton} onPress={handleLogout}>
                <Text style={styles.yesText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0080DC", paddingVertical: 35, paddingHorizontal: 20 },
  headerTitle: { fontSize: 22, color: "white", fontWeight: "bold" },
  profileContainer: { alignItems: "center", marginTop: 20 },
  profileImage: { width: 90, height: 90, borderRadius: 50 },
  profileName: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  loadingText: { textAlign: "center", fontSize: 16, marginTop: 20 },
  inputContainer: { paddingHorizontal: 20, marginTop: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { backgroundColor: "#E7EDFF", padding: 15, borderRadius: 10, marginBottom: 15 },
  logoutButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E7EDFF", padding: 20, borderRadius: 10, margin: 20 },
  logoutText: { fontSize: 16, color: "blue", marginLeft: 10 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "#FFFFFF", padding: 50, paddingHorizontal: 20, borderRadius: 30, width: 350, alignItems: "center" },
  modalText: { fontSize: 16, textAlign: "center", marginVertical: 15 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelButton: { backgroundColor: "#E7EDFF", padding: 10, borderRadius: 35, flex: 1, alignItems: "center", marginRight: 10 },
  cancelText: { color: "black", fontWeight: "bold" },
  yesButton: { backgroundColor: "blue", padding: 10, borderRadius: 35, flex: 1, alignItems: "center" },
  yesText: { color: "white", fontWeight: "bold" },
});

export default ProfileScreen;
