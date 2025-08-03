import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  Switch
} from 'react-native';
import { useSiteStore } from '../stores/siteStore';

const SiteSelectionScreen = ({ visible, onClose }) => {
  const { sites, selectedSite, selectSite, getSiteStats, updateSite, addSite, removeSite } = useSiteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [newSite, setNewSite] = useState({
    name: '',
    address: '',
    type: 'Office Complex',
    status: 'online',
    cameras: 0,
    accessPoints: 0,
    alarms: 0
  });
  const stats = getSiteStats();

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#48bb78';
      case 'maintenance': return '#ed8936';
      case 'offline': return '#f56565';
      default: return '#718096';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'maintenance': return '🟡';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  const handleSiteSelect = (site) => {
    selectSite(site.id);
    Alert.alert(
      'Site Selected',
      `Now managing: ${site.name}`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const handleEditSite = (site) => {
    setEditingSite({ ...site });
    setShowEditModal(true);
  };

  const handleUpdateSite = () => {
    if (!editingSite.name || !editingSite.address) {
      Alert.alert('Error', 'Please fill in site name and address');
      return;
    }

    updateSite(editingSite.id, editingSite);
    setShowEditModal(false);
    setEditingSite(null);
    Alert.alert('Success', `${editingSite.name} updated successfully!`);
  };

  const handleAddSite = () => {
    if (!newSite.name || !newSite.address) {
      Alert.alert('Error', 'Please fill in site name and address');
      return;
    }

    addSite(newSite);
    setShowAddModal(false);
    setNewSite({
      name: '',
      address: '',
      type: 'Office Complex',
      status: 'online',
      cameras: 0,
      accessPoints: 0,
      alarms: 0
    });
    Alert.alert('Success', `${newSite.name} added successfully!`);
  };

  const handleDeleteSite = (siteId, siteName) => {
    Alert.alert(
      'Delete Site',
      `Are you sure you want to remove "${siteName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            removeSite(siteId);
            if (selectedSite?.id === siteId) {
              selectSite(null);
            }
          }
        }
      ]
    );
  };

  const renderSiteItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.siteItem,
        selectedSite?.id === item.id && styles.selectedSiteItem
      ]}
      onPress={() => handleSiteSelect(item)}
    >
      <View style={styles.siteHeader}>
        <View style={styles.siteNameContainer}>
          <Text style={styles.siteName}>{item.name}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.siteAddress}>{item.address}</Text>
      <Text style={styles.siteType}>{item.type}</Text>
      
      <View style={styles.siteStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.cameras}</Text>
          <Text style={styles.statLabel}>Cameras</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.accessPoints}</Text>
          <Text style={styles.statLabel}>Access</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.alarms}</Text>
          <Text style={styles.statLabel}>Alarms</Text>
        </View>
      </View>
      
      {selectedSite?.id === item.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>✓ Currently Selected</Text>
        </View>
      )}
      
      <View style={styles.siteActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#f6ad55' }]}
          onPress={(e) => {
            e.stopPropagation();
            handleEditSite(item);
          }}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#f56565' }]}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteSite(item.id, item.name);
          }}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Site</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statCardNumber}>{stats.total}</Text>
            <Text style={styles.statCardLabel}>Total Sites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardNumber}>{stats.online}</Text>
            <Text style={styles.statCardLabel}>Online</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardNumber}>{stats.maintenance}</Text>
            <Text style={styles.statCardLabel}>Maintenance</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search sites by name, address, or type..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#718096"
          />
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add New Site</Text>
        </TouchableOpacity>

        <FlatList
          data={filteredSites}
          renderItem={renderSiteItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.siteList}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      {/* Add Site Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Site</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Site Name *</Text>
              <TextInput
                style={styles.textInput}
                value={newSite.name}
                onChangeText={(text) => setNewSite({...newSite, name: text})}
                placeholder="Enter site name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address *</Text>
              <TextInput
                style={styles.textInput}
                value={newSite.address}
                onChangeText={(text) => setNewSite({...newSite, address: text})}
                placeholder="Enter site address"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Site Type</Text>
              <View style={styles.pickerContainer}>
                {['Office Complex', 'Manufacturing', 'Retail', 'Warehouse', 'Data Center'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      newSite.type === type && styles.selectedTypeButton
                    ]}
                    onPress={() => setNewSite({...newSite, type})}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      newSite.type === type && styles.selectedTypeButtonText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleAddSite}>
              <Text style={styles.saveButtonText}>Add Site</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Site Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Site</Text>
            <TouchableOpacity onPress={() => {
              setShowEditModal(false);
              setEditingSite(null);
            }}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {editingSite && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Site Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editingSite.name}
                    onChangeText={(text) => setEditingSite({...editingSite, name: text})}
                    placeholder="Enter site name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editingSite.address}
                    onChangeText={(text) => setEditingSite({...editingSite, address: text})}
                    placeholder="Enter site address"
                    multiline
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Site Type</Text>
                  <View style={styles.pickerContainer}>
                    {['Office Complex', 'Manufacturing', 'Retail', 'Warehouse', 'Data Center'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeButton,
                          editingSite.type === type && styles.selectedTypeButton
                        ]}
                        onPress={() => setEditingSite({...editingSite, type})}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          editingSite.type === type && styles.selectedTypeButtonText
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Status</Text>
                  <View style={styles.pickerContainer}>
                    {['online', 'maintenance', 'offline'].map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusButton,
                          editingSite.status === status && styles.selectedStatusButton
                        ]}
                        onPress={() => setEditingSite({...editingSite, status})}
                      >
                        <Text style={[
                          styles.statusButtonText,
                          editingSite.status === status && styles.selectedStatusButtonText
                        ]}>
                          {status.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleUpdateSite}>
                  <Text style={styles.saveButtonText}>Update Site</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a365d',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statCardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  statCardLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  searchContainer: {
    padding: 15,
    paddingTop: 5,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  siteList: {
    flex: 1,
    padding: 15,
    paddingTop: 5,
  },
  siteItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedSiteItem: {
    borderWidth: 2,
    borderColor: '#1a365d',
  },
  siteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  siteNameContainer: {
    flex: 1,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  siteAddress: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  siteType: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
    marginBottom: 12,
  },
  siteStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  selectedIndicator: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#1a365d',
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  siteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#1a365d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    color: '#1a365d',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedTypeButton: {
    backgroundColor: '#1a365d',
  },
  typeButtonText: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTypeButtonText: {
    color: '#fff',
  },
  statusButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedStatusButton: {
    backgroundColor: '#1a365d',
  },
  statusButtonText: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedStatusButtonText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#1a365d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SiteSelectionScreen;
