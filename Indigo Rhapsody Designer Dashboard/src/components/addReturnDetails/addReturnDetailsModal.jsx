// AddReturnDetailsModal.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProductsBydesigner } from "../../service/productsService";
import { addReturnPolicy } from "../../service/productsService";

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
  max-width: 600px;
  width: 100%;
  z-index: 1000;
  overflow-y: auto;
  max-height: 90vh;
`;

const FormSection = styled.div`
  margin-bottom: 20px;

  h4 {
    margin-bottom: 10px;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    input[type="checkbox"] {
      width: auto;
      margin: 0;
    }
  }

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;

    input {
      flex: 1;
    }

    select {
      flex: 0 0 120px;
    }
  }

  .error-text {
    color: red;
    font-size: 0.85rem;
    margin-bottom: 5px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &.save {
      background-color: #007bff;
      color: #fff;
    }

    &.cancel {
      background-color: #f0f0f0;
      color: #333;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

function AddReturnDetailsModal({ show, onClose }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    returnable: true,
    return_Policy: "",
    return_Window: "",
    return_Window_Unit: "days",
  });

  const [errors, setErrors] = useState({});

  // Fetch products when modal opens
  useEffect(() => {
    if (show) {
      const fetchProducts = async () => {
        try {
          setLoadingProducts(true);
          const data = await getProductsBydesigner();
          setProducts(data.products || []);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          toast.error("Failed to load products");
        } finally {
          setLoadingProducts(false);
        }
      };
      fetchProducts();
    }
  }, [show]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setFormData({
        productId: "",
        returnable: true,
        return_Policy: "",
        return_Window: "",
        return_Window_Unit: "days",
      });
      setErrors({});
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.productId) {
      newErrors.productId = "Please select a product.";
    }
    if (formData.returnable && !formData.return_Policy.trim()) {
      newErrors.return_Policy = "Return policy is required when returnable is enabled.";
    }
    if (formData.returnable && !formData.return_Window) {
      newErrors.return_Window = "Return window is required when returnable is enabled.";
    }
    if (formData.returnable && formData.return_Window && formData.return_Window <= 0) {
      newErrors.return_Window = "Return window must be a positive number.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const returnPolicyData = {
        returnable: formData.returnable,
        return_Policy: formData.return_Policy,
        return_Window: parseInt(formData.return_Window) || 0,
        return_Window_Unit: formData.return_Window_Unit,
      };

      await addReturnPolicy(formData.productId, returnPolicyData);

      toast.success("Return policy added successfully!");
      onClose();
      // Optionally refresh the page or re-fetch data
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to add return policy: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay show={show} onClick={handleOverlayClick}>
      <ModalContent>
        <ToastContainer />
        <h3>Add Return Details</h3>
        <form onSubmit={handleSubmit}>
          {/* Product Selection */}
          <FormSection>
            <h4>Product Selection</h4>
            <label>Select Product</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              disabled={loadingProducts}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productName || product.sku || product._id}
                </option>
              ))}
            </select>
            {errors.productId && (
              <div className="error-text">{errors.productId}</div>
            )}
            {loadingProducts && <p>Loading products...</p>}
          </FormSection>

          {/* Returnable Toggle */}
          <FormSection>
            <h4>Return Settings</h4>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="returnable"
                id="returnable"
                checked={formData.returnable}
                onChange={handleInputChange}
              />
              <label htmlFor="returnable" style={{ margin: 0, fontWeight: "normal" }}>
                Product is returnable
              </label>
            </div>
          </FormSection>

          {/* Return Policy Details - Only show if returnable */}
          {formData.returnable && (
            <>
              <FormSection>
                <label>Return Policy</label>
                <textarea
                  name="return_Policy"
                  placeholder="e.g., Items can be returned within 7 days of delivery in original condition"
                  value={formData.return_Policy}
                  onChange={handleInputChange}
                />
                {errors.return_Policy && (
                  <div className="error-text">{errors.return_Policy}</div>
                )}
              </FormSection>

              <FormSection>
                <label>Return Window</label>
                <div className="input-group">
                  <input
                    type="number"
                    name="return_Window"
                    placeholder="7"
                    min="1"
                    value={formData.return_Window}
                    onChange={handleInputChange}
                  />
                  <select
                    name="return_Window_Unit"
                    value={formData.return_Window_Unit}
                    onChange={handleInputChange}
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                {errors.return_Window && (
                  <div className="error-text">{errors.return_Window}</div>
                )}
              </FormSection>
            </>
          )}

          {/* Button Group */}
          <ButtonGroup>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Return Details"}
            </button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default AddReturnDetailsModal;


