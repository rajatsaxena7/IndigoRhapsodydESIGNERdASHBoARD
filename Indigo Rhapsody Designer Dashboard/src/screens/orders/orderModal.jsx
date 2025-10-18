import React from "react";
import styled from "styled-components";

// Styled components for the modal
const ModalOverlay = styled.div`
  display: ${(props) => (props.visible ? "flex" : "none")};
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
  max-width: 1000px;
  max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;

  h3 {
    margin: 0;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const SectionContent = styled.div`
  background-color: #f7f8fa;
  padding: 15px;
  border-radius: 5px;
`;

const DetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  p {
    margin: 0;
  }

  strong {
    margin-right: 5px;
  }
`;

function OrderDetailsModal({ visible, onClose, order }) {
  if (!order) return null;

  return (
    <ModalOverlay visible={visible} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>
          <h3>Order Details</h3>
          <span>Status: {order.status}</span>
        </ModalHeader>

        <Section>
          <SectionTitle>Order ID</SectionTitle>
          <SectionContent>
            <p>{order.orderId}</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Customer Details</SectionTitle>
          <SectionContent>
            <DetailsRow>
              <p>
                <strong>Name:</strong> {order.userId?.displayName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {order.userId?.email || "N/A"}
              </p>
            </DetailsRow>
            <DetailsRow>
              <p>
                <strong>Phone:</strong>{" "}
                {order.userId?.phoneNumber || "N/A"}
              </p>
            </DetailsRow>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Products</SectionTitle>
          <SectionContent>
            {order.products?.map((product, index) => (
              <div key={index}>
                <p>
                  <strong>{product.productName}</strong> - Quantity:{" "}
                  {product.quantity}, Price:₹ {product.price} (Size:{" "}
                  {product.size}, Color: {product.color})
                </p>
              </div>
            ))}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Shipping Address</SectionTitle>
          <SectionContent>
            <p>
              {order.address ? 
                `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}` :
                "Address not available"
              }
            </p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Order Summary</SectionTitle>
          <SectionContent>
            <p>
              <strong>Total Amount:</strong> ₹
              {order.products?.reduce(
                (sum, product) => sum + product.price * product.quantity,
                0
              ) || order.amount || "N/A"}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
            </p>
          </SectionContent>
        </Section>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default OrderDetailsModal;
