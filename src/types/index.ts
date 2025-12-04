export interface Ingredient {
    name: string;
    carbs: number; // grams
    calories: number; // kcal
}

export interface FoodItem {
    name: string;
    carbs: number; // grams
    calories: number; // kcal
    gi: number; // glycemic index
    confidence: number; // 0-1
    ingredients?: Ingredient[]; // optional breakdown of ingredients
}

export interface MealLog {
    id: string;
    date: string; // ISO string
    items: FoodItem[];
    totalCarbs: number;
    totalCalories: number;
}
