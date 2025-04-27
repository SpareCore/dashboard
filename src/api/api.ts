import { Job, Node, SystemMetrics, TimeSeriesData } from '../types';

// This would typically come from environment variables
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Nodes
  async getNodes(): Promise<Node[]> {
    return this.request<Node[]>('/nodes');
  }
  
  async getNode(id: string): Promise<Node> {
    return this.request<Node>(`/nodes/${id}`);
  }
  
  async updateNodeStatus(id: string, status: 'online' | 'offline'): Promise<Node> {
    return this.request<Node>(`/nodes/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
  
  // Jobs
  async getJobs(status?: Job['status']): Promise<Job[]> {
    const query = status ? `?status=${status}` : '';
    return this.request<Job[]>(`/jobs${query}`);
  }
  
  async getJob(id: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }
  
  async createJob(jobData: Omit<Job, 'id' | 'status' | 'progress' | 'createdAt' | 'startedAt' | 'completedAt' | 'logs' | 'errorMessage' | 'results'>): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }
  
  async cancelJob(id: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}/cancel`, {
      method: 'PUT',
    });
  }
  
  async getJobLogs(id: string): Promise<string[]> {
    return this.request<string[]>(`/jobs/${id}/logs`);
  }
  
  // System Metrics
  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.request<SystemMetrics>('/metrics');
  }
  
  async getHistoricalMetrics(metric: string, period: 'hour' | 'day' | 'week' | 'month'): Promise<TimeSeriesData> {
    return this.request<TimeSeriesData>(`/metrics/historical/${metric}?period=${period}`);
  }
}

export const apiService = new ApiService();