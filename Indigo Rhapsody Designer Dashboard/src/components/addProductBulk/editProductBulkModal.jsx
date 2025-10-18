import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FaUpload } from "react-icons/fa";
import { edituploadBulkExcel } from "../../service/addProductsService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFileAndGetURL } from "../../service/firebaseStorageService";

const ModalOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  z-index: 1000;
`;

const DropZone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #f9f9f9;
  }

  p {
    margin-top: 10px;
    color: #666;
  }
`;

const Button = styled.button`
  .add-button {
    padding: 0 10px;
    border: none;
    background-color: #28a745;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;

  .progress {
    height: 100%;
    background-color: #007bff;
    width: ${(props) => props.progress}%;
    transition: width 0.3s;
  }
`;
function EditVariantModal({ show, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);

  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {

    if (file) {
      setUploading(true);
      setProgress(10); // Initial progress
      try {
        console.log("Starting bulk update process...");
        console.log("Selected file:", file.name, file.size);
        
        // Step 1: Upload the file to Firebase Storage
        setProgress(30);
        console.log("Uploading file to Firebase Storage...");
        const fileUrl = await uploadFileAndGetURL(file);
        console.log("File uploaded to Firebase:", fileUrl);

        // Step 2: Call the backend API with the file URL
        setProgress(60);
        console.log("Calling backend API with file URL...");
        
        // Test if the file URL is accessible
        try {
          const testResponse = await fetch(fileUrl, { method: 'HEAD' });
          console.log("File URL accessibility test:", {
            status: testResponse.status,
            ok: testResponse.ok,
            url: fileUrl
          });
        } catch (testError) {
          console.warn("File URL accessibility test failed:", testError);
        }
        
        const response = await edituploadBulkExcel(fileUrl);
        console.log("Backend API response:", response);

        setProgress(100);
        toast.success("Product variants updated successfully!");

        onClose(); // Close the modal after upload
        window.location.reload(); // Refresh the page to reflect new data
      } catch (error) {
        setProgress(0);
        console.error("Bulk update error details:", {
          message: error.message,
          stack: error.stack,
          response: error.response
        });
        toast.error(`Error updating product variants: ${error.message}`);
      } finally {
        setUploading(false);
      }
    } else {
      alert("Please select a file to upload");
    }
  };

  return (
    <ModalOverlay
      show={show}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalContent>
        <h3>Edit Product Variants</h3>
        {uploading && (
          <ProgressBar progress={progress}>
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </ProgressBar>
        )}
        <DropZone
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <FaUpload size={40} color="#888" />
          <p>
            {file
              ? `Selected file: ${file.name}`
              : "Drag & drop or click to upload a file"}
          </p>
        </DropZone>
        <Button
          type="button"
          onClick={handleUpload}
          style={{ marginTop: "20px", padding: "10px 20px",
            border: "1px solid #007bff",
            borderRadius: "5px",
          }}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
}

export default EditVariantModal;
