import React from 'react';
import {Link } from 'react-router-dom';
// import Checkout from './Checkout';
function Cart({ cartItems }) {
  if (!cartItems || cartItems.length === 0) {
    return <div>No items in cart</div>;
  }

  return (
    <div>
        <nav>
          <ul>
            <li><Link to="/Checkout">Checkout</Link></li>
          </ul>
        </nav>
      <h2>Cart</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>Price: {item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cart;

