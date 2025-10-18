import { apiGet, apiPost } from './apiService';
import { getDesignerId, getUserId } from './cookieService';

export const createShippingOrder = async (shippingDetails) => {
  try {
    const data = await apiPost(`/shipping/createOrder`, shippingDetails);
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to create shipping order");
  }
};

export const createManifest = async (shipmentId) => {
  try {
    const data = await apiPost(`/shipping/generate-manifest`, { shipment_id: shipmentId });
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to create manifest");
  }
};

export const createInvoice = async (shipmentId) => {
  try {
    const data = await apiPost(`/shipping/generate-manifest`, { shipment_id: shipmentId });
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to create invoice");
  }
};
export const getPickupLocationName = async (designerRef) => {
  try {
    const data = await apiGet(`/designer/${designerRef}/pickup-location`);
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to get pickup location name");
  }
};

export const getShippingDetails = async (shipmentId) => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }
    
    const data = await apiGet(`/shipping/designer/${designerId}`);
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to get shipping details");
  }
};

export const getShippingName = async (shipmentId) => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const data = await apiGet(`/designer/name/${userId}`);
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to get shipping details");
  }
};
