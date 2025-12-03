import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AlertTriangle,
  Droplets,
  CloudRain,
  Volume2,
} from "lucide-react-native";
import { PageHeader } from "@/components/ui/PageHeader";
import { FarmerHeader } from "@/components/FarmerHeader";
import { Card } from "@/components/ui/Card";

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FarmerHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PageHeader
          title="Alerts & Notifications"
          subtitle="Latest events affecting your farm"
          rightElement={
            <TouchableOpacity style={styles.voiceButton}>
              <Volume2 size={20} color="#0ea5e9" />
              <Text style={styles.voiceText}>Read Aloud</Text>
            </TouchableOpacity>
          }
        />

        <AlertCard
          type="warning"
          title="Low Groundwater Warning"
          desc="Water levels in your area have dropped below 2.5m. Please reduce irrigation."
          time="2 hours ago"
          icon={Droplets}
        />

        <AlertCard
          type="danger"
          title="Heavy Rainfall Alert"
          desc="Heavy rain expected in the next 24 hours. Ensure proper drainage in fields."
          time="5 hours ago"
          icon={CloudRain}
        />

        <AlertCard
          type="info"
          title="Crop Disease Outbreak"
          desc="Leaf Blight reported in nearby farms. Check your crops immediately."
          time="1 day ago"
          icon={AlertTriangle}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function AlertCard({ type, title, desc, time, icon: Icon }: any) {
  const colors = {
    warning: {
      bg: "#fffbeb",
      border: "#fcd34d",
      icon: "#d97706",
      text: "#92400e",
    },
    danger: {
      bg: "#fef2f2",
      border: "#fca5a5",
      icon: "#dc2626",
      text: "#991b1b",
    },
    info: {
      bg: "#eff6ff",
      border: "#93c5fd",
      icon: "#2563eb",
      text: "#1e40af",
    },
  };
  const color = colors[type as keyof typeof colors];

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: color.bg, borderColor: color.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: color.bg }]}>
          <Icon size={24} color={color.icon} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.cardTitle, { color: color.text }]}>{title}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
      <Text style={[styles.cardDesc, { color: color.text }]}>{desc}</Text>
    </Card>
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

  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  voiceText: {
    color: "#0ea5e9",
    fontWeight: "600",
    fontSize: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  iconBox: {
    padding: 8,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
});
