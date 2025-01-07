import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import { processHistoryForCards } from '../services/dataCleaner';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useUser } from "../context/UserContext";

export default function MainGrid() {
  const [interval, setInterval] = useState(90);

  const [cardData, setCardData] = useState([]);
  const [holdingData, setHoldingData] = useState([]);

  const { user, activePortfolio } = useUser();
  const queryClient = useQueryClient();

  //card data react query
  const { data: portfolio_history, portfolioHistoryLoading, portfolioHistoryError, } = useQuery({
    queryKey: ["portfolio_history", activePortfolio],
    queryFn: () => api.getPortfolioHistoryById(activePortfolio),
    enabled: activePortfolio != null, //query doesn't run if no active portfolio
  });

    //holding data react query
    const { data: holdings, holdingLoading, holdingError, } = useQuery({
      queryKey: ["holdings", activePortfolio],
      queryFn: () => api.getHoldingsByPortfolioId(activePortfolio),
      enabled: activePortfolio != null, //query doesn't run if no active portfolio
    });

  useEffect(() => {
    if (portfolio_history) {
      let data = processHistoryForCards(portfolio_history,interval);
      setCardData(data);
    }
  }, [portfolio_history,interval]);

  useEffect(() => {
    if (holdings) {
      //let data = processHistoryForCards(portfolio_history,interval);
      setHoldingData(holdings);
    }
  }, [holdings,interval]);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
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
          <SessionsChart cardData = {cardData} interval = {interval}/>
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
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
