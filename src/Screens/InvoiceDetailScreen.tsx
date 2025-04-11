import { View, StyleSheet, ActivityIndicator } from "react-native"
import { WebView } from "react-native-webview"
import { type RouteProp, useRoute } from "@react-navigation/native"

type InvoiceDetailParams = {
  invoiceId: string
  invoiceDetails: string
}

const InvoiceDetailScreen = () => {
  const route = useRoute<RouteProp<{ params: InvoiceDetailParams }, "params">>()
  const { invoiceDetails } = route.params

  // Add a loading indicator while the WebView loads
  const renderLoading = () => <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: invoiceDetails }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        renderLoading={renderLoading}
        startInLoadingState={true}
        scalesPageToFit={true}
        style={styles.webview}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default InvoiceDetailScreen
