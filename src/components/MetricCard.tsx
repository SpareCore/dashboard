import { Box, Flex, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  helpText?: string;
  colorScheme?: string;
  isLoading?: boolean;
}

export default function MetricCard({
  title,
  value,
  icon,
  helpText,
  colorScheme = 'blue',
  isLoading = false,
}: MetricCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const iconBg = useColorModeValue(`${colorScheme}.50`, `${colorScheme}.900`);
  const iconColor = useColorModeValue(`${colorScheme}.600`, `${colorScheme}.200`);
  
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py="4"
      shadow="base"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      rounded="lg"
      bg={bgColor}
    >
      <Flex justifyContent="space-between">
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight="medium" isTruncated color={textColor}>
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="medium" isTruncated>
            {isLoading ? '-' : value}
          </StatNumber>
          {helpText && (
            <StatHelpText fontSize="sm">{helpText}</StatHelpText>
          )}
        </Box>
        <Box
          my="auto"
          alignItems="center"
          justifyContent="center"
          color={iconColor}
          bg={iconBg}
          rounded="full"
          p={2}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}