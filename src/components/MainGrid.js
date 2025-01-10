import * as React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import StatCard from "./StatCard";
import HoldingsGrid from "./HoldingsGrid";
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
        <HoldingsGrid activePortfolio={activePortfolio} interval={interval}/>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
