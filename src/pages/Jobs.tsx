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
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  Code,
  Stack,
} from '@chakra-ui/react';
import { FiMoreVertical, FiRefreshCw, FiSearch, FiFilter, FiEye, FiStopCircle, FiTrash, FiPlay } from 'react-icons/fi';
import { useJobs } from '../hooks/useApi';
import { useJobUpdates } from '../hooks/useSocket';
import { apiService } from '../api/api';
import StatusBadge from '../components/StatusBadge';
import { Job } from '../types';

export default function Jobs() {
  const { data: initialJobs, loading, execute: fetchJobs } = useJobs();
  const jobs = useJobUpdates(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobLogs, setJobLogs] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Fetch initial data
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  // Handle filtering
  useEffect(() => {
    if (!jobs) return;
    
    let filtered = [...jobs];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.name.toLowerCase().includes(query) ||
          job.id.toLowerCase().includes(query) ||
          job.type.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredJobs(filtered);
  }, [jobs, searchQuery, statusFilter]);
  
  const handleViewJob = async (job: Job) => {
    setSelectedJob(job);
    
    try {
      const logs = await apiService.getJobLogs(job.id);
      setJobLogs(logs);
    } catch (error) {
      console.error('Failed to fetch job logs:', error);
      setJobLogs(['Failed to load logs']);
    }
    
    onOpen();
  };
  
  const handleCancelJob = async (jobId: string) => {
    try {
      await apiService.cancelJob(jobId);
      // The socket update will handle the UI update
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  };
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Jobs</Heading>
        <Button
          leftIcon={<FiRefreshCw />}
          onClick={() => fetchJobs()}
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
            placeholder="Search jobs by name, ID, or type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            pl={10}
          />
          <Box position="absolute" left={3}>
            <FiSearch color="gray.400" />
          </Box>
        </Flex>
        
        <Flex align="center" gap={2}>
          <FiFilter color="gray.500" />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            w={{ base: 'full', md: '200px' }}
          >
            <option value="all">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </Flex>
      </Flex>
      
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={useColorModeValue('white', 'gray.800')}
      >
        {loading && !jobs ? (
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
                  <Th>Type</Th>
                  <Th>Progress</Th>
                  <Th>Started</Th>
                  <Th>Node</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <Tr key={job.id}>
                      <Td fontWeight="medium">{job.name}</Td>
                      <Td>
                        <StatusBadge status={job.status} />
                      </Td>
                      <Td>{job.type}</Td>
                      <Td>
                        <Flex align="center">
                          <Progress
                            value={job.progress}
                            size="sm"
                            colorScheme="blue"
                            flex="1"
                            mr={2}
                            borderRadius="full"
                            isIndeterminate={job.status === 'running' && job.progress === 0}
                          />
                          <Text fontSize="xs" fontWeight="bold">
                            {job.progress}%
                          </Text>
                        </Flex>
                      </Td>
                      <Td>
                        {job.startedAt
                          ? new Date(job.startedAt).toLocaleString()
                          : 'Not started'}
                      </Td>
                      <Td>{job.nodeId || 'Not assigned'}</Td>
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
                              icon={<FiEye />}
                              onClick={() => handleViewJob(job)}
                            >
                              View Details
                            </MenuItem>
                            {job.status === 'queued' || job.status === 'running' ? (
                              <MenuItem
                                icon={<FiStopCircle />}
                                onClick={() => handleCancelJob(job.id)}
                              >
                                Cancel Job
                              </MenuItem>
                            ) : null}
                            {job.status === 'completed' || job.status === 'failed' ? (
                              <MenuItem icon={<FiPlay />}>Rerun Job</MenuItem>
                            ) : null}
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={4}>
                      No jobs found matching your criteria
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
      
      {/* Job Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedJob?.name}
            <Text fontSize="sm" fontWeight="normal" mt={1} color="gray.500">
              ID: {selectedJob?.id}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>Details</Tab>
                <Tab>Parameters</Tab>
                <Tab>Results</Tab>
                <Tab>Logs</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Status:</Text>
                      <StatusBadge status={selectedJob?.status || 'queued'} />
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Type:</Text>
                      <Text>{selectedJob?.type}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Priority:</Text>
                      <Text>{selectedJob?.priority}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Progress:</Text>
                      <Text>{selectedJob?.progress}%</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Created:</Text>
                      <Text>
                        {selectedJob?.createdAt
                          ? new Date(selectedJob.createdAt).toLocaleString()
                          : 'Unknown'}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Started:</Text>
                      <Text>
                        {selectedJob?.startedAt
                          ? new Date(selectedJob.startedAt).toLocaleString()
                          : 'Not started'}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Completed:</Text>
                      <Text>
                        {selectedJob?.completedAt
                          ? new Date(selectedJob.completedAt).toLocaleString()
                          : 'Not completed'}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Node:</Text>
                      <Text>{selectedJob?.nodeId || 'Not assigned'}</Text>
                    </Flex>
                    {selectedJob?.errorMessage && (
                      <Box>
                        <Text fontWeight="bold" mb={2} color="red.500">
                          Error:
                        </Text>
                        <Code p={2} borderRadius="md" variant="subtle" colorScheme="red">
                          {selectedJob.errorMessage}
                        </Code>
                      </Box>
                    )}
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Code
                    p={4}
                    borderRadius="md"
                    whiteSpace="pre-wrap"
                    overflowX="auto"
                    d="block"
                  >
                    {JSON.stringify(selectedJob?.parameters || {}, null, 2)}
                  </Code>
                </TabPanel>
                <TabPanel>
                  {selectedJob?.results ? (
                    <Code
                      p={4}
                      borderRadius="md"
                      whiteSpace="pre-wrap"
                      overflowX="auto"
                      d="block"
                    >
                      {JSON.stringify(selectedJob.results, null, 2)}
                    </Code>
                  ) : (
                    <Text>No results available</Text>
                  )}
                </TabPanel>
                <TabPanel>
                  <Box
                    bg={useColorModeValue('gray.50', 'gray.900')}
                    borderRadius="md"
                    p={3}
                    maxHeight="300px"
                    overflowY="auto"
                  >
                    {jobLogs.length > 0 ? (
                      jobLogs.map((log, index) => (
                        <Text key={index} fontSize="sm" fontFamily="mono">
                          {log}
                        </Text>
                      ))
                    ) : (
                      <Text>No logs available</Text>
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            {selectedJob?.status === 'queued' || selectedJob?.status === 'running' ? (
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => {
                  if (selectedJob) {
                    handleCancelJob(selectedJob.id);
                    onClose();
                  }
                }}
              >
                Cancel Job
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}