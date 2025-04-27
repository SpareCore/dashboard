import { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCpu, FiServer, FiCheckCircle, FiAlertCircle, FiClock, FiActivity } from 'react-icons/fi';

import MetricCard from '../components/MetricCard';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { useSystemMetrics } from '../hooks/useApi';
import { useMetricsUpdates } from '../hooks/useSocket';
import { SystemMetrics, TimeSeriesData } from '../types';

export default function Dashboard() {
  const { data: initialMetrics, loading, execute: fetchMetrics } = useSystemMetrics();
  const metrics = useMetricsUpdates(initialMetrics);
  const [cpuHistory, setCpuHistory] = useState<TimeSeriesData>({
    label: 'CPU Usage',
    data: [],
  });
  
  // Fetch initial data
  useEffect(() => {
    fetchMetrics();
    
    // Set up polling for metrics every 30 seconds as a fallback
    const intervalId = setInterval(() => {
      fetchMetrics();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchMetrics]);
  
  // Update CPU history when metrics change
  useEffect(() => {
    if (metrics) {
      const now = new Date().toISOString();
      setCpuHistory((prev) => {
        const newData = [...prev.data, { timestamp: now, value: metrics.totalCpuUsage }];
        // Keep last 20 points
        if (newData.length > 20) {
          return { ...prev, data: newData.slice(-20) };
        }
        return { ...prev, data: newData };
      });
    }
  }, [metrics]);
  
  return (
    <Box>
      <Heading size="lg" mb={6}>
        System Dashboard
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <MetricCard
          title="Active Nodes"
          value={metrics?.activeNodes || 0}
          icon={<Icon as={FiServer} w={8} h={8} />}
          helpText={`${metrics?.totalNodes || 0} total nodes`}
          colorScheme="blue"
          isLoading={loading && !metrics}
        />
        <MetricCard
          title="Running Jobs"
          value={metrics?.runningJobs || 0}
          icon={<Icon as={FiCpu} w={8} h={8} />}
          helpText={`${metrics?.queuedJobs || 0} queued`}
          colorScheme="purple"
          isLoading={loading && !metrics}
        />
        <MetricCard
          title="Completed Jobs"
          value={metrics?.completedJobs || 0}
          icon={<Icon as={FiCheckCircle} w={8} h={8} />}
          helpText="Last 24 hours"
          colorScheme="green"
          isLoading={loading && !metrics}
        />
        <MetricCard
          title="Failed Jobs"
          value={metrics?.failedJobs || 0}
          icon={<Icon as={FiAlertCircle} w={8} h={8} />}
          helpText="Last 24 hours"
          colorScheme="red"
          isLoading={loading && !metrics}
        />
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <TimeSeriesChart
          title="CPU Utilization"
          data={cpuHistory}
          isLoading={loading && !metrics}
        />
        
        <Box
          p={4}
          bg={useColorModeValue('white', 'gray.800')}
          shadow="base"
          borderRadius="lg"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          borderWidth="1px"
        >
          <Text fontSize="lg" fontWeight="medium" mb={4}>
            System Load
          </Text>
          
          <SimpleGrid columns={1} spacing={4}>
            <Stat>
              <Flex justify="space-between">
                <Box>
                  <StatLabel>CPU Usage</StatLabel>
                  <StatNumber>{metrics?.totalCpuUsage || 0}%</StatNumber>
                </Box>
                <Box my="auto">
                  <Icon as={FiActivity} color="blue.500" w={6} h={6} />
                </Box>
              </Flex>
              <Progress
                colorScheme="blue"
                size="sm"
                value={metrics?.totalCpuUsage || 0}
                mt={2}
              />
            </Stat>
            
            <Stat>
              <Flex justify="space-between">
                <Box>
                  <StatLabel>Memory Usage</StatLabel>
                  <StatNumber>{metrics?.totalMemoryUsage || 0}%</StatNumber>
                </Box>
                <Box my="auto">
                  <Icon as={FiActivity} color="purple.500" w={6} h={6} />
                </Box>
              </Flex>
              <Progress
                colorScheme="purple"
                size="sm"
                value={metrics?.totalMemoryUsage || 0}
                mt={2}
              />
            </Stat>
            
            <Stat>
              <Flex justify="space-between">
                <Box>
                  <StatLabel>Disk Usage</StatLabel>
                  <StatNumber>{metrics?.totalDiskUsage || 0}%</StatNumber>
                </Box>
                <Box my="auto">
                  <Icon as={FiActivity} color="green.500" w={6} h={6} />
                </Box>
              </Flex>
              <Progress
                colorScheme="green"
                size="sm"
                value={metrics?.totalDiskUsage || 0}
                mt={2}
              />
            </Stat>
            
            <Stat>
              <Flex justify="space-between">
                <Box>
                  <StatLabel>Average Job Time</StatLabel>
                  <StatNumber>{metrics?.averageJobTime || 0}s</StatNumber>
                  <StatHelpText>Last 24 hours</StatHelpText>
                </Box>
                <Box my="auto">
                  <Icon as={FiClock} color="orange.500" w={6} h={6} />
                </Box>
              </Flex>
            </Stat>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
}