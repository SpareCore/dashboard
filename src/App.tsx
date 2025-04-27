import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Dashboard from './pages/Dashboard';
import Nodes from './pages/Nodes';
import Jobs from './pages/Jobs';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  return (
    <Box minH="100vh">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;