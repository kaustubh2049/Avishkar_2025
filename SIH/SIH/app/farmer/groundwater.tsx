import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Droplets, MapPin, TrendingUp } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import MapView, { Marker } from "react-native-maps";

const screenWidth = Dimensions.get("window").width;

export default function GroundwaterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Groundwater Status", headerBackTitle: "Home" }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Live Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Droplets size={24} color="#0ea5e9" />
            <Text style={styles.statusTitle}>Current Water Level</Text>
          </View>
          <Text style={styles.levelText}>2.8 m</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Good 🟢</Text>
          </View>
          <Text style={styles.locationText}>at your farm location</Text>
        </View>

        {/* Nearby Stations Map */}
        <Text style={styles.sectionTitle}>Nearby DWLR Stations (10km)</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 18.5204,
              longitude: 73.8567,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: 18.5204, longitude: 73.8567 }}
              title="Your Farm"
              pinColor="blue"
            />
            <Marker
              coordinate={{ latitude: 18.5304, longitude: 73.8667 }}
              title="Station A"
              pinColor="green"
            />
            <Marker
              coordinate={{ latitude: 18.5104, longitude: 73.8467 }}
              title="Station B"
              pinColor="orange"
            />
          </MapView>
        </View>

        {/* Prediction Graph */}
        <Text style={styles.sectionTitle}>7-Day Prediction</Text>
        <View style={styles.chartCard}>
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  data: [2.8, 2.7, 2.9, 2.8, 2.6, 2.5, 2.7],
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix="m"
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#0ea5e9",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <View style={styles.insightBox}>
            <TrendingUp size={20} color="#0ea5e9" />
            <Text style={styles.insightText}>
              Water level is expected to remain stable for the next week. Good for irrigation.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  statusTitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  levelText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0f172a",
  },
  badge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginVertical: 8,
  },
  badgeText: {
    color: "#166534",
    fontWeight: "700",
    fontSize: 14,
  },
  locationText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
    marginTop: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 2,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    marginBottom: 24,
  },
  insightBox: {
    flexDirection: "row",
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 12,
    alignItems: "center",
  },
  insightText: {
    flex: 1,
    color: "#0c4a6e",
    fontSize: 14,
    lineHeight: 20,
  },
});
