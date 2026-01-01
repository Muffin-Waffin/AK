import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock OCR Service
const mockExtractText = async (imageUri) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("This is a simulated OCR result.\n\nIngredients:\n- Water\n- Sugar\n- Natural Flavors\n\n(Note: Native OCR requires a custom build, so we are mocking this for the demo.)");
        }, 1500); // Simulate processing delay
    });
};

export default function ResultScreen({ imageUri, onDone, onSaveHistory }) {
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");

    useEffect(() => {
        let active = true;

        const processImage = async () => {
            const result = await mockExtractText(imageUri);
            if (active) {
                setText(result);
                setLoading(false);
                if (onSaveHistory) {
                    onSaveHistory({ uri: imageUri, text: result, date: new Date().toISOString() });
                }
            }
        };

        processImage();

        return () => { active = false; };
    }, [imageUri]);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
            </View>

            <View style={styles.resultContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2196F3" />
                        <Text style={styles.loadingText}>Extracting text...</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.textScroll}>
                        <Text style={styles.headerText}>Extracted Text</Text>
                        <Text style={styles.bodyText}>{text}</Text>
                    </ScrollView>
                )}

                <TouchableOpacity style={styles.doneButton} onPress={onDone}>
                    <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        height: '40%',
        backgroundColor: '#222',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    resultContainer: {
        flex: 1,
        backgroundColor: '#111',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#888',
        marginTop: 10,
    },
    textScroll: {
        flex: 1,
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bodyText: {
        color: '#ddd',
        fontSize: 14,
        lineHeight: 22,
    },
    doneButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
