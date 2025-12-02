export interface Ingredient {
    name: string;
    carbs: number; // grams
}

export interface FoodItem {
    name: string;
    carbs: number; // grams
    gi: number; // glycemic index
    confidence: number; // 0-1
    ingredients?: Ingredient[]; // optional breakdown of ingredients
}
