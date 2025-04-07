import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const CollectDataScreen = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [showCanceled, setShowCanceled] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserAndAppointments();
  }, []);

  const fetchUserAndAppointments = async () => {
    try {
      setLoading(true);
      const user = await AsyncStorage.getItem("userData");
      if (!user) throw new Error("User not found in storage");

      const userData = JSON.parse(user);
      if (!userData.api_token) throw new Error("Token missing");

      // Fetch User Profile
      const profileResponse = await axios.get(
        "https://therapy.kidstherapy.me/api/profile",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userData.api_token}`,
          },
        }
      );
      setUser(profileResponse.data);

      // Fetch Appointments
      const appointmentsResponse = await axios.get(
        "https://therapy.kidstherapy.me/api/patient-appointments",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userData.api_token}`,
          },
        }
      );
      setAppointments(appointmentsResponse.data.appointments);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };
  const handleInvoiceScreen = () => {
    navigation.navigate("InvoiceScreen");
  };
  const handleAppointmentPress = (appointment) => {
    navigation.navigate("DataDetail", { appointment });
  };

  const renderAppointment = ({ item }) => {
    const status = item.appointment_status?.name === "Completed" ? "Completed" : "Pending";

    return (
      <TouchableOpacity
        onPress={() => handleAppointmentPress(item)}
        style={[
          styles.card,
          status === "Completed" ? styles.completedCard : styles.pendingCard,
        ]}
      >
        <View style={styles.iconContainer}>
          {status === "Completed" ? (
            <AntDesign name="checksquare" size={40} color="#00AB5F" />
          ) : (
            <FontAwesome name="calendar" size={40} color="#FF6930" />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>
            Direct Therapy with {item.user?.name}
          </Text>
          <Text style={styles.date}>
            {`${item.appointment_date}  ${item.start_time} - ${item.end_time}`}
          </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.billable}>Billable</Text>
            <Text
              style={[
                styles.statusText,
                status === "Completed" ? styles.completedText : styles.pendingText,
              ]}
            >
              {status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals List</Text>
      </View>

      {/* Session List */}
      <FlatList
        style={styles.FlatList}
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAppointment}
        ListEmptyComponent={() => <Text style={styles.noData}>No Appointments</Text>}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("CollectData")}>
          <FontAwesome name="database" size={24} color="white" />
          <Text style={styles.navText}>Data Collect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleInvoiceScreen}>
          <FontAwesome5 name="file-invoice-dollar" size={24} color="white" />
          <Text style={styles.navText}>Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <FontAwesome name="user" size={24} color="white" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
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
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10, shadowColor: "#000",
    shadowOpacity: 0.1, shadowRadius: 5, elevation: 0,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#0080DC33",
    height: 120,
    paddingBottom: 0,

    margin: 0,

  }, completedCard: {
    backgroundColor: "#E7EDFF"

  },
  pendingCard: {
    backgroundColor: "#E7EDFF"
  },
  iconContainer: {
    marginRight: 10,
    top: -12
  },
  detailsContainer: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#090D4D"
  },
  date: {
    fontSize: 12,
    color: "#090D4D",
    marginVertical: 5
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  billable: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: -45,
    color: "#090D4D"
  }, title: { fontSize: 14, fontWeight: 'bold', color: '#090D4D' }, statusText: {
    fontSize: 12,
    fontWeight: "bold"
  },
  completedText: {
    color: "#00AB5F"
  },
  pendingText: {
    color: "#FF6930"
  },
  date: { fontSize: 12, color: '#090D4D' },
  completedText: { fontSize: 14, fontWeight: 'bold', color: 'green' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#007bff', padding: 10, position: 'absolute', bottom: 0, width: '100%' },
  navItem: { alignItems: 'center' },
  navText: { color: 'white', fontSize: 12, marginTop: 2 },
});

export default CollectDataScreen;
