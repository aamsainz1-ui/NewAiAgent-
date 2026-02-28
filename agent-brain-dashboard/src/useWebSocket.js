// WebSocket Hook for Dashboard
import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'wss://agent-brain-dashboard.vercel.app/ws';

// For local development, use localhost
const getWebSocketUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'ws://localhost:8080';
  }
  // For production, you'll need a WebSocket proxy (e.g., ws://your-vps:8080)
  return 'ws://srv1377366.hstgr.cloud:8080';
};

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState({
    tokensUsed: 0,
    apiCalls: 0,
    activeSessions: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    lastUpdate: new Date().toLocaleTimeString()
  });
  const [activity, setActivity] = useState({ agent: 'SUPERVISOR', action: 'System initialized', timestamp: new Date() });
  const [activityLog, setActivityLog] = useState([]);
  const [nodeStatuses, setNodeStatuses] = useState({});
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  
  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message:', data.type);
          
          switch (data.type) {
            case 'connected':
              console.log('Server confirmed connection');
              break;
              
            case 'metrics':
              setMetrics(prev => ({
                ...data.data,
                lastUpdate: new Date().toLocaleTimeString()
              }));
              break;
              
            case 'activity':
              setActivity(data.data);
              setActivityLog(prev => [data.data, ...prev.slice(0, 9)]);
              break;
              
            case 'nodeStatuses':
              setNodeStatuses(data.data);
              break;
              
            case 'pong':
              // Heartbeat response
              break;
              
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (err) {
          console.error('Message parse error:', err);
        }
      };
      
      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error');
        setIsConnected(false);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };
      
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message);
    }
  }, []);
  
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);
  
  const sendMessage = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);
  
  // Connect on mount
  useEffect(() => {
    connect();
    
    // Heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'ping' });
      }
    }, 30000);
    
    return () => {
      clearInterval(heartbeat);
      disconnect();
    };
  }, [connect, disconnect, sendMessage]);
  
  return {
    isConnected,
    metrics,
    activity,
    activityLog,
    nodeStatuses,
    error,
    sendMessage,
    reconnect: connect
  };
}
