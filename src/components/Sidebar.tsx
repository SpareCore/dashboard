import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  BoxProps,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiServer,
  FiCpu,
  FiActivity,
  FiSettings,
  FiDatabase,
} from 'react-icons/fi';

interface LinkItemProps {
  name: string;
  icon: React.ElementType;
  path: string;
}

const LinkItems: LinkItemProps[] = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Nodes', icon: FiServer, path: '/nodes' },
  { name: 'Jobs', icon: FiCpu, path: '/jobs' },
  { name: 'Analytics', icon: FiActivity, path: '/analytics' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function Sidebar({ onClose, isOpen, ...rest }: SidebarProps) {
  return (
    <Box>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        {...rest}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
}

function SidebarContent({ onClose, ...rest }: SidebarContentProps) {
  const location = useLocation();
  
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          SpareCore
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          path={link.path}
          isActive={location.pathname === link.path}
        >
          {link.name}
        </NavItem>
      ))}
      
      <Box position="absolute" bottom="8" left="0" right="0" px="8">
        <Flex
          align="center"
          p="4"
          borderRadius="lg"
          role="group"
          bg={useColorModeValue('brand.50', 'gray.700')}
          color={useColorModeValue('brand.600', 'white')}
          cursor="pointer"
        >
          <Icon as={FiDatabase} mr="4" />
          <Text>System Status</Text>
        </Flex>
      </Box>
    </Box>
  );
}

interface NavItemProps extends BoxProps {
  icon: React.ElementType;
  path: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavItem({ icon, path, isActive, children, ...rest }: NavItemProps) {
  const activeBg = useColorModeValue('brand.50', 'gray.700');
  const inactiveBg = useColorModeValue('transparent', 'transparent');
  const activeColor = useColorModeValue('brand.600', 'white');
  const inactiveColor = useColorModeValue('gray.600', 'gray.300');
  
  return (
    <Box as={RouterLink} to={path} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : inactiveBg}
        color={isActive ? activeColor : inactiveColor}
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
}