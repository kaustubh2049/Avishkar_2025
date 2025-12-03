import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Camera, Upload, AlertTriangle, CheckCircle } from "lucide-react-native";

export default function DiseaseDetectionScreen() {
  const [result, setResult] = useState<null | any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleScan = () => {
    setAnalyzing(true);
    // Simulate a scan result after delay
    setTimeout(() => {
      setResult({
        disease: "Early Blight",
        severity: "High",
        confidence: "94%",
        causes: [
          "Fungal infection (Alternaria solani)",
          "Warm temperatures (24-29°C)",
          "High humidity or frequent rainfall"
        ],
        remedies: [
          "Apply fungicides containing Mancozeb or Chlorothalonil.",
          "Improve air circulation by spacing plants properly.",
          "Remove and destroy infected leaves immediately.",
          "Use drip irrigation to keep foliage dry."
        ]
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Scan Crop", headerBackTitle: "Home" }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Upload Area */}
        <View style={styles.uploadCard}>
          <View style={styles.iconContainer}>
            <Camera size={48} color="#94a3b8" />
          </View>
          <Text style={styles.uploadTitle}>Take a Photo or Upload</Text>
          <Text style={styles.uploadSubtitle}>Ensure the affected leaf is clearly visible</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleScan} disabled={analyzing}>
              <Camera size={20} color="#fff" />
              <Text style={styles.buttonText}>{analyzing ? "Analyzing..." : "Camera"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleScan} disabled={analyzing}>
              <Upload size={20} color="#0ea5e9" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Result Section */}
        {result && !analyzing && (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Analysis Report</Text>
            
            <View style={styles.resultCard}>
              {/* Header: Disease Name & Severity */}
              <View style={styles.resultHeader}>
                <View style={styles.headerLeft}>
                  <Text style={styles.label}>Detected Disease</Text>
                  <Text style={styles.diseaseName}>{result.disease}</Text>
                </View>
                <View style={[styles.severityBadge, result.severity === 'High' ? styles.bgRed : styles.bgYellow]}>
                  <AlertTriangle size={14} color={result.severity === 'High' ? "#991b1b" : "#854d0e"} />
                  <Text style={[styles.severityText, result.severity === 'High' ? styles.textRed : styles.textYellow]}>
                    {result.severity} Severity
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Possible Causes */}
              <View style={styles.section}>
                <Text style={styles.subTitle}>Possible Causes</Text>
                {result.causes.map((cause: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>{cause}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              {/* Recommended Treatment */}
              <View style={styles.section}>
                <Text style={styles.subTitle}>Recommended Treatment</Text>
                {result.remedies.map((remedy: string, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <CheckCircle size={16} color="#16a34a" style={{ marginTop: 2 }} />
                    <Text style={styles.listText}>{remedy}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Find Remedies Nearby</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  uploadCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: "#e0f2fe",
  },
  secondaryButtonText: {
    color: "#0ea5e9",
  },
  resultContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  diseaseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  bgRed: { backgroundColor: "#fee2e2" },
  bgYellow: { backgroundColor: "#fef9c3" },
  textRed: { color: "#991b1b" },
  textYellow: { color: "#854d0e" },
  severityText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94a3b8",
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  buyButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
