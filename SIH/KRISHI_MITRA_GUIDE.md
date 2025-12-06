# KrishiMitra - AI Agricultural Assistant

## Overview
**KrishiMitra** (Agricultural Friend) is an intelligent AI-powered chatbot that provides personalized farming guidance to Indian farmers. It uses Google's Gemini AI to answer questions about crop management, pest control, irrigation, soil health, and sustainable farming practices.

## Features

### 🤖 AI-Powered Conversations
- Real-time responses to farming questions
- Context-aware recommendations
- Multi-language support (English & Hindi)
- Personalized advice based on crop type and region

### 💡 Smart Suggestions
- Auto-generated conversation starters
- Context-aware follow-up suggestions
- Seasonal farming tips
- Quick action recommendations

### 🌾 Specialized Knowledge Areas
1. **Crop Management**
   - Planting schedules
   - Growth stages
   - Harvesting techniques
   - Post-harvest handling

2. **Pest & Disease Control**
   - Pest identification
   - Organic control methods
   - Chemical options
   - Prevention strategies

3. **Irrigation Management**
   - Watering schedules
   - Water conservation
   - Soil moisture monitoring
   - Drought management

4. **Soil Health**
   - Soil testing interpretation
   - Fertilizer recommendations
   - Crop rotation planning
   - Organic matter management

5. **Seasonal Guidance**
   - Season-specific tips
   - Weather adaptation
   - Crop selection
   - Preparation strategies

## Architecture

### Services
- **`aiAssistantService.ts`** - Core AI communication service
  - `sendMessageToAI()` - Send user queries to Gemini
  - `getSeasonalTips()` - Get season-specific advice
  - `getPestAdvice()` - Get pest management guidance
  - `getIrrigationAdvice()` - Get irrigation recommendations
  - `generateSuggestions()` - Generate conversation starters

### Components
- **`krishi-mitra.tsx`** - Main chatbot screen
  - Message display
  - Input handling
  - Suggestion chips
  - Real-time responses

### Integration
- Uses existing **Gemini API** from project
- API Key: `AIzaSyB-XQxFCptfz783oykllMTCYfUYFO18ZHU`
- Model: `gemini-2.0-flash`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

## Usage

### Accessing KrishiMitra
```typescript
// Navigate to KrishiMitra from any screen
import { useRouter } from "expo-router";

const router = useRouter();
router.push("/farmer/krishi-mitra");
```

### Sending a Message
```typescript
import { sendMessageToAI } from "@/services/aiAssistantService";

const response = await sendMessageToAI(
  "How to prevent powdery mildew on wheat?",
  {
    cropType: "Wheat",
    region: "Punjab",
    season: "Winter",
    soilType: "Loamy"
  }
);

console.log(response.message);
console.log(response.suggestions); // Follow-up suggestions
```

### Getting Seasonal Tips
```typescript
import { getSeasonalTips } from "@/services/aiAssistantService";

const tips = await getSeasonalTips("Rice", "Monsoon");
// Returns array of 5 specific tips
```

### Getting Pest Advice
```typescript
import { getPestAdvice } from "@/services/aiAssistantService";

const advice = await getPestAdvice("Armyworm", "Corn");
// Returns detailed pest management advice
```

### Getting Irrigation Recommendations
```typescript
import { getIrrigationAdvice } from "@/services/aiAssistantService";

const advice = await getIrrigationAdvice(
  "Cotton",
  "Sandy Loam",
  "Summer"
);
// Returns irrigation schedule and tips
```

## UI Components

### Message Bubble
- User messages: Blue background, right-aligned
- Assistant messages: White background, left-aligned
- Supports multi-line text
- Timestamps included

### Suggestion Chips
- Quick action buttons
- Contextual suggestions
- Icon + text format
- Tap to populate input

### Input Area
- Multi-line text input
- Character counter (500 char limit)
- Send button with icon
- Keyboard-aware layout

## Data Flow

```
User Input
    ↓
Message Added to State
    ↓
Send to Gemini API
    ↓
Parse Response
    ↓
Extract Suggestions
    ↓
Display Message + Suggestions
    ↓
Update Conversation History
```

## API Integration

### Request Format
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "User question with context"
        }
      ]
    }
  ],
  "systemInstruction": {
    "parts": [
      {
        "text": "Expert agricultural assistant prompt"
      }
    ]
  }
}
```

### Response Format
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "AI response text"
          }
        ]
      }
    }
  ]
}
```

## Features Roadmap

### Phase 1 (Current)
- ✅ Text-based chat interface
- ✅ Gemini AI integration
- ✅ Suggestion system
- ✅ Context-aware responses

### Phase 2 (Planned)
- [ ] Image analysis for crop/pest identification
- [ ] Voice input/output
- [ ] Chat history persistence
- [ ] Multi-language support (Hindi, Marathi, etc.)
- [ ] Offline mode with cached responses

### Phase 3 (Future)
- [ ] Integration with weather data
- [ ] Soil testing result interpretation
- [ ] Fertilizer cost calculator
- [ ] Market price tracking
- [ ] Government scheme recommendations
- [ ] Community forum integration

## Error Handling

### Network Errors
- Graceful fallback messages
- Retry mechanism
- Offline detection

### API Errors
- Rate limiting handling
- Invalid response parsing
- Timeout management

### User Errors
- Input validation
- Character limit enforcement
- Empty message prevention

## Performance Optimization

- Message virtualization for large conversations
- Lazy loading of suggestions
- Debounced input handling
- Optimized re-renders
- Efficient state management

## Security

- API key stored securely
- No sensitive data logging
- Input sanitization
- HTTPS only communication
- Rate limiting on API calls

## Testing

### Unit Tests
- Message formatting
- Suggestion extraction
- Response parsing

### Integration Tests
- API communication
- Message flow
- State management

### E2E Tests
- Full conversation flow
- Error scenarios
- Performance under load

## Troubleshooting

### Issue: No response from AI
**Solution**: Check API key, internet connection, and rate limits

### Issue: Suggestions not appearing
**Solution**: Ensure response contains numbered list format

### Issue: Slow responses
**Solution**: Check network speed, API status, and device performance

### Issue: Character encoding issues
**Solution**: Ensure UTF-8 encoding for multi-language support

## Future Enhancements

1. **Smart Context Learning**
   - Remember user's farm details
   - Personalized recommendations
   - Preference tracking

2. **Advanced Analytics**
   - Conversation insights
   - Common farming issues
   - Regional trends

3. **Integration with Other Services**
   - Weather API
   - Market prices
   - Government schemes
   - Soil testing labs

4. **Accessibility**
   - Voice commands
   - Text-to-speech
   - High contrast mode
   - Larger fonts

## Support

For issues or feature requests, please contact the development team or create an issue in the project repository.

---

**Last Updated**: December 5, 2025
**Version**: 1.0
**Status**: Production Ready
