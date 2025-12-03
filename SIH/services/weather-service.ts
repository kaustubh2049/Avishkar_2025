export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    visibility: number;
    feelsLike: number;
    dewPoint: number;
    uvIndex: number;
    sunrise: number;
    sunset: number;
    city: string;
  };
  forecast: Array<{
    dt: number;
    temp: number;
    temp_min: number;
    temp_max: number;
    condition: string;
    icon: string;
    date: string;
    humidity: number;
    windSpeed: number;
  }>;
}

const API_KEY =
  process.env.EXPO_PUBLIC_WEATHER_KEY || "9f6d447bf0436ff48583128181e579af";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    // Fetch current weather and forecast from OpenWeatherMap
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      ),
      fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      ),
    ]);

    const [currentData, forecastData] = await Promise.all([
      currentRes.json(),
      forecastRes.json(),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      console.warn(
        "OpenWeatherMap API error:",
        currentData?.message || forecastData?.message
      );
      return getMockWeatherData();
    }

    // Calculate dew point approximation
    const dewPoint = Math.round(
      currentData.main.temp - (100 - currentData.main.humidity) / 5
    );

    // Process forecast data - group by days and take daily entries
    const forecastDays = [];
    const processedDates = new Set();
    const today = new Date().toDateString();

    // Process all forecast entries to get 5 unique days
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();

      // Skip today's entries to focus on future days, and ensure we get 5 unique days
      if (
        dateKey !== today &&
        !processedDates.has(dateKey) &&
        forecastDays.length < 5
      ) {
        processedDates.add(dateKey);
        forecastDays.push({
          dt: item.dt,
          temp: Math.round(item.main.temp),
          temp_min: Math.round(item.main.temp_min),
          temp_max: Math.round(item.main.temp_max),
          condition: item.weather[0]?.main ?? "",
          icon: item.weather[0]?.icon ?? "",
          date: date.toLocaleDateString(undefined, { weekday: "short" }),
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind?.speed * 3.6 || 0), // Convert m/s to km/h
        });
      }
    }

    // If we still don't have 5 days, fill with generated data
    while (forecastDays.length < 5) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + forecastDays.length + 1);

      const conditions = ["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm"];
      const icons = ["01d", "02d", "10d", "09d", "11d"];
      const conditionIndex = forecastDays.length % conditions.length;

      forecastDays.push({
        dt: Math.floor(nextDay.getTime() / 1000),
        temp: Math.round(25 + Math.random() * 8), // Random temp between 25-33
        temp_min: Math.round(18 + Math.random() * 5), // Random min temp
        temp_max: Math.round(28 + Math.random() * 8), // Random max temp
        condition: conditions[conditionIndex],
        icon: icons[conditionIndex],
        date: nextDay.toLocaleDateString(undefined, { weekday: "short" }),
        humidity: Math.round(40 + Math.random() * 40), // Random humidity 40-80%
        windSpeed: Math.round(3 + Math.random() * 10), // Random wind speed
      });
    }

    return {
      current: {
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0]?.main ?? "",
        description: currentData.weather[0]?.description ?? "",
        icon: currentData.weather[0]?.icon ?? "",
        humidity: currentData.main.humidity,
        windSpeed: Math.round((currentData.wind?.speed || 0) * 3.6), // Convert m/s to km/h
        windDirection: currentData.wind?.deg || 0,
        pressure: currentData.main.pressure,
        visibility: Math.round((currentData.visibility || 10000) / 1000), // Convert meters to km
        feelsLike: Math.round(currentData.main.feels_like),
        dewPoint,
        uvIndex: 6, // OpenWeatherMap doesn't provide UV in free plan
        sunrise: currentData.sys?.sunrise || 0,
        sunset: currentData.sys?.sunset || 0,
        city: currentData.name || "",
      },
      forecast: forecastDays,
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    // Fallback to mock data on any error to keep UI functional
    return getMockWeatherData();
  }
};

const getMockWeatherData = (): WeatherData => {
  const now = new Date();
  const forecastDays = [];

  // Generate 5 days of forecast data
  const conditions = ["Clear", "Clouds", "Rain", "Thunderstorm", "Drizzle"];
  const icons = ["01d", "02d", "10d", "11d", "09d"];

  for (let i = 0; i < 5; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);

    const conditionIndex = i % conditions.length;
    const baseTemp = 28 - i * 1; // Gradually cooler over days

    forecastDays.push({
      dt: Math.floor(date.getTime() / 1000),
      temp: baseTemp + Math.floor(Math.random() * 3),
      temp_min: baseTemp - 3 - Math.floor(Math.random() * 3),
      temp_max: baseTemp + 2 + Math.floor(Math.random() * 3),
      condition: conditions[conditionIndex],
      icon: icons[conditionIndex],
      date: date.toLocaleDateString(undefined, { weekday: "short" }),
      humidity: 45 + Math.floor(Math.random() * 30),
      windSpeed: 3 + Math.floor(Math.random() * 8),
    });
  }

  return {
    current: {
      temp: 28,
      condition: "Clear",
      description: "clear sky",
      icon: "01d",
      humidity: 45,
      windSpeed: 5.2,
      windDirection: 180,
      pressure: 1013,
      visibility: 10,
      feelsLike: 30,
      dewPoint: 18,
      uvIndex: 6,
      sunrise: Math.floor(new Date().setHours(6, 30, 0, 0) / 1000),
      sunset: Math.floor(new Date().setHours(18, 30, 0, 0) / 1000),
      city: "Demo Location (API Error)",
    },
    forecast: forecastDays,
  };
};
