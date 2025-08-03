import { create } from 'zustand';

// Camera brand configurations
const CAMERA_BRANDS = {
  'Vivotek': {
    defaultPort: 554,
    streamPath: '/live.sdp',
    defaultUsername: 'admin',
    ptzSupport: true,
    commonModels: ['IB9367-HT', 'IB9389-HT', 'FD9389-HTV', 'IP9181-H']
  },
  'Axis': {
    defaultPort: 554,
    streamPath: '/axis-media/media.amp?videocodec=h264',
    defaultUsername: 'root',
    ptzSupport: true,
    commonModels: ['P3245-LV', 'M3046-V', 'P1455-LE', 'Q6055-E']
  },
  'Hikvision': {
    defaultPort: 554,
    streamPath: '/Streaming/Channels/101',
    defaultUsername: 'admin',
    ptzSupport: true,
    commonModels: ['DS-2CD2385FWD-I', 'DS-2DE4A425IW-DE', 'DS-2CD2143G0-IS']
  },
  'Dahua': {
    defaultPort: 554,
    streamPath: '/cam/realmonitor?channel=1&subtype=0',
    defaultUsername: 'admin',
    ptzSupport: true,
    commonModels: ['IPC-HFW4431R-Z', 'SD59225U-HNI', 'IPC-HDBW4431R-AS']
  }
};

// Sample camera data - in production this would come from an API
const sampleCameras = [
  {
    id: 1,
    name: 'Main Entrance',
    brand: 'Vivotek',
    model: 'IB9367-HT',
    ipAddress: '192.168.1.100',
    port: 554,
    username: 'admin',
    password: '', // In production, this would be encrypted
    location: 'Front Door',
    status: 'online',
    streamUrl: 'rtsp://192.168.1.100:554/live.sdp',
    resolution: '4K',
    nightVision: true,
    ptzCapable: true,
    recording: true,
    lastSeen: new Date().toISOString(),
    siteId: 1
  },
  {
    id: 2,
    name: 'Parking Area',
    brand: 'Axis',
    model: 'P3245-LV',
    ipAddress: '192.168.1.101',
    port: 554,
    username: 'root',
    password: '',
    location: 'Parking Lot',
    status: 'online',
    streamUrl: 'rtsp://192.168.1.101:554/axis-media/media.amp?videocodec=h264',
    resolution: '1080p',
    nightVision: true,
    ptzCapable: false,
    recording: true,
    lastSeen: new Date().toISOString(),
    siteId: 1
  },
  {
    id: 3,
    name: 'Back Office',
    brand: 'Hikvision',
    model: 'DS-2CD2385FWD-I',
    ipAddress: '192.168.1.102',
    port: 554,
    username: 'admin',
    password: '',
    location: 'Office Area',
    status: 'offline',
    streamUrl: 'rtsp://192.168.1.102:554/Streaming/Channels/101',
    resolution: '4K',
    nightVision: true,
    ptzCapable: false,
    recording: true,
    lastSeen: new Date().toISOString(),
    siteId: 1
  }
];

