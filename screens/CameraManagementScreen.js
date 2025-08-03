import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
  FlatList
} from 'react-native';
import { useCameraStore } from '../stores/cameraStore';
import { useSiteStore } from '../stores/siteStore';

const CameraManagementScreen = () => {
  const { 
    cameras, 
    selectedCamera, 
    addBrandCamera, 
    removeCamera, 
    selectCamera, 
    testCameraConnection, 
    getCameraStats,
    controlPTZ,
    connectionStatus,
    getSupportedBrands,
    getBrandConfig
  } = useCameraStore();
  
  const { selectedSite } = useSiteStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCameraDetails, setShowCameraDetails] = useState(false);
  const [newCamera, setNewCamera] = useState({
    name: '',
    brand: 'Vivotek',
    model: '',
    ipAddress: '',
    port: '',
    username: '',
    password: '',
    location: '',
    resolution: '1080p',
    nightVision: true,
    ptzCapable: false,
    recording: true
  });

  const stats = getCameraStats();
  const siteCameras = cameras.filter(c => c.siteId === selectedSite?.id);

  const handleAddCamera = () => {
    if (!newCamera.name || !newCamera.ipAddress || !newCamera.brand) {
      Alert.alert('Error', 'Please fill in camera name, brand, and IP address');
      return;
    }

    const brandConfig = getBrandConfig(newCamera.brand);
    const cameraData = {
      ...newCamera,
      siteId: selectedSite?.id || 1,
      port: parseInt(newCamera.port) || brandConfig.defaultPort,
      username: newCamera.username || brandConfig.defaultUsername
    };

    const cameraId = addBrandCamera(cameraData, newCamera.brand);
    
    // Test connection after adding
    testCameraConnection(cameraId);
    
    setShowAddModal(false);
    setNewCamera({
      name: '',
      brand: 'Vivotek',
      model: '',
      ipAddress: '',
      port: '',
      username: '',
      password: '',
      location: '',
      resolution: '1080p',
      nightVision: true,
      ptzCapable: false,
      recording: true
    });

    Alert.alert('Success', `${newCamera.brand} camera added successfully!`);
  };

  const handleDeleteCamera = (cameraId, cameraName) => {
    Alert.alert(
      'Delete Camera',
      `Are you sure you want to remove "${cameraName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeCamera(cameraId)
        }
      ]
    );
  };

  const handleTestConnection = async (cameraId, cameraName) => {
    const success = await testCameraConnection(cameraId);
    Alert.alert(
      'Connection Test',
      success 
        ? `✅ Successfully connected to ${cameraName}` 
        : `❌ Failed to connect to ${cameraName}`
    );
  };

  const renderCameraCard = ({ item: camera }) => (
    <View style={styles.cameraCard}>
      <View style={styles.cameraHeader}>
        <View style={styles.cameraInfo}>
          <Text style={styles.cameraName}>{camera.name}</Text>
          <Text style={styles.cameraModel}>{camera.brand} {camera.model}</Text>
          <Text style={styles.cameraLocation}>📍 {camera.location}</Text>
        </View>
        <View style={styles.cameraStatus}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: camera.status === 'online' ? '#48bb78' : '#f56565' }
          ]} />
          <Text style={[
            styles.statusText,
            { color: camera.status === 'online' ? '#48bb78' : '#f56565' }
          ]}>
            {camera.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.cameraDetails}>
        <Text style={styles.detailText}>🌐 {camera.ipAddress}:{camera.port}</Text>
        <Text style={styles.detailText}>📺 {camera.resolution}</Text>
        <View style={styles.featureRow}>
          {camera.nightVision && <Text style={styles.featureTag}>🌙 Night Vision</Text>}
          {camera.ptzCapable && <Text style={styles.featureTag}>🔄 PTZ</Text>}
          {camera.recording && <Text style={styles.featureTag}>🔴 Recording</Text>}
        </View>
      </View>

      <View style={styles.cameraActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            selectCamera(camera.id);
            setShowCameraDetails(true);
          }}
        >
          <Text style={styles.actionButtonText}>View Feed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.testButton]}
          onPress={() => handleTestConnection(camera.id, camera.name)}
          disabled={connectionStatus[camera.id] === 'testing'}
        >
          <Text style={styles.actionButtonText}>
            {connectionStatus[camera.id] === 'testing' ? 'Testing...' : 'Test'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteCamera(camera.id, camera.name)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const PTZControls = ({ camera }) => (
    <View style={styles.ptzControls}>
      <Text style={styles.ptzTitle}>PTZ Controls</Text>
      <View style={styles.ptzGrid}>
        <TouchableOpacity 
          style={styles.ptzButton}
          onPress={() => controlPTZ(camera.id, 'up')}
        >
          <Text style={styles.ptzButtonText}>↑</Text>
        </TouchableOpacity>
        <View style={styles.ptzRow}>
          <TouchableOpacity 
            style={styles.ptzButton}
            onPress={() => controlPTZ(camera.id, 'left')}
          >
            <Text style={styles.ptzButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.ptzButton}
            onPress={() => controlPTZ(camera.id, 'home')}
          >
            <Text style={styles.ptzButtonText}>⌂</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.ptzButton}
            onPress={() => controlPTZ(camera.id, 'right')}
          >
            <Text style={styles.ptzButtonText}>→</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.ptzButton}
          onPress={() => controlPTZ(camera.id, 'down')}
        >
          <Text style={styles.ptzButtonText}>↓</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.zoomControls}>
        <TouchableOpacity 
          style={styles.zoomButton}
          onPress={() => controlPTZ(camera.id, 'zoom_in')}
        >
          <Text style={styles.zoomButtonText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.zoomButton}
          onPress={() => controlPTZ(camera.id, 'zoom_out')}
        >
          <Text style={styles.zoomButtonText}>Zoom Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Camera Systems</Text>
        <Text style={styles.subtitle}>Multi-Brand Remote Management</Text>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Cameras</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#48bb78' }]}>{stats.online}</Text>
          <Text style={styles.statLabel}>Online</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#f56565' }]}>{stats.offline}</Text>
          <Text style={styles.statLabel}>Offline</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.vivotek + stats.axis + stats.hikvision + stats.dahua}</Text>
          <Text style={styles.statLabel}>All Brands</Text>
        </View>
      </View>

      {/* Add Camera Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ Add Professional Camera</Text>
      </TouchableOpacity>

      {/* Camera List */}
      <FlatList
        data={siteCameras}
        renderItem={renderCameraCard}
        keyExtractor={(item) => item.id.toString()}
        style={styles.cameraList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No cameras configured</Text>
            <Text style={styles.emptySubtext}>Add your first professional camera to get started</Text>
          </View>
        }
      />

      {/* Add Camera Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Professional Camera</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Camera Brand *</Text>
              <View style={styles.pickerContainer}>
                {getSupportedBrands().map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.brandButton,
                      newCamera.brand === brand && styles.selectedBrandButton
                    ]}
                    onPress={() => {
                      const brandConfig = getBrandConfig(brand);
                      setNewCamera({
                        ...newCamera,
                        brand,
                        port: brandConfig.defaultPort.toString(),
                        username: brandConfig.defaultUsername,
                        ptzCapable: brandConfig.ptzSupport
                      });
                    }}
                  >
                    <Text style={[
                      styles.brandButtonText,
                      newCamera.brand === brand && styles.selectedBrandButtonText
                    ]}>
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Camera Name *</Text>
              <TextInput
                style={styles.textInput}
                value={newCamera.name}
                onChangeText={(text) => setNewCamera({...newCamera, name: text})}
                placeholder="e.g., Main Entrance"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Model</Text>
              <TextInput
                style={styles.textInput}
                value={newCamera.model}
                onChangeText={(text) => setNewCamera({...newCamera, model: text})}
                placeholder="e.g., VT-4K-001"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>IP Address *</Text>
              <TextInput
                style={styles.textInput}
                value={newCamera.ipAddress}
                onChangeText={(text) => setNewCamera({...newCamera, ipAddress: text})}
                placeholder="192.168.1.100"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Port</Text>
              <TextInput
                style={styles.textInput}
                value={newCamera.port}
                onChangeText={(text) => setNewCamera({...newCamera, port: text})}
                placeholder="554"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={newCamera.username}
                onChangeText={(text) => setNewCamera({...newCamera, username: text})}
                placeholder="admin"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                value={newCamera.password}
                onChangeText={(text) => setNewCamera({...newCamera, password: text})}
                placeholder="Camera password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={newCamera.location}
                onChangeText={(text) => setNewCamera({...newCamera, location: text})}
                placeholder="e.g., Front Door"
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.inputLabel}>Night Vision</Text>
              <Switch
                value={newCamera.nightVision}
                onValueChange={(value) => setNewCamera({...newCamera, nightVision: value})}
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.inputLabel}>PTZ Capable</Text>
              <Switch
                value={newCamera.ptzCapable}
                onValueChange={(value) => setNewCamera({...newCamera, ptzCapable: value})}
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.inputLabel}>Enable Recording</Text>
              <Switch
                value={newCamera.recording}
                onValueChange={(value) => setNewCamera({...newCamera, recording: value})}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleAddCamera}>
              <Text style={styles.saveButtonText}>Add Camera</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Camera Details Modal */}
      <Modal
        visible={showCameraDetails}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedCamera?.name || 'Camera Details'}
            </Text>
            <TouchableOpacity onPress={() => setShowCameraDetails(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedCamera && (
              <>
                <View style={styles.feedContainer}>
                  <Text style={styles.feedPlaceholder}>
                    📹 Live Feed Placeholder
                  </Text>
                  <Text style={styles.feedSubtext}>
                    Stream: {selectedCamera.streamUrl}
                  </Text>
                </View>

                {selectedCamera.ptzCapable && (
                  <PTZControls camera={selectedCamera} />
                )}

                <View style={styles.cameraInfoSection}>
                  <Text style={styles.sectionTitle}>Camera Information</Text>
                  <Text style={styles.infoText}>Model: Vuvitek {selectedCamera.model}</Text>
                  <Text style={styles.infoText}>IP: {selectedCamera.ipAddress}:{selectedCamera.port}</Text>
                  <Text style={styles.infoText}>Location: {selectedCamera.location}</Text>
                  <Text style={styles.infoText}>Resolution: {selectedCamera.resolution}</Text>
                  <Text style={styles.infoText}>
                    Status: <Text style={{ color: selectedCamera.status === 'online' ? '#48bb78' : '#f56565' }}>
                      {selectedCamera.status.toUpperCase()}
                    </Text>
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    backgroundColor: '#1a365d',
    padding: 20,
    paddingTop: 50,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#90cdf4',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#1a365d',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  cameraCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cameraInfo: {
    flex: 1,
  },
  cameraName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 5,
  },
  cameraModel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 3,
  },
  cameraLocation: {
    fontSize: 14,
    color: '#4a5568',
  },
  cameraStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cameraDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 3,
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  featureTag: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 12,
    color: '#4a5568',
    marginRight: 5,
    marginBottom: 3,
  },
  cameraActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#1a365d',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#48bb78',
  },
  deleteButton: {
    backgroundColor: '#f56565',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#4a5568',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1a365d',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brandButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBrandButton: {
    backgroundColor: '#1a365d',
    borderColor: '#1a365d',
  },
  brandButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  selectedBrandButtonText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#1a365d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedContainer: {
    backgroundColor: '#000',
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  feedPlaceholder: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  feedSubtext: {
    color: '#90cdf4',
    fontSize: 12,
  },
  ptzControls: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  ptzTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 15,
    textAlign: 'center',
  },
  ptzGrid: {
    alignItems: 'center',
    marginBottom: 15,
  },
  ptzRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ptzButton: {
    backgroundColor: '#1a365d',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  ptzButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  zoomButton: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  zoomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cameraInfoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 8,
  },
});

export default CameraManagementScreen;
