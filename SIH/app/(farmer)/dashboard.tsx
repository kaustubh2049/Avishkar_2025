import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Droplets,
  Calendar,
  AlertTriangle,
  Settings,
  LogOut,
} from "lucide-react-native";

export default function FarmerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/select-user-type");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#4caf50", "#2e7d32"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || "F"}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || "Farmer"}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Weather Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Droplets size={24} color="#4caf50" />
            <Text style={styles.cardTitle}>Water Level</Text>
          </View>
          <View style={styles.metricContainer}>
            <Text style={styles.metricValue}>2.4m</Text>
            <Text style={styles.metricLabel}>Current Groundwater Level</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, styles.statusGood]} />
            <Text style={styles.statusText}>Good</Text>
          </View>
        </View>

        {/* Irrigation Schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={24} color="#4caf50" />
            <Text style={styles.cardTitle}>Irrigation Schedule</Text>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleDay}>Today</Text>
            <Text style={styles.scheduleTime}>6:00 AM - 7:30 AM</Text>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleDay}>Tomorrow</Text>
            <Text style={styles.scheduleTime}>6:30 AM - 8:00 AM</Text>
          </View>
        </View>

        {/* Alerts */}
        <View style={[styles.card, styles.alertCard]}>
          <View style={styles.cardHeader}>
            <AlertTriangle size={24} color="#f44336" />
            <Text style={[styles.cardTitle, styles.alertTitle]}>Alerts</Text>
          </View>
          <Text style={styles.alertText}>
            • Water level is expected to drop in the next 3 days
          </Text>
          <Text style={styles.alertText}>
            • Soil moisture is below optimal levels in Field B
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Request Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <Text style={[styles.actionText, styles.secondaryButtonText]}>
              View Reports
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  greeting: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  metricContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  metricLabel: {
    color: "#666",
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusGood: {
    backgroundColor: "#4caf50",
  },
  statusText: {
    color: "#666",
    fontSize: 14,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  scheduleDay: {
    fontWeight: "500",
    color: "#333",
  },
  scheduleTime: {
    color: "#666",
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  alertTitle: {
    color: "#f44336",
  },
  alertText: {
    color: "#d32f2f",
    marginBottom: 5,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#4caf50",
  },
  secondaryButtonText: {
    color: "#4caf50",
  },
});
