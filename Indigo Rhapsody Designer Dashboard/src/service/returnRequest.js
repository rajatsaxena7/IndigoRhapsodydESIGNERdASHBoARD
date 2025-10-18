import { apiGet, apiPost } from './apiService';
import { getDesignerId } from './cookieService';

export const getReturnRequest = async () => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }
    
    const data = await apiGet(`/order/return-requests/${designerId}`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};

export const CreateReturnRequest = async (returnId) => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }

    const data = await apiPost(`/shipping/createReturn`, {
      returnId, // Pass the returnId received in the function argument
      designerRef: designerId, // Pass the designerId as designerRef
    });
    return data;
  } catch (error) {
    console.error("Error creating return request:", error);
    throw error;
  }
};

export const DeclineReturnRequest = async (returnId) => {
  try {
    const data = await apiPost(`/shipping/rejectRequest`, {
      returnId,
    });
    return data;
  } catch (error) {
    console.error("Error creating return request:", error);
    throw error;
  }
};
