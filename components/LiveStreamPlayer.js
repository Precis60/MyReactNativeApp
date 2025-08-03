import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const LiveStreamPlayer = ({ streamUrl, cameraName, style }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);

  const onLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const onLoad = () => {
    setLoading(false);
    setError(null);
  };

  const onError = (error) => {
    console.error('Video error:', error);
    setLoading(false);
    setError('Failed to load live stream. Please check camera connection.');
  };

  const onBuffer = ({ isBuffering }) => {
    setLoading(isBuffering);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const reconnect = () => {
    setError(null);
    setLoading(true);
    // Force re-render by updating the key
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Stream Unavailable</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.streamUrl}>Stream: {streamUrl}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={reconnect}>
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: streamUrl }}
          style={styles.video}
          resizeMode="contain"
          paused={paused}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onError={onError}
          onBuffer={onBuffer}
          bufferConfig={{
            minBufferMs: 1000,
            maxBufferMs: 5000,
            bufferForPlaybackMs: 1000,
            bufferForPlaybackAfterRebufferMs: 1500,
          }}
          repeat={true}
          playInBackground={false}
          playWhenInactive={false}
        />
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Connecting to {cameraName}...</Text>
          </View>
        )}
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={togglePlayPause}>
            <Text style={styles.controlButtonText}>
              {paused ? '▶️' : '⏸️'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={reconnect}>
            <Text style={styles.controlButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.streamInfo}>
        <Text style={styles.streamLabel}>Live Stream: {cameraName}</Text>
        <Text style={styles.streamUrl} numberOfLines={1}>{streamUrl}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoContainer: {
    position: 'relative',
    aspectRatio: 16/9,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  controls: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 16,
  },
  streamInfo: {
    padding: 12,
    backgroundColor: '#1a1a1a',
  },
  streamLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  streamUrl: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    backgroundColor: '#1a1a1a',
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LiveStreamPlayer;
