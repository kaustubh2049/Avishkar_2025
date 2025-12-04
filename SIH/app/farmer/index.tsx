import { StationCard } from "@/components/station-card";
import { StationMap } from "@/components/station-map";
import { useStations } from "@/providers/stations-provider";
import { router } from "expo-router";
import { Droplet, Info, Layers, CloudRain, Thermometer, Leaf, ChevronDown } from "lucide-react-native";
import { FarmerHeader, AiFab } from "@/components/FarmerHeader";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from 'expo-location';
import { fetchWeather, WeatherData } from "@/services/weather-service";

const { width } = Dimensions.get("window");

type MapLayer = "groundwater" | "rainfall" | "soil" | "crop";

function MapScreenContent() {
  const { 
    stations, 
    nearbyStations, 
    userLocation, 
    isLoadingLocation, 
    locationError, 
    requestLocationPermission,
    estimatedLevel,
  } = useStations();
  const [activeLayer, setActiveLayer] = useState<MapLayer>("groundwater");
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("Locating...");
  const insets = useSafeAreaInsets();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (userLocation) {
      fetchWeather(userLocation.latitude, userLocation.longitude).then(setWeather);
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      (async () => {
        try {
          const [address] = await Location.reverseGeocodeAsync({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          });
          if (address) {
            const name = [address.city, address.region, address.country].filter(Boolean).join(", ");
            setLocationName(name || "Unknown Location");
          }
        } catch (e) {
          setLocationName(`${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)}`);
        }
      })();
    } else if (locationError) {
      setLocationName("Location Unavailable");
    } else {
      setLocationName("Locating...");
    }
  }, [userLocation, locationError]);

  

  const renderSummaryCard = (
    title: string,
    value: string,
    subtext: string,
    icon: any,
    color: string,
    bgColors: readonly [string, string, ...string[]],
    onPress?: () => void,
  ) => (
    <TouchableOpacity activeOpacity={onPress ? 0.8 : 1} onPress={onPress}>
      <LinearGradient
        colors={bgColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryCardHeader}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <Text style={styles.summaryCardTitle}>{title}</Text>
        </View>
        <Text style={styles.summaryCardValue}>{value}</Text>
        <Text style={styles.summaryCardSubtext}>{subtext}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FarmerHeader />
      <AiFab />
      <View style={styles.summaryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryContent}
        >
          {/* Groundwater Card */}
          {renderSummaryCard(
            "Groundwater",
            estimatedLevel ? `${estimatedLevel.toFixed(1)}m` : "--",
            "Current Level",
            <Droplet size={20} color="#fff" />,
            "#0ea5e9",
            ["#3b82f6", "#2563eb"]
          )}

          {/* Weather Card */}
          {renderSummaryCard(
            "Weather",
            weather ? `${weather.current.temp}°C` : "--",
            weather ? `${weather.current.condition} • ${weather.current.humidity}% Hum` : "Loading...",
            <CloudRain size={20} color="#fff" />,
            "#f59e0b",
            ["#f59e0b", "#d97706"]
          )}

          {/* Soil Health Card */}
          {renderSummaryCard(
            "Soil Health",
            "Good",
            "Nitrogen: Optimal",
            <Leaf size={20} color="#fff" />,
            "#22c55e",
            ["#22c55e", "#16a34a"],
            () => router.push("/farmer/soil-report")
          )}
        </ScrollView>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>Live Monitoring Map</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.pulsingDot} />
            <Text style={styles.liveText}>Live Updates</Text>
          </View>
        </View>

        <View style={{ flex: 1, position: 'relative' }}>
          <StationMap
            stations={stations} // Pass all stations, map component can handle filtering if needed
            userLocation={userLocation}
            onStationPress={(station) => router.push(`/station/${station.id}`)}
          />

          {/* Layer Control FAB */}
          <View style={styles.layerControlContainer}>
            {isLayerMenuOpen && (
              <View style={styles.layerMenu}>
                <Text style={styles.layerMenuTitle}>Map Layers</Text>
                
                <TouchableOpacity 
                  style={[styles.layerOption, activeLayer === 'groundwater' && styles.layerOptionActive]}
                  onPress={() => { setActiveLayer('groundwater'); setIsLayerMenuOpen(false); }}
                >
                  <Droplet size={16} color={activeLayer === 'groundwater' ? "#0ea5e9" : "#64748b"} />
                  <Text style={[styles.layerOptionText, activeLayer === 'groundwater' && styles.layerOptionTextActive]}>Groundwater</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.layerOption, activeLayer === 'rainfall' && styles.layerOptionActive]}
                  onPress={() => { setActiveLayer('rainfall'); setIsLayerMenuOpen(false); }}
                >
                  <CloudRain size={16} color={activeLayer === 'rainfall' ? "#0ea5e9" : "#64748b"} />
                  <Text style={[styles.layerOptionText, activeLayer === 'rainfall' && styles.layerOptionTextActive]}>Rainfall Heatmap</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.layerOption, activeLayer === 'soil' && styles.layerOptionActive]}
                  onPress={() => { setActiveLayer('soil'); setIsLayerMenuOpen(false); }}
                >
                  <Leaf size={16} color={activeLayer === 'soil' ? "#0ea5e9" : "#64748b"} />
                  <Text style={[styles.layerOptionText, activeLayer === 'soil' && styles.layerOptionTextActive]}>Soil Moisture</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.layerFab}
              onPress={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            >
              <Layers size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Sheet (Nearby Insights) */}
      <View style={[styles.bottomSheet, isBottomSheetExpanded && styles.bottomSheetExpanded]}>
        <TouchableOpacity
          style={styles.bottomSheetHandle}
          onPress={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
        >
          <View style={styles.handle} />
        </TouchableOpacity>

        <View style={styles.bottomSheetHeader}>
          <View>
            <Text style={styles.bottomSheetTitle}>Nearby Insights</Text>
            <Text style={styles.bottomSheetSubtitle}>
              {nearbyStations.length} stations within 50km
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
          >
            <ChevronDown size={20} color="#64748b" style={{ transform: [{ rotate: isBottomSheetExpanded ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={nearbyStations}
          keyExtractor={(station) => station.id}
          renderItem={({ item: station }) => (
            <StationCard
              station={station}
              onPress={() => router.push(`/station/${station.id}`)}
            />
          )}
          style={styles.stationsList}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </View>
  );
}

export default function MapScreen() {
  return (
    <MapScreenContent />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  userNameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 4,
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  summaryContainer: {
    marginBottom: 0,
    backgroundColor: "white",
    paddingBottom: 16,
    paddingTop: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  summaryContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  summaryCard: {
    width: width * 0.42,
    padding: 16,
    borderRadius: 20,
    justifyContent: "space-between",
    height: 140,
  },
  summaryCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCardTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  summaryCardSubtext: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    marginBottom: 110,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "white",
    elevation: 4,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "white",
    // Removed border to bring map closer visually
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#15803d",
  },
  layerControlContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    alignItems: "flex-end",
  },
  layerFab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  layerMenu: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 8,
    marginBottom: 12,
    width: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  layerMenuTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
    paddingHorizontal: 8,
    textTransform: "uppercase",
  },
  layerOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  layerOptionActive: {
    backgroundColor: "#e0f2fe",
  },
  layerOptionText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  layerOptionTextActive: {
    color: "#0ea5e9",
    fontWeight: "600",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
    zIndex: 50,
  },
  bottomSheetExpanded: {
    height: "75%",
    zIndex: 60,
  },
  bottomSheetHandle: {
    alignItems: "center",
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#cbd5e1",
    borderRadius: 2,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  bottomSheetSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  expandButton: {
    padding: 8,
  },
  stationsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
