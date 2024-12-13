import axios from "axios"; // For making HTTP requests
const API_BASE_URL = "/api"; // "proxy": in package.json will route to backend

const api = {
  //Hello world
  helloWorld: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hello`);
      return response.data;
    } catch (error) {
      console.error("Error in helloWorld:", error);
      throw error;
    }
  },

  //user queries
  createUser: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/createUser`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getUserById`, {
        params: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getUserByEmail`, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      throw error;
    }
  },

  updateUser: async (id, updates) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updateUser`, {
        id,
        updates,
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteUser`, {
        data: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw error;
    }
  },

  //portfolio queries
  createPortfolio: async (userId, name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/createPortfolio`, {
        userId,
        name,
      });
      return response.data;
    } catch (error) {
      console.error("Error in createPortfolio:", error);
      throw error;
    }
  },

  getPortfoliosByUserId: async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getPortfoliosByUserId`,
        { params: { userId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getPortfoliosByUserId:", error);
      throw error;
    }
  },

  updatePortfolioName: async (id, name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updatePortfolioName`, {
        id,
        name,
      });
      return response.data;
    } catch (error) {
      console.error("Error in updatePortfolioName:", error);
      throw error;
    }
  },

  deletePortfolio: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deletePortfolio`, {
        data: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error in deletePortfolio:", error);
      throw error;
    }
  },

  //holding queries

  createHolding: async (portfolioId, name, category) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/createHolding`, {
        portfolioId,
        name,
        category,
      });
      return response.data;
    } catch (error) {
      console.error("Error in createHolding:", error);
      throw error;
    }
  },

  getHoldingsByPortfolioId: async (portfolioId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getHoldingsByPortfolioId`,
        { params: { portfolioId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getHoldingsByPortfolioId:", error);
      throw error;
    }
  },

  updateHolding: async (id, updates) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updateHolding`, {
        id,
        updates,
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateHolding:", error);
      throw error;
    }
  },

  deleteHolding: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteHolding`, {
        data: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error in deleteHolding:", error);
      throw error;
    }
  },

  //asset queries

  createAsset: async (holdingId, symbol, name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/createAsset`, {
        holdingId,
        symbol,
        name,
      });
      return response.data;
    } catch (error) {
      console.error("Error in createAsset:", error);
      throw error;
    }
  },

  getAssetsByHoldingId: async (holdingId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAssetsByHoldingId`, {
        params: { holdingId },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getAssetsByHoldingId:", error);
      throw error;
    }
  },

  updateAsset: async (id, updates) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updateAsset`, {
        id,
        updates,
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateAsset:", error);
      throw error;
    }
  },

  deleteAsset: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteAsset`, {
        data: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error in deleteAsset:", error);
      throw error;
    }
  },

  //transactions

  createTransaction: async (
    portfolioId,
    assetId,
    transactionType,
    quantity,
    price
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/createTransaction`, {
        portfolioId,
        assetId,
        transactionType,
        quantity,
        price,
      });
      return response.data;
    } catch (error) {
      console.error("Error in createTransaction:", error);
      throw error;
    }
  },

  getTransactionsByPortfolioId: async (portfolioId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getTransactionsByPortfolioId`,
        { params: { portfolioId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getTransactionsByPortfolioId:", error);
      throw error;
    }
  },

  getTransactionsByAssetId: async (assetId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getTransactionsByAssetId`,
        { params: { assetId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error in getTransactionsByAssetId:", error);
      throw error;
    }
  },

  updateTransaction: async (id, updates) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updateTransaction`, {
        id,
        updates,
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateTransaction:", error);
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteTransaction`, {
        data: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error in POSTFUNCTION:", error);
      throw error;
    }
  },

  //asset

  createAssetPrice: async (assetId, price) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/createAssetPrice`, {
        assetId,
        price,
      });
      return response.data;
    } catch (error) {
      console.error("Error in createAssetPrice:", error);
      throw error;
    }
  },

  getAssetPricesById: async (assetId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAssetPricesById`, {
        params: { assetId },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getAssetPricesById:", error);
      throw error;
    }
  },

  getLatestAssetPrice: async (assetId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getLatestAssetPrice`, {
        params: { assetId },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getLatestAssetPrice:", error);
      throw error;
    }
  },

  deleteAssetPrice: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteAssetPrice`, {
        data: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error in deleteAssetPrice:", error);
      throw error;
    }
  },
};

export default api;
