import React, { useState } from "react";
import styled from "styled-components";
import {
  createShippingOrder,
  getPickupLocationName,
} from "../../service/shippinService"; // Updated to use the new endpoint
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDesignerId } from "../../service/cookieService";

const ModalOverlay = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;

  h3 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  background-color: #667eea;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #5a67d8;
  }

  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
  background-color: #f7f8fa;
  border-radius: 5px;
  padding: 10px;
`;

const ProductItem = styled.li`
  margin-bottom: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  background-color: #fed7d7;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: #38a169;
  background-color: #c6f6d5;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

const ShipOrderModal = ({ show, onClose, order }) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    length: "",
    breadth: "",
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const designerRef = getDesignerId();
      if (!designerRef) {
        throw new Error('Designer ID not found');
      }

      // Fetch pickup location name using the new endpoint
      const pickupLocationResponse = await getPickupLocationName(designerRef);
      const pickupLocationName = pickupLocationResponse.pickup_location_name;

      console.log("Pickup Location Name:", pickupLocationName);

      const requestBody = {
        orderId: order.orderId,
        height: formData.height,
        weight: formData.weight,
        length: formData.length,
        breadth: formData.breadth,
        pickup_Location: pickupLocationName,
        designerRef: designerRef,
      };

      console.log("Request Body:", requestBody);

      const result = await createShippingOrder(requestBody);
      setResponse(result);
      setError(null);
      toast.success("Shipping order created successfully!");

      setFormData({
        height: "",
        weight: "",
        length: "",
        breadth: "",
      });
      setResponse(null);
      onClose(); // Close the modal
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to create shipping order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.height && formData.weight && formData.length && formData.breadth;

  return (
    <ModalOverlay show={show} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>
          <h3>Ship Order</h3>
        </ModalHeader>
        
        <Form onSubmit={handleFormSubmit}>
          <div>
            <h4>Products to Ship:</h4>
            <ProductList>
              {order.products?.map((product, index) => (
                <ProductItem key={index}>
                  {product.productName} - Quantity: {product.quantity}
                </ProductItem>
              ))}
            </ProductList>
          </div>
          
          <div>
            <h4>Package Dimensions:</h4>
            <Input
              type="text"
              name="height"
              placeholder="Height (whole number)"
              value={formData.height}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="weight"
              placeholder="Weight (whole number)"
              value={formData.weight}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="length"
              placeholder="Length (whole number)"
              value={formData.length}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="breadth"
              placeholder="Breadth (whole number)"
              value={formData.breadth}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <Button type="submit" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? "Processing..." : "Ship Order"}
          </Button>
        </Form>
        
        {response && (
          <SuccessMessage>
            <h4>Success!</h4>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </SuccessMessage>
        )}
        
        {error && (
          <ErrorMessage>
            <h4>Error:</h4>
            <p>{error}</p>
          </ErrorMessage>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ShipOrderModal;
