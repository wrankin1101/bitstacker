import * as React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedTreeView from "./CustomizedTreeView";
import CustomizedDataGrid from "./CustomizedDataGrid";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import StatCard from "./StatCard";
import { processHistoryForCards, ProcessedHoldingData } from "../services/dataCleaner";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useUser } from "../context/UserContext";

export default function MainGrid() {
  const [interval, setInterval] = useState(90);

  const [cardData, setCardData] = useState([]);
  const [holdingsData, setHoldingData] = useState([]);
  const [currentHoldingIndex, setCurrentHoldingIndex] = useState(0);

  const { user, activePortfolio } = useUser();
  const queryClient = useQueryClient();

  //card data react query
  const {data: portfolioHistoryQuery, portfolioHistoryLoading, portfolioHistoryError,} = useQuery({
    queryKey: ["portfolio_history", activePortfolio],
    queryFn: () => api.getPortfolioHistoryById(activePortfolio),
    enabled: activePortfolio != null, //query doesn't run if no active portfolio
  });

  useEffect(() => {
    if (portfolioHistoryQuery) {
      let data = processHistoryForCards(portfolioHistoryQuery, interval);
      setCardData(data);
    }
  }, [portfolioHistoryQuery, interval]);


  //holding data react query
  const {data: holdingsQuery, holdingLoading, holdingError,} = useQuery({
    queryKey: ["holdings", activePortfolio],
    queryFn: () => api.getHoldingsByPortfolioId(activePortfolio),
    enabled: activePortfolio != null, //query doesn't run if no active portfolio
  });

  useEffect(() => {
    if (holdingsQuery) {
      const initializedHoldings = holdingsQuery.map((holding) => new ProcessedHoldingData(holding));
      setHoldingData(initializedHoldings);
      setCurrentHoldingIndex(0); // Reset currentHoldingIndex when holdings change
    }
  }, [holdingsQuery]);

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

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {cardData.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <SessionsChart cardData={cardData} interval={interval} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Holdings
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid holdingsData={holdingsData}/>
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
