import { apiGet, apiPost, apiPut, apiDelete } from './apiService';
import { getDesignerId, getUserId } from './cookieService';
import { getApiBaseUrl } from '../config/environment';

export const uploadVideoWithProducts = async (videoData) => {
  try {
    const designerRef = getDesignerId();
    const userId = getUserId();

    if (!designerRef) {
      throw new Error('Designer ID not found');
    }

    if (!userId) {
      throw new Error('User ID not found');
    }

    const data = {
      userId: userId,
      designerId: designerRef,
      videoUrl: videoData.videoUrl,
      title: videoData.title,
      description: videoData.description,
      productIds: videoData.productIds || []
    };

    console.log("Sending video data to API:", data);
    console.log("API endpoint:", `/content-video/add-video-with-products`);
    console.log("Designer ID:", designerRef);

    // Try using apiPost first
    try {
      const response = await apiPost(`/content-video/add-video-with-products`, data);
      console.log("API Response:", response);
      return response;
    } catch (apiError) {
      console.log("apiPost failed, trying direct fetch:", apiError);

      // Fallback: Try direct fetch with full URL
      const fullUrl = `${getApiBaseUrl()}/content-video/add-video-with-products`;
      console.log("Trying direct fetch to:", fullUrl);

      const directResponse = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log("Direct fetch response status:", directResponse.status);
      console.log("Direct fetch response headers:", Object.fromEntries(directResponse.headers.entries()));

      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        console.log("Direct fetch error text:", errorText);
        throw new Error(`HTTP ${directResponse.status}: ${errorText}`);
      }

      const result = await directResponse.json();
      console.log("Direct fetch result:", result);
      return result;
    }
  } catch (error) {
    console.error("Detailed error info:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

export const getVideosByDesigner = async () => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User ID not found');
    }

    console.log("Fetching videos for user:", userId);
    const response = await apiGet(`/content-video/videos-by-user/${userId}`);
    console.log("Videos API Response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

export const updateVideo = async (videoId, videoData) => {
  try {
    const designerRef = getDesignerId();
    if (!designerRef) {
      throw new Error('Designer ID not found');
    }

    const data = {
      ...videoData,
      designerId: designerRef
    };

    const response = await apiPut(`/content-video/${videoId}`, data);
    return response;
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
};

export const deleteVideo = async (videoId) => {
  try {
    console.log("Deleting video:", videoId);
    const response = await apiDelete(`/content-video/${videoId}`);
    console.log("Delete response:", response);
    return response;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};
