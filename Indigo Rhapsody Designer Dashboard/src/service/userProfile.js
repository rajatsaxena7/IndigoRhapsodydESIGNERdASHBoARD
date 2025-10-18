import { storage } from "../../src/service/firebaseService"; // Import the storage instance
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { apiGet, apiPost, apiPut } from './apiService';
import { getDesignerId } from './cookieService';

export const dashBoardDesigner = async () => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }
    
    const data = await apiGet(`/designer/${designerId}/details`);
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};
const uploadImageToFirebase = async (file, folder = "ProfileImages") => {
  try {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw new Error("Failed to upload image");
  }
};

export const updateProfileRequest = async (
  profileData,
  logoFile,
  backgroundFile
) => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }

    // Upload images to Firebase if provided
    let logoUrl = profileData.logoUrl || null;
    let backGroundImage = profileData.backGroundImage || null;

    if (logoFile) {
      logoUrl = await uploadImageToFirebase(logoFile, "Logo");
    }

    if (backgroundFile) {
      backGroundImage = await uploadImageToFirebase(
        backgroundFile,
        "Background"
      );
    }

    // Prepare payload with updated URLs if provided
    const updatedProfileData = {
      ...profileData,
      ...(logoUrl && { logoUrl }),
      ...(backGroundImage && { backGroundImage }),
    };

    const data = await apiPost(`/designer/${designerId}/update-request`, { 
      updates: updatedProfileData 
    });
    
    // Return the uploaded URLs along with the API response
    return {
      ...data,
      logoUrl: logoUrl,
      backGroundImage: backGroundImage
    };
  } catch (error) {
    console.error("Error submitting profile update request:", error);
    throw error; // Rethrow the error to be handled by the UI
  }
};

export const updateProfile = async (profileData, logoFile, backgroundFile) => {
  try {
    const designerId = getDesignerId();
    if (!designerId) {
      throw new Error('Designer ID not found');
    }

    // Upload images to Firebase if provided
    let logoUrl = profileData.logoUrl || null;
    let backGroundImage = profileData.backGroundImage || null;

    if (logoFile) {
      logoUrl = await uploadImageToFirebase(logoFile);
    }

    if (backgroundFile) {
      backGroundImage = await uploadImageToFirebase(backgroundFile);
    }

    // Prepare payload with URLs if updated
    const updatedProfileData = {
      ...profileData,
      ...(logoUrl && { logoUrl }),
      ...(backGroundImage && { backGroundImage }),
    };

    const data = await apiPut(`/designer/${designerId}/update`, updatedProfileData);
    return data; // Return the updated profile data
  } catch (error) {
    // console.error("Error updating profile:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};
