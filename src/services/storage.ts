import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FoodItem, MealLog } from '../types';

const MEAL_LOGS_KEY = 'meal_logs';

export const saveMeal = async (items: FoodItem[]): Promise<MealLog> => {
    try {
        const totalCarbs = items.reduce((sum, item) => sum + item.carbs, 0);
        const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);

        const newLog: MealLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items,
            totalCarbs,
            totalCalories,
        };

        const existingLogs = await getMealLogs();
        const updatedLogs = [newLog, ...existingLogs];

        await AsyncStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(updatedLogs));
        return newLog;
    } catch (error) {
        console.error('Failed to save meal log:', error);
        throw error;
    }
};

export const getMealLogs = async (): Promise<MealLog[]> => {
    try {
        const logsJson = await AsyncStorage.getItem(MEAL_LOGS_KEY);
        if (!logsJson) return [];
        return JSON.parse(logsJson);
    } catch (error) {
        console.error('Failed to get meal logs:', error);
        return [];
    }
};

export const deleteMealLog = async (id: string): Promise<void> => {
    try {
        const existingLogs = await getMealLogs();
        const updatedLogs = existingLogs.filter(log => log.id !== id);
        await AsyncStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
        console.error('Failed to delete meal log:', error);
        throw error;
    }
};

export const clearLogs = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(MEAL_LOGS_KEY);
    } catch (error) {
        console.error('Failed to clear meal logs:', error);
        throw error;
    }
};

const ENERGY_UNIT_KEY = 'energy_unit';

export type EnergyUnit = 'kcal' | 'kJ';

export const saveEnergyUnit = async (unit: EnergyUnit): Promise<void> => {
    try {
        await AsyncStorage.setItem(ENERGY_UNIT_KEY, unit);
    } catch (error) {
        console.error('Failed to save energy unit:', error);
        throw error;
    }
};

export const getEnergyUnit = async (): Promise<EnergyUnit> => {
    try {
        const unit = await AsyncStorage.getItem(ENERGY_UNIT_KEY);
        return (unit as EnergyUnit) || 'kcal';
    } catch (error) {
        console.error('Failed to get energy unit:', error);
        return 'kcal';
    }
};
