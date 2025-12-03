import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Layout } from './src/components/Layout';
import { ImageUpload } from './src/components/ImageUpload';
import { AnalysisForm } from './src/components/AnalysisForm';
import { ResultsDisplay } from './src/components/ResultsDisplay';
import { ApiKeyInput } from './src/components/ApiKeyInput';
import { MealLogList } from './src/components/MealLog';
import { analyzeImage } from './src/services/gemini';
import { saveMeal, getMealLogs } from './src/services/storage';
import type { FoodItem, MealLog } from './src/types';
import { colors, spacing, borderRadius } from './src/styles/theme';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export default function App() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodItem[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'analyze' | 'history'>('analyze');
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const storedKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) setApiKey(storedKey);
    } catch (err) {
      console.error('Failed to load API key:', err);
    }
  };

  const handleSaveApiKey = async (key: string) => {
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE_KEY, key);
      setApiKey(key);
    } catch (err) {
      console.error('Failed to save API key:', err);
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const handleResetKey = async () => {
    try {
      await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey('');
      setResults([]);
      setSelectedImages([]);
    } catch (err) {
      console.error('Failed to reset API key:', err);
    }
  };

  const handleImagesSelected = (uris: string[]) => {
    setSelectedImages((prev) => [...prev, ...uris]);
    if (results.length > 0) setResults([]);
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!apiKey) return;

    setIsAnalyzing(true);
    setResults([]);
    setError(null);

    try {
      // Analyze all selected images concurrently
      const analysisPromises = selectedImages.map(imageUri =>
        analyzeImage(imageUri, description, apiKey)
      );

      const analysisResults = await Promise.all(analysisPromises);

      // Flatten the array of arrays into a single list of food items
      const allItems = analysisResults.flat();

      setResults(allItems);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.message || 'Failed to analyze images. Please check your API key and try again.';
      setError(errorMessage);
      Alert.alert('Analysis Error', errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveLog = async () => {
    try {
      await saveMeal(results);
      Alert.alert('Success', 'Meal saved to log');
      setResults([]);
      setSelectedImages([]);
      setDescription('');
    } catch (err) {
      Alert.alert('Error', 'Failed to save meal');
    }
  };

  const handleToggleHistory = async () => {
    if (view === 'analyze') {
      const logs = await getMealLogs();
      setMealLogs(logs);
      setView('history');
    } else {
      setView('analyze');
    }
  };

  const handleRemoveIngredient = (itemIndex: number, ingredientIndex: number) => {
    const newResults = [...results];
    const item = newResults[itemIndex];

    if (item.ingredients && item.ingredients[ingredientIndex]) {
      const ingredient = item.ingredients[ingredientIndex];

      // Update totals
      item.carbs = Math.max(0, item.carbs - ingredient.carbs);
      item.calories = Math.max(0, (item.calories || 0) - (ingredient.calories || 0));

      // Remove ingredient
      item.ingredients.splice(ingredientIndex, 1);

      setResults(newResults);
    }
  };

  const handleSaveItem = async (index: number) => {
    try {
      const item = results[index];
      await saveMeal([item]);
      Alert.alert('Success', 'Item saved to log');
    } catch (err) {
      Alert.alert('Error', 'Failed to save item');
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <Layout
        onResetKey={apiKey ? handleResetKey : undefined}
        onToggleHistory={apiKey ? handleToggleHistory : undefined}
        style={styles.status}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Analyze Your Meal</Text>
            <Text style={styles.subtitle}>
              Upload a photo of your food or menu to get instant carbohydrate and GI estimates.
            </Text>
          </View>

          {!apiKey ? (
            <ApiKeyInput onSave={handleSaveApiKey} />
          ) : (
            <>
              {view === 'history' ? (
                <MealLogList
                  logs={mealLogs}
                  onBack={() => setView('analyze')}
                  onUpdate={handleToggleHistory}
                />
              ) : (
                <>
                  <View style={styles.card}>
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>1. Upload Images</Text>
                      <ImageUpload
                        onImagesSelected={handleImagesSelected}
                        selectedImages={selectedImages}
                        onRemoveImage={handleRemoveImage}
                      />
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>2. Add Details</Text>
                      <AnalysisForm
                        description={description}
                        onDescriptionChange={setDescription}
                        onAnalyze={handleAnalyze}
                        isAnalyzing={isAnalyzing}
                        hasImages={selectedImages.length > 0}
                      />
                    </View>
                  </View>

                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <ResultsDisplay
                    items={results}
                    onSave={handleSaveLog}
                    onRemoveIngredient={handleRemoveIngredient}
                    onSaveItem={handleSaveItem}
                  />
                </>
              )}
            </>
          )}
        </View>
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  status: {
    gap: spacing.lg,
  },
  content: {
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.slate[900],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.slate[600],
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.slate[200],
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.slate[900],
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: colors.red[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.red[100],
  },
  errorText: {
    color: colors.red[700],
    textAlign: 'center',
  },
});
