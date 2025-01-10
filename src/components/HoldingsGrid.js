import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from '@mui/material';
import Grid from "@mui/material/Grid2";
import AddIcon from '@mui/icons-material/Add';
import api from "../services/api";
import { ProcessedHoldingData } from "../services/dataCleaner";

import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedTreeView from "./CustomizedTreeView";
import CustomizedDataGrid from "./CustomizedDataGrid";

export default function HoldingsGrid({ activePortfolio, interval }) {
  const [holdingsData, setHoldingData] = useState([]);
  const [currentHoldingIndex, setCurrentHoldingIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newHolding, setNewHolding] = useState({ name: '', category: '', sold: false });

  const queryClient = useQueryClient();

  // Holding data react query
  const { data: holdingsQuery, holdingLoading, holdingError } = useQuery({
    queryKey: ["holdings", activePortfolio],
    queryFn: () => api.getHoldingsByPortfolioId(activePortfolio),
    enabled: activePortfolio != null, // Query doesn't run if no active portfolio
  });

  const addHolding = useMutation({
    mutationFn: () => api.createHolding(activePortfolio, newHolding.name, newHolding.category),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["holdings", activePortfolio]);
    },
    onError: (error) => {
      console.error("Error adding holding:", error);
    },
  });

  useEffect(() => {
    if (holdingsQuery) {
      setHoldingData((prevHoldingData) => {
        let indexSet = false;
        // Map holdings array to an array of ProcessedHoldingData objects
        const newHoldings = holdingsQuery.map((holding) => new ProcessedHoldingData(holding));
  
        // Merge new holdings with existing holdings, avoiding duplicates
        const mergedHoldings = [...prevHoldingData];
        newHoldings.forEach((newHolding) => {
          const existingHoldingIndex = mergedHoldings.findIndex((holding) => holding.id === newHolding.id);
          if (existingHoldingIndex === -1) {
            mergedHoldings.push(newHolding);
            if (!indexSet) {
              setCurrentHoldingIndex(mergedHoldings.length - 1);
              indexSet = true;
            }
          }
        });
  
        return mergedHoldings;
      });
    }
  }, [holdingsQuery, interval]);

  //holdings history lazy loading + state
  const fetchHoldingsHistory = async (holdingId) => {
    const data = await api.getHoldingsHistoryById(holdingId);
    return data;
  };

  const { data: holdingHistoryQuery, holdingHistoryisLoading, holdingHistoryisError, holdingHistoryError,} = useQuery({
    queryKey: ["holdingsHistory", holdingsData[currentHoldingIndex]?.id],
    queryFn: () => fetchHoldingsHistory(holdingsData[currentHoldingIndex]?.id),
    enabled: holdingsData.length > 0 && currentHoldingIndex < holdingsData.length,
  });

  useEffect(() => {
    if (holdingHistoryQuery) {
      setHoldingData((prevHoldingData) => {
        // Create a shallow copy of the previous holding data
        const updatedHoldingData = [...prevHoldingData];
  
        // Check if the current holding index is within bounds
        if (currentHoldingIndex < updatedHoldingData.length) {
          // Update the holding object with the new history and interval
          updatedHoldingData[currentHoldingIndex].addHistory(holdingHistoryQuery);
          updatedHoldingData[currentHoldingIndex].addInterval(interval);
        }
        // Return the updated holding data
        return updatedHoldingData;
      });
  
      // Move to the next holding
      if (currentHoldingIndex < holdingsData.length - 1) {
        setCurrentHoldingIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [holdingHistoryQuery]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddHolding = () => {
    addHolding.mutate();
    handleCloseDialog();
  };

  return (
    <>
    <Typography component="h2" variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        Holdings
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ ml: 2 }}
        >
          Add
        </Button>
      </Typography>
    <Grid container spacing={2} columns={12}>
      
        <Grid size={{ xs: 12, md: 9 }}>
          <CustomizedDataGrid holdingsData={holdingsData} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>

      {/* Add Holding Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Holding</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newHolding.name}
            onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            type="text"
            fullWidth
            value={newHolding.category}
            onChange={(e) => setNewHolding({ ...newHolding, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddHolding} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}