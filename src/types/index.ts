export interface Node {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  lastSeen: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  jobsCompleted: number;
  jobsFailed: number;
  uptime: number;
  capabilities: string[];
  ipAddress: string;
}

export interface Job {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: number;
  progress: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  nodeId: string | null;
  logs: string[];
  errorMessage: string | null;
  type: string;
  parameters: Record<string, any>;
  results: Record<string, any> | null;
  estimatedDuration: number | null;
}

export interface SystemMetrics {
  totalNodes: number;
  activeNodes: number;
  totalJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  queuedJobs: number;
  averageJobTime: number;
  systemLoad: number;
  totalCpuUsage: number;
  totalMemoryUsage: number;
  totalDiskUsage: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

export interface TimeSeriesData {
  label: string;
  data: TimeSeriesDataPoint[];
}

export interface NotificationMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}