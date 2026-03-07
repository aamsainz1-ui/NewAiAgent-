// WebSocket Hook for Dashboard
import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'wss://agent-brain-dashboard.vercel.app/ws';

// For local development, use localhost
const getWebSocketUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'ws://localhost:8080';
  }
  // For production - use WSS (secure WebSocket) to avoid Mixed Content error
  // If your server doesn't support WSS, disable WebSocket or use a proxy
  return 'wss://srv1377366.hstgr.cloud:8080';
};

export function useWebSocket() {
  // DISABLED - WebSocket connection removed to avoid Mixed Content errors
  // Using static fallback data only
  return {
    isConnected: false,
    metrics: {
      tokensUsed: 0,
      apiCalls: 0,
      activeSessions: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      networkLatency: 0,
      lastUpdate: new Date().toLocaleTimeString()
    },
    activity: { agent: 'OFFLINE', action: 'Real-time updates disabled', timestamp: new Date() },
    activityLog: [],
    nodeStatuses: {},
    error: null,
    sendMessage: () => {},
    reconnect: () => {}
  };
}
