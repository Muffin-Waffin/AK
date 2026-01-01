import { StyleSheet, Image, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PreviewScreen({ imageUri, onRetake, onConfirm }) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

            <View style={styles.overlay}>
                <View style={styles.controls}>

                    <TouchableOpacity style={styles.actionButton} onPress={onRetake}>
                        <View style={[styles.iconCircle, styles.retakeDetail]}>
                            <Ionicons name="close" size={32} color="white" />
                        </View>
                        <Text style={styles.label}>Retake</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={onConfirm}>
                        <View style={[styles.iconCircle, styles.confirmDetail]}>
                            <Ionicons name="checkmark" size={32} color="white" />
                        </View>
                        <Text style={styles.label}>Confirm</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    image: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 50,
        paddingTop: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        gap: 5,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    retakeDetail: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    confirmDetail: {
        backgroundColor: '#2196F3', // Blue color for confirm
    },
    label: {
        color: 'white',
        fontWeight: '600',
        textShadowColor: 'black',
        textShadowRadius: 2,
    }
});
