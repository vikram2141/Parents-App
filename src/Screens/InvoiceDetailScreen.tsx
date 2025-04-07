import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { RouteProp, useRoute } from '@react-navigation/native';

type InvoiceDetailParams = {
  htmlContent: string;
};

const InvoiceDetailScreen = () => {
  const route = useRoute<RouteProp<{ params: InvoiceDetailParams }, 'params'>>();
  const { htmlContent } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView 
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default InvoiceDetailScreen;

const styles = StyleSheet.create({});
