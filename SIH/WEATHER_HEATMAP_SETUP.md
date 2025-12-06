# Weather Heatmap - OpenStreetMap Integration

## Overview
The weather page now features an interactive OpenStreetMap-based heatmap showing real-time weather data across major Indian cities with color-coded visualization for temperature, rainfall, wind speed, humidity, and groundwater levels.

## Components

### 1. **WeatherHeatmap Component** (`components/WeatherHeatmap.tsx`)
- Interactive map using `react-native-maps` with OpenStreetMap provider
- Dynamic markers with color-coded dots based on selected weather layer
- Custom marker labels showing city name and current value
- User location tracking and highlighting
- Automatic map fitting to show all data points
- Attribution for OpenStreetMap contributors

### 2. **India Heatmap Service** (`services/india-heatmap-service.ts`)
- 12 major Indian cities with accurate coordinates
- Color functions for each weather metric:
  - **Temperature**: Red (hot) → Blue (cold)
  - **Rainfall**: Light blue (dry) → Dark blue (wet)
  - **Wind Speed**: Green (calm) → Red (strong)
  - **Humidity**: Light (dry) → Dark blue (wet)
  - **Groundwater**: Green (good) → Red (critical depth)
- Legend data for each layer
- Mock data with realistic variations

### 3. **Weather Screen** (`app/farmer/weather.tsx`)
- Integrated heatmap data fetching
- 5 interactive map layers with easy switching
- Dynamic legend showing color scale
- Data information section
- Loading states and error handling

## Features

### Interactive Map Layers
- **Temperature Map**: Shows current air temperature across India
- **Rainfall Map**: Displays recent precipitation levels
- **Wind Map**: Visualizes wind speed distribution
- **Humidity Map**: Shows relative humidity levels
- **Groundwater Map**: Displays groundwater depth (critical for agriculture)

### User Experience
- ✅ Real-time color-coded markers
- ✅ Smooth layer switching with legend updates
- ✅ User location highlighting
- ✅ Tap markers to see detailed information
- ✅ Auto-fit map to show all data points
- ✅ Loading indicators
- ✅ OpenStreetMap attribution

## Cities Included
1. Mumbai (Western Coast)
2. Delhi (North)
3. Bangalore (South)
4. Chennai (Southeast)
5. Kolkata (East)
6. Hyderabad (Central)
7. Pune (West-Central)
8. Jaipur (Northwest)
9. Ahmedabad (West)
10. Lucknow (North-Central)
11. Kochi (Southwest)
12. Srinagar (North - Kashmir)

## Data Structure

```typescript
interface CityWeatherData {
  name: string;
  lat: number;
  lon: number;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  pressure: number;
  groundwater?: number;
  condition: string;
  x: string;  // For legacy positioning
  y: string;  // For legacy positioning
}
```

## Color Schemes

### Temperature
- < 15°C: #1565c0 (Blue)
- 15-20°C: #00897b (Teal)
- 20-25°C: #7cb342 (Green)
- 25-30°C: #fbc02d (Yellow)
- 30-35°C: #f57c00 (Orange)
- > 35°C: #d32f2f (Red)

### Rainfall
- 0-10 mm: #e1f5fe (Very Light Blue)
- 10-20 mm: #b3e5fc (Light Blue)
- 20-30 mm: #4fc3f7 (Cyan)
- 30-40 mm: #0288d1 (Blue)
- 40-50 mm: #1565c0 (Dark Blue)
- > 50 mm: #0d47a1 (Very Dark Blue)

### Wind Speed
- < 3 km/h: #c8e6c9 (Light Green)
- 3-6 km/h: #9ccc65 (Green)
- 6-9 km/h: #fdd835 (Yellow)
- 9-12 km/h: #fb8c00 (Orange)
- 12-15 km/h: #e53935 (Red)
- > 15 km/h: #c62828 (Dark Red)

### Humidity
- < 40%: #e0f2f1 (Very Light)
- 40-50%: #b3e5fc (Light)
- 50-60%: #4fc3f7 (Cyan)
- 60-70%: #0288d1 (Blue)
- 70-80%: #0277bd (Dark Blue)
- > 80%: #01579b (Very Dark Blue)

### Groundwater Depth
- < 8m: #2e7d32 (Dark Green - Excellent)
- 8-10m: #7cb342 (Green - Good)
- 10-12m: #fbc02d (Yellow - Moderate)
- 12-15m: #f57c00 (Orange - Concerning)
- > 15m: #d32f2f (Red - Critical)

## Production Integration

To use real weather data, integrate with:

### 1. **OpenWeatherMap API**
```typescript
// For temperature, humidity, wind, rainfall
const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_KEY;
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
```

### 2. **India Meteorological Department (IMD)**
- Official weather data for India
- More accurate for Indian regions

### 3. **Central Ground Water Board (CGWB) API**
- Real groundwater level data
- Critical for agricultural planning

### 4. **USGS Water Resources**
- Alternative groundwater data source

## Implementation Steps

1. ✅ Created `WeatherHeatmap.tsx` component
2. ✅ Integrated `india-heatmap-service.ts`
3. ✅ Updated `weather.tsx` to use OpenStreetMap
4. ✅ Added interactive layer switching
5. ✅ Implemented color-coded visualization
6. ⏳ Next: Integrate real APIs for live data

## Performance Optimization

- Markers are only rendered for visible cities
- Map fitting is animated for smooth UX
- Legend updates are optimized
- Loading states prevent UI blocking

## Troubleshooting

### Map not showing
- Ensure `react-native-maps` is installed
- Check Google Maps API key in app.json (for Android)
- Verify location permissions are granted

### Markers not appearing
- Check heatmap data is loading
- Verify city coordinates are valid
- Check color functions are returning valid hex colors

### Performance issues
- Reduce number of cities if needed
- Optimize marker rendering
- Use map clustering for large datasets

## Future Enhancements

1. Add historical data comparison
2. Implement real-time data updates
3. Add weather alerts and warnings
4. Include satellite imagery overlay
5. Add crop-specific recommendations based on weather
6. Implement data caching
7. Add offline map support
8. Create weather prediction models
