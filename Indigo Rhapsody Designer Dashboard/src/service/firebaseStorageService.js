// firebaseStorageService.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseService"; // Adjust the path as necessary

export const uploadFileAndGetURL = async (file) => {
  try {
    // Determine the folder based on file type
    const isVideo = file.type.startsWith('video/');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    let folder = 'files';
    if (isVideo) {
      folder = 'videos';
    } else if (isExcel) {
      folder = 'excelFiles';
    } else if (file.type.startsWith('image/')) {
      folder = 'images';
    }

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    
    // Create a storage reference
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    throw new Error("Error uploading file to storage: " + error.message);
  }
};
