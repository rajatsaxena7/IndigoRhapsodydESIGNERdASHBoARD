import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  dashBoardDesigner,
  updateProfileRequest,
} from "../../service/userProfile";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CameraIcon,
  CheckIcon,
} from "../../components/common/Icons";
import { toast } from "react-toastify";

const ProfileContainer = styled.div`
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ProfileAvatar = styled.div`
  position: relative;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f3f4f6;
  }

  .upload-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: #2563eb;
    }

    /* force svg size inside the round button */
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const ProfileInfo = styled.div`
  flex: 1;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  p {
    color: #6b7280;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.25rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoCard = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;

  h3 {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  p {
    color: #1f2937;
    font-size: 0.875rem;
    margin: 0;
  }
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }

  display: inline-flex;
  gap: 6px;
  align-items: center;
`;

const BackgroundImageSection = styled.div`
  position: relative;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: #eef2ff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-overlay {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  max-width: 480px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

/* ---------- Icon sizing helpers ---------- */
const IconBox = styled.span`
  display: inline-flex;
  width: ${(p) => p.$size || 16}px;
  height: ${(p) => p.$size || 16}px;
  flex: 0 0 ${(p) => p.$size || 16}px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

/* ---------- Form UI helpers ---------- */
const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.375rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.375rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.75rem;
  resize: vertical;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  background: ${(p) => p.$variant === "secondary" ? "#6b7280" : p.disabled ? "#9ca3af" : "#3b82f6"};
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  min-height: 28px;
`;

const FileBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;

  .name {
    font-size: 0.75rem;
    color: #059669;
  }

  .remove {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.125rem 0.25rem;
    border-radius: 2px;
    font-size: 0.625rem;
    cursor: pointer;
  }
`;

/* ============================================================= */

