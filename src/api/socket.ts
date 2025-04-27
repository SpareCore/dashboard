import { io, Socket } from 'socket.io-client';
import { Job, Node, NotificationMessage, SystemMetrics } from '../types';

// This would typically come from environment variables
const SOCKET_URL = 'http://localhost:8080';

type EventHandlers = {
  'node:update': (node: Node) => void;
  'node:status': (nodeId: string, status: Node['status']) => void;
  'job:update': (job: Job) => void;
  'job:status': (jobId: string, status: Job['status']) => void;
  'metrics:update': (metrics: SystemMetrics) => void;
  'notification': (notification: NotificationMessage) => void;
  'connect': () => void;
  'disconnect': (reason: string) => void;
  'error': (error: Error) => void;
};

class SocketService {
  private socket: Socket | null = null;
  private eventHandlers: Partial<Record<keyof EventHandlers, Function[]>> = {};
  
  connect() {
    if (this.socket) {
      return;
    }
    
    this.socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
    });
    
    this.setupEventListeners();
  }
  
  disconnect() {
    if (!this.socket) {
      return;
    }
    
    this.socket.disconnect();
    this.socket = null;
  }
  
  private setupEventListeners() {
    if (!this.socket) {
      return;
    }
    
    this.socket.on('connect', () => this.triggerEvent('connect'));
    this.socket.on('disconnect', (reason) => this.triggerEvent('disconnect', reason));
    this.socket.on('error', (error) => this.triggerEvent('error', error));
    
    // System events
    this.socket.on('node:update', (node) => this.triggerEvent('node:update', node));
    this.socket.on('node:status', (nodeId, status) => this.triggerEvent('node:status', nodeId, status));
    this.socket.on('job:update', (job) => this.triggerEvent('job:update', job));
    this.socket.on('job:status', (jobId, status) => this.triggerEvent('job:status', jobId, status));
    this.socket.on('metrics:update', (metrics) => this.triggerEvent('metrics:update', metrics));
    this.socket.on('notification', (notification) => this.triggerEvent('notification', notification));
  }
  
  on<T extends keyof EventHandlers>(event: T, handler: EventHandlers[T]) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    
    this.eventHandlers[event]?.push(handler as Function);
  }
  
  off<T extends keyof EventHandlers>(event: T, handler: EventHandlers[T]) {
    const handlers = this.eventHandlers[event];
    if (!handlers) {
      return;
    }
    
    const index = handlers.indexOf(handler as Function);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
  
  private triggerEvent(event: string, ...args: any[]) {
    const handlers = this.eventHandlers[event as keyof EventHandlers];
    if (!handlers) {
      return;
    }
    
    handlers.forEach((handler) => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }
  
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();