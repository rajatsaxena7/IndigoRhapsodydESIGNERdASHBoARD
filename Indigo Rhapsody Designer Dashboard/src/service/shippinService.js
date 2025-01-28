const BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

const designerId = localStorage.getItem("designerId");
const userId = localStorage.getItem("userId");
import axios from "axios";

export const createShippingOrder = async (shippingDetails) => {
  const response = await fetch(`${BASE_URL}/shipping/createOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shippingDetails),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create shipping order");
  }
  return data;
  x;
};

export const createManifest = async (shipmentId) => {
  const response = await fetch(`${BASE_URL}/shipping/generate-manifest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shipment_id: shipmentId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create manifest");
  }
  return data;
};

export const createInvoice = async (shipmentId) => {
  const response = await fetch(`${BASE_URL}/shipping/generate-manifest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shipment_id: shipmentId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create invoice");
  }
  return data;
};

export const getPickupLocationName = async (designerRef) => {
  const response = await axios.get(
    `${BASE_URL}/designer/${designerRef}/pickup-location`
  );
  return response.data;
};

export const getShippingDetails = async (shipmentId) => {
  const response = await fetch(`${BASE_URL}/shipping/designer/${designerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to get shipping details");
  }
  return data;
};

export const getShippingName = async (shipmentId) => {
  const response = await fetch(`${BASE_URL}/designer/name/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to get shipping details");
  }
  return data;
};
