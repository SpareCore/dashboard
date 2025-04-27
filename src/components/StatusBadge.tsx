import { Badge, BadgeProps } from '@chakra-ui/react';

interface StatusBadgeProps extends Omit<BadgeProps, 'colorScheme'> {
  status: 'online' | 'offline' | 'busy' | 'error' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
}

export default function StatusBadge({ status, ...rest }: StatusBadgeProps) {
  const getColorScheme = () => {
    switch (status) {
      case 'online':
      case 'completed':
        return 'green';
      case 'offline':
      case 'cancelled':
        return 'gray';
      case 'busy':
      case 'running':
      case 'queued':
        return 'blue';
      case 'error':
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  return (
    <Badge
      colorScheme={getColorScheme()}
      borderRadius="full"
      px="2"
      {...rest}
    >
      {status}
    </Badge>
  );
}