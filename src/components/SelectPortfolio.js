import * as React from "react";
import {
  Avatar as MuiAvatar,
  ListItemAvatar as MuiListItemAvatar,
  MenuItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Select,
  selectClasses,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
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
  "&.MuiList-root": {
    p: "8px",
  },
  [`& .${selectClasses.select}`]: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    pl: 1,
  },
};

export default function SelectPortfolio() {
  const [portfolios, setPortfolios] = React.useState([]);
  const [portfolioId, setPortfolioId] = React.useState(0);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const newPortfolio = { id: 0, name: "New Portfolio", description: "" };
  const [portfolioToEdit, setPortfolioToEdit] = React.useState(newPortfolio);
  const [portfolioName, setPortfolioName] = React.useState("");

  const { user, activePortfolio, updateUserPortfolio } = useUser();
  const queryClient = useQueryClient();

  //react query
  const {
    data: portfoliosData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getPortfolios", user.id],
    queryFn: () => api.getPortfoliosByUserId(user.id),
    enabled: !!user || !!user.id, //query doesn't run if userId is undefined
  });

  // Update portfolio in a side effect
  React.useEffect(() => {
    if (portfoliosData && portfoliosData.length > 0) {
      setPortfolios(portfoliosData);
      // Set the active portfolio to first portfolio if it's not already set
      if (!activePortfolio) {
        updateUserPortfolio(portfoliosData[0].id);
        setPortfolioId(portfoliosData[0].id);
      } else {
        setPortfolioId(activePortfolio);
      }
    }
  }, [portfoliosData]);

  const addPortfolio = useMutation({
    mutationFn: () => api.createPortfolio(user.id, portfolioName),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getPortfolios", user.id]);
      updateUserPortfolio(data.lastInsertRowid);
    },
    onError: (error) => {
      console.error("Error creating portfolio:", error);
    },
  });

  const editPortfolio = useMutation({
    mutationFn: () => api.updatePortfolioName(portfolioToEdit.id, portfolioName),
    onSuccess: () => {
      queryClient.invalidateQueries(["getPortfolios", user.id]);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating portfolio:", error);
    },
  });
  
  const deletePortfolio = useMutation({
    mutationFn: () => api.deletePortfolio(portfolioToEdit.id),
    onSuccess: () => {
      if(portfolioToEdit.id === activePortfolio) {
        updateUserPortfolio(portfolios[0].id);
      }
      setPortfolioToEdit(newPortfolio);
      setPortfolioName("");
      queryClient.invalidateQueries(["getPortfolios", user.id]);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting portfolio:", error);
    },
  });

  const handleChange = (event) => {
    var portfolioId = event.target.value;
    if (portfolioId === 0) {
      
      console.log("Add new portfolio");
      handleEdit(newPortfolio);
    } else {
      setPortfolioId(portfolioId);
      updateUserPortfolio(portfolioId);
    }
  };

  const handleEdit = (portfolio) => {
    setPortfolioToEdit(portfolio);
    setPortfolioName(portfolio.name);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    // Implement delete functionality here
    deletePortfolio.mutate();
    console.log(`Delete portfolio with ID: ${portfolioToEdit.id}`);
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    if (portfolioToEdit.id === 0) {
      addPortfolio.mutate();
    } else {
      editPortfolio.mutate();
    }
    console.log(
      `Save portfolio with ID: ${portfolioToEdit.id} and name: ${portfolioName}`
    );
    setIsDialogOpen(false);
  };

  //render selected portfolio without edit/delete buttons
  const renderSelectedPortfolio = (selected) => {
    if (!selected) {
      return <span>Select portfolio</span>;
    }
    const selectedPortfolio = portfolios.find(
      (portfolio) => portfolio.id === selected
    );
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        <ListItemAvatar>
          <Avatar alt={selectedPortfolio.name}>
            <AccountBalanceWalletIcon sx={{ fontSize: "1rem" }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={selectedPortfolio.name}
          secondary={selectedPortfolio.description}
        />
      </div>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Select
        labelId="portfolio-select"
        id="portfolio-simple-select"
        value={portfolioId}
        onChange={handleChange}
        displayEmpty
        inputProps={{ "aria-label": "Select portfolio" }}
        fullWidth
        sx={selectPortfolioStyles}
        renderValue={renderSelectedPortfolio}
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
            <IconButton
              variant="text"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(portfolio);
              }}
              size="small"
              sx={{ border: "none" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
        <Divider sx={{ mx: -1 }} />
        <MenuItem value={0}>
          <ListItemIcon>
            <AddRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Add portfolio"
            secondary="Create new portfolio"
          />
        </MenuItem>
      </Select>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{portfolioToEdit.id !== 0 ? "Edit" : "Add"} Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Portfolio details
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Portfolio Name"
            type="text"
            fullWidth
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {portfolioToEdit.id !== 0 && portfolios.length > 1 && (
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>)}
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
