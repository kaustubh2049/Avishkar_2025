import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CloudRain, Sun, Wind, Droplets, CloudSun, Cloud, CloudLightning, Snowflake, CloudFog, MapPin } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useStations } from "@/providers/stations-provider";
import { fetchWeather, WeatherData } from "@/services/weather-service";

export default function WeatherScreen() {
  const { userLocation, requestLocationPermission, isLoadingLocation } = useStations();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation) {
      loadWeather(userLocation.latitude, userLocation.longitude);
    } else {
        // If no location, try requesting it again or wait
        // requestLocationPermission(); 
    }
  }, [userLocation]);

  const loadWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(lat, lon);
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (condition: string, size: number = 24, color: string = "#fff") => {
    switch (condition.toLowerCase()) {
      case "clear": return <Sun size={size} color={color} />;
      case "clouds": return <Cloud size={size} color={color} />;
      case "rain": return <CloudRain size={size} color={color} />;
      case "drizzle": return <CloudRain size={size} color={color} />;
      case "thunderstorm": return <CloudLightning size={size} color={color} />;
      case "snow": return <Snowflake size={size} color={color} />;
      case "mist": 
      case "smoke":
      case "haze":
      case "dust":
      case "fog": return <CloudFog size={size} color={color} />;
      default: return <CloudSun size={size} color={color} />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoadingLocation || (loading && !weather)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Fetching weather data...</Text>
      </View>
    );
  }

  if (!userLocation) {
     return (
        <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Location access is needed for weather.</Text>
            <Text style={styles.subErrorText} onPress={requestLocationPermission}>Tap to enable location</Text>
        </View>
     )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={() => userLocation && loadWeather(userLocation.latitude, userLocation.longitude)}>Retry</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Weather Forecast</Text>
        <View style={styles.locationRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.locationText}>{weather?.current.city || "Unknown Location"}</Text>
        </View>

        {/* Current Weather */}
        {weather && (
            <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            style={styles.currentCard}
            >
            <View style={styles.currentHeader}>
                <View>
                <Text style={styles.tempText}>{weather.current.temp}°C</Text>
                <Text style={styles.conditionText}>{weather.current.condition}</Text>
                <Text style={styles.descText}>{weather.current.description}</Text>
                </View>
                {getIcon(weather.current.condition, 64, "#fcd34d")}
            </View>
            
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                <Wind size={20} color="#bfdbfe" />
                <Text style={styles.statValue}>{weather.current.windSpeed} m/s</Text>
                <Text style={styles.statLabel}>Wind</Text>
                </View>
                <View style={styles.statItem}>
                <Droplets size={20} color="#bfdbfe" />
                <Text style={styles.statValue}>{weather.current.humidity}%</Text>
                <Text style={styles.statLabel}>Humidity</Text>
                </View>
                <View style={styles.statItem}>
                <Sun size={20} color="#bfdbfe" />
                <Text style={styles.statValue}>{formatTime(weather.current.sunrise)}</Text>
                <Text style={styles.statLabel}>Sunrise</Text>
                </View>
            </View>
            </LinearGradient>
        )}

        {/* Forecast */}
        <Text style={styles.sectionTitle}>Next 5 Days</Text>
        <View style={styles.forecastList}>
            {weather?.forecast.map((item, index) => (
                <ForecastItem 
                    key={index}
                    day={index === 0 ? "Today" : item.date} 
                    temp={`${item.temp_max}° / ${item.temp_min}°`} 
                    icon={(props: any) => getIcon(item.condition, props.size, props.color)} 
                    color={item.condition.toLowerCase().includes("rain") ? "#3b82f6" : "#f59e0b"} 
                    condition={item.condition} 
                />
            ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function ForecastItem({ day, temp, icon: Icon, color, condition }: any) {
  return (
    <View style={styles.forecastItem}>
      <Text style={styles.dayText}>{day}</Text>
      <View style={styles.conditionRow}>
        <Icon size={24} color={color} />
        <Text style={styles.conditionLabel}>{condition}</Text>
      </View>
      <Text style={styles.tempRange}>{temp}</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 10,
    color: "#64748b",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    marginBottom: 8,
  },
  subErrorText: {
    color: "#0ea5e9",
    fontWeight: "600",
  },
  retryText: {
    color: "#0ea5e9",
    fontWeight: "600",
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#64748b",
  },
  currentCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    elevation: 4,
  },
  currentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  tempText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#fff",
  },
  conditionText: {
    fontSize: 24,
    color: "#bfdbfe",
    fontWeight: "600",
  },
  descText: {
    fontSize: 14,
    color: "#bfdbfe",
    textTransform: "capitalize",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  statLabel: {
    color: "#bfdbfe",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  forecastList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    elevation: 2,
  },
  forecastItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dayText: {
    width: 80,
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  conditionRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  conditionLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  tempRange: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
});

