import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Switch,
  Divider,
  Text,
  SimpleGrid,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function Settings() {
  const toast = useToast();
  
  // Mock settings state
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'Zcaler Distributed Computing',
    apiEndpoint: 'http://localhost:8080/api',
    refreshInterval: 30,
    enableWebSockets: true,
    enableNotifications: true,
    debugMode: false,
  });
  
  const [jobSettings, setJobSettings] = useState({
    defaultJobPriority: 5,
    maxConcurrentJobs: 20,
    queueThreshold: 100,
    retryFailedJobs: true,
    maxRetries: 3,
    jobTimeout: 3600,
  });
  
  const [nodeSettings, setNodeSettings] = useState({
    nodeHeartbeatInterval: 60,
    nodeTimeoutThreshold: 180,
    autoDisconnectInactiveNodes: true,
    loadBalancingStrategy: 'resource-based',
    requireNodeAuthentication: true,
  });
  
  const handleSaveGeneral = () => {
    toast({
      title: 'Settings Saved',
      description: 'General settings have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleSaveJobSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Job settings have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleSaveNodeSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Node settings have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Box>
      <Heading size="lg" mb={6}>
        System Settings
      </Heading>
      
      <Tabs variant="enclosed">
        <TabList>
          <Tab>General</Tab>
          <Tab>Job Settings</Tab>
          <Tab>Node Management</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>System Name</FormLabel>
                    <Input
                      value={generalSettings.systemName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          systemName: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>API Endpoint</FormLabel>
                    <Input
                      value={generalSettings.apiEndpoint}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          apiEndpoint: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Dashboard Refresh Interval (seconds)</FormLabel>
                    <NumberInput
                      min={5}
                      max={300}
                      value={generalSettings.refreshInterval}
                      onChange={(valueString) =>
                        setGeneralSettings({
                          ...generalSettings,
                          refreshInterval: parseInt(valueString),
                        })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <Divider />
                  
                  <Text fontWeight="medium">Features</Text>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="enable-websockets" mb="0">
                        Enable WebSockets
                      </FormLabel>
                      <Switch
                        id="enable-websockets"
                        isChecked={generalSettings.enableWebSockets}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            enableWebSockets: e.target.checked,
                          })
                        }
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="enable-notifications" mb="0">
                        Enable Notifications
                      </FormLabel>
                      <Switch
                        id="enable-notifications"
                        isChecked={generalSettings.enableNotifications}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            enableNotifications: e.target.checked,
                          })
                        }
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="debug-mode" mb="0">
                        Debug Mode
                      </FormLabel>
                      <Switch
                        id="debug-mode"
                        isChecked={generalSettings.debugMode}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            debugMode: e.target.checked,
                          })
                        }
                      />
                    </FormControl>
                  </SimpleGrid>
                  
                  <Divider />
                  
                  <Button colorScheme="blue" alignSelf="flex-end" onClick={handleSaveGeneral}>
                    Save Settings
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
          
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>Default Job Priority (1-10)</FormLabel>
                      <NumberInput
                        min={1}
                        max={10}
                        value={jobSettings.defaultJobPriority}
                        onChange={(valueString) =>
                          setJobSettings({
                            ...jobSettings,
                            defaultJobPriority: parseInt(valueString),
                          })
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Maximum Concurrent Jobs</FormLabel>
                      <NumberInput
                        min={1}
                        max={100}
                        value={jobSettings.maxConcurrentJobs}
                        onChange={(valueString) =>
                          setJobSettings({
                            ...jobSettings,
                            maxConcurrentJobs: parseInt(valueString),
                          })
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Queue Threshold</FormLabel>
                      <NumberInput
                        min={10}
                        max={1000}
                        value={jobSettings.queueThreshold}
                        onChange={(valueString) =>
                          setJobSettings({
                            ...jobSettings,
                            queueThreshold: parseInt(valueString),
                          })
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Job Timeout (seconds)</FormLabel>
                      <NumberInput
                        min={60}
                        max={86400}
                        value={jobSettings.jobTimeout}
                        onChange={(valueString) =>
                          setJobSettings({
                            ...jobSettings,
                            jobTimeout: parseInt(valueString),
                          })
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid>
                  
                  <Divider />
                  
                  <Text fontWeight="medium">Job Retry Settings</Text>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="retry-failed-jobs" mb="0">
                      Automatically Retry Failed Jobs
                    </FormLabel>
                    <Switch
                      id="retry-failed-jobs"
                      isChecked={jobSettings.retryFailedJobs}
                      onChange={(e) =>
                        setJobSettings({
                          ...jobSettings,
                          retryFailedJobs: e.target.checked,
                        })
                      }
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Maximum Retries</FormLabel>
                    <NumberInput
                      min={1}
                      max={10}
                      isDisabled={!jobSettings.retryFailedJobs}
                      value={jobSettings.maxRetries}
                      onChange={(valueString) =>
                        setJobSettings({
                          ...jobSettings,
                          maxRetries: parseInt(valueString),
                        })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <Divider />
                  
                  <Button colorScheme="blue" alignSelf="flex-end" onClick={handleSaveJobSettings}>
                    Save Job Settings
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
          
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>Node Heartbeat Interval (seconds)</FormLabel>
                      <NumberInput
                        min={10}
                        max={300}
                        value={nodeSettings.nodeHeartbeatInterval}
                        onChange={(valueString) =>
                          setNodeSettings({
                            ...nodeSettings,
                            nodeHeartbeatInterval: parseInt(valueString),
                          })
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Node Timeout Threshold (seconds)</FormLabel>
                      <NumberInput
                        min={60}
                        max={600}
                        value={nodeSettings.nodeTimeoutThreshold}
                        onChange={(valueString) =>
                          setNodeSettings({
                            ...nodeSettings,
                            nodeTimeoutThreshold: parseInt(valueString),
                          })
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Load Balancing Strategy</FormLabel>
                      <Select
                        value={nodeSettings.loadBalancingStrategy}
                        onChange={(e) =>
                          setNodeSettings({
                            ...nodeSettings,
                            loadBalancingStrategy: e.target.value,
                          })
                        }
                      >
                        <option value="round-robin">Round Robin</option>
                        <option value="resource-based">Resource-Based</option>
                        <option value="least-jobs">Least Jobs</option>
                        <option value="capability-match">Capability Match</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                  
                  <Divider />
                  
                  <Text fontWeight="medium">Node Management</Text>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="auto-disconnect" mb="0">
                      Auto-Disconnect Inactive Nodes
                    </FormLabel>
                    <Switch
                      id="auto-disconnect"
                      isChecked={nodeSettings.autoDisconnectInactiveNodes}
                      onChange={(e) =>
                        setNodeSettings({
                          ...nodeSettings,
                          autoDisconnectInactiveNodes: e.target.checked,
                        })
                      }
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="node-auth" mb="0">
                      Require Node Authentication
                    </FormLabel>
                    <Switch
                      id="node-auth"
                      isChecked={nodeSettings.requireNodeAuthentication}
                      onChange={(e) =>
                        setNodeSettings({
                          ...nodeSettings,
                          requireNodeAuthentication: e.target.checked,
                        })
                      }
                    />
                  </FormControl>
                  
                  <Divider />
                  
                  <Button colorScheme="blue" alignSelf="flex-end" onClick={handleSaveNodeSettings}>
                    Save Node Settings
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}