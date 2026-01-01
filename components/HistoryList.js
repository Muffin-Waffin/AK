import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

export default function HistoryList({ history }) {
    if (!history || history.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No history yet.</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            <View style={styles.textContainer}>
                <Text style={styles.itemText} numberOfLines={2}>{item.text}</Text>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Recents</Text>
            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} // simple key for now
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        backgroundColor: 'rgba(0,0,0,0.8)',
        width: '100%',
    },
    header: {
        color: '#888',
        fontSize: 12,
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 5,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 10,
    },
    emptyContainer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    emptyText: {
        color: '#555',
        fontSize: 12,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#222',
        borderRadius: 8,
        marginRight: 10,
        padding: 5,
        width: 200,
        height: 70,
        alignItems: 'center',
    },
    thumbnail: {
        width: 40,
        height: 40,
        borderRadius: 4,
        marginRight: 10,
        backgroundColor: '#333',
    },
    textContainer: {
        flex: 1,
    },
    itemText: {
        color: 'white',
        fontSize: 12,
        marginBottom: 2,
    },
    dateText: {
        color: '#666',
        fontSize: 10,
    }
});
