import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/theme';

interface LayoutProps {
    children: React.ReactNode;
    onToggleHistory?: () => void;
    onToggleSettings?: () => void;
    style?: ViewStyle;
}

export function Layout({ children, onToggleHistory, onToggleSettings, style }: LayoutProps) {
    return (
        <SafeAreaView style={[styles.container, style]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="restaurant" size={24} color={colors.white} />
                    </View>
                    <Text style={styles.title}>NutriLens</Text>
                </View>
                <View style={styles.headerRight}>
                    {onToggleHistory && (
                        <TouchableOpacity onPress={onToggleHistory} style={styles.historyButton}>
                            <Ionicons name="time-outline" size={24} color={colors.slate[600]} />
                        </TouchableOpacity>
                    )}
                    {onToggleSettings && (
                        <TouchableOpacity onPress={onToggleSettings} style={styles.historyButton}>
                            <Ionicons name="settings-sharp" size={24} color={colors.slate[600]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                {children}
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    © {new Date().getFullYear()} NutriLens. For informational purposes only.
                </Text>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.slate[50],
    },
    header: {
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200],
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconContainer: {
        backgroundColor: colors.emerald[500],
        padding: spacing.sm,
        borderRadius: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.slate[900],
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    settingsText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.slate[600],
    },
    historyButton: {
        padding: spacing.xs,
    },
    main: {
        flex: 1,
    },
    mainContent: {
        padding: spacing.md,
    },
    footer: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.slate[200],
        paddingVertical: spacing.lg,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: colors.slate[500],
    },
});
