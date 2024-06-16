import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlansList from './components/Plans/PlansList';
import Cart from './components/Cart/Cart';
import Checkout from './components/Cart/Checkout';
function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart ({cartItems.length})</Link></li>
            <li><a href="http://localhost:8080/logout" target="_blank" rel="noopener noreferrer">Logout</a></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<PlansList addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


