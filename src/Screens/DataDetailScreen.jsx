import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get('window').width;

const CollectDataScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logoText}>Goals List</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.infoText}><Text style={styles.label}>Patient Name:</Text> Taha</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Appointment Date:</Text> 17 Feb 2025</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Appointment Start Time:</Text> 03:00 PM</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Appointment End Time:</Text> 05:30 PM</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Goal / Objective Data:</Text> (for this session)</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Description:</Text> ABC</Text>
            <Text style={styles.infoText}>Looks to one side at hand or toy</Text>
          </View>
        </View>

        {/* Line Chart */}
        <LineChart
          data={{
            labels: ["12:20", "12:21", "12:22", "12:23", "12:24"],
            datasets: [{ data: [10, 90, 20, 60, 30] }]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 }
          }}
          style={styles.chart}
        />

        {/* Pagination */}
        <View style={styles.pagination}>
          {[1, 2, 3, 4, 5].map((page, index) => (
            <TouchableOpacity key={index} style={styles.pageButton}>
              <Text style={styles.pageButtonText}>{page}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
  scrollContent: { paddingBottom: 80 },
  header: {
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "#0073e6",
    padding: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  back: {
    position: 'absolute',
    left: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  pagination: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 10 
  },
  pageButton: {
    backgroundColor: '#007bff',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 5,
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007bff',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: { alignItems: 'center' },
  navText: { color: 'white', fontSize: 12, marginTop: 2 },
});

export default CollectDataScreen;
