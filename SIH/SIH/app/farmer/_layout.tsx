import { Tabs } from "expo-router";
import { CloudSun, MapPin, MessageSquare, Bell, ScanLine } from "lucide-react-native";
import React from "react";
import { useTheme } from "@/providers/theme-provider";

export default function FarmerLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0ea5e9", // Sky blue
        tabBarInactiveTintColor: "#64748b",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
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
          tabBarIcon: ({ color, size }) => <CloudSun size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="disease-detection"
        options={{
          title: "Scan Crop",
          tabBarIcon: ({ color, size }) => <ScanLine size={size} color={color} />,
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
