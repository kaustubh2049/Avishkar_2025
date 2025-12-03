import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useStations } from "@/providers/stations-provider";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import { Bell, RefreshCw, LogOut, MapPin, Bot } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";

export function FarmerHeader() {
  const { userLocation, isLoadingLocation, requestLocationPermission, locationError } = useStations();
  const { user, logout } = useAuth();
  const [locationName, setLocationName] = useState<string>("Locating...");

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.greetingText}>{getGreeting()},</Text>
        <Text style={styles.userNameText}>{user?.name || "Farmer"}</Text>
        <View style={styles.locationContainer}>
          {isLoadingLocation ? (
            <View style={styles.locationStatus}>
              <ActivityIndicator size="small" color="#0891b2" />
              <Text style={styles.locationText}>Locating...</Text>
            </View>
          ) : userLocation ? (
            <View style={styles.locationStatus}>
              <MapPin size={12} color="#64748b" />
              <Text style={styles.locationText}>{locationName}</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={requestLocationPermission} style={styles.locationStatus}>
              <Text style={[styles.locationText, { color: "#dc2626" }]}>Enable Location</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/farmer/alerts")}>
          <Bell size={22} color="#64748b" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={requestLocationPermission} disabled={isLoadingLocation}>
          {isLoadingLocation ? (
            <ActivityIndicator size={20} color="#0891b2" />
          ) : (
            <RefreshCw size={20} color="#0891b2" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <LogOut size={22} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AiFab() {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={styles.fabOverlay}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push("/farmer/chatbot")}
        style={[styles.fabButton, { bottom: (insets.bottom || 0) + 72 }]}
      >
        <Bot size={24} color="#ffffff" />
        <Text style={styles.fabLabel}>AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  headerLeft: { flex: 1 },
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
  locationContainer: { flexDirection: "row", alignItems: "center" },
  locationStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: { fontSize: 12, color: "#64748b", marginLeft: 4, fontWeight: "500" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconButton: { padding: 8, backgroundColor: "#f1f5f9", borderRadius: 12, position: "relative" },
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
  fabOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  fabButton: {
    position: "absolute",
    right: 16,
    backgroundColor: "#0ea5e9",
    borderRadius: 28,
    height: 56,
    minWidth: 56,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});

