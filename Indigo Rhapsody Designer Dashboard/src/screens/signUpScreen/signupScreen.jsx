import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../service/firebaseService"; // Adjust import to match your file structure
import { getApiBaseUrl } from "../../config/environment";
import logo from "../../assets/images/logo.webp";
import "./stylesheet.css";

function SignupScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
    email: "",
    password: "",
    // Additional Fields
    is_creator: true,
    shortDescription: "",
    about: "",
    role: "Designer",

    // For images
    logoUrl: "",
    backgroundImageUrl: "",

    // Address fields
    addressNickname: "Home", // By default "Home"
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // Fields to validate at each step
  const stepFields = {
    1: ["displayName", "phoneNumber"],
    2: ["email", "password"],
    3: ["logoUrl", "backgroundImageUrl"],
    4: ["address", "pincode", "city", "state"],
  };

  // Validate the given list of fields from formData
  const validateFields = (fields) => {
    let newErrors = { ...errors };
    let isValid = true;

    // Clear errors only for the fields we validate now
    fields.forEach((field) => {
      delete newErrors[field];
    });

    fields.forEach((field) => {
      const value = formData[field];

      // Check if value is empty
      if (!value) {
        newErrors[field] = "This field is required";
        isValid = false;
      }

      // Additional validations
      if (field === "phoneNumber" && value) {
        const phoneRegex = /^\+91\d{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phoneNumber =
            "Phone number must be in the format +91XXXXXXXXXX";
          isValid = false;
        }
      }

      if (field === "pincode" && value) {
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(value)) {
          newErrors.pincode = "Pin code must be exactly 6 digits.";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };
  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    let newErrors = { ...errors };

    // Update formData
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear existing errors for this field if any
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Email validation
    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    }

    // Password validation (at least 6 characters)
    if (name === "password") {
      if (value.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      } else {
        delete newErrors.password;
      }
    }

    // Pincode validation and API call (if pincode is exactly 6 characters long)
    if (name === "pincode") {
      // Reset city and state if pincode changes
      setFormData((prev) => ({ ...prev, city: "", state: "" }));

      if (value.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${value}`
          );
          const data = await response.json();

          if (data && data[0] && data[0].Status === "Success") {
            const postOfficeInfo = data[0].PostOffice[0];
            if (postOfficeInfo) {
              setFormData((prev) => ({
                ...prev,
                city: postOfficeInfo.District || "",
                state: postOfficeInfo.State || "",
              }));
            }
          } else {
            console.error("Invalid pincode or API error:", data);
          }
        } catch (error) {
          console.error("Error fetching pincode details:", error);
        }
      }
    }

    // Update errors state
    setErrors(newErrors);
  };

  // Handle file uploads for Logo / Background
  const handleFileUpload = async (e, fieldName, folder) => {
    const file = e.target.files[0];
    if (!file) return;

    let newErrors = { ...errors };

    try {
      const fileRef = ref(storage, `${folder}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      setFormData((prev) => ({
        ...prev,
        [fieldName]: url,
      }));

      // Clear error for this field if a valid file is uploaded
      delete newErrors[fieldName];

      setErrors(newErrors); // Update errors state
    } catch (error) {
      console.error("File upload error:", error);
      newErrors[fieldName] = "File upload failed. Try again.";
      setErrors(newErrors);
    }
  };

  // Move to next step after validation
  const handleNext = () => {
    if (validateFields(stepFields[step])) {
      setStep(step + 1);
    }
  };

  // Final form submit (at Step 4)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate step 4 fields before sending data
    if (!validateFields(stepFields[4])) {
      return;
    }

    // Construct the final 'address' array
    const finalAddress = [
      {
        nick_name: formData.addressNickname || "Home",
        street_details: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: parseInt(formData.pincode, 10),
      },
    ];

    // Prepare the final request body
    const requestBody = {
      email: formData.email,
      password: formData.password,
      displayName: formData.displayName,
      phoneNumber: formData.phoneNumber,
      role: formData.role || "Designer",
      is_creator: formData.is_creator, // or set to 'true' if always
      shortDescription: formData.shortDescription || "Default short desc",
      about: formData.about || "Default about text",
      logoUrl: formData.logoUrl,
      backgroundImageUrl: formData.backgroundImageUrl,
      address: finalAddress,
    };

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/user/user-designer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        setShowModal(true);
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "Sign-up failed"));
      }
    } catch (error) {
      alert("Error during sign-up. Please try again later.");
    }
  };

  // On success, continue to next route
  const handleContinue = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      {/* Header */}
      <div className="signup-header">
        <img src={logo} alt="Brand Logo" className="logo" />
        <strong
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          Create your Account
        </strong>
      </div>

      {/* Progress Bar & Form */}
      <div className="main-content">
        <div className="progress-bar">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span className="circle">1</span>
            <span className="label">Login</span>
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span className="circle">2</span>
            <span className="label">Information</span>
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="circle">3</span>
            <span className="label">Image</span>
          </div>
          <div className={`step ${step === 4 ? "active" : ""}`}>
            <span className="circle">4</span>
            <span className="label">Address</span>
          </div>
        </div>

        <div className="form-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="step-content">
                <div className="input-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Your Display Name"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                  {errors.displayName && (
                    <span className="error">{errors.displayName}</span>
                  )}
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="+91XXXXXXXXXX"
                    maxLength={13}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  {errors.phoneNumber && (
                    <span className="error">{errors.phoneNumber}</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="step-content">
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    title="Please enter a valid email address" // Tooltip for invalid input
                    required // Mark the field as required
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required // Mark as required
                  />
                  {errors.password && (
                    <span className="error">{errors.password}</span>
                  )}
                </div>
              </div>
            )}
            {/* Step 3 */}
            {/* Step 3 */}
            {step === 3 && (
              <div className="step-content">
                <div className="input-group">
                  <label>Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    placeholder="A short bio or tagline"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>About</label>
                  <input
                    type="text"
                    name="about"
                    placeholder="More details about you"
                    value={formData.about}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label>Logo</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "logoUrl", "logos")}
                  />
                  {errors.logoUrl && (
                    <span className="error">{errors.logoUrl}</span>
                  )}
                </div>

                <div className="input-group">
                  <label>Background</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(e, "backgroundImageUrl", "backgrounds")
                    }
                  />
                  {/* Added error display for Background */}
                  {errors.backgroundImageUrl && (
                    <span className="error">{errors.backgroundImageUrl}</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="step-content">
                <div className="input-group">
                  <label>Pin Code</label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Enter your Pin Code"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                  {errors.pincode && (
                    <span className="error">{errors.pincode}</span>
                  )}
                </div>
                <div className="input-group">
                  <label>Address Nickname</label>
                  <input
                    type="text"
                    name="addressNickname"
                    placeholder="e.g., Home, Office, etc."
                    value={formData.addressNickname}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Street Details</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="e.g., 123 Main Street"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <span className="error">{errors.address}</span>
                  )}
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && <span className="error">{errors.city}</span>}
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter your State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                  {errors.state && (
                    <span className="error">{errors.state}</span>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-action">
              {step < 4 && (
                <button
                  type="button"
                  className="next-btn"
                  onClick={handleNext}
                  style={{ marginTop: "30px" }}
                >
                  Next
                </button>
              )}
              {step === 4 && (
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon">✔</div>
            <h3>SUCCESS</h3>
            <p>Congratulations, your account has been successfully created.</p>
            <button onClick={handleContinue} className="modal-btn">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupScreen;
