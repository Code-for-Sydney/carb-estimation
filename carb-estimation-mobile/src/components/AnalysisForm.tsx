import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../styles/theme';
import { commonStyles } from '../styles/common';

interface AnalysisFormProps {
    description: string;
    onDescriptionChange: (value: string) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
    hasImages: boolean;
}

export function AnalysisForm({
    description,
    onDescriptionChange,
    onAnalyze,
    isAnalyzing,
    hasImages,
}: AnalysisFormProps) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.label}>Additional Details (Optional)</Text>
                <TextInput
                    style={styles.input}
                    multiline
                    numberOfLines={3}
                    placeholder="e.g., 'Spaghetti bolognese with parmesan' or 'Menu from Italian restaurant'"
                    placeholderTextColor={colors.slate[400]}
                    value={description}
                    onChangeText={onDescriptionChange}
                    textAlignVertical="top"
                />
            </View>

            <TouchableOpacity
                style={[
                    commonStyles.button,
                    (!hasImages || isAnalyzing) && styles.buttonDisabled,
                ]}
                onPress={onAnalyze}
                disabled={!hasImages || isAnalyzing}
            >
                {isAnalyzing ? (
                    <>
                        <ActivityIndicator color={colors.white} size="small" />
                        <Text style={commonStyles.buttonText}>Analyzing...</Text>
                    </>
                ) : (
                    <>
                        <Ionicons name="send" size={20} color={colors.white} />
                        <Text style={commonStyles.buttonText}>Analyze Food</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.slate[700],
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.slate[300],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 16,
        backgroundColor: colors.white,
        minHeight: 80,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});