const ProfileScreen = () => {
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    about: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);

  useEffect(() => {
    fetchDesignerData();
  }, []);

  const fetchDesignerData = async () => {
    try {
      const data = await dashBoardDesigner();
      setDesigner(data.designer);
    } catch (error) {
      console.error("Error fetching designer data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => {
    if (designer) {
      setFormData({
        displayName: designer.userId?.displayName || "",
        email: designer.userId?.email || "",
        phoneNumber: designer.userId?.phoneNumber || "",
        address: designer.userId?.address?.[0]?.street_details || "",
        city: designer.userId?.address?.[0]?.city || "",
        state: designer.userId?.address?.[0]?.state || "",
        pincode: designer.userId?.address?.[0]?.pincode || "",
        about: designer.about || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setLogoFile(null);
    setBackgroundFile(null);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (type === "logo") {
      setLogoFile(file);
      toast.success("Profile picture selected successfully!");
    } else {
      setBackgroundFile(file);
      toast.success("Background image selected successfully!");
    }
  };

  const removeFile = (type) => {
    if (type === "logo") {
      setLogoFile(null);
      toast.info("Profile picture removed");
    } else {
      setBackgroundFile(null);
      toast.info("Background image removed");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const updatedData = { ...formData, about: formData.about };
      const result = await updateProfileRequest(
        updatedData,
        logoFile,
        backgroundFile
      );

              setDesigner((prev) => ({
          ...prev,
          logoUrl: result.logoUrl || prev.logoUrl,
          backGroundImage: result.backGroundImage || prev.backGroundImage,
          about: formData.about,
          userId: {
            ...prev.userId,
            displayName: formData.displayName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: [{ 
              street_details: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode
            }],
            about: formData.about,
          },
        }));

      setIsModalOpen(false);
      setLogoFile(null);
      setBackgroundFile(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error submitting profile update request:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
        <div>Loading...</div>
      </ProfileContainer>
    );
  }

  if (!designer) {
    return (
      <ProfileContainer>
        <div>No profile data available</div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>
            <img
              src={
                designer.logoUrl ||
                "https://via.placeholder.com/80x80?text=Profile"
              }
              alt="Profile"
            />
            <div className="upload-overlay" title="Change profile picture">
              <CameraIcon />
            </div>
          </ProfileAvatar>

          <div style={{ flex: 1 }}>
            <h1>{designer.userId?.displayName || "Designer Name"}</h1>
            <p>{designer.userId?.email || "email@example.com"}</p>
            <EditButton onClick={handleModalOpen}>
              <IconBox $size={12}>
                <PencilIcon />
              </IconBox>
              Edit Profile
            </EditButton>
          </div>
        </ProfileHeader>

        <BackgroundImageSection>
          {designer.backGroundImage && (
            <img src={designer.backGroundImage} alt="Background" />
          )}
          <div className="upload-overlay">
            <CameraIcon />
            Upload Background
          </div>
        </BackgroundImageSection>

        <Section>
          <h2>Contact Information</h2>
          <InfoGrid>
            <InfoCard>
              <h3>Email</h3>
              <p>{designer.userId?.email || "Not provided"}</p>
            </InfoCard>
            <InfoCard>
              <h3>Phone</h3>
              <p>{designer.userId?.phoneNumber || "Not provided"}</p>
            </InfoCard>
            <InfoCard>
              <h3>Address</h3>
              <p>
                {designer.userId?.address?.[0]?.street_details ||
                  "Not provided"}
              </p>
            </InfoCard>
            <InfoCard>
              <h3>City</h3>
              <p>{designer.userId?.address?.[0]?.city || "Not provided"}</p>
            </InfoCard>
            <InfoCard>
              <h3>State</h3>
              <p>{designer.userId?.address?.[0]?.state || "Not provided"}</p>
            </InfoCard>
            <InfoCard>
              <h3>Pincode</h3>
              <p>{designer.userId?.address?.[0]?.pincode || "Not provided"}</p>
            </InfoCard>
          </InfoGrid>
        </Section>

        {designer.userId?.about && (
          <Section>
            <h2>About</h2>
            <InfoCard>
              <p>{designer.userId.about}</p>
            </InfoCard>
          </Section>
        )}
      </ProfileCard>

      {isModalOpen && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                Edit Profile
              </h2>
              <button
                onClick={handleModalClose}
                aria-label="Close edit profile"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <Label>
                    <IconBox>
                      <UserIcon />
                    </IconBox>
                    Display Name *
                  </Label>
                  <Input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    placeholder="Enter your display name"
                    required
                  />
                </div>

                <div>
                  <Label>
                    <IconBox>
                      <EnvelopeIcon />
                    </IconBox>
                    Email *
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label>
                    <IconBox>
                      <PhoneIcon />
                    </IconBox>
                    Phone Number *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <Label>
                    <IconBox>
                      <MapPinIcon />
                    </IconBox>
                    Address
                  </Label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <Label>
                    <IconBox>
                      <MapPinIcon />
                    </IconBox>
                    City
                  </Label>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <Label>
                    <IconBox>
                      <MapPinIcon />
                    </IconBox>
                    State
                  </Label>
                  <Input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="Enter your state"
                  />
                </div>

                <div>
                  <Label>
                    <IconBox>
                      <MapPinIcon />
                    </IconBox>
                    Pincode
                  </Label>
                  <Input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    placeholder="Enter your pincode"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <Label>
                  <IconBox>
                    <UserIcon />
                  </IconBox>
                  About
                </Label>
                <TextArea
                  rows={3}
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <Label>
                  <IconBox>
                    <CameraIcon />
                  </IconBox>
                  Profile Picture
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                />
                {logoFile && (
                  <FileBadge>
                    <IconBox $size={12}>
                      <CheckIcon />
                    </IconBox>
                    <span className="name">File selected: {logoFile.name}</span>
                    <button
                      type="button"
                      className="remove"
                      onClick={() => removeFile("logo")}
                    >
                      Remove
                    </button>
                  </FileBadge>
                )}
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <Label>
                  <IconBox>
                    <CameraIcon />
                  </IconBox>
                  Background Image
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "background")}
                />
                {backgroundFile && (
                  <FileBadge>
                    <IconBox $size={12}>
                      <CheckIcon />
                    </IconBox>
                    <span className="name">
                      File selected: {backgroundFile.name}
                    </span>
                    <button
                      type="button"
                      className="remove"
                      onClick={() => removeFile("background")}
                    >
                      Remove
                    </button>
                  </FileBadge>
                )}
              </div>

              <ActionRow>
                <Button type="button" $variant="secondary" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Saving..." : "Save Changes"}
                </Button>
              </ActionRow>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </ProfileContainer>
  );
};

export default ProfileScreen;
