import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BarChart, LineChart } from 'lucide-react';
import SingleURLView from './components/SingleUrlView';
import MultipleURLView from './components/MultipleUrlView';
import { ToastContainer } from 'react-toastify';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    background: {
      default: '#f5f5f5',
    }
  },
  shape: {
    borderRadius: 8,
  }
});

const App = () => {
  const [mode, setMode] = useState(0);

  const handleModeChange = (event, newValue) => {
    setMode(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Web Performance Analyzer
            </Typography>

            <Tabs 
              value={mode} 
              onChange={handleModeChange} 
              sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                icon={<BarChart className="mr-2" size={20} />}
                label="Single URL Analysis" 
                iconPosition="start"
              />
              <Tab 
                icon={<LineChart className="mr-2" size={20} />}
                label="Multiple URLs Comparison" 
                iconPosition="start"
              />
            </Tabs>

            {mode === 0 ? <SingleURLView /> : <MultipleURLView />}
          </Paper>
        </Container>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
};

export default App;