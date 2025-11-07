import React, { useState } from 'react';
import { cartAPI } from './apiActions';

const TestCartPage = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAddItem = async () => {
    setLoading(true);
    try {
      // Test with productId and quantity (legacy pattern)
      const result1 = await cartAPI.addItem('user123', 'product1', 2);
      console.log('Test 1 - Legacy pattern:', result1);
      
      // Test with cartItem object (new pattern)
      const cartItem = {
        productId: 'product2',
        quantity: 1
      };
      const result2 = await cartAPI.addItem('user123', cartItem);
      console.log('Test 2 - New pattern:', result2);
      
      setResult('Cart tests passed! Check console for details.');
    } catch (error) {
      console.error('Cart test failed:', error);
      setResult(`Cart test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetCart = async () => {
    setLoading(true);
    try {
      const cart = await cartAPI.getCart('user123');
      console.log('Get cart result:', cart);
      setResult(`Cart retrieved: ${JSON.stringify(cart, null, 2)}`);
    } catch (error) {
      console.error('Get cart failed:', error);
      setResult(`Get cart failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cart API Test Page</h2>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={testAddItem} disabled={loading}>
          Test Add Item (Both Patterns)
        </button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={testGetCart} disabled={loading}>
          Test Get Cart
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {result && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default TestCartPage;