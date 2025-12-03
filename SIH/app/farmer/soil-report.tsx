import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { FarmerHeader } from "@/components/FarmerHeader";
import { Sprout, AlertCircle, CheckCircle2 } from "lucide-react-native";

export default function SoilReportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ headerTitle: "Soil Health", headerBackTitle: "Home" }}
      />
      <FarmerHeader />
      <AiFab />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overall Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>84</Text>
            <Text style={styles.scoreTotal}>/100</Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreTitle}>Soil Fertility Score</Text>
            <Text style={styles.scoreSubtitle}>
              Your soil is healthy but needs some Nitrogen.
            </Text>
          </View>
        </View>

        {/* Nutrient Grid */}
        <Text style={styles.sectionTitle}>Nutrient Status</Text>
        <View style={styles.grid}>
          <NutrientCard name="Nitrogen (N)" value="Low" status="low" />
          <NutrientCard name="Phosphorus (P)" value="Good" status="good" />
          <NutrientCard name="Potassium (K)" value="High" status="good" />
          <NutrientCard name="Iron (Fe)" value="Good" status="good" />
          <NutrientCard name="Zinc (Zn)" value="Medium" status="medium" />
          <NutrientCard name="pH Level" value="6.5" status="good" />
        </View>

        {/* Recommendations */}
        <Text style={styles.sectionTitle}>Fertilizer Schedule</Text>
        <View style={styles.recommendationCard}>
          <View style={styles.recItem}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>15</Text>
              <Text style={styles.monthText}>OCT</Text>
            </View>
            <View style={styles.recContent}>
              <Text style={styles.recTitle}>Urea Application</Text>
              <Text style={styles.recDesc}>
                Apply 25kg/acre to boost Nitrogen levels.
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.recItem}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>01</Text>
              <Text style={styles.monthText}>NOV</Text>
            </View>
            <View style={styles.recContent}>
              <Text style={styles.recTitle}>Compost Mix</Text>
              <Text style={styles.recDesc}>
                Add organic compost for better soil texture.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NutrientCard({
  name,
  value,
  status,
}: {
  name: string;
  value: string;
  status: "good" | "medium" | "low";
}) {
  const colors = {
    good: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
    medium: { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
    low: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
  };
  const color = colors[status];

  return (
    <View
      style={[
        styles.nutrientCard,
        { borderColor: color.border, backgroundColor: color.bg },
      ]}
    >
      <Text style={[styles.nutrientName, { color: color.text }]}>{name}</Text>
      <Text style={[styles.nutrientValue, { color: color.text }]}>{value}</Text>
    </View>
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
  scoreCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#0ea5e9",
    marginRight: 20,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0ea5e9",
  },
  scoreTotal: {
    fontSize: 12,
    color: "#64748b",
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  nutrientCard: {
    width: "31%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  nutrientName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  recItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateBox: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 16,
    width: 60,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  monthText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  recDesc: {
    fontSize: 13,
    color: "#64748b",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 16,
  },
});