export const useCameraStore = create((set, get) => ({
  // State
  cameras: sampleCameras,
  selectedCamera: null,
  loading: false,
  error: null,
  connectionStatus: {},

  // Helper functions
  getBrandConfig: (brand) => {
    return CAMERA_BRANDS[brand] || CAMERA_BRANDS['Vivotek'];
  },

  generateStreamUrl: (brand, ipAddress, port, streamPath = null) => {
    const config = CAMERA_BRANDS[brand] || CAMERA_BRANDS['Vivotek'];
    const path = streamPath || config.streamPath;
    return `rtsp://${ipAddress}:${port}${path}`;
  },

  getSupportedBrands: () => {
    return Object.keys(CAMERA_BRANDS);
  },

  // Actions
  addCamera: (cameraData) => {
    const brandConfig = get().getBrandConfig(cameraData.brand);
    const streamUrl = get().generateStreamUrl(
      cameraData.brand, 
      cameraData.ipAddress, 
      cameraData.port || brandConfig.defaultPort
    );
    
    const newCamera = {
      ...cameraData,
      id: Math.max(...get().cameras.map(c => c.id)) + 1,
      port: cameraData.port || brandConfig.defaultPort,
      username: cameraData.username || brandConfig.defaultUsername,
      streamUrl,
      lastSeen: new Date().toISOString(),
      status: 'offline' // Will be updated when connection is tested
    };
    set(state => ({
      cameras: [...state.cameras, newCamera]
    }));
    return newCamera.id;
  },

  updateCamera: (cameraId, updates) => {
    set(state => ({
      cameras: state.cameras.map(camera => 
        camera.id === cameraId 
          ? { ...camera, ...updates, lastSeen: new Date().toISOString() }
          : camera
      )
    }));
  },

  removeCamera: (cameraId) => {
    set(state => ({
      cameras: state.cameras.filter(camera => camera.id !== cameraId),
      selectedCamera: state.selectedCamera?.id === cameraId ? null : state.selectedCamera
    }));
  },

  selectCamera: (cameraId) => {
    const camera = get().cameras.find(c => c.id === cameraId);
    if (camera) {
      set({ selectedCamera: camera });
    }
  },

  getCamerasBySite: (siteId) => {
    return get().cameras.filter(camera => camera.siteId === siteId);
  },

  getCamerasByBrand: (brand) => {
    return get().cameras.filter(camera => camera.brand.toLowerCase() === brand.toLowerCase());
  },

  testCameraConnection: async (cameraId) => {
    const camera = get().cameras.find(c => c.id === cameraId);
    if (!camera) return false;

    set(state => ({
      connectionStatus: { ...state.connectionStatus, [cameraId]: 'testing' }
    }));

    try {
      // In production, this would make an actual network request to test the camera
      // For now, we'll simulate the test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isOnline = Math.random() > 0.2; // 80% success rate for demo
      const status = isOnline ? 'online' : 'offline';
      
      get().updateCamera(cameraId, { status });
      
      set(state => ({
        connectionStatus: { ...state.connectionStatus, [cameraId]: status }
      }));
      
      return isOnline;
    } catch (error) {
      set(state => ({
        connectionStatus: { ...state.connectionStatus, [cameraId]: 'error' },
        error: error.message
      }));
      return false;
    }
  },

  // Brand-specific methods
  getCamerasByBrand: (brand) => {
    return get().cameras.filter(camera => camera.brand === brand);
  },

  addBrandCamera: (config, brand) => {
    const brandConfig = get().getBrandConfig(brand);
    const brandCamera = {
      ...config,
      brand,
      port: config.port || brandConfig.defaultPort,
      username: config.username || brandConfig.defaultUsername,
      // Brand-agnostic defaults
      nightVision: config.nightVision !== undefined ? config.nightVision : true,
      ptzCapable: config.ptzCapable !== undefined ? config.ptzCapable : brandConfig.ptzSupport,
      recording: config.recording !== undefined ? config.recording : true
    };
    return get().addCamera(brandCamera);
  },

  // PTZ Controls for all supported camera brands
  controlPTZ: async (cameraId, command, value = null) => {
    const camera = get().cameras.find(c => c.id === cameraId);
    if (!camera || !camera.ptzCapable) return false;

    try {
      // In production, this would send brand-specific PTZ commands
      // Each brand has different PTZ command protocols
      console.log(`PTZ Command for ${camera.brand} ${camera.name}: ${command}`, value);
      
      // Brand-specific PTZ implementation would go here
      switch (camera.brand) {
        case 'Vivotek':
          // Vivotek PTZ API calls
          break;
        case 'Axis':
          // Axis PTZ API calls
          break;
        case 'Hikvision':
          // Hikvision PTZ API calls
          break;
        case 'Dahua':
          // Dahua PTZ API calls
          break;
      }
      
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  // Statistics
  getCameraStats: () => {
    const cameras = get().cameras;
    return {
      total: cameras.length,
      online: cameras.filter(c => c.status === 'online').length,
      offline: cameras.filter(c => c.status === 'offline').length,
      recording: cameras.filter(c => c.recording).length,
      ptzCapable: cameras.filter(c => c.ptzCapable).length,
      // Brand-specific counts
      vivotek: cameras.filter(c => c.brand === 'Vivotek').length,
      axis: cameras.filter(c => c.brand === 'Axis').length,
      hikvision: cameras.filter(c => c.brand === 'Hikvision').length,
      dahua: cameras.filter(c => c.brand === 'Dahua').length
    };
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
