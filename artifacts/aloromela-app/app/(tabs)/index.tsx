import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const SITE_URL = "https://aloromela.replit.app";

export default function HomeScreen() {
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "web" ? 67 : insets.top }]}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0E9F8A" />
        </View>
      )}
      {Platform.OS !== "web" ? (
        <>
          <WebView
            ref={webViewRef}
            source={{ uri: SITE_URL }}
            style={styles.webview}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
            allowsBackForwardNavigationGestures
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState={false}
            scalesPageToFit={false}
            mixedContentMode="compatibility"
          />
          {canGoBack && (
            <TouchableOpacity
              style={[styles.backBtn, { bottom: insets.bottom + 12 }]}
              onPress={() => webViewRef.current?.goBack()}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.webFallback}>
          <Feather name="book-open" size={48} color="#0E9F8A" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E9F8A",
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    backgroundColor: "#0E9F8A",
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  webFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
