import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Import FontAwesome
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Import FontAwesome

const ProfileScreen = () => {
  const [logoutVisible, setLogoutVisible] = useState(false);

  const navigation = useNavigation();

  const handleLogout = () => {
    setLogoutVisible(false);
    console.log("User logged out"); 
    // Add logout logic here (e.g., clearing auth state)
  };
  const handleInvoiceScreen = () => {
    navigation.navigate("InvoiceScreen");
  };const handleProfileScreen = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>
   <ScrollView>
      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://s3-alpha-sig.figma.com/img/4162/414c/9b3f703ad8d5623b1cf082032f5945e2?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=R97CmYtwIVz2Oe2r0JEtfBf7jbRrDD5BfyTacYKtzxKS1C6jp6zjENf3dwN4CEX-svyf1ch2341VUd-eJpc5VkmSQWzjlqL4KjYYmHuVZ0MVvK~3Rxr4pzRceU8oh4MTj4ZEaGdyQSE19kXxJmGF539SbMcpz41u-0YnE-pczBbW9ksMWcmcqVkA3xRy3U2U5PU0mOdq3Jn3jN8vs0UvGLphAwcOldBpThFsBkxYCaaFcAQ-pbh~3Fod3ycsw9S-v4jbGpzkjZ8tgfKZLqggFUsrTf~6wkI4JhIi0Rd~eyVLvH-HPA2r4FOzFiocexd4OA3pnbA8shOfTb-02scWpA__" }} // Replace with valid image URL
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Taha</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value="M Taha" editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value="taha@gmail.com" editable={false} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value="98765 43210" editable={false} />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value="Vijay Nagar, Indore" editable={false} />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutVisible(true)}>
        <MaterialCommunityIcons name="logout" size={20} color="blue" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal transparent={true} visible={logoutVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <MaterialCommunityIcons name="logout" size={40} color="blue" />
            <Text style={styles.modalText}>
              Are you sure you want to <Text style={{ color: "blue", fontWeight: "bold" }}>Logout?</Text>
            </Text>
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
        <TouchableOpacity style={styles.navItem} onPress={handleInvoiceScreen}>
                       <FontAwesome5 name="file-invoice-dollar" size={24} color="white" />
                       <Text style={styles.navText}>Invoice</Text>
                     </TouchableOpacity> 
       
                     <TouchableOpacity style={styles.navItem} onPress={handleProfileScreen}>
                     <Image
                   source={{ uri: "https://s3-alpha-sig.figma.com/img/4162/414c/9b3f703ad8d5623b1cf082032f5945e2?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mYPodw9VISmiL3Te0b0NsD1K3t9IV6JBwH7V0~RER-1unny7yayjiksOTxetl0XU0uwV1KqsAUbQ8vThqHlMm42EawzLagnpyx02xITEu3CH7wzGBNvOWNekEp2NiRZ~3etFDkC-LKjgEScvKTGjZCcg4hU3D0NV2fAYDH0kVez2cKLlEkHCQXxexzCkOIeOv7MraUxkyZVZyvNOE9tsWlmwIpNckULLd~eImFK1-c1wEloYTSaCnyBtKpDg4pd6EV4~FAgJ0Cw20HWMISE9KWFZcAjp6vRYqBhzZvZGn19fLG7rZxqhAABopPZuehdneCD7ZnRrPngd~Y3yfqHPpQ__" }}
                   style={styles.profileImages}
                 />              <Text style={styles.navText}>Profile</Text>
                     </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0080DC",
    paddingVertical: 35,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, color: "white", fontWeight: "bold" },
  profileContainer: { alignItems: "center", marginTop: 20 },
  profileImage: { width: 90, height: 90, borderRadius: 50 },
  profileName: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  inputContainer: { paddingHorizontal: 20, marginTop: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { backgroundColor: "#E7EDFF", padding: 15, borderRadius: 10, marginBottom: 15 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7EDFF",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  logoutText: { fontSize: 16, color: "blue", marginLeft: 10 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "#FFFFFF", padding: 50, paddingHorizontal: 20, borderRadius: 30, width: 350, alignItems: "center" },
  modalText: { fontSize: 16, textAlign: "center", marginVertical: 15 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelButton: { backgroundColor: "#E7EDFF", padding: 10, borderRadius: 35, flex: 1, alignItems: "center", marginRight: 10 },
  cancelText: { color: "black", fontWeight: "bold" },
  yesButton: { backgroundColor: "blue", padding: 10, borderRadius: 35, flex: 1, alignItems: "center" },
  yesText: { color: "white", fontWeight: "bold" },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#007bff', padding: 10, position: 'absolute', bottom: 0, width: '100%' },
  navItem: { alignItems: 'center' },
  navText: { color: 'white', fontSize: 12, marginTop: 2 },
  profileImages:{
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default ProfileScreen;
