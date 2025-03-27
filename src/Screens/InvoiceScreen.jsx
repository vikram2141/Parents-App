import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const invoiceData = [
  { id: "1", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "2", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" },
  { id: "3", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "4", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" },
  { id: "5", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "6", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" },
  { id: "7", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "8", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" },
  { id: "9", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "10", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" },
  { id: "11", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "12", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" },
  {  id: "13", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "14", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" }, 
  { id: "15", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "16", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" },
  { id: "17", date: "17/02/25", caseType: "ABC", paid: "7200", due: "0", total: "4545" },
  { id: "18", date: "17/02/25", caseType: "XYZ", paid: "1245", due: "0", total: "4545" },
];

const InvoiceTable = () => {
  const navigation = useNavigation(); // ✅ Moved inside component

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.caseType}</Text>
      <Text style={styles.cell}>{item.paid}</Text>
      <Text style={styles.cell}>{item.due}</Text>
      <Text style={styles.cell}>{item.total}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="eye" size={20} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, styles.editButton]}>
          <MaterialIcons name="payments" size={20} color="#007BFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Invoice</Text>
      
      <View style={styles.table}>
        {/* ✅ Fixed missing "Total" column in the header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>#</Text>
          <Text style={styles.headerCell}>Inv. Date</Text>
          <Text style={styles.headerCell}>Case/Non Case</Text>
          <Text style={styles.headerCell}>Amt. Paid</Text>
          <Text style={styles.headerCell}>Amt. Due</Text>
          <Text style={styles.headerCell}>Total</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>

        {/* ✅ Removed unnecessary ScrollView */}
        <FlatList 
          data={invoiceData} 
          keyExtractor={(item) => item.id} 
          renderItem={renderItem} 
        />
      </View>

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

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("InvoiceScreen")}>
          <FontAwesome5 name="file-invoice-dollar" size={24} color="white" />
          <Text style={styles.navText}>Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: "https://s3-alpha-sig.figma.com/img/4162/414c/9b3f703ad8d5623b1cf082032f5945e2?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=R97CmYtwIVz2Oe2r0JEtfBf7jbRrDD5BfyTacYKtzxKS1C6jp6zjENf3dwN4CEX-svyf1ch2341VUd-eJpc5VkmSQWzjlqL4KjYYmHuVZ0MVvK~3Rxr4pzRceU8oh4MTj4ZEaGdyQSE19kXxJmGF539SbMcpz41u-0YnE-pczBbW9ksMWcmcqVkA3xRy3U2U5PU0mOdq3Jn3jN8vs0UvGLphAwcOldBpThFsBkxYCaaFcAQ-pbh~3Fod3ycsw9S-v4jbGpzkjZ8tgfKZLqggFUsrTf~6wkI4JhIi0Rd~eyVLvH-HPA2r4FOzFiocexd4OA3pnbA8shOfTb-02scWpA__" }} // ✅ Placeholder image
            style={styles.profileImage}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 60, // ✅ Avoids overlap with bottom navigation
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginLeft:5,
    marginRight:5,
    marginBottom:5,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    paddingVertical: 8,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  actionCell: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconButton: {
    padding: 0,
    marginHorizontal: 2,
    marginVertical:2,
    borderRadius: 8,
  },
 
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#007bff",
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default InvoiceTable;
