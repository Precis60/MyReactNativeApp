import { create } from 'zustand';

// Camera brand configurations - Updated to use ONVIF standard endpoints
const CAMERA_BRANDS = {
  'Vivotek': {
    defaultPort: 554,
    streamPath: '/onvif/media_service/streaming',
    onvifPort: 80,
    onvifPath: '/onvif/device_service',
    defaultUsername: 'admin',
    ptzSupport: true,
    commonModels: ['IB9367-HT', 'IB9389-HT', 'FD9389-HTV', 'IP9181-H'],
    onvifProfile: 'MainStream'
  },
  'Axis': {
    defaultPort: 554,
    streamPath: '/onvif/media_service/streaming',
    onvifPort: 80,
    onvifPath: '/onvif/device_service',
    defaultUsername: 'root',
    ptzSupport: true,
    commonModels: ['P3245-LV', 'M3046-V', 'P1455-LE', 'Q6055-E'],
    onvifProfile: 'Profile_1'
  },
  'Hikvision': {
    defaultPort: 554,
    streamPath: '/onvif/media_service/streaming',
    onvifPort: 80,
    onvifPath: '/onvif/device_service',
    defaultUsername: 'admin',
    ptzSupport: true,
    commonModels: ['DS-2CD2385FWD-I', 'DS-2DE4A425IW-DE', 'DS-2CD2143G0-IS'],
    onvifProfile: 'MediaProfile000'
  },
  'Dahua': {
    defaultPort: 554,
    streamPath: '/onvif/media_service/streaming',
    onvifPort: 80,
    onvifPath: '/onvif/device_service',
    defaultUsername: 'admin',
    ptzSupport: true,
    commonModels: ['IPC-HFW4431R-Z', 'SD59225U-HNI', 'IPC-HDBW4431R-AS'],
    onvifProfile: 'MainStream'
  }
};

// Sample camera data - Updated to use ONVIF feeds
const sampleCameras = [
  {
    id: 1,
    name: 'Main Entrance',
    brand: 'Vivotek',
    model: 'IB9367-HT',
    ipAddress: '192.168.1.100',
    port: 554,
    username: 'admin',
    password: 'admin123', // In production, this would be encrypted
    location: 'Front Door',
    status: 'online',
    streamUrl: 'rtsp://admin:admin123@192.168.1.100:554/onvif/media_service/streaming?profile=MainStream&onvif=true',
    onvifUrl: 'http://192.168.1.100:80/onvif/device_service',
    streamType: 'ONVIF',
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
    password: 'axis123',
    location: 'Parking Lot',
    status: 'online',
    streamUrl: 'rtsp://root:axis123@192.168.1.101:554/onvif/media_service/streaming?profile=Profile_1&onvif=true',
    onvifUrl: 'http://192.168.1.101:80/onvif/device_service',
    streamType: 'ONVIF',
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
    password: 'hik123',
    location: 'Office Area',
    status: 'offline',
    streamUrl: 'rtsp://admin:hik123@192.168.1.102:554/onvif/media_service/streaming?profile=MediaProfile000&onvif=true',
    onvifUrl: 'http://192.168.1.102:80/onvif/device_service',
    streamType: 'ONVIF',
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

  generateStreamUrl: (brand, ipAddress, port, streamPath = null, username = null, password = null) => {
    const config = CAMERA_BRANDS[brand] || CAMERA_BRANDS['Vivotek'];
    const path = streamPath || config.streamPath;
    const streamPort = port || config.defaultPort;
    
    // Generate ONVIF-compliant RTSP URL with authentication
    if (username && password) {
      return `rtsp://${username}:${password}@${ipAddress}:${streamPort}${path}`;
    }
    return `rtsp://${ipAddress}:${streamPort}${path}`;
  },

  generateOnvifUrl: (brand, ipAddress, username = null, password = null) => {
    const config = CAMERA_BRANDS[brand] || CAMERA_BRANDS['Vivotek'];
    const onvifPort = config.onvifPort || 80;
    const onvifPath = config.onvifPath || '/onvif/device_service';
    
    // Generate ONVIF device service URL
    return `http://${ipAddress}:${onvifPort}${onvifPath}`;
  },

  getOnvifStreamUrl: (brand, ipAddress, username = null, password = null) => {
    const config = CAMERA_BRANDS[brand] || CAMERA_BRANDS['Vivotek'];
    const profile = config.onvifProfile || 'MainStream';
    
    // Generate ONVIF media stream URL with profile
    const baseUrl = get().generateStreamUrl(brand, ipAddress, config.defaultPort, config.streamPath, username, password);
    return `${baseUrl}?profile=${profile}&onvif=true`;
  },

  getSupportedBrands: () => {
    return Object.keys(CAMERA_BRANDS);
  },

  // Actions
  addCamera: (cameraData) => {
    const brandConfig = get().getBrandConfig(cameraData.brand);
    const username = cameraData.username || brandConfig.defaultUsername;
    const password = cameraData.password || 'admin';
    
    // Generate ONVIF stream URL with authentication
    const streamUrl = get().getOnvifStreamUrl(
      cameraData.brand, 
      cameraData.ipAddress, 
      username,
      password
    );
    
    // Generate ONVIF device service URL for management
    const onvifUrl = get().generateOnvifUrl(
      cameraData.brand,
      cameraData.ipAddress,
      username,
      password
    );
    
    const newCamera = {
      ...cameraData,
      id: Math.max(...get().cameras.map(c => c.id)) + 1,
      port: cameraData.port || brandConfig.defaultPort,
      username,
      password,
      streamUrl,
      onvifUrl,
      streamType: 'ONVIF',
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
      cameras: state.cameras.map(camera => {
        if (camera.id === cameraId) {
          const updatedCamera = { ...camera, ...updates };
          
          // Regenerate ONVIF URLs if IP address, brand, username, or password changed
          if (updates.ipAddress || updates.brand || updates.username || updates.password) {
            const brandConfig = get().getBrandConfig(updatedCamera.brand);
            const username = updatedCamera.username || brandConfig.defaultUsername;
            const password = updatedCamera.password || 'admin';
            
            updatedCamera.streamUrl = get().getOnvifStreamUrl(
              updatedCamera.brand,
              updatedCamera.ipAddress,
              username,
              password
            );
            
            updatedCamera.onvifUrl = get().generateOnvifUrl(
              updatedCamera.brand,
              updatedCamera.ipAddress,
              username,
              password
            );
            
            updatedCamera.streamType = 'ONVIF';
          }
          
          return { ...updatedCamera, lastSeen: new Date().toISOString() };
        }
        return camera;
      })
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
