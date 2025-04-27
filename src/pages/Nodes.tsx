import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Icon,
  Button,
  Flex,
  Input,
  Select,
  Text,
  useColorModeValue,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { FiMoreVertical, FiRefreshCw, FiSearch, FiFilter, FiPower } from 'react-icons/fi';
import { useNodes } from '../hooks/useApi';
import { useNodeUpdates } from '../hooks/useSocket';
import { apiService } from '../api/api';
import StatusBadge from '../components/StatusBadge';
import { Node } from '../types';

export default function Nodes() {
  const { data: initialNodes, loading, execute: fetchNodes } = useNodes();
  const nodes = useNodeUpdates(initialNodes);
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fetch initial data
  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);
  
  // Handle filtering
  useEffect(() => {
    if (!nodes) return;
    
    let filtered = [...nodes];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        node =>
          node.name.toLowerCase().includes(query) ||
          node.id.toLowerCase().includes(query) ||
          node.ipAddress.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(node => node.status === statusFilter);
    }
    
    setFilteredNodes(filtered);
  }, [nodes, searchQuery, statusFilter]);
  
  // Handler for toggling node status
  const handleToggleStatus = async (nodeId: string, currentStatus: Node['status']) => {
    try {
      const newStatus = currentStatus === 'online' ? 'offline' : 'online';
      await apiService.updateNodeStatus(nodeId, newStatus);
      // The socket update will handle the UI update
    } catch (error) {
      console.error('Failed to update node status:', error);
    }
  };
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Nodes</Heading>
        <Button
          leftIcon={<Icon as={FiRefreshCw} />}
          onClick={() => fetchNodes()}
          isLoading={loading}
          variant="outline"
        >
          Refresh
        </Button>
      </Flex>
      
      <Flex
        mb={6}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        gap={4}
      >
        <Flex flex="1" align="center" position="relative">
          <Input
            placeholder="Search nodes by name, ID, or IP"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            pl={10}
          />
          <Icon
            as={FiSearch}
            position="absolute"
            left={3}
            color="gray.400"
          />
        </Flex>
        
        <Flex align="center" gap={2}>
          <Icon as={FiFilter} color="gray.500" />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            w={{ base: 'full', md: '200px' }}
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="busy">Busy</option>
            <option value="error">Error</option>
          </Select>
        </Flex>
      </Flex>
      
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={useColorModeValue('white', 'gray.800')}
      >
        {loading && !nodes ? (
          <Flex justify="center" align="center" p={8}>
            <Spinner />
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Status</Th>
                  <Th>IP Address</Th>
                  <Th>CPU</Th>
                  <Th>Memory</Th>
                  <Th>Jobs Completed</Th>
                  <Th>Last Seen</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredNodes.length > 0 ? (
                  filteredNodes.map((node) => (
                    <Tr key={node.id}>
                      <Td fontWeight="medium">{node.name}</Td>
                      <Td>
                        <StatusBadge status={node.status} />
                      </Td>
                      <Td>{node.ipAddress}</Td>
                      <Td>
                        <Flex align="center">
                          <Progress
                            value={node.cpuUsage}
                            size="sm"
                            colorScheme={
                              node.cpuUsage > 90
                                ? 'red'
                                : node.cpuUsage > 70
                                ? 'orange'
                                : 'green'
                            }
                            flex="1"
                            mr={2}
                            borderRadius="full"
                          />
                          <Text fontSize="xs" fontWeight="bold">
                            {node.cpuUsage}%
                          </Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex align="center">
                          <Progress
                            value={node.memoryUsage}
                            size="sm"
                            colorScheme={
                              node.memoryUsage > 90
                                ? 'red'
                                : node.memoryUsage > 70
                                ? 'orange'
                                : 'green'
                            }
                            flex="1"
                            mr={2}
                            borderRadius="full"
                          />
                          <Text fontSize="xs" fontWeight="bold">
                            {node.memoryUsage}%
                          </Text>
                        </Flex>
                      </Td>
                      <Td>{node.jobsCompleted}</Td>
                      <Td>{new Date(node.lastSeen).toLocaleString()}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            variant="ghost"
                            size="sm"
                            aria-label="Actions"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<FiPower />}
                              onClick={() => handleToggleStatus(node.id, node.status)}
                            >
                              {node.status === 'online' ? 'Set Offline' : 'Set Online'}
                            </MenuItem>
                            <MenuItem icon={<FiRefreshCw />}>Restart Node</MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={8} textAlign="center" py={4}>
                      No nodes found matching your criteria
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
}