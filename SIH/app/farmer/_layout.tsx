import { Tabs } from "expo-router";
import { CloudSun, MapPin, ScanLine } from "lucide-react-native";
import React from "react";

export default function FarmerLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0ea5e9", // Sky blue
        tabBarInactiveTintColor: "#64748b",
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 56,
          paddingBottom: 4,
          paddingTop: 4,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarItemStyle: { flex: 1, paddingVertical: 4, minHeight: 48 },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, size }) => (
            <CloudSun size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="disease-detection"
        options={{
          title: "Scan Crop",
          tabBarIcon: ({ color, size }) => (
            <ScanLine size={size} color={color} />
          ),
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen name="alerts" options={{ href: null }} />
      <Tabs.Screen name="chatbot" options={{ href: null }} />
      <Tabs.Screen name="groundwater" options={{ href: null }} />
      <Tabs.Screen name="soil-report" options={{ href: null }} />
      <Tabs.Screen name="crop-recommendation" options={{ href: null }} />
      <Tabs.Screen name="irrigation" options={{ href: null }} />
      <Tabs.Screen name="schemes" options={{ href: null }} />
    </Tabs>
  );
}
