// Checkout.js

import React from 'react';

const Checkout = ({ cartItems }) => {
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  // Function to handle checkout process
  const handleCheckout = () => {
    // Implement checkout logic here (e.g., redirect to payment gateway, etc.)
    console.log('Implement checkout logic here');
  };

  return (
    <div>
      <h2>Cart Items</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <p>Total Price: ${totalPrice}</p>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Checkout;


