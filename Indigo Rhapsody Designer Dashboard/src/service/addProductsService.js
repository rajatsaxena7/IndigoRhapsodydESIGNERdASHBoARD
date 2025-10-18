import { apiGet, apiPost, apiPut } from './apiService';
import { getDesignerId, getAccessToken } from './cookieService';
import { getApiBaseUrl } from '../config/environment';

export const getCategory = async () => {
  try {
    const data = await apiGet(`/category`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};
export const getSubCategory = async (categoryId) => {
  try {
    const data = await apiGet(`/subcategory/getSubCategoriesByCategory/${categoryId}`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    // Retrieve designerRef from cookies
    const designerRef = getDesignerId();
    if (!designerRef) {
      throw new Error('Designer ID not found');
    }

    // Add designerRef to the productData object
    const dataWithDesignerRef = {
      ...productData,
      designerRef: designerRef, // Append designerRef
    };

    const data = await apiPost("/products/createProduct", dataWithDesignerRef);
    return data; // Return the product details
  } catch (error) {
    // console.error("Error creating product:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};

export const uploadBulkExcel = async (fileUrl) => {
  try {
    const designerRef = getDesignerId();
    if (!designerRef) {
      throw new Error(
        "Designer reference is missing. Please log in or check your credentials."
      );
    }

    const data = {
      fileUrl: fileUrl,
      designerRef: designerRef,
    };

    const responseData = await apiPost(`/products/uploadBulk`, data);
    return responseData;
  } catch (error) {
    console.error("Error in uploadBulkExcel:", error.message);
    throw error;
  }
};

export const edituploadBulkExcel = async (fileUrl) => {
  try {
    const designerRef = getDesignerId();
    if (!designerRef) {
      throw new Error(
        "Designer reference is missing. Please log in or check your credentials."
      );
    }

    console.log("Starting bulk update with file URL:", fileUrl);

    // Download the file from Firebase
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.status}`);
    }

    const fileBlob = await fileResponse.blob();
    const fileName = fileUrl.split('/').pop().split('?')[0]; // Remove query parameters
    const file = new File([fileBlob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create FormData with the correct field name 'csvFile'
    const formData = new FormData();
    formData.append('csvFile', file);
    formData.append('designerRef', designerRef);

    console.log("Sending FormData with csvFile:", {
      fileName: fileName,
      fileSize: file.size,
      designerRef: designerRef,
      fieldName: 'csvFile'
    });

    // Make direct fetch request with FormData (no auth header needed)
    const response = await fetch(`${getApiBaseUrl()}/products/bulk-update`, {
      method: 'POST',
      // Don't set Content-Type for FormData, let browser set it
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    console.log("Bulk update success - API Response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in edituploadBulkExcel:", {
      message: error.message,
      response: error.response,
      status: error.status,
      data: error.data,
      stack: error.stack
    });
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    // Retrieve designerRef from cookies
    const designerRef = getDesignerId();
    if (!designerRef) {
      throw new Error('Designer ID not found');
    }

    // Add designerRef to the productData object
    const dataWithDesignerRef = {
      ...productData,
      designerRef: designerRef, // Append designerRef
    };

    // Use the productId in the URL
    const data = await apiPut(`/products/products/${productId}`, dataWithDesignerRef);
    return data; // Return the updated product details
  } catch (error) {
    // console.error("Error updating product:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};

export const AddCategory = async (categoryData) => {
  try {
    const data = await apiPost(`/subcategory/`, categoryData);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};