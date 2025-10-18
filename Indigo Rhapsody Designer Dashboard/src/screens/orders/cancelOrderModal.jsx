import React, { useState } from 'react';
import { Modal, Input, Button, Space, Typography, Alert } from 'antd';
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { apiPost } from '../../service/apiService';

const { TextArea } = Input;
const { Text, Title } = Typography;

const CancelOrderModal = ({ show, onClose, order, onCancelSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);



  const handleCancelOrder = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setLoading(true);
    try {
      // Debug: Log the order object to see its structure
      console.log('Order object:', order);
      
      // Try different possible ID fields
      const orderId = order._id || order.id || order.orderId;
      console.log('Using order ID:', orderId);
      
      if (!orderId) {
        throw new Error('Order ID not found. Available fields: ' + Object.keys(order).join(', '));
      }
      const data = await apiPost(`/order/designer/cancel/${orderId}`, { reason: reason.trim() });
      toast.success('Order cancelled successfully');
      onCancelSuccess();
      handleClose();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>Cancel Order</span>
        </Space>
      }
      open={show}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
      maskClosable={false}
    >
      <div style={{ padding: '8px 0' }}>
        <Alert
          message="Warning"
          description={
            <div>
              <Text>
                Are you sure you want to cancel order <Text strong>#{order?.orderId}</Text>?
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                This action cannot be undone. Please provide a reason for cancellation.
              </Text>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Cancellation Reason *
          </Text>
          <TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for cancelling this order..."
            rows={4}
            maxLength={500}
            showCount
            style={{ resize: 'none' }}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button 
              onClick={handleClose}
              disabled={loading}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleCancelOrder}
              loading={loading}
              disabled={!reason.trim()}
            >
              {loading ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default CancelOrderModal;
