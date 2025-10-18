import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PlayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon
} from '../../components/common/Icons';
import { uploadVideoWithProducts, getVideosByDesigner, deleteVideo } from '../../service/videoService';
import { getProductsBydesigner } from '../../service/productsService';
import { uploadFileAndGetURL } from '../../service/firebaseStorageService';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modern Design System
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 2rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 320px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const StatsBar = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  min-width: 180px;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const VideoThumbnail = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  background: #f1f5f9;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: all 0.2s ease;
  }

  &:hover .play-button {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }

  .duration {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const VideoContent = styled.div`
  padding: 1.5rem;
`;

const VideoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const VideoDate = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
`;

const VideoViews = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
`;

const ProductTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ProductTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  color: #475569;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
`;

const VideoActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch(props.variant) {
      case 'view':
        return `
          background: #f1f5f9;
          color: #475569;
          &:hover {
            background: #e2e8f0;
            color: #334155;
          }
        `;
      case 'edit':
        return `
          background: #fef3c7;
          color: #d97706;
          &:hover {
            background: #fde68a;
            color: #b45309;
          }
        `;
      case 'delete':
        return `
          background: #fecaca;
          color: #dc2626;
          &:hover {
            background: #fca5a5;
            color: #b91c1c;
          }
        `;
      default:
        return `
          background: #dbeafe;
          color: #2563eb;
          &:hover {
            background: #bfdbfe;
            color: #1d4ed8;
          }
        `;
    }
  }}

  &:hover {
    transform: translateY(-1px);
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f8fafc;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
`;

const FileUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  &.dragover {
    border-color: #3b82f6;
    background: #f0f9ff;
    transform: scale(1.02);
  }

  &.uploading {
    pointer-events: none;
    opacity: 0.7;
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #6b7280;
`;

const UploadText = styled.div`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;

  .progress {
    height: 100%;
    background: #3b82f6;
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
  }
`;

const VideoPreview = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f0f9ff;
  border-radius: 0.5rem;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .video-info {
    flex: 1;
  }

  .video-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 0.25rem;
  }

  .video-size {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .remove-btn {
    background: #fecaca;
    color: #dc2626;
    border: none;
    border-radius: 0.375rem;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #fca5a5;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s ease;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background: #f1f5f9;
      color: #374151;
    }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #94a3b8;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
`;

const EmptyStateText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const LoadingThumbnail = styled.div`
  aspect-ratio: 16/9;
  background: #f1f5f9;
`;

const LoadingContent = styled.div`
  padding: 1.5rem;
  
  .line {
    height: 16px;
    background: #f1f5f9;
    border-radius: 4px;
    margin-bottom: 8px;
    
    &.title {
      width: 80%;
    }
    
    &.text {
      width: 60%;
    }
  }
`;

const VideosScreen = () => {
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    productIds: []
  });

  useEffect(() => {
    fetchVideos();
    fetchProducts();
  }, []);

  const fetchVideos = async () => {
    try {
      console.log("Fetching videos...");
      const response = await getVideosByDesigner();
      console.log("Videos response:", response);
      
      // Handle the API response structure
      let videosData = [];
      if (response.success && response.videos) {
        videosData = response.videos;
      } else if (response.videos) {
        videosData = response.videos;
      } else if (Array.isArray(response)) {
        videosData = response;
      }
      
      console.log("Processed videos data:", videosData);
      setVideos(videosData);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProductsBydesigner();
      setProducts(response.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddVideo = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      productIds: []
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    setShowModal(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const maxSize = 15 * 1024 * 1024; // 15MB in bytes
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, WebM, OGG, MOV, AVI)');
      return false;
    }
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 15MB');
      return false;
    }
    
    return true;
  };

  const handleFileSelect = async (file) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

             // Upload to Firebase
       console.log('Starting Firebase upload for file:', file.name);
       const videoUrl = await uploadFileAndGetURL(file);
       console.log('Firebase upload completed, URL:', videoUrl);
       
       // Complete progress
       setUploadProgress(100);
       clearInterval(progressInterval);
      
             // Update form with the Firebase URL
       setFormData(prev => ({
         ...prev,
         videoUrl: videoUrl
       }));

       console.log('Video URL set in form:', videoUrl);
       toast.success('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video. Please try again.');
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, videoUrl: "" }));
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
         console.log('Form data before submission:', formData);
     
     if (!formData.title || !formData.videoUrl) {
       console.log('Validation failed - Title:', formData.title, 'Video URL:', formData.videoUrl);
       toast.error("Please fill in all required fields");
       return;
     }

    try {
      console.log("Submitting video data:", {
        userId: "68a49455b33a027402fb9fc0",
        ...formData
      });

      const result = await uploadVideoWithProducts({
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        productIds: formData.productIds
      });
      
      console.log("Upload successful:", result);
      toast.success("Video uploaded successfully!");
      setShowModal(false);
      fetchVideos();
    } catch (error) {
      console.error("Error uploading video:", error);
      
      // More detailed error handling
      let errorMessage = "Failed to upload video";
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Unable to connect to server";
      } else if (error.message.includes("401")) {
        errorMessage = "Authentication error: Please log in again";
      } else if (error.message.includes("400")) {
        errorMessage = "Invalid data: Please check your inputs";
      } else if (error.message.includes("500")) {
        errorMessage = "Server error: Please try again later";
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(videoId);
        toast.success("Video deleted successfully!");
        fetchVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
        toast.error("Failed to delete video");
      }
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLoadingState = () => (
    <LoadingGrid>
      {Array.from({ length: 6 }).map((_, index) => (
        <LoadingCard key={index}>
          <LoadingThumbnail />
          <LoadingContent>
            <div className="line title" />
            <div className="line text" />
            <div className="line text" />
          </LoadingContent>
        </LoadingCard>
      ))}
    </LoadingGrid>
  );

  const renderEmptyState = () => (
    <EmptyState>
      <EmptyStateIcon>
        <PlayIcon className="w-8 h-8" />
      </EmptyStateIcon>
      <EmptyStateTitle>No videos yet</EmptyStateTitle>
      <EmptyStateText>
        Create engaging video content and tag your products to showcase your collection to potential customers.
      </EmptyStateText>
      <AddButton onClick={handleAddVideo}>
        <PlusIcon className="w-4 h-4" />
        Upload Your First Video
      </AddButton>
    </EmptyState>
  );

  return (
    <PageContainer>
      <PageHeader>
        <HeaderContent>
          <HeaderLeft>
            <PageTitle>Videos</PageTitle>
            <PageSubtitle>Manage your video content and product showcases</PageSubtitle>
          </HeaderLeft>
          <HeaderActions>
            <SearchContainer>
              <SearchIcon>
                <MagnifyingGlassIcon className="w-4 h-4" />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            <AddButton onClick={handleAddVideo}>
              <PlusIcon className="w-4 h-4" />
              Add Video
            </AddButton>
          </HeaderActions>
        </HeaderContent>
      </PageHeader>

      <MainContent>
        <StatsBar>
          <StatCard>
            <StatNumber>{videos.length}</StatNumber>
            <StatLabel>Total Videos</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{videos.filter(v => v.products?.length > 0).length}</StatNumber>
            <StatLabel>Tagged Videos</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>
              {videos.reduce((sum, v) => sum + (v.products?.length || 0), 0)}
            </StatNumber>
            <StatLabel>Product Tags</StatLabel>
          </StatCard>
        </StatsBar>

        {loading ? renderLoadingState() : 
         filteredVideos.length === 0 ? renderEmptyState() : (
          <VideosGrid>
            {filteredVideos.map((video) => (
              <VideoCard key={video._id}>
                <VideoThumbnail onClick={() => window.open(video.videoUrl, '_blank')}>
                  <img 
                    src={video.thumbnail || "https://via.placeholder.com/640x360/f1f5f9/94a3b8?text=Video+Thumbnail"} 
                    alt={video.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/640x360/f1f5f9/94a3b8?text=Video";
                    }}
                  />
                  <div className="play-button">
                    <PlayIcon className="w-6 h-6" />
                  </div>
                  {video.duration && (
                    <div className="duration">{video.duration}</div>
                  )}
                </VideoThumbnail>
                
                <VideoContent>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoDescription>{video.description}</VideoDescription>
                  
                  <VideoMeta>
                    <VideoDate>
                      {video.createdDate ? new Date(video.createdDate).toLocaleDateString() : 
                       video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Recently'}
                    </VideoDate>
                    <VideoViews>
                      {video.no_of_likes || 0} likes • {video.no_of_Shares || 0} shares
                    </VideoViews>
                  </VideoMeta>
                  
                  {video.products && video.products.length > 0 && (
                    <ProductTags>
                      {video.products.slice(0, 3).map((productItem) => {
                        const product = productItem.productId;
                        return (
                          <ProductTag key={product._id}>
                            {product ? product.productName : 'Product'}
                          </ProductTag>
                        );
                      })}
                      {video.products.length > 3 && (
                        <ProductTag>+{video.products.length - 3} more</ProductTag>
                      )}
                    </ProductTags>
                  )}
                  
                  <VideoActions>
                    <ActionButton 
                      variant="view" 
                      onClick={() => window.open(video.videoUrl, '_blank')}
                      title="View Video"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </ActionButton>
                    <ActionButton variant="edit" title="Edit Video">
                      <PencilIcon className="w-4 h-4" />
                    </ActionButton>
                    <ActionButton 
                      variant="delete" 
                      onClick={() => handleDeleteVideo(video._id)}
                      title="Delete Video"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </ActionButton>
                  </VideoActions>
                </VideoContent>
              </VideoCard>
            ))}
          </VideosGrid>
        )}
      </MainContent>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add New Video</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-4 h-4" />
              </CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormGroup>
                  <Label>Upload Video File *</Label>
                  <FileUploadArea
                    className={`${dragOver ? 'dragover' : ''} ${uploading ? 'uploading' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    <UploadIcon>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </UploadIcon>
                    <UploadText>
                      {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </UploadText>
                    <UploadSubtext>
                      MP4, WebM, OGG, MOV, AVI up to 15MB
                    </UploadSubtext>
                    {uploading && (
                      <ProgressBar progress={uploadProgress}>
                        <div className="progress" />
                      </ProgressBar>
                    )}
                  </FileUploadArea>
                  
                  {selectedFile && !uploading && (
                    <VideoPreview>
                      <div className="video-info">
                        <div className="video-name">{selectedFile.name}</div>
                        <div className="video-size">{formatFileSize(selectedFile.size)}</div>
                      </div>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={removeSelectedFile}
                        title="Remove video"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </VideoPreview>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Video Title *</Label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter video title"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your video content..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Tag Products (Hold Ctrl/Cmd to select multiple)</Label>
                  <Select
                    multiple
                    value={formData.productIds}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData({ ...formData, productIds: selectedOptions });
                    }}
                  >
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.productName}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                                 <Button 
                   type="submit" 
                   variant="primary" 
                   disabled={uploading || !formData.videoUrl || !formData.title}
                 >
                   {uploading ? 'Uploading...' : 'Save Video'}
                 </Button>
                 
                 {/* Debug info - remove this later */}
                 <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                   Debug: Video URL: {formData.videoUrl ? 'Set' : 'Not set'} | 
                   Title: {formData.title ? 'Set' : 'Not set'} | 
                   Uploading: {uploading ? 'Yes' : 'No'}
                 </div>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default VideosScreen;
