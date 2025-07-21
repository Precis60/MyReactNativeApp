import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

// Home Screen Component
function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.companyName}>Precision Cabling & Automation</Text>
        <Text style={styles.appTitle}>Security Plus</Text>
        <Text style={styles.subtitle}>Professional Security Management</Text>
      </View>
      
      <View style={styles.dashboardGrid}>
        <TouchableOpacity style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>🔒 Access Control</Text>
          <Text style={styles.cardSubtitle}>Manage door locks & access</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>📹 Camera Systems</Text>
          <Text style={styles.cardSubtitle}>Monitor security cameras</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>🚨 Alarm Systems</Text>
          <Text style={styles.cardSubtitle}>Security alerts & monitoring</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>⚡ Automation</Text>
          <Text style={styles.cardSubtitle}>Smart building controls</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.supportSection}>
        <TouchableOpacity style={styles.supportButton}>
          <Text style={styles.supportButtonText}>🔧 Maintenance & Support</Text>
          <Text style={styles.supportSubtext}>Contact Precision Cabling & Automation</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusItem}>
          <Text style={styles.statusText}>🟢 All Systems Online</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusText}>🔐 Security Armed</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusText}>📡 Network Connected</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Monitoring Screen Component
function MonitoringScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Live Monitoring</Text>
      </View>
      <View style={styles.monitoringGrid}>
        <View style={styles.monitoringCard}>
          <Text style={styles.cardTitle}>📹 Camera Feed 1</Text>
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.placeholderText}>Main Entrance</Text>
          </View>
        </View>
        <View style={styles.monitoringCard}>
          <Text style={styles.cardTitle}>📹 Camera Feed 2</Text>
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.placeholderText}>Parking Area</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Settings Screen Component
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Settings</Text>
      </View>
      <View style={styles.settingsSection}>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>👤 User Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>🔧 System Configuration</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>📊 Reports & Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>🔔 Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>🔧 Maintenance & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>ℹ️ About Security Plus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#1a365d',
            tabBarInactiveTintColor: '#718096',
            tabBarStyle: {
              backgroundColor: '#f7fafc',
              borderTopWidth: 1,
              borderTopColor: '#e2e8f0',
            },
            headerStyle: {
              backgroundColor: '#1a365d',
            },
            headerTintColor: '#fff',
          }}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={HomeScreen}
            options={{
              tabBarLabel: 'Dashboard',
              headerShown: false,
            }}
          />
          <Tab.Screen 
            name="Monitoring" 
            component={MonitoringScreen}
            options={{
              tabBarLabel: 'Monitor',
              headerShown: false,
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              headerShown: false,
            }}
          />
        </Tab.Navigator>
        <StatusBar style="light" backgroundColor="#1a365d" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    backgroundColor: '#1a365d',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  companyName: {
    color: '#90cdf4',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  appTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#cbd5e0',
    fontSize: 16,
    fontWeight: '300',
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  dashboardCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#718096',
  },
  statusSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
  },
  statusItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    fontSize: 16,
    color: '#2d3748',
  },
  monitoringGrid: {
    padding: 15,
  },
  monitoringCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraPlaceholder: {
    backgroundColor: '#edf2f7',
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  placeholderText: {
    color: '#718096',
    fontSize: 14,
  },
  settingsSection: {
    padding: 15,
  },
  settingsItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsText: {
    fontSize: 16,
    color: '#2d3748',
  },
  supportSection: {
    padding: 15,
    paddingTop: 5,
  },
  supportButton: {
    backgroundColor: '#1a365d',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  supportButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  supportSubtext: {
    color: '#90cdf4',
    fontSize: 14,
    fontWeight: '400',
  },
});
