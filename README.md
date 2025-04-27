# Zcaler Dashboard

## Overview
The Dashboard provides a comprehensive visual interface for monitoring and managing the Zcaler distributed computing network. It offers real-time insights into system performance, node status, and job progress.

## Purpose
- Delivers transparent visibility into the entire distributed computing system
- Provides administrators with monitoring and control capabilities
- Visualizes network health, resource utilization, and job statistics
- Offers interfaces for job submission and testing

## Key Features
- **Real-time Monitoring**: Live updates on node status, job progress, and system metrics
- **Node Management**: View active/inactive nodes, resource utilization, and performance statistics
- **Job Tracking**: Monitor queued, running, completed, and failed jobs with detailed information
- **System Analytics**: Historical data and trends on system performance and resource utilization
- **Administrative Controls**: Manage nodes, prioritize jobs, and configure system settings
- **Job Submission Interface**: Submit and test jobs directly from the dashboard

## Technical Implementation
- Modern React web application with TypeScript and Chakra UI
- Real-time updates using WebSocket connections to the Job Server
- Interactive data visualizations for system metrics using Recharts
- Secure authentication for administrative access
- Customizable views for different monitoring needs

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/SpareCore/zcaler.git
cd zcaler/zcaler-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To build the application for production:

```bash
npm run build
```

The build files will be in the `dist` directory and can be served using any static web server.

### Configuration

The dashboard connects to the Job Server API. By default, it connects to `http://localhost:8080/api`. You can change this in the Settings page or by modifying the source code in `src/api/api.ts`.

## Integration
The Dashboard connects directly to the Job Server's API endpoints to retrieve system data and issue commands, serving as the primary interface for human interaction with the Zcaler distributed computing network.

## Deployment
The Dashboard can be deployed alongside the Job Server or as a standalone web application, accessible to administrators for monitoring and managing the distributed computing environment.