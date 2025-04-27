import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { TimeSeriesData } from '../types';

export default function Analytics() {
  // Mock data for demonstration
  const cpuData: TimeSeriesData = {
    label: 'CPU Usage',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: Math.floor(Math.random() * 30) + 40,
    })),
  };
  
  const memoryData: TimeSeriesData = {
    label: 'Memory Usage',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: Math.floor(Math.random() * 20) + 50,
    })),
  };
  
  const activeNodesData: TimeSeriesData = {
    label: 'Active Nodes',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: Math.floor(Math.random() * 5) + 15,
    })),
  };
  
  const jobCompletionData: TimeSeriesData = {
    label: 'Jobs Completed',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: Math.floor(Math.random() * 20) + 10,
    })),
  };
  
  const jobErrorRateData: TimeSeriesData = {
    label: 'Error Rate (%)',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: Math.floor(Math.random() * 5) + 1,
    })),
  };
  
  const jobQueueData: TimeSeriesData = {
    label: 'Queue Length',
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: Math.floor(Math.random() * 10) + 5,
    })),
  };
  
  return (
    <Box>
      <Heading size="lg" mb={6}>
        System Analytics
      </Heading>
      
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6} mb={8}>
        <TimeSeriesChart title="CPU Utilization (24h)" data={cpuData} />
        <TimeSeriesChart title="Memory Utilization (24h)" data={memoryData} />
        <TimeSeriesChart title="Active Nodes (24h)" data={activeNodesData} />
        <TimeSeriesChart title="Jobs Completed (24h)" data={jobCompletionData} />
        <TimeSeriesChart title="Job Error Rate (24h)" data={jobErrorRateData} />
        <TimeSeriesChart title="Job Queue Length (24h)" data={jobQueueData} />
      </SimpleGrid>
    </Box>
  );
}