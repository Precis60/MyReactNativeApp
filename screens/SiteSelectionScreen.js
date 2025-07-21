import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { useSiteStore } from '../stores/siteStore';

const SiteSelectionScreen = ({ visible, onClose }) => {
  const { sites, selectedSite, selectSite, getSiteStats } = useSiteStore();
  const [searchQuery, setSearchQuery] = useState('');
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

        <FlatList
          data={filteredSites}
          renderItem={renderSiteItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.siteList}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
});

export default SiteSelectionScreen;
