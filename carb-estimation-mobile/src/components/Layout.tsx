import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/theme';

interface LayoutProps {
    children: React.ReactNode;
    onResetKey?: () => void;
}

export function Layout({ children, onResetKey }: LayoutProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="restaurant" size={24} color={colors.white} />
                    </View>
                    <Text style={styles.title}>CarbEstimate AI</Text>
                </View>
                {onResetKey && (
                    <TouchableOpacity onPress={onResetKey} style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={20} color={colors.slate[600]} />
                        <Text style={styles.settingsText}>Change API Key</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                {children}
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    © {new Date().getFullYear()} CarbEstimate AI. For informational purposes only.
                </Text>
            </View>
        </SafeAreaView>
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
