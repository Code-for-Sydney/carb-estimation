import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FoodItem } from '../types';

export async function analyzeImage(
    fileUri: string,
    description: string,
    apiKey: string
): Promise<FoodItem[]> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Read file as base64 using fetch and FileReader (works in React Native)
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    // Determine mime type from URI
    const mimeType = fileUri.toLowerCase().endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';

    const prompt = `
    Analyze this image of food (which may be a plate or a menu).
    Identify all distinct food items present.
    
    IMPORTANT: If the image shows a single plate or meal composed of multiple components (e.g. a main dish with sides like steak and fries), group them as a SINGLE item (e.g. "Steak with Fries") and list the components in the ingredients breakdown. Only return multiple items if there are clearly distinct separate meals or dishes (e.g. multiple plates, or a menu with different options).

    For each item, estimate:
    1. The carbohydrate content in grams per standard serving.
    2. The estimated calories (kcal) per standard serving.
    3. The Glycemic Index (GI).
    4. A confidence score (0.0 to 1.0) for your identification.
    5. A breakdown of ingredients with their individual carb and calorie values (if applicable).

    Context provided by user: "${description}"

    Return ONLY a valid JSON array with objects containing these fields:
    - name (string)
    - carbs (number) - total carbs for the item
    - calories (number) - total calories for the item
    - gi (number)
    - confidence (number)
    - ingredients (optional array of objects with "name", "carbs", and "calories" fields) - breakdown of ingredients

    Example format:
    [
      { 
        "name": "Burger", 
        "carbs": 45, 
        "calories": 550,
        "gi": 60, 
        "confidence": 0.95,
        "ingredients": [
          { "name": "Bun", "carbs": 30, "calories": 150 },
          { "name": "Patty", "carbs": 0, "calories": 250 },
          { "name": "Cheese", "carbs": 2, "calories": 100 },
          { "name": "Sauce", "carbs": 8, "calories": 40 },
          { "name": "Vegetables", "carbs": 5, "calories": 10 }
        ]
      }
    ]
  `;

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text);
            throw new Error(
                `Failed to parse AI response. The model might be overloaded or returned invalid data. Raw: ${text.substring(
                    0,
                    50
                )}...`
            );
        }
    } catch (apiError: any) {
        console.error('Gemini API Error:', apiError);
        const message = apiError.message || 'Unknown API error';
        if (message.includes('403')) {
            throw new Error(
                'Invalid API Key or API access not enabled. Please check your key.'
            );
        }
        throw new Error(`Gemini API Error: ${message}`);
    }
}
