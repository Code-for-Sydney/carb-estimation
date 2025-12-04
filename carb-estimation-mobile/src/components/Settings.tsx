import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { EnergyUnit } from '../services/storage';
import { colors, spacing, borderRadius } from '../styles/theme';

interface SettingsProps {
    energyUnit: EnergyUnit;
    apiKey: string;
    onEnergyUnitChange: (unit: EnergyUnit) => void;
    onApiKeyChange: (key: string) => void;
    onResetApiKey: () => void;
    onBack: () => void;
}

export function Settings({ energyUnit, apiKey, onEnergyUnitChange, onApiKeyChange, onResetApiKey, onBack }: SettingsProps) {
    const [isEditingApiKey, setIsEditingApiKey] = useState(false);
    const [newApiKey, setNewApiKey] = useState('');

    const handleSaveApiKey = () => {
        if (!newApiKey.trim()) {
            Alert.alert('Error', 'Please enter a valid API key');
            return;
        }
        onApiKeyChange(newApiKey.trim());
        setNewApiKey('');
        setIsEditingApiKey(false);
    };

    const handleResetApiKey = () => {
        Alert.alert(
            'Reset API Key',
            'Are you sure you want to reset your API key? You will need to enter a new one to use the app.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        onResetApiKey();
                        setIsEditingApiKey(false);
                        setNewApiKey('');
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.slate[700]} />
                    <Text style={styles.headerTitle}>Settings</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* API Configuration Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>API Configuration</Text>

                    <View style={styles.settingCard}>
                        <View style={styles.settingHeader}>
                            <Ionicons name="key-outline" size={20} color={colors.slate[700]} />
                            <Text style={styles.settingTitle}>Gemini API Key</Text>
                        </View>
                        <Text style={styles.settingDescription}>
                            Your API key is used to analyze food images
                        </Text>

                        {!isEditingApiKey ? (
                            <>
                                <View style={styles.apiKeyDisplay}>
                                    <Ionicons name="checkmark-circle" size={20} color={colors.emerald[600]} />
                                    <Text style={styles.apiKeyText}>API Key configured</Text>
                                </View>
                                <View style={styles.apiKeyActions}>
                                    <TouchableOpacity
                                        style={styles.changeKeyButton}
                                        onPress={() => setIsEditingApiKey(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="create-outline" size={18} color={colors.emerald[600]} />
                                        <Text style={styles.changeKeyText}>Change API Key</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.resetKeyButton}
                                        onPress={handleResetApiKey}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="trash-outline" size={18} color={colors.red[600]} />
                                        <Text style={styles.resetKeyText}>Reset</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    style={styles.apiKeyInput}
                                    placeholder="Enter new API key"
                                    value={newApiKey}
                                    onChangeText={setNewApiKey}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry
                                />
                                <View style={styles.apiKeyActions}>
                                    <TouchableOpacity
                                        style={styles.saveKeyButton}
                                        onPress={handleSaveApiKey}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="checkmark" size={18} color={colors.white} />
                                        <Text style={styles.saveKeyText}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.cancelKeyButton}
                                        onPress={() => {
                                            setIsEditingApiKey(false);
                                            setNewApiKey('');
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.cancelKeyText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Display Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Display Preferences</Text>

                    <View style={styles.settingCard}>
                        <View style={styles.settingHeader}>
                            <Ionicons name="flame-outline" size={20} color={colors.slate[700]} />
                            <Text style={styles.settingTitle}>Energy Unit</Text>
                        </View>
                        <Text style={styles.settingDescription}>
                            Choose how to display energy values
                        </Text>

                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    energyUnit === 'kcal' && styles.optionButtonActive,
                                ]}
                                onPress={() => onEnergyUnitChange('kcal')}
                                activeOpacity={0.7}
                            >
                                <View style={styles.radioOuter}>
                                    {energyUnit === 'kcal' && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                                <View style={styles.optionContent}>
                                    <Text style={[
                                        styles.optionLabel,
                                        energyUnit === 'kcal' && styles.optionLabelActive,
                                    ]}>
                                        Kilocalories (kcal)
                                    </Text>
                                    <Text style={styles.optionSubtext}>
                                        Standard food energy unit
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    energyUnit === 'kJ' && styles.optionButtonActive,
                                ]}
                                onPress={() => onEnergyUnitChange('kJ')}
                                activeOpacity={0.7}
                            >
                                <View style={styles.radioOuter}>
                                    {energyUnit === 'kJ' && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                                <View style={styles.optionContent}>
                                    <Text style={[
                                        styles.optionLabel,
                                        energyUnit === 'kJ' && styles.optionLabelActive,
                                    ]}>
                                        Kilojoules (kJ)
                                    </Text>
                                    <Text style={styles.optionSubtext}>
                                        SI unit (1 kcal = 4.184 kJ)
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.slate[50],
    },
    header: {
        padding: spacing.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200],
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.slate[900],
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        gap: spacing.lg,
    },
    section: {
        gap: spacing.md,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.slate[500],
        marginLeft: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    settingCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.slate[200],
        gap: spacing.md,
    },
    settingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.slate[900],
    },
    settingDescription: {
        fontSize: 14,
        color: colors.slate[600],
        lineHeight: 20,
    },
    optionsContainer: {
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.slate[200],
        backgroundColor: colors.white,
        gap: spacing.md,
    },
    optionButtonActive: {
        borderColor: colors.emerald[500],
        backgroundColor: colors.emerald[50],
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.slate[400],
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.emerald[600],
    },
    optionContent: {
        flex: 1,
        gap: 2,
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.slate[700],
    },
    optionLabelActive: {
        color: colors.emerald[700],
        fontWeight: '600',
    },
    optionSubtext: {
        fontSize: 13,
        color: colors.slate[500],
    },
    apiKeyDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        backgroundColor: colors.emerald[50],
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.emerald[200],
    },
    apiKeyText: {
        fontSize: 14,
        color: colors.emerald[700],
        fontWeight: '500',
    },
    apiKeyActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    changeKeyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.emerald[500],
    },
    changeKeyText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.emerald[600],
    },
    resetKeyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.red[600],
    },
    resetKeyText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.red[600],
    },
    apiKeyInput: {
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.slate[300],
        fontSize: 14,
        color: colors.slate[900],
    },
    saveKeyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        padding: spacing.md,
        backgroundColor: colors.emerald[600],
        borderRadius: borderRadius.md,
    },
    saveKeyText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
    cancelKeyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.slate[300],
    },
    cancelKeyText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.slate[600],
    },
});
