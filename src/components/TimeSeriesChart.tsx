import { Box, useColorModeValue, Text } from '@chakra-ui/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TimeSeriesData } from '../types';

interface TimeSeriesChartProps {
  title: string;
  data: TimeSeriesData | TimeSeriesData[];
  height?: number;
  isLoading?: boolean;
}

export default function TimeSeriesChart({
  title,
  data,
  height = 300,
  isLoading = false,
}: TimeSeriesChartProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const dataArray = Array.isArray(data) ? data : [data];
  
  // Format the data for recharts
  const formattedData = isLoading
    ? []
    : dataArray[0]?.data.map((point, index) => {
        const entry: Record<string, any> = {
          timestamp: new Date(point.timestamp).toLocaleTimeString(),
        };
        
        dataArray.forEach((series) => {
          entry[series.label] = series.data[index]?.value || 0;
        });
        
        return entry;
      });
      
  // Define colors for each line
  const lineColors = ['#2196f3', '#9c27b0', '#ff9800', '#4caf50', '#f44336'];
  
  return (
    <Box
      p={4}
      bg={bgColor}
      shadow="base"
      borderRadius="lg"
      borderColor={borderColor}
      borderWidth="1px"
    >
      <Text fontSize="lg" fontWeight="medium" mb={4} color={textColor}>
        {title}
      </Text>
      <Box h={`${height}px`}>
        {isLoading ? (
          <Box
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text>Loading...</Text>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataArray.map((series, index) => (
                <Line
                  key={series.label}
                  type="monotone"
                  dataKey={series.label}
                  stroke={lineColors[index % lineColors.length]}
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}