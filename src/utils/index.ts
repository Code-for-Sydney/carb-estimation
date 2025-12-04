import type { EnergyUnit } from '../services/storage';

const KCAL_TO_KJ = 4.184;

/**
 * Convert energy from kcal to the specified unit
 */
export const convertEnergy = (kcal: number, unit: EnergyUnit): number => {
    if (unit === 'kJ') {
        return kcal * KCAL_TO_KJ;
    }
    return kcal;
};

/**
 * Format energy value with the appropriate unit label
 */
export const formatEnergy = (kcal: number, unit: EnergyUnit): string => {
    const value = convertEnergy(kcal, unit);
    return `${Math.round(value)} ${unit}`;
};

/**
 * Get the short label for the energy unit (for compact displays)
 */
export const getEnergyUnitLabel = (unit: EnergyUnit): string => {
    return unit;
};
