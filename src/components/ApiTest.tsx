import React from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { collectionService } from '../api';
import { useApi } from '../hooks/useApi';
import type { CollectionResponse } from '../types/api';

export const ApiTest: React.FC = () => {
  const { data: collections, loading, error, execute } = useApi<CollectionResponse[]>();

  const handleTestApi = async () => {
    try {
      await execute(() => collectionService.getCollections());
    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        API Infrastructure Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={handleTestApi}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={20} /> : 'Test Collections API'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error.message}
        </Alert>
      )}

      {collections && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Successfully fetched {collections.length} collections
        </Alert>
      )}

      {collections && collections.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Collections:
          </Typography>
          <ul>
            {collections.map((collection) => (
              <li key={collection.id}>
                {collection.title} ({collection.code}) - {collection.totalQuestions} questions
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}; 