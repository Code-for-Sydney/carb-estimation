import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../styles/theme';
import { commonStyles } from '../styles/common';

interface ApiKeyInputProps {
    onSave: (key: string) => void;
}

export function ApiKeyInput({ onSave }: ApiKeyInputProps) {
    const [key, setKey] = useState('');

    const handleSubmit = () => {
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Ionicons name="key" size={24} color={colors.emerald[600]} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Enter API Key</Text>
                <Text style={styles.subtitle}>
                    To use the advanced AI features, please provide your Google Gemini API Key.
                </Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={commonStyles.input}
                    secureTextEntry
                    value={key}
                    onChangeText={setKey}
                    placeholder="AIzaSy..."
                    placeholderTextColor={colors.slate[400]}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={[commonStyles.button, !key.trim() && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={!key.trim()}
                >
                    <Ionicons name="save" size={20} color={colors.white} />
                    <Text style={commonStyles.buttonText}>Save API Key</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.disclaimer}>
                Your key is stored locally on your device and never sent to our servers.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.slate[200],
        alignItems: 'center',
        gap: spacing.md,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    iconCircle: {
        backgroundColor: colors.emerald[100],
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.slate[900],
    },
    subtitle: {
        fontSize: 14,
        color: colors.slate[500],
        textAlign: 'center',
    },
    form: {
        width: '100%',
        gap: spacing.md,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    disclaimer: {
        fontSize: 12,
        color: colors.slate[400],
        textAlign: 'center',
    },
});
