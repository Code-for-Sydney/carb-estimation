import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MealLog } from '../types';
import { WeeklyChart } from './WeeklyChart';
import { deleteMealLog } from '../services/storage';
import { colors, spacing, borderRadius } from '../styles/theme';

interface MealLogListProps {
    logs: MealLog[];
    onBack: () => void;
    onUpdate: () => void;
}

export function MealLogList({ logs, onBack, onUpdate }: MealLogListProps) {
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const groupLogsByDate = (logs: MealLog[]) => {
        const groups: { [key: string]: MealLog[] } = {};
        logs.forEach(log => {
            const date = new Date(log.date).toDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(log);
        });
        return groups;
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Meal",
            "Are you sure you want to delete this meal log?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteMealLog(id);
                            onUpdate();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete meal log");
                        }
                    }
                }
            ]
        );
    };

    const groupedLogs = groupLogsByDate(logs);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.slate[700]} />
                    <Text style={styles.headerTitle}>Meal History</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {logs.length > 0 && <WeeklyChart logs={logs} />}

                {logs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="restaurant-outline" size={48} color={colors.slate[300]} />
                        <Text style={styles.emptyText}>No meals saved yet</Text>
                    </View>
                ) : (
                    Object.entries(groupedLogs).map(([date, dayLogs]) => (
                        <View key={date} style={styles.daySection}>
                            <Text style={styles.dateHeader}>{date}</Text>
                            {dayLogs.map(log => (
                                <View key={log.id} style={styles.logCard}>
                                    <View style={styles.logHeader}>
                                        <Text style={styles.time}>
                                            {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                        <View style={styles.totals}>
                                            <Text style={styles.primaryTotal}>{Math.round(log.totalCalories)} kcal</Text>
                                            <Text style={styles.secondaryTotal}>{Math.round(log.totalCarbs)}g carbs</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(log.id)}
                                            style={styles.deleteButton}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons name="trash-outline" size={18} color={colors.red[600]} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemsList}>
                                        {log.items.map((item, index) => (
                                            <Text key={index} style={styles.itemName}>
                                                • {item.name}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))
                )}
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
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.md,
        marginTop: spacing.xl,
    },
    emptyText: {
        fontSize: 16,
        color: colors.slate[500],
    },
    daySection: {
        gap: spacing.sm,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.slate[500],
        marginLeft: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    logCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.slate[200],
        gap: spacing.sm,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
        paddingBottom: spacing.sm,
    },
    time: {
        fontSize: 14,
        color: colors.slate[500],
        fontWeight: '500',
    },
    totals: {
        flexDirection: 'row',
        gap: spacing.md,
        flex: 1,
    },
    deleteButton: {
        padding: 4,
    },
    primaryTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.slate[900],
    },
    secondaryTotal: {
        fontSize: 14,
        color: colors.slate[600],
    },
    itemsList: {
        gap: 2,
    },
    itemName: {
        fontSize: 14,
        color: colors.slate[700],
    },
});
