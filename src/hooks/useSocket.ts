import { useEffect, useState } from 'react';
import { socketService } from '../api/socket';
import { Job, Node, NotificationMessage, SystemMetrics } from '../types';

// Hook for connection status
export function useSocketConnection() {
  const [isConnected, setIsConnected] = useState(socketService.isConnected());
  
  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    
    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    
    // Ensure connection on mount
    if (!socketService.isConnected()) {
      socketService.connect();
    }
    
    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
    };
  }, []);
  
  return isConnected;
}

// Hook for node updates
export function useNodeUpdates(initialNodes: Node[] = []) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes]);
  
  useEffect(() => {
    const handleNodeUpdate = (updatedNode: Node) => {
      setNodes((prevNodes) => {
        const index = prevNodes.findIndex((node) => node.id === updatedNode.id);
        if (index === -1) {
          return [...prevNodes, updatedNode];
        }
        
        const newNodes = [...prevNodes];
        newNodes[index] = updatedNode;
        return newNodes;
      });
    };
    
    const handleNodeStatus = (nodeId: string, status: Node['status']) => {
      setNodes((prevNodes) => {
        const index = prevNodes.findIndex((node) => node.id === nodeId);
        if (index === -1) {
          return prevNodes;
        }
        
        const newNodes = [...prevNodes];
        newNodes[index] = { ...newNodes[index], status };
        return newNodes;
      });
    };
    
    socketService.on('node:update', handleNodeUpdate);
    socketService.on('node:status', handleNodeStatus);
    
    return () => {
      socketService.off('node:update', handleNodeUpdate);
      socketService.off('node:status', handleNodeStatus);
    };
  }, []);
  
  return nodes;
}

// Hook for job updates
export function useJobUpdates(initialJobs: Job[] = []) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  
  useEffect(() => {
    if (initialJobs.length > 0) {
      setJobs(initialJobs);
    }
  }, [initialJobs]);
  
  useEffect(() => {
    const handleJobUpdate = (updatedJob: Job) => {
      setJobs((prevJobs) => {
        const index = prevJobs.findIndex((job) => job.id === updatedJob.id);
        if (index === -1) {
          return [...prevJobs, updatedJob];
        }
        
        const newJobs = [...prevJobs];
        newJobs[index] = updatedJob;
        return newJobs;
      });
    };
    
    const handleJobStatus = (jobId: string, status: Job['status']) => {
      setJobs((prevJobs) => {
        const index = prevJobs.findIndex((job) => job.id === jobId);
        if (index === -1) {
          return prevJobs;
        }
        
        const newJobs = [...prevJobs];
        newJobs[index] = { ...newJobs[index], status };
        return newJobs;
      });
    };
    
    socketService.on('job:update', handleJobUpdate);
    socketService.on('job:status', handleJobStatus);
    
    return () => {
      socketService.off('job:update', handleJobUpdate);
      socketService.off('job:status', handleJobStatus);
    };
  }, []);
  
  return jobs;
}

// Hook for system metrics updates
export function useMetricsUpdates(initialMetrics?: SystemMetrics) {
  const [metrics, setMetrics] = useState<SystemMetrics | undefined>(initialMetrics);
  
  useEffect(() => {
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }
  }, [initialMetrics]);
  
  useEffect(() => {
    const handleMetricsUpdate = (updatedMetrics: SystemMetrics) => {
      setMetrics(updatedMetrics);
    };
    
    socketService.on('metrics:update', handleMetricsUpdate);
    
    return () => {
      socketService.off('metrics:update', handleMetricsUpdate);
    };
  }, []);
  
  return metrics;
}

// Hook for notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  
  useEffect(() => {
    const handleNotification = (notification: NotificationMessage) => {
      setNotifications((prev) => [notification, ...prev]);
    };
    
    socketService.on('notification', handleNotification);
    
    return () => {
      socketService.off('notification', handleNotification);
    };
  }, []);
  
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };
  
  const clearNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  return {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  };
}