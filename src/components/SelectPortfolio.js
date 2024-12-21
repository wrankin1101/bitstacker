import * as React from 'react';
import {
  Avatar as MuiAvatar,
  ListItemAvatar as MuiListItemAvatar,
  MenuItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Select,
  selectClasses,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useUser } from "../context/UserContext";

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

const selectPortfolioStyles = { 
  maxHeight: 56,
  width: 215,
  '&.MuiList-root': {
    p: '8px',
  },
  [`& .${selectClasses.select}`]: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    pl: 1,
  },
};

export default function SelectPortfolio() {
  const [portfolios, setPortfolios] = React.useState([]);
  const [portfolioId, setPortfolioId] = React.useState(0);
  
  const { user, activePortfolio, updateUserPortfolio } = useUser();
  const queryClient = useQueryClient();

  //react query
  const { data, isLoading, error } = useQuery({
    queryKey: ["getPortfolios", user.id],
    queryFn: () => api.getPortfoliosByUserId(user.id),
    enabled: !!user || !!user.id, //query doesn't run if userId is undefined
  });
  
  // Update portfolio in a side effect
  React.useEffect(() => {
    if (data && data.length > 0) {
      setPortfolios(data);
      // Set the active portfolio to first portfolio if it's not already set
      if (!activePortfolio){
        updateUserPortfolio(data[0].id);
        setPortfolioId(data[0].id);
      }
      else {
        setPortfolioId(activePortfolio);
      }
    }
  }, [data]);


  const addPortfolio = useMutation({
    mutationFn: () => api.createPortfolio(user.id, "test"),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getPortfolios", user.id]);
      updateUserPortfolio(data.lastInsertRowid);
    },
    onError: (error) => {
      console.error("Error creating portfolio:", error);
    },
  });

  const handleChange = (event) => {
    var portfolioId = event.target.value;
    if (portfolioId === 0) {
      addPortfolio.mutate();
    } else {
      setPortfolioId(portfolioId);
      updateUserPortfolio(portfolioId);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Select
      labelId="portfolio-select"
      id="portfolio-simple-select"
      value={portfolioId}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select portfolio' }}
      fullWidth
      sx={selectPortfolioStyles}
    >
      <ListSubheader sx={{ pt: 0 }}>Portfolios</ListSubheader>
      {portfolios.map((portfolio) => (
        <MenuItem key={portfolio.id} value={portfolio.id}>
          <ListItemAvatar>
            <Avatar alt={portfolio.name}>
              <AccountBalanceWalletIcon sx={{ fontSize: "1rem" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={portfolio.name}
            secondary={portfolio.description}
          />
        </MenuItem>
      ))}
      <Divider sx={{ mx: -1 }} />
      <MenuItem value={0}>
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Add portfolio" secondary="Create new portfolio" />
      </MenuItem>
    </Select>
  );
}
