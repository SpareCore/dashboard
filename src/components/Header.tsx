import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useColorMode,
  Icon,
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiUser, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import { useNotifications } from '../hooks/useSocket';

interface HeaderProps {
  isOpen: boolean;
  onOpen: () => void;
  isConnected: boolean;
}

export default function Header({ onOpen, isConnected }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { notifications, markAllAsRead, clearAllNotifications } = useNotifications();
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  return (
    <Box
      px={4}
      position="fixed"
      width="full"
      zIndex="1"
      height="20"
      bg={useColorModeValue('white', 'gray.800')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
        
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          display={{ base: 'none', md: 'flex' }}
        >
          Zcaler Dashboard
        </Text>
        
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          display={{ base: 'flex', md: 'none' }}
        >
          ZD
        </Text>
        
        <Flex alignItems="center">
          <Badge
            colorScheme={isConnected ? 'green' : 'red'}
            variant="solid"
            borderRadius="full"
            px={2}
            mr={4}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          
          <Stack direction="row" spacing={3} alignItems="center">
            <Button onClick={toggleColorMode} size="sm" variant="ghost">
              <Icon as={colorMode === 'light' ? FiMoon : FiSun} />
            </Button>
            
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="ghost"
                cursor="pointer"
                position="relative"
                size="sm"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="red"
                    borderRadius="full"
                    size="xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </MenuButton>
              <MenuList>
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((notification) => (
                      <MenuItem key={notification.id}>
                        <Box>
                          <Text fontWeight={notification.read ? 'normal' : 'bold'}>
                            {notification.message}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </Text>
                        </Box>
                      </MenuItem>
                    ))}
                    <MenuDivider />
                    <MenuItem onClick={markAllAsRead}>Mark all as read</MenuItem>
                    <MenuItem onClick={clearAllNotifications}>Clear all</MenuItem>
                  </>
                ) : (
                  <MenuItem>No notifications</MenuItem>
                )}
              </MenuList>
            </Menu>
            
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="ghost"
                cursor="pointer"
                size="sm"
              >
                <FiUser />
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}