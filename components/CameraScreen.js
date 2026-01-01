import { useState, useRef, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.7;

export default function CameraScreen({ onScan }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Delay rendering to allow native resources to free up
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCameraReady(true);
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  // Reset scanned state when component mounts/remounts (if kept mounted, parent should handle reset)
  useEffect(() => {
    setScanned(false);
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (onScan) {
      onScan({ type, data });
    }
  };

  if (!permission || !isCameraReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode="picture" // CameraView in SDK 50+ might auto-enable scanner if onBarcodeScanned is present, but 'mode' might be relevant. 'picture' + scanner usually works.
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_e", "upc_a", "code128"],
        }}
        onCameraReady={() => console.log("Camera Ready")}
        onMountError={(e) => console.error("Camera Mount Error", e)}
      />

      {/* Scanner Overlay */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.scannerBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>

      {/* Controls Overlay */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse-outline" size={32} color="white" />
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
            <Text style={styles.rescanText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Overlay Mask
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfocusedContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: SCANNER_SIZE,
  },
  scannerBox: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Corners
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#2196F3',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0 },

  controlsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    left: 20,
    alignItems: 'flex-end',
  },
  button: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
  },
  rescanButton: {
    position: 'absolute',
    bottom: -Dimensions.get('window').height * 0.8, // Push to bottom roughly
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rescanText: {
    fontWeight: 'bold',
  }
});
