import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../styles/theme';

interface ImageUploadProps {
    onImagesSelected: (uris: string[]) => void;
    selectedImages: string[];
    onRemoveImage: (index: number) => void;
}

export function ImageUpload({ onImagesSelected, selectedImages, onRemoveImage }: ImageUploadProps) {
    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets) {
            const uris = result.assets.map(asset => asset.uri);
            onImagesSelected(uris);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        });

        if (!result.canceled && result.assets) {
            onImagesSelected([result.assets[0].uri]);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.uploadArea}>
                <View style={styles.iconCircle}>
                    <Ionicons name="cloud-upload-outline" size={32} color={colors.slate[500]} />
                </View>
                <Text style={styles.uploadTitle}>Upload Food Images</Text>
                <Text style={styles.uploadSubtitle}>Take a photo or choose from your gallery</Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                        <Ionicons name="camera-outline" size={20} color={colors.emerald[600]} />
                        <Text style={styles.uploadButtonText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        <Ionicons name="images-outline" size={20} color={colors.emerald[600]} />
                        <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {selectedImages.length > 0 && (
                <View style={styles.imageGrid}>
                    {selectedImages.map((uri, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image source={{ uri }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => onRemoveImage(index)}
                            >
                                <Ionicons name="close" size={16} color={colors.slate[700]} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },
    uploadArea: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.slate[300],
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    iconCircle: {
        backgroundColor: colors.slate[100],
        padding: spacing.md,
        borderRadius: 999,
        marginBottom: spacing.md,
    },
    uploadTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.slate[900],
        marginBottom: spacing.xs,
    },
    uploadSubtitle: {
        fontSize: 14,
        color: colors.slate[500],
        marginBottom: spacing.lg,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
    },
    uploadButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: colors.emerald[50],
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.emerald[200],
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.emerald[600],
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    imageContainer: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.slate[200],
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: spacing.xs,
        right: spacing.xs,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 999,
        padding: 4,
    },
});
