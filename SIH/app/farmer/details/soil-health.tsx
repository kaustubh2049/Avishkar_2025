import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Leaf,
  Droplet,
  Sun,
  Droplets,
  AlertCircle,
} from "lucide-react-native";
import { FarmerHeader } from "@/components/FarmerHeader";

const SoilHealthDetails = () => {
  const router = useRouter();

  // Mock soil data
  const soilData = {
    score: 68,
    status: "Good",
    nutrients: [
      {
        name: "Nitrogen (N)",
        value: 20,
        status: "Low",
        range: "10-40 ppm",
      },
      {
        name: "Phosphorus (P)",
        value: 45,
        status: "Adequate",
        range: "30-50 ppm",
      },
      { name: "Potassium (K)", value: 85, status: "High", range: "40-80 ppm" },
      {
        name: "pH",
        value: 6.5,
        status: "Optimal",
        range: "6.0-7.5",
      },
    ],
    recommendations: [
      "Apply zinc sulfate at 25 kg/ha during next sowing",
      "Include leguminous crops in rotation to maintain nitrogen levels",
      "Apply organic compost to improve soil structure",
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#1e3a8a", "#1e40af"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Soil Health Analysis</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>
      <FarmerHeader />

      <ScrollView style={styles.content}>
        {/* Soil Health Score */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{soilData.score}</Text>
            <Text style={styles.scoreLabel}>Soil Health Score</Text>
          </View>
          <Text style={styles.scoreStatus}>{soilData.status} Soil Health</Text>
        </View>

        {/* Nutrient Levels */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Leaf size={20} color="#1e3a8a" />
            <Text style={styles.cardTitle}>Nutrient Levels</Text>
          </View>

          {soilData.nutrients.map((nutrient, index) => (
            <View key={index} style={styles.nutrientItem}>
              <View style={styles.nutrientInfo}>
                <Text style={styles.nutrientName}>{nutrient.name}</Text>
                <Text style={styles.nutrientRange}>{nutrient.range}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${nutrient.value}%`,
                        backgroundColor:
                          nutrient.status === "Low"
                            ? "#ef4444"
                            : nutrient.status === "High"
                            ? "#f59e0b"
                            : "#10b981",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.nutrientStatus}>{nutrient.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AlertCircle size={20} color="#1e3a8a" />
            <Text style={styles.cardTitle}>Recommendations</Text>
          </View>

          {soilData.recommendations.map((item, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Water Holding Capacity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Droplet size={20} color="#1e3a8a" />
            <Text style={styles.cardTitle}>Water Holding Capacity</Text>
          </View>
          <View style={styles.waterCapacityContainer}>
            <View style={styles.waterMeter}>
              <View style={styles.waterLevel} />
              <View style={styles.waterIndicator} />
            </View>
            <View style={styles.waterLabels}>
              <Text style={styles.waterLabel}>Low</Text>
              <Text style={styles.waterLabel}>Medium</Text>
              <Text style={styles.waterLabel}>High</Text>
            </View>
          </View>
          <Text style={styles.waterDescription}>
            Your soil has moderate water holding capacity. Adding organic matter
            can help improve water retention.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scoreContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scoreText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e3a8a",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  nutrientItem: {
    marginBottom: 16,
  },
  nutrientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nutrientName: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  nutrientRange: {
    fontSize: 12,
    color: "#94a3b8",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginRight: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  nutrientStatus: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 70,
    textAlign: "right",
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1e3a8a",
    marginTop: 8,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  waterCapacityContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  waterMeter: {
    width: "100%",
    height: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    marginBottom: 8,
    overflow: "hidden",
    position: "relative",
  },
  waterLevel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "65%",
    backgroundColor: "#3b82f6",
    borderRadius: 10,
  },
  waterIndicator: {
    position: "absolute",
    left: "65%",
    top: -5,
    width: 4,
    height: 30,
    backgroundColor: "#1e40af",
    borderRadius: 2,
  },
  waterLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  waterLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  waterDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginTop: 10,
  },
});

export default SoilHealthDetails;
