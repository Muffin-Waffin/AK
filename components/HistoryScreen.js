
import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen({ history, onSelect, onDelete }) {
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleLongPress = (item) => {
        setSelectionMode(true);
        toggleSelection(item);
    };

    const toggleSelection = (item) => {
        if (selectedItems.includes(item.date)) {
            const newSelection = selectedItems.filter(id => id !== item.date);
            setSelectedItems(newSelection);
            if (newSelection.length === 0) setSelectionMode(false);
        } else {
            setSelectedItems([...selectedItems, item.date]);
        }
    };

    const handleTap = (item) => {
        if (selectionMode) {
            toggleSelection(item);
        } else {
            onSelect(item);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete Items",
            `Are you sure you want to delete ${selectedItems.length} items ? `,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        onDelete(selectedItems);
                        setSelectionMode(false);
                        setSelectedItems([]);
                    }
                }
            ]
        );
    };

    const cancelSelection = () => {
        setSelectionMode(false);
        setSelectedItems([]);
    };

    if (!history || history.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>No scan history found.</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const isSelected = selectedItems.includes(item.date);
        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleTap(item)}
                onLongPress={() => handleLongPress(item)}
                delayLongPress={300}
            >
                {selectionMode && (
                    <View style={styles.checkboxContainer}>
                        <Ionicons
                            name={isSelected ? "checkbox" : "square-outline"}
                            size={24}
                            color={isSelected ? "#2196F3" : "#666"}
                        />
                    </View>
                )}
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                <View style={styles.textContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    <Text style={styles.ingredientText} numberOfLines={1}>{item.ingredient}</Text>
                    <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                {!selectionMode && (
                    <View style={styles.arrowContainer}>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>
                    {selectionMode ? `${selectedItems.length} Selected` : 'Scan History'}
                </Text>
                {selectionMode && (
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={confirmDelete} style={styles.iconButton}>
                            <Ionicons name="trash-outline" size={24} color="#F44336" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={cancelSelection} style={styles.iconButton}>
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item) => item.date}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const getStatusColor = (status) => {
    switch (status) {
        case 'YES': return '#4CAF50';
        case 'NO': return '#F44336';
        case 'MODERATE': return '#FFC107';
        default: return '#888';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 50,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    header: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 15,
    },
    iconButton: {
        padding: 5,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 100,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#222',
        borderRadius: 12,
        marginBottom: 15,
        padding: 10,
        alignItems: 'center',
    },
    cardSelected: {
        backgroundColor: '#333',
        borderColor: '#2196F3',
        borderWidth: 1,
    },
    checkboxContainer: {
        marginRight: 10,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: '#333',
    },
    textContainer: {
        flex: 1,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 5,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    ingredientText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    dateText: {
        color: '#666',
        fontSize: 12,
        marginTop: 2,
    },
    arrowContainer: {
        justifyContent: 'center',
        paddingLeft: 10,
    }
});

