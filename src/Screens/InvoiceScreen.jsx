import { useEffect, useState, useCallback } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const InvoiceTable = () => {
  const navigation = useNavigation()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  // Function to get user data from AsyncStorage
  const getUserData = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("userData")
      if (!user) throw new Error("User not found in storage")

      const parsedUserData = JSON.parse(user)
      setUserData(parsedUserData)
      return parsedUserData
    } catch (error) {
      console.error("Error getting user data:", error)
      Alert.alert("Error", "Failed to get user data. Please login again.")
      return null
    }
  }, [])

  // Function to Fetch API Data
  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    try {
      // Get user data to access the API token
      const user = await getUserData()
      if (!user) {
        setLoading(false)
        return
      }

      // Create FormData as shown in the API example
      const formData = new FormData()

      // Make a POST request using the user's API token
      const response = await axios({
        method: "post",
        url: "https://therapy.kidstherapy.me/api/patient-invoices",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.api_token}`,
        },
        data: formData,
      })

      // Check if we have patients data in the response
      if (response.data && response.data.patients) {
        // Transform API Data according to the structure we saw in the example
        const formattedData = response.data.patients.map((invoice) => ({
          id: invoice.id.toString(),
          date: formatDate(invoice.invoice_date), // Format date to DD/MM/YY
          caseType: determineCaseType(invoice.id), // Alternate between ABC and XYZ as in the original UI
          paid: invoice.paid.toString(),
          due: invoice.due.toString(),
          total: invoice.grand_total.toString(), // Use grand_total as shown in the API data
        }))

        setInvoices(formattedData)
      } else {
        console.error("Invalid API response format:", response.data)
        Alert.alert("Error", "Received invalid data format from server")
      }
    } catch (error) {
      console.error("Error fetching invoices:", error.response?.data || error.message)
      Alert.alert("Error", "Failed to load invoices. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [getUserData])

  // Replace the fetchInvoiceDetails function with this improved version
  const fetchInvoiceDetails = async (invoiceId) => {
    try {
      // Get user data to access the API token
      const user = await getUserData()
      if (!user) {
        return null
      }

      console.log("Fetching invoice details for ID:", invoiceId)
      
      // Try to get the raw HTML content first
      try {
        const response = await fetch('https://therapy.kidstherapy.me/api/show-invoice', {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/html',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.api_token}`
          },
          body: JSON.stringify({
            invoice_id: invoiceId
          })
        });
        
        // Check if the response is HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const htmlContent = await response.text();
          console.log("Received HTML content");
          return htmlContent;
        }
        
        // If not HTML, try to parse as JSON
        const data = await response.json();
        console.log("Invoice Details Response:", JSON.stringify(data, null, 2));
        return data;
      } catch (error) {
        console.error("First approach failed:", error.message);
        
        // Try alternative approach with FormData
        console.log("Trying alternative approach with FormData");
        const formData = new FormData();
        formData.append('invoice_id', invoiceId);
        
        const response = await fetch('https://therapy.kidstherapy.me/api/show-invoice', {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/html',
            'Authorization': `Bearer ${user.api_token}`
          },
          body: formData
        });
        
        // Check if the response is HTML
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const htmlContent = await response.text();
          console.log("Received HTML content from FormData approach");
          return htmlContent;
        }
        
        // If not HTML, try to parse as JSON
        const data = await response.json();
        console.log("FormData Response:", JSON.stringify(data, null, 2));
        return data;
      }
    } catch (error) {
      console.error("All approaches failed:", error.message);
      Alert.alert("Error", "Failed to load invoice details. Please try again.");
      return null;
    }
  }

  // Update the handleViewInvoice function to better handle the response
  const handleViewInvoice = async (invoiceId) => {
    try {
      // Show loading indicator
      setLoading(true)

      // Fetch invoice details
      const invoiceDetails = await fetchInvoiceDetails(invoiceId)

      // Hide loading indicator
      setLoading(false)

      if (invoiceDetails) {
        console.log("Navigating to InvoiceDetail with data type:", typeof invoiceDetails);
        // Navigate to invoice detail screen with the fetched data
        navigation.navigate("InvoiceDetail", {
          invoiceId: invoiceId,
          invoiceDetails: invoiceDetails,
        })
      } else {
        Alert.alert("Error", "Could not retrieve invoice details. Please try again.")
      }
    } catch (error) {
      setLoading(false)
      console.error("Error handling view invoice:", error)
      Alert.alert("Error", "Something went wrong. Please try again.")
    }
  }

  // Helper function to format date from YYYY-MM-DD to DD/MM/YY
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(2)
    return `${day}/${month}/${year}`
  }

  // Determine case type based on invoice ID (alternating between ABC and XYZ)
  const determineCaseType = (id) => {
    return Number.parseInt(id) % 2 === 0 ? "XYZ" : "ABC"
  }

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  // Render FlatList Items
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.caseType}</Text>
      <Text style={styles.cell}>{item.paid}</Text>
      <Text style={styles.cell}>{item.due}</Text>
      <Text style={styles.cell}>{item.total}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleViewInvoice(item.id)}>
          <FontAwesome name="eye" size={15} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.editButton]}
          onPress={() => Alert.alert("Payment", "Payment functionality coming soon!")}
        >
          <MaterialIcons name="payments" size={15} color="#007BFF" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Invoice</Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>#</Text>
          <Text style={styles.headerCell}>Inv. Date</Text>
          <Text style={styles.headerCell}>Case/Non Case</Text>
          <Text style={styles.headerCell}>Amt. Paid</Text>
          <Text style={styles.headerCell}>Amt. Due</Text>
          <Text style={styles.headerCell}>Total</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={invoices}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ListEmptyComponent={<Text style={styles.emptyText}>No invoices found</Text>}
            />
          </View>
        )}
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
          <FontAwesome name="user-o" size={24} color="white" />

          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 60,
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
    marginHorizontal: 5,
    marginBottom: 5,
    flex: 1, // Added flex: 1 to ensure the table takes available space
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
    margin:8,
  },
  iconButton: {
    padding: 0,
    marginHorizontal: 2,
    borderRadius: 8,
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#888",
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
})

export default InvoiceTable