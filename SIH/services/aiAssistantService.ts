// AI Agricultural Assistant Service
// Uses Gemini AI for intelligent farming guidance

const GEMINI_API_KEY = "AIzaSyB-XQxFCptfz783oykllMTCYfUYFO18ZHU";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
  type?: "text" | "suggestion";
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  confidence?: number;
}

/**
 * Send a message to the AI Agricultural Assistant
 * @param message - User's question or query
 * @param context - Optional context about the farm/crop
 * @returns AI response with suggestions
 */
export const sendMessageToAI = async (
  message: string,
  context?: {
    cropType?: string;
    region?: string;
    season?: string;
    soilType?: string;
  }
): Promise<AIResponse> => {
  try {
    console.log("🤖 Sending message to AI Assistant...");

    const contextStr = context
      ? `
Context:
- Crop: ${context.cropType || "Not specified"}
- Region: ${context.region || "Not specified"}
- Season: ${context.season || "Not specified"}
- Soil Type: ${context.soilType || "Not specified"}
`
      : "";

    const systemPrompt = `You are an expert agricultural assistant helping Indian farmers with crop management, pest control, irrigation, soil health, and farming best practices. 
You provide practical, actionable advice based on local farming conditions.
Keep responses concise, clear, and in simple language.
Always provide 2-3 practical suggestions when relevant.
Focus on sustainable and cost-effective solutions.`;

    const userPrompt = `${contextStr}

User Question: ${message}

Provide a helpful response with practical advice. If relevant, suggest 2-3 specific actions the farmer can take.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: userPrompt,
            },
          ],
        },
      ],
      systemInstruction: {
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("📡 AI response received");

    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      throw new Error("No response from AI");
    }

    console.log("✅ AI response processed");

    // Extract suggestions if present
    const suggestions = extractSuggestions(responseText);

    return {
      message: responseText,
      suggestions,
      confidence: 85,
    };
  } catch (error) {
    console.error("❌ AI Assistant error:", error);
    throw error;
  }
};

/**
 * Get quick farming tips based on season and crop
 */
export const getSeasonalTips = async (
  cropType: string,
  season: string
): Promise<string[]> => {
  try {
    console.log(`🌾 Getting seasonal tips for ${cropType} in ${season}...`);

    const prompt = `As an agricultural expert, provide 5 specific, actionable tips for growing ${cropType} during ${season} season in India. 
Format as a numbered list with brief, practical advice.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return parseNumberedList(responseText);
  } catch (error) {
    console.error("❌ Failed to get seasonal tips:", error);
    return getDefaultTips(cropType, season);
  }
};

/**
 * Get pest management advice
 */
export const getPestAdvice = async (
  pestName: string,
  cropType: string
): Promise<string> => {
  try {
    console.log(`🐛 Getting pest management advice for ${pestName}...`);

    const prompt = `As a pest management expert, provide practical advice for controlling ${pestName} on ${cropType} crops in India.
Include:
1. Identification signs
2. Prevention methods
3. Organic control methods
4. Chemical options (if needed)
5. When to seek professional help

Keep it concise and actionable.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to fetch pest advice";
  } catch (error) {
    console.error("❌ Failed to get pest advice:", error);
    return "Please consult a local agricultural expert for pest management.";
  }
};

/**
 * Get irrigation recommendations
 */
export const getIrrigationAdvice = async (
  cropType: string,
  soilType: string,
  season: string
): Promise<string> => {
  try {
    console.log(`💧 Getting irrigation advice...`);

    const prompt = `As an irrigation expert, provide specific irrigation recommendations for:
- Crop: ${cropType}
- Soil Type: ${soilType}
- Season: ${season}

Include:
1. Optimal watering frequency
2. Water quantity per irrigation
3. Best time of day to irrigate
4. Signs of over/under watering
5. Water conservation tips

Keep it practical and region-specific for India.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to fetch irrigation advice";
  } catch (error) {
    console.error("❌ Failed to get irrigation advice:", error);
    return "Please consult local water management resources for irrigation guidance.";
  }
};

/**
 * Extract suggestions from response text
 */
const extractSuggestions = (text: string): string[] => {
  const suggestions: string[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    // Look for numbered items or bullet points
    if (/^[\d\-•*]\s/.test(line.trim())) {
      const suggestion = line.replace(/^[\d\-•*]\s*\.?\s*/, "").trim();
      if (suggestion.length > 0 && suggestion.length < 200) {
        suggestions.push(suggestion);
      }
    }
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
};

/**
 * Parse numbered list from response
 */
const parseNumberedList = (text: string): string[] => {
  const items: string[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    if (/^\d+[\.\)]\s/.test(line.trim())) {
      const item = line.replace(/^\d+[\.\)]\s*/, "").trim();
      if (item.length > 0) {
        items.push(item);
      }
    }
  }

  return items;
};

/**
 * Default tips if API fails
 */
const getDefaultTips = (cropType: string, season: string): string[] => {
  return [
    `Prepare soil with adequate organic matter before ${season} planting`,
    `Monitor weather patterns and adjust irrigation accordingly`,
    `Use quality seeds suited for ${season} conditions`,
    `Implement crop rotation to maintain soil health`,
    `Regular pest and disease monitoring is essential`,
  ];
};

/**
 * Generate conversation suggestions based on context
 */
export const generateSuggestions = (context?: {
  cropType?: string;
  hasIssue?: boolean;
}): string[] => {
  const baseSuggestions = [
    "What's the best irrigation schedule?",
    "How to prevent common pests?",
    "Soil health tips",
    "Fertilizer recommendations",
    "Weather-based farming advice",
  ];

  if (context?.cropType) {
    return [
      `Best practices for ${context.cropType}`,
      `${context.cropType} pest management`,
      `Seasonal care for ${context.cropType}`,
      ...baseSuggestions,
    ];
  }

  if (context?.hasIssue) {
    return [
      "Identify plant disease",
      "Pest control methods",
      "Soil problem solutions",
      "Water management help",
      ...baseSuggestions,
    ];
  }

  return baseSuggestions;
};
