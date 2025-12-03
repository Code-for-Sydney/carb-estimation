import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FoodItem } from '../types';
import { colors, spacing, borderRadius } from '../styles/theme';

interface ResultsDisplayProps {
    items: FoodItem[];
    onSave?: () => void;
    onRemoveIngredient?: (itemIndex: number, ingredientIndex: number) => void;
    onSaveItem?: (index: number) => void;
}

export function ResultsDisplay({ items, onSave, onRemoveIngredient, onSaveItem }: ResultsDisplayProps) {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

    const toggleExpanded = (index: number) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedItems(newExpanded);
    };

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
                        const isExpanded = expandedItems.has(index);
                        const hasIngredients = item.ingredients && item.ingredients.length > 0;

                        return (
                            <View
                                key={index}
                                style={[
                                    styles.item,
                                    index < items.length - 1 && styles.itemBorder,
                                ]}
                            >
                                <View style={styles.itemContent}>
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
                                        <View style={styles.statRow}>
                                            <Text style={styles.primaryValue}>{item.calories}</Text>
                                            <Text style={styles.primaryLabel}>KCAL</Text>
                                        </View>
                                        <View style={styles.statRow}>
                                            <Text style={styles.secondaryValue}>{item.carbs}g</Text>
                                            <Text style={styles.secondaryLabel}>CARBS</Text>
                                        </View>
                                        {onSaveItem && (
                                            <TouchableOpacity
                                                onPress={() => onSaveItem(index)}
                                                style={styles.itemSaveButton}
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                            >
                                                <Ionicons name="save-outline" size={20} color={colors.emerald[600]} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                {hasIngredients && (
                                    <>
                                        <TouchableOpacity
                                            style={styles.expandButton}
                                            onPress={() => toggleExpanded(index)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                                size={20}
                                                color={colors.slate[500]}
                                            />
                                            <Text style={styles.expandButtonText}>
                                                {isExpanded ? 'Hide' : 'Show'} Ingredients
                                            </Text>
                                        </TouchableOpacity>

                                        {isExpanded && (
                                            <View style={styles.ingredientsContainer}>
                                                <Text style={styles.ingredientsTitle}>Ingredient Breakdown</Text>
                                                {item.ingredients!.map((ingredient, ingredientIndex) => (
                                                    <View key={ingredientIndex} style={styles.ingredientRow}>
                                                        <Text style={styles.ingredientName}>{ingredient.name}</Text>
                                                        <View style={styles.ingredientStats}>
                                                            <Text style={styles.ingredientPrimary}>{ingredient.calories} kcal</Text>
                                                            <Text style={styles.ingredientSecondary}>{ingredient.carbs}g carbs</Text>
                                                            {onRemoveIngredient && (
                                                                <TouchableOpacity
                                                                    onPress={() => onRemoveIngredient(index, ingredientIndex)}
                                                                    style={styles.removeIngredientButton}
                                                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                                >
                                                                    <Ionicons name="close-circle" size={20} color={colors.red[600]} />
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>

            <View style={styles.disclaimer}>
                <Ionicons name="information-circle" size={20} color={colors.blue[700]} />
                <Text style={styles.disclaimerText}>
                    These are estimates based on visual analysis. Actual nutritional content may vary based on
                    ingredients and portion sizes. Always consult with a healthcare professional for medical advice.
                </Text>
            </View>

            {onSave && (
                <TouchableOpacity style={styles.saveButton} onPress={onSave} activeOpacity={0.8}>
                    <Ionicons name="save-outline" size={20} color={colors.white} />
                    <Text style={styles.saveButtonText}>Save to Log</Text>
                </TouchableOpacity>
            )}
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
        gap: spacing.md,
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.md,
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
    primaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.slate[900],
    },
    primaryLabel: {
        fontSize: 10,
        color: colors.slate[500],
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    statRow: {
        alignItems: 'flex-end',
        marginBottom: 4,
    },
    secondaryValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.slate[700],
    },
    secondaryLabel: {
        fontSize: 10,
        color: colors.slate[500],
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    itemSaveButton: {
        marginTop: spacing.sm,
        padding: 4,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.slate[50],
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    expandButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.slate[600],
    },
    ingredientsContainer: {
        backgroundColor: colors.slate[50],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    ingredientsTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.slate[700],
        marginBottom: spacing.xs,
    },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    ingredientName: {
        fontSize: 14,
        color: colors.slate[700],
        flex: 1,
    },
    ingredientPrimary: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.slate[900],
    },
    ingredientStats: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    ingredientSecondary: {
        fontSize: 14,
        color: colors.slate[500],
    },
    removeIngredientButton: {
        marginLeft: spacing.xs,
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
    saveButton: {
        backgroundColor: colors.emerald[600],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
