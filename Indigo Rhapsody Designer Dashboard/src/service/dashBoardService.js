import { apiGet } from './apiService';
import { getDesignerId } from './cookieService';

export const dashBoardDesigner = async () => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }
    
    const data = await apiGet(`/order/total-orders/designer/${designerId}`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};
export const dashBoardDesignerSales = async () => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }
    
    const data = await apiGet(`/order/total-sales/designer/${designerId}`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};

export const dashBoardDesignerProducts = async () => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }
    
    const data = await apiGet(`/products/total-products/designer/${designerId}`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};

export const getOrderForTable = async () => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }
    
    const data = await apiGet(`/order/designer/${designerId}`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};