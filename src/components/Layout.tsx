import { ReactNode, useEffect } from 'react';
import { Box, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSocketConnection } from '../hooks/useSocket';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isConnected = useSocketConnection();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Effect to show connection status
  useEffect(() => {
    if (isConnected) {
      console.log('Connected to WebSocket server');
    } else {
      console.log('Disconnected from WebSocket server');
    }
  }, [isConnected]);
  
  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <Header isOpen={isOpen} onOpen={onOpen} isConnected={isConnected} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex
          direction="column"
          flex="1"
          overflow="auto"
          pt={{ base: '20', md: '4' }}
          px={{ base: '4', md: '8' }}
        >
          {children}
        </Flex>
      </Box>
    </Box>
  );
}