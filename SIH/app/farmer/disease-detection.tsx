import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Camera, Upload, AlertTriangle, CheckCircle } from "lucide-react-native";

export default function DiseaseDetectionScreen() {
  const [result, setResult] = useState<null | any>(null);

  const handleScan = () => {
    // Simulate a scan result
    setResult({
      disease: "Leaf Blight",
      severity: "Moderate",
      cure: "Apply Mancozeb 75 WP @ 2g/liter of water.",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Disease Detection", headerBackTitle: "Home" }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Upload Area */}
        <View style={styles.uploadCard}>
          <View style={styles.iconContainer}>
            <Camera size={48} color="#94a3b8" />
          </View>
          <Text style={styles.uploadTitle}>Take a Photo or Upload</Text>
          <Text style={styles.uploadSubtitle}>Ensure the affected leaf is clearly visible</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleScan}>
              <Camera size={20} color="#fff" />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleScan}>
              <Upload size={20} color="#0ea5e9" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Result Section */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Analysis Result</Text>
            
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <AlertTriangle size={24} color="#dc2626" />
                <Text style={styles.diseaseName}>{result.disease}</Text>
              </View>
              
              <View style={styles.severityBadge}>
                <Text style={styles.severityText}>Severity: {result.severity}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.cureTitle}>Recommended Cure:</Text>
              <Text style={styles.cureText}>{result.cure}</Text>

              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Find Medicine Nearby</Text>
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
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dc2626",
  },
  severityBadge: {
    backgroundColor: "#fee2e2",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  severityText: {
    color: "#991b1b",
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 16,
  },
  cureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  cureText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: "#0f172a",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
