import { create } from 'zustand';

// Sample site data - in production this would come from an API
const sampleSites = [
  {
    id: 1,
    name: 'Corporate Headquarters',
    address: '123 Business Ave, Sydney NSW',
    type: 'Office Complex',
    status: 'online',
    cameras: 12,
    accessPoints: 8,
    alarms: 4,
    lastUpdate: '2025-07-21T21:25:00Z'
  },
  {
    id: 2,
    name: 'Manufacturing Plant A',
    address: '456 Industrial Rd, Melbourne VIC',
    type: 'Manufacturing',
    status: 'online',
    cameras: 24,
    accessPoints: 16,
    alarms: 8,
    lastUpdate: '2025-07-21T21:20:00Z'
  },
  {
    id: 3,
    name: 'Retail Store - CBD',
    address: '789 Queen St, Brisbane QLD',
    type: 'Retail',
    status: 'maintenance',
    cameras: 8,
    accessPoints: 4,
    alarms: 2,
    lastUpdate: '2025-07-21T20:45:00Z'
  },
  {
    id: 4,
    name: 'Warehouse Distribution',
    address: '321 Logistics Way, Perth WA',
    type: 'Warehouse',
    status: 'online',
    cameras: 16,
    accessPoints: 12,
    alarms: 6,
    lastUpdate: '2025-07-21T21:22:00Z'
  },
  {
    id: 5,
    name: 'Data Center Alpha',
    address: '654 Tech Park Dr, Adelaide SA',
    type: 'Data Center',
    status: 'online',
    cameras: 20,
    accessPoints: 6,
    alarms: 10,
    lastUpdate: '2025-07-21T21:28:00Z'
  }
];

export const useSiteStore = create((set, get) => ({
  // State
  sites: sampleSites,
  selectedSite: sampleSites[0], // Default to first site
  loading: false,
  error: null,

  // Actions
  selectSite: (siteId) => {
    const site = get().sites.find(s => s.id === siteId);
    if (site) {
      set({ selectedSite: site });
    }
  },

  addSite: (siteData) => {
    const newSite = {
      ...siteData,
      id: Math.max(...get().sites.map(s => s.id)) + 1,
      lastUpdate: new Date().toISOString()
    };
    set(state => ({
      sites: [...state.sites, newSite]
    }));
  },

  updateSite: (siteId, updates) => {
    set(state => ({
      sites: state.sites.map(site => 
        site.id === siteId 
          ? { ...site, ...updates, lastUpdate: new Date().toISOString() }
          : site
      )
    }));
  },

  removeSite: (siteId) => {
    set(state => ({
      sites: state.sites.filter(site => site.id !== siteId),
      selectedSite: state.selectedSite?.id === siteId 
        ? state.sites.find(s => s.id !== siteId) || null
        : state.selectedSite
    }));
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Computed values
  getSitesByStatus: (status) => {
    return get().sites.filter(site => site.status === status);
  },

  getTotalSites: () => get().sites.length,

  getSiteStats: () => {
    const sites = get().sites;
    return {
      total: sites.length,
      online: sites.filter(s => s.status === 'online').length,
      maintenance: sites.filter(s => s.status === 'maintenance').length,
      offline: sites.filter(s => s.status === 'offline').length,
      totalCameras: sites.reduce((sum, s) => sum + s.cameras, 0),
      totalAccessPoints: sites.reduce((sum, s) => sum + s.accessPoints, 0),
      totalAlarms: sites.reduce((sum, s) => sum + s.alarms, 0)
    };
  }
}));
