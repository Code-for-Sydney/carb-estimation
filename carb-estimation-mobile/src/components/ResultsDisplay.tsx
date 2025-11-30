import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FoodItem } from '../types';
import { colors, spacing, borderRadius } from '../styles/theme';

interface ResultsDisplayProps {
    items: FoodItem[];
}

export function ResultsDisplay({ items }: ResultsDisplayProps) {
    const getGiColor = (gi: number) => {
        if (gi < 55) return { text: colors.emerald[600], bg: colors.emerald[50], border: colors.emerald[200] };
        if (gi < 70) return { text: colors.amber[600], bg: colors.amber[50], border: colors.amber[100] };
        return { text: colors.red[600], bg: colors.red[50], border: colors.red[100] };
    };

    const getGiLabel = (gi: number) => {
        if (gi < 55) return 'Low GI';
        if (gi < 70) return 'Medium GI';
        return 'High GI';
    };

    if (items.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Ionicons name="analytics" size={20} color={colors.emerald[600]} />
                        <Text style={styles.headerTitle}>Analysis Results</Text>
                    </View>
                    <Text style={styles.headerCount}>
                        {items.length} item{items.length !== 1 ? 's' : ''} identified
                    </Text>
                </View>

                <View style={styles.itemsContainer}>
                    {items.map((item, index) => {
                        const giColors = getGiColor(item.gi);
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.item,
                                    index < items.length - 1 && styles.itemBorder,
                                ]}
                            >
                                <View style={styles.itemLeft}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <View style={styles.badges}>
                                        <View
                                            style={[
                                                styles.badge,
                                                {
                                                    backgroundColor: giColors.bg,
                                                    borderColor: giColors.border,
                                                },
                                            ]}
                                        >
                                            <Text style={[styles.badgeText, { color: giColors.text }]}>
                                                GI: {item.gi} ({getGiLabel(item.gi)})
                                            </Text>
                                        </View>
                                        <Text style={styles.confidence}>
                                            Confidence: {Math.round(item.confidence * 100)}%
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.itemRight}>
                                    <Text style={styles.carbsValue}>{item.carbs}g</Text>
                                    <Text style={styles.carbsLabel}>CARBS</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {items.length > 1 && (
                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Total Carbohydrates</Text>
                        <View style={styles.totalValue}>
                            <Text style={styles.totalCarbs}>
                                {items.reduce((sum, item) => sum + item.carbs, 0)}g
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.disclaimer}>
                <Ionicons name="information-circle" size={20} color={colors.blue[700]} />
                <Text style={styles.disclaimerText}>
                    These are estimates based on visual analysis. Actual nutritional content may vary based on
                    ingredients and portion sizes. Always consult with a healthcare professional for medical advice.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.lg,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.slate[200],
        overflow: 'hidden',
    },
    header: {
        backgroundColor: colors.slate[50],
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.slate[900],
    },
    headerCount: {
        fontSize: 14,
        color: colors.slate[500],
    },
    itemsContainer: {
        padding: 0,
    },
    item: {
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    itemLeft: {
        flex: 1,
        gap: spacing.sm,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.slate[900],
    },
    badges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flexWrap: 'wrap',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    confidence: {
        fontSize: 14,
        color: colors.slate[500],
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    carbsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.slate[900],
    },
    carbsLabel: {
        fontSize: 10,
        color: colors.slate[500],
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    totalSection: {
        backgroundColor: colors.emerald[50],
        borderTopWidth: 2,
        borderTopColor: colors.emerald[200],
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.emerald[700],
    },
    totalValue: {
        alignItems: 'flex-end',
    },
    totalCarbs: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.emerald[700],
    },
    disclaimer: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.blue[50],
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.blue[100],
    },
    disclaimerText: {
        flex: 1,
        fontSize: 14,
        color: colors.blue[700],
        lineHeight: 20,
    },
});
