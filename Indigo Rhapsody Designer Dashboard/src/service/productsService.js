import { apiGet, apiPut, apiPost } from './apiService';
import { getDesignerId } from './cookieService';

export const getProductsBydesigner = async () => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }
    
    const data = await apiGet(`/products/getProductsByDesigner/${designerId}`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};

export const updateProductStatus = async (productId, enabled) => {
  try {
    const data = await apiPut(`/products/${productId}/toggle-status`, { enabled });
    return data;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
};

export const createPassword = async (email, password) => {
  try {
    const data = await apiPost("/products/createProduct", { email, password });
    return data; // Return the user and designer details
  } catch (error) {
    // console.error("Error logging in:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};
