import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MealLog } from '../types';
import { colors, spacing, borderRadius } from '../styles/theme';

interface WeeklyChartProps {
    logs: MealLog[];
}

export function WeeklyChart({ logs }: WeeklyChartProps) {
    // Get last 7 days including today
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d);
        }
        return days;
    };

    const days = getLast7Days();

    // Calculate daily totals
    const dailyTotals = days.map(day => {
        const dayStr = day.toDateString();
        const dayLogs = logs.filter(log => new Date(log.date).toDateString() === dayStr);
        return dayLogs.reduce((sum, log) => sum + log.totalCalories, 0);
    });

    const maxVal = Math.max(...dailyTotals, 2000); // Minimum 2000 kcal scale

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Last 7 Days (Calories)</Text>
            <View style={styles.chart}>
                {days.map((day, index) => {
                    const value = dailyTotals[index];
                    const heightPercentage = (value / maxVal) * 100;
                    const isToday = index === 6;

                    return (
                        <View key={index} style={styles.barContainer}>
                            <View style={styles.barTrack}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${heightPercentage}%`,
                                            backgroundColor: isToday ? colors.emerald[500] : colors.emerald[400]
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                                {day.toLocaleDateString(undefined, { weekday: 'narrow' })}
                            </Text>
                            <Text style={styles.valueLabel}>{Math.round(value)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.slate[200],
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.slate[900],
        marginBottom: spacing.lg,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        paddingBottom: spacing.xs,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
        gap: 4,
    },
    barTrack: {
        flex: 1,
        width: 8,
        backgroundColor: colors.slate[100],
        borderRadius: 4,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    bar: {
        width: '100%',
        borderRadius: 4,
        minHeight: 4,
    },
    dayLabel: {
        fontSize: 12,
        color: colors.slate[500],
        fontWeight: '500',
    },
    todayLabel: {
        color: colors.emerald[600],
        fontWeight: '700',
    },
    valueLabel: {
        fontSize: 10,
        color: colors.slate[400],
    },
});
