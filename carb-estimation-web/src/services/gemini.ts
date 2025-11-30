import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FoodItem } from '../components/ResultsDisplay';

export async function analyzeImage(
    file: File,
    description: string,
    apiKey: string
): Promise<FoodItem[]> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
    });

    const prompt = `
    Analyze this image of food (which may be a plate or a menu).
    Identify all distinct food items present.
    For each item, estimate:
    1. The carbohydrate content in grams per standard serving.
    2. The Glycemic Index (GI).
    3. A confidence score (0.0 to 1.0) for your identification.

    Context provided by user: "${description}"

    Return ONLY a valid JSON array with objects containing these fields:
    - name (string)
    - carbs (number)
    - gi (number)
    - confidence (number)

    Example format:
    [
      { "name": "Burger", "carbs": 45, "gi": 60, "confidence": 0.95 }
    ]
  `;

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present (more robust regex)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(jsonString);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            throw new Error(`Failed to parse AI response. The model might be overloaded or returned invalid data. Raw: ${text.substring(0, 50)}...`);
        }
    } catch (apiError: any) {
        console.error("Gemini API Error:", apiError);
        // Extract meaningful error message
        const message = apiError.message || "Unknown API error";
        if (message.includes("403")) {
            throw new Error("Invalid API Key or API access not enabled. Please check your key.");
        }
        throw new Error(`Gemini API Error: ${message}`);
    }
}
